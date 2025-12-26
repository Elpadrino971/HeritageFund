from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import httpx
import certifi
import base64
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection - use SSL for Atlas, no SSL for localhost
mongo_url = os.environ['MONGO_URL']
if 'mongodb+srv' in mongo_url or 'mongodb.net' in mongo_url:
    client = AsyncIOMotorClient(mongo_url, tlsCAFile=certifi.where())
else:
    client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe
stripe_api_key = os.environ.get('STRIPE_API_KEY')

# Cloudinary (optional - falls back to base64 storage)
CLOUDINARY_URL = os.environ.get('CLOUDINARY_URL')

# FastAPI app
app = FastAPI(title="HeritageFund API")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ================================
# MODELS
# ================================

class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "heir"  # heir, investor, notary
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    session_id: str
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Campaign(BaseModel):
    campaign_id: str
    user_id: str
    title: str
    description: str
    story: str
    property_type: str  # house, apartment, land, business
    property_value: float
    location: str
    target_amount: float
    raised_amount: float = 0.0
    interest_rate: float = 5.0  # Annual %
    duration_months: int = 24
    images: List[str] = []
    status: str = "draft"  # draft, active, funded, completed
    notary_validated: bool = False
    notary_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    funded_at: Optional[datetime] = None

class CampaignCreate(BaseModel):
    title: str
    description: str
    story: str
    property_type: str
    property_value: float
    location: str
    target_amount: float
    interest_rate: float = 5.0
    duration_months: int = 24
    images: List[str] = []

class Investment(BaseModel):
    investment_id: str
    campaign_id: str
    user_id: str
    amount: float
    expected_return: float
    status: str = "active"  # active, repaid, defaulted
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaymentTransaction(BaseModel):
    transaction_id: str
    user_id: str
    campaign_id: Optional[str] = None
    amount: float
    currency: str = "eur"
    session_id: str
    payment_status: str = "pending"  # pending, paid, failed, expired
    transaction_type: str = "investment"  # investment, refund
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SuccessionCalculatorInput(BaseModel):
    property_value: float
    relationship: str  # direct_line, sibling, spouse, other
    previous_donations: float = 0.0
    has_disability: bool = False

class SuccessionResult(BaseModel):
    property_value: float
    relationship: str
    abatement: float
    taxable_amount: float
    tax_rate: float
    succession_fees: float
    net_inheritance: float
    breakdown: Dict[str, float]

# ================================
# SUCCESSION CALCULATOR LOGIC
# ================================

def calculate_succession_fees(data: SuccessionCalculatorInput) -> SuccessionResult:
    """Calculate French succession fees based on relationship and value"""
    property_value = data.property_value
    relationship = data.relationship
    
    # Abatements based on relationship (2025 values)
    abatements = {
        "spouse": float('inf'),  # Spouse exempt
        "direct_line": 100000,  # Children
        "sibling": 15932,
        "nephew_niece": 7967,
        "other": 1594
    }
    
    # Disability bonus
    disability_bonus = 159325 if data.has_disability else 0
    
    abatement = abatements.get(relationship, 1594) + disability_bonus
    
    # For spouse, no tax
    if relationship == "spouse":
        return SuccessionResult(
            property_value=property_value,
            relationship=relationship,
            abatement=property_value,
            taxable_amount=0,
            tax_rate=0,
            succession_fees=0,
            net_inheritance=property_value,
            breakdown={"abatement": property_value, "tax": 0}
        )
    
    # Calculate taxable amount
    taxable_amount = max(0, property_value - abatement - data.previous_donations)
    
    # Tax brackets for direct line (children)
    if relationship == "direct_line":
        brackets = [
            (8072, 0.05),
            (12109, 0.10),
            (15932, 0.15),
            (552324, 0.20),
            (902838, 0.30),
            (1805677, 0.40),
            (float('inf'), 0.45)
        ]
    elif relationship == "sibling":
        brackets = [
            (24430, 0.35),
            (float('inf'), 0.45)
        ]
    else:
        brackets = [(float('inf'), 0.60)]  # Other relationships: 60% flat
    
    # Calculate progressive tax
    tax = 0
    remaining = taxable_amount
    prev_limit = 0
    weighted_rate = 0
    
    for limit, rate in brackets:
        bracket_amount = min(remaining, limit - prev_limit)
        if bracket_amount > 0:
            tax += bracket_amount * rate
            remaining -= bracket_amount
        prev_limit = limit
        if remaining <= 0:
            break
    
    if taxable_amount > 0:
        weighted_rate = (tax / taxable_amount) * 100
    
    return SuccessionResult(
        property_value=property_value,
        relationship=relationship,
        abatement=abatement,
        taxable_amount=taxable_amount,
        tax_rate=round(weighted_rate, 2),
        succession_fees=round(tax, 2),
        net_inheritance=round(property_value - tax, 2),
        breakdown={
            "property_value": property_value,
            "abatement": abatement,
            "taxable": taxable_amount,
            "tax": round(tax, 2)
        }
    )

# ================================
# AUTH HELPERS
# ================================

async def get_current_user(request: Request) -> Optional[User]:
    """Get current user from session token in cookie or Authorization header"""
    session_token = request.cookies.get("session_token")
    
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header[7:]
    
    if not session_token:
        return None
    
    session = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session:
        return None
    
    expires_at = session.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        return None
    
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if user:
        return User(**user)
    return None

async def require_auth(request: Request) -> User:
    """Require authenticated user"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

# ================================
# AUTH ROUTES
# ================================

@api_router.get("/auth/session")
async def process_session(session_id: str, response: Response):
    """Process OAuth session_id and create local session"""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            
            if resp.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")
            
            data = resp.json()
    except Exception as e:
        logger.error(f"OAuth error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")
    
    email = data.get("email")
    name = data.get("name")
    picture = data.get("picture")
    session_token = data.get("session_token")
    
    # Find or create user
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
        # Update user data
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": name, "picture": picture}}
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_doc = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "role": "heir",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user_doc)
    
    # Create session
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    session_doc = {
        "session_id": str(uuid.uuid4()),
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return user

@api_router.get("/auth/me")
async def get_me(user: User = Depends(require_auth)):
    """Get current user"""
    return user.model_dump()

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out"}

@api_router.post("/auth/role")
async def update_role(role: str, user: User = Depends(require_auth)):
    """Update user role"""
    if role not in ["heir", "investor", "notary"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$set": {"role": role}}
    )
    return {"message": "Role updated", "role": role}

# ================================
# CALCULATOR ROUTES
# ================================

@api_router.post("/calculator/succession", response_model=SuccessionResult)
async def calculate_succession(data: SuccessionCalculatorInput):
    """Calculate succession fees (free, no auth required)"""
    return calculate_succession_fees(data)

# ================================
# CAMPAIGN ROUTES
# ================================

@api_router.post("/campaigns", response_model=Campaign)
async def create_campaign(data: CampaignCreate, user: User = Depends(require_auth)):
    """Create a new campaign"""
    campaign_id = f"camp_{uuid.uuid4().hex[:12]}"
    
    campaign = Campaign(
        campaign_id=campaign_id,
        user_id=user.user_id,
        **data.model_dump()
    )
    
    doc = campaign.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.campaigns.insert_one(doc)
    return campaign

@api_router.get("/campaigns")
async def list_campaigns(status: Optional[str] = None, limit: int = 20):
    """List all active campaigns (public)"""
    query = {"status": "active"}
    if status:
        query["status"] = status
    
    campaigns = await db.campaigns.find(query, {"_id": 0}).limit(limit).to_list(limit)
    
    # Get user info for each campaign
    for camp in campaigns:
        user = await db.users.find_one({"user_id": camp["user_id"]}, {"_id": 0, "name": 1, "picture": 1})
        camp["user"] = user
    
    return campaigns

@api_router.get("/campaigns/mine")
async def my_campaigns(user: User = Depends(require_auth)):
    """Get user's campaigns"""
    campaigns = await db.campaigns.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).to_list(100)
    return campaigns

@api_router.get("/campaigns/{campaign_id}")
async def get_campaign(campaign_id: str):
    """Get campaign details"""
    campaign = await db.campaigns.find_one({"campaign_id": campaign_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Get owner info
    user = await db.users.find_one({"user_id": campaign["user_id"]}, {"_id": 0, "name": 1, "picture": 1})
    campaign["user"] = user
    
    # Get investors count
    investors = await db.investments.count_documents({"campaign_id": campaign_id})
    campaign["investors_count"] = investors
    
    return campaign

@api_router.put("/campaigns/{campaign_id}")
async def update_campaign(campaign_id: str, data: CampaignCreate, user: User = Depends(require_auth)):
    """Update campaign"""
    campaign = await db.campaigns.find_one({"campaign_id": campaign_id, "user_id": user.user_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    await db.campaigns.update_one(
        {"campaign_id": campaign_id},
        {"$set": data.model_dump()}
    )
    return {"message": "Campaign updated"}

@api_router.post("/campaigns/{campaign_id}/publish")
async def publish_campaign(campaign_id: str, user: User = Depends(require_auth)):
    """Publish campaign (change status to active)"""
    campaign = await db.campaigns.find_one({"campaign_id": campaign_id, "user_id": user.user_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    await db.campaigns.update_one(
        {"campaign_id": campaign_id},
        {"$set": {"status": "active"}}
    )
    return {"message": "Campaign published"}

# ================================
# INVESTMENT ROUTES
# ================================

@api_router.get("/investments/mine")
async def my_investments(user: User = Depends(require_auth)):
    """Get user's investments"""
    investments = await db.investments.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).to_list(100)
    
    # Get campaign details for each investment
    for inv in investments:
        campaign = await db.campaigns.find_one(
            {"campaign_id": inv["campaign_id"]},
            {"_id": 0, "title": 1, "interest_rate": 1, "duration_months": 1, "status": 1}
        )
        inv["campaign"] = campaign
    
    return investments

@api_router.get("/investments/stats")
async def investment_stats(user: User = Depends(require_auth)):
    """Get investment statistics for user"""
    investments = await db.investments.find(
        {"user_id": user.user_id, "status": "active"},
        {"_id": 0}
    ).to_list(100)
    
    total_invested = sum(inv["amount"] for inv in investments)
    total_expected_return = sum(inv["expected_return"] for inv in investments)
    
    return {
        "total_invested": total_invested,
        "total_expected_return": total_expected_return,
        "active_investments": len(investments),
        "average_return_rate": (total_expected_return / total_invested * 100) if total_invested > 0 else 0
    }

# ================================
# PAYMENT ROUTES
# ================================

@api_router.post("/payments/create-checkout")
async def create_checkout(
    request: Request,
    campaign_id: str,
    amount: float,
    user: User = Depends(require_auth)
):
    """Create Stripe checkout session for investment"""
    logger.info(f"Creating checkout for campaign {campaign_id}, amount {amount}, user {user.user_id}")
    
    if amount < 50:
        raise HTTPException(status_code=400, detail="Minimum investment is 50€")
    
    campaign = await db.campaigns.find_one({"campaign_id": campaign_id, "status": "active"}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or not active")
    
    # Get origin from request
    origin = request.headers.get("origin", "")
    if not origin:
        origin = str(request.base_url).rstrip("/")
    
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    logger.info(f"Stripe key present: {bool(stripe_api_key)}, Origin: {origin}")
    
    try:
        stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        success_url = f"{origin}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{origin}/campaigns/{campaign_id}"
        
        metadata = {
            "user_id": user.user_id,
            "campaign_id": campaign_id,
            "type": "investment"
        }
        
        checkout_request = CheckoutSessionRequest(
            amount=float(amount),
            currency="eur",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata
        )
        
        logger.info(f"Creating Stripe session with amount: {amount} EUR")
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
        logger.info(f"Stripe session created: {session.session_id}")
        
        # Create payment transaction record
        transaction_id = f"tx_{uuid.uuid4().hex[:12]}"
        tx_doc = {
            "transaction_id": transaction_id,
            "user_id": user.user_id,
            "campaign_id": campaign_id,
            "amount": amount,
            "currency": "eur",
            "session_id": session.session_id,
            "payment_status": "pending",
            "transaction_type": "investment",
            "metadata": metadata,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.payment_transactions.insert_one(tx_doc)
        
        return {"url": session.url, "session_id": session.session_id}
    except Exception as e:
        logger.error(f"Stripe checkout error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment error: {str(e)}")

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, user: User = Depends(require_auth)):
    """Get payment status and process if successful"""
    host_url = "https://heritageguard.preview.emergentagent.com"
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    try:
        status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
    except Exception as e:
        logger.error(f"Stripe status error: {e}")
        raise HTTPException(status_code=500, detail="Error checking payment status")
    
    # Get transaction
    transaction = await db.payment_transactions.find_one(
        {"session_id": session_id},
        {"_id": 0}
    )
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Update transaction status
    if status.payment_status == "paid" and transaction.get("payment_status") != "paid":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": "paid"}}
        )
        
        # Create investment record
        campaign = await db.campaigns.find_one(
            {"campaign_id": transaction["campaign_id"]},
            {"_id": 0}
        )
        
        if campaign:
            interest_rate = campaign.get("interest_rate", 5.0)
            duration_months = campaign.get("duration_months", 24)
            amount = transaction["amount"]
            expected_return = amount * (1 + (interest_rate / 100) * (duration_months / 12))
            
            investment_id = f"inv_{uuid.uuid4().hex[:12]}"
            investment_doc = {
                "investment_id": investment_id,
                "campaign_id": transaction["campaign_id"],
                "user_id": user.user_id,
                "amount": amount,
                "expected_return": round(expected_return, 2),
                "status": "active",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.investments.insert_one(investment_doc)
            
            # Update campaign raised amount
            await db.campaigns.update_one(
                {"campaign_id": transaction["campaign_id"]},
                {"$inc": {"raised_amount": amount}}
            )
            
            # Check if campaign is fully funded
            updated_campaign = await db.campaigns.find_one(
                {"campaign_id": transaction["campaign_id"]},
                {"_id": 0}
            )
            if updated_campaign and updated_campaign.get("raised_amount", 0) >= updated_campaign.get("target_amount", 0):
                await db.campaigns.update_one(
                    {"campaign_id": transaction["campaign_id"]},
                    {"$set": {"status": "funded", "funded_at": datetime.now(timezone.utc).isoformat()}}
                )
    elif status.status == "expired":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": "expired"}}
        )
    
    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount": status.amount_total / 100,  # Convert from cents
        "currency": status.currency
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {"payment_status": "paid"}}
            )
        
        return {"received": True}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"received": False, "error": str(e)}

# ================================
# NOTARY ROUTES
# ================================

@api_router.get("/notary/campaigns")
async def notary_campaigns(user: User = Depends(require_auth)):
    """Get campaigns pending validation for notary"""
    if user.role != "notary":
        raise HTTPException(status_code=403, detail="Notary access required")
    
    campaigns = await db.campaigns.find(
        {"status": "active", "notary_validated": False},
        {"_id": 0}
    ).to_list(100)
    
    return campaigns

@api_router.post("/notary/validate/{campaign_id}")
async def validate_campaign(campaign_id: str, user: User = Depends(require_auth)):
    """Validate a campaign as notary"""
    if user.role != "notary":
        raise HTTPException(status_code=403, detail="Notary access required")
    
    await db.campaigns.update_one(
        {"campaign_id": campaign_id},
        {"$set": {"notary_validated": True, "notary_id": user.user_id}}
    )
    return {"message": "Campaign validated"}

@api_router.get("/notary/stats")
async def notary_stats(user: User = Depends(require_auth)):
    """Get notary statistics"""
    if user.role != "notary":
        raise HTTPException(status_code=403, detail="Notary access required")
    
    validated = await db.campaigns.count_documents({"notary_id": user.user_id})
    pending = await db.campaigns.count_documents({"status": "active", "notary_validated": False})
    
    # Calculate commissions (5% of funded campaigns)
    funded_campaigns = await db.campaigns.find(
        {"notary_id": user.user_id, "status": "funded"},
        {"_id": 0, "raised_amount": 1}
    ).to_list(100)
    
    total_commission = sum(camp.get("raised_amount", 0) * 0.05 for camp in funded_campaigns)
    
    return {
        "validated_campaigns": validated,
        "pending_campaigns": pending,
        "total_commission": round(total_commission, 2)
    }

# ================================
# STATS ROUTES
# ================================

@api_router.get("/stats/platform")
async def platform_stats():
    """Get platform-wide statistics"""
    total_campaigns = await db.campaigns.count_documents({"status": {"$in": ["active", "funded"]}})
    total_raised = 0
    
    campaigns = await db.campaigns.find(
        {"status": {"$in": ["active", "funded"]}},
        {"_id": 0, "raised_amount": 1}
    ).to_list(1000)
    total_raised = sum(c.get("raised_amount", 0) for c in campaigns)
    
    total_investors = await db.investments.distinct("user_id")
    funded_campaigns = await db.campaigns.count_documents({"status": "funded"})
    
    return {
        "total_campaigns": total_campaigns,
        "total_raised": round(total_raised, 2),
        "total_investors": len(total_investors),
        "funded_campaigns": funded_campaigns,
        "success_rate": round((funded_campaigns / total_campaigns * 100) if total_campaigns > 0 else 0, 1)
    }

# ================================
# HEALTH CHECK
# ================================

@api_router.get("/")
async def root():
    return {"message": "HeritageFund API", "version": "1.0.0"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
