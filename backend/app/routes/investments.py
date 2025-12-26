from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from bson import ObjectId

from app.models.investment import Investment, InvestmentStatus
from app.models.campaign import Campaign
from app.models.user import User
from app.dependencies import get_current_user

router = APIRouter()


class CreateInvestmentRequest(BaseModel):
    campaign_id: str
    amount: float  # Min 50€


@router.post("/", status_code=201)
async def create_investment(
    request: CreateInvestmentRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new investment (investor only)
    """
    # Validate campaign
    if not ObjectId.is_valid(request.campaign_id):
        raise HTTPException(status_code=400, detail="Invalid campaign ID")

    campaign = await Campaign.get(request.campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    if campaign.status != "active":
        raise HTTPException(status_code=400, detail="Campaign is not active")

    # Validate amount
    if request.amount < 50:
        raise HTTPException(status_code=400, detail="Minimum investment is 50€")

    if campaign.current_amount + request.amount > campaign.target_amount:
        raise HTTPException(
            status_code=400,
            detail=f"Investment would exceed target. Remaining: {campaign.target_amount - campaign.current_amount}€"
        )

    # Check if user already invested
    existing = await Investment.find_one(
        Investment.campaign_id == ObjectId(request.campaign_id),
        Investment.investor_id == current_user.id
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have already invested in this campaign"
        )

    # Create investment
    investment = Investment(
        campaign_id=ObjectId(request.campaign_id),
        investor_id=current_user.id,
        amount=request.amount,
        interest_rate=campaign.interest_rate,
        duration_months=campaign.duration_months,
        status=InvestmentStatus.PENDING
    )

    await investment.insert()

    # TODO: Create Stripe payment intent here
    # For now, we'll mark as pending

    return {
        "message": "Investment created successfully",
        "investment_id": str(investment.id),
        "amount": investment.amount,
        "status": investment.status,
        "next_step": "Complete payment via Stripe"
    }


@router.get("/my/investments")
async def my_investments(current_user: User = Depends(get_current_user)):
    """
    Get investments made by current user
    """
    investments = await Investment.find(
        Investment.investor_id == current_user.id
    ).to_list()

    result = []
    for inv in investments:
        campaign = await Campaign.get(inv.campaign_id)

        result.append({
            "id": str(inv.id),
            "campaign": {
                "id": str(campaign.id) if campaign else None,
                "title": campaign.title if campaign else "Unknown",
            },
            "amount": inv.amount,
            "interest_rate": inv.interest_rate,
            "duration_months": inv.duration_months,
            "status": inv.status,
            "monthly_payment": inv.monthly_payment,
            "total_expected_return": inv.total_expected_return,
            "total_returned": inv.total_returned,
            "created_at": inv.created_at,
        })

    return {"investments": result}


@router.get("/{investment_id}")
async def get_investment(
    investment_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get investment details
    """
    if not ObjectId.is_valid(investment_id):
        raise HTTPException(status_code=400, detail="Invalid investment ID")

    investment = await Investment.get(investment_id)
    if not investment:
        raise HTTPException(status_code=404, detail="Investment not found")

    # Check ownership
    if investment.investor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    campaign = await Campaign.get(investment.campaign_id)

    return {
        "id": str(investment.id),
        "campaign": {
            "id": str(campaign.id) if campaign else None,
            "title": campaign.title if campaign else "Unknown",
        },
        "amount": investment.amount,
        "interest_rate": investment.interest_rate,
        "duration_months": investment.duration_months,
        "status": investment.status,
        "monthly_payment": investment.monthly_payment,
        "total_expected_return": investment.total_expected_return,
        "total_returned": investment.total_returned,
        "next_payment_date": investment.next_payment_date,
        "created_at": investment.created_at,
        "confirmed_at": investment.confirmed_at,
    }
