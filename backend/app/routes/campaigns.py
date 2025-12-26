from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from bson import ObjectId

from app.models.campaign import Campaign, CampaignStatus, PropertyType
from app.models.user import User, UserRole
from app.dependencies import get_current_user

router = APIRouter()


class CreateCampaignRequest(BaseModel):
    title: str
    story: str
    location: str
    property_type: PropertyType
    asset_value: float
    tax_amount: float
    target_amount: float
    interest_rate: float
    duration_months: int
    images: List[str] = []


class UpdateCampaignRequest(BaseModel):
    title: Optional[str] = None
    story: Optional[str] = None
    location: Optional[str] = None
    images: Optional[List[str]] = None
    status: Optional[CampaignStatus] = None


@router.get("/")
async def list_campaigns(
    status: Optional[CampaignStatus] = Query(None),
    property_type: Optional[PropertyType] = Query(None),
    limit: int = Query(20, le=100),
    skip: int = Query(0)
):
    """
    List all active campaigns with optional filters
    """
    query = {}

    if status:
        query["status"] = status
    else:
        # By default, only show active campaigns
        query["status"] = CampaignStatus.ACTIVE

    if property_type:
        query["property_type"] = property_type

    campaigns = await Campaign.find(query).sort("-published_at").skip(skip).limit(limit).to_list()

    return {
        "campaigns": [
            {
                "id": str(c.id),
                "title": c.title,
                "story": c.story[:200] + "..." if len(c.story) > 200 else c.story,
                "location": c.location,
                "property_type": c.property_type,
                "target_amount": c.target_amount,
                "current_amount": c.current_amount,
                "interest_rate": c.interest_rate,
                "duration_months": c.duration_months,
                "backers_count": c.backers_count,
                "images": c.images,
                "published_at": c.published_at,
                "deadline": c.deadline,
            }
            for c in campaigns
        ],
        "total": len(campaigns)
    }


@router.get("/{campaign_id}")
async def get_campaign(campaign_id: str):
    """
    Get campaign details by ID
    """
    if not ObjectId.is_valid(campaign_id):
        raise HTTPException(status_code=400, detail="Invalid campaign ID")

    campaign = await Campaign.get(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    # Increment views
    campaign.views_count += 1
    await campaign.save()

    return {
        "id": str(campaign.id),
        "heir_id": str(campaign.heir_id),
        "title": campaign.title,
        "story": campaign.story,
        "location": campaign.location,
        "property_type": campaign.property_type,
        "asset_value": campaign.asset_value,
        "tax_amount": campaign.tax_amount,
        "target_amount": campaign.target_amount,
        "current_amount": campaign.current_amount,
        "interest_rate": campaign.interest_rate,
        "duration_months": campaign.duration_months,
        "images": campaign.images,
        "videos": campaign.videos,
        "status": campaign.status,
        "backers_count": campaign.backers_count,
        "views_count": campaign.views_count,
        "created_at": campaign.created_at,
        "published_at": campaign.published_at,
        "deadline": campaign.deadline,
    }


@router.post("/", status_code=201)
async def create_campaign(
    request: CreateCampaignRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new campaign (heir only)
    """
    if current_user.role not in [UserRole.HEIR, UserRole.ADMIN]:
        raise HTTPException(
            status_code=403,
            detail="Only heirs can create campaigns"
        )

    campaign = Campaign(
        heir_id=current_user.id,
        title=request.title,
        story=request.story,
        location=request.location,
        property_type=request.property_type,
        asset_value=request.asset_value,
        tax_amount=request.tax_amount,
        target_amount=request.target_amount,
        interest_rate=request.interest_rate,
        duration_months=request.duration_months,
        images=request.images,
        status=CampaignStatus.DRAFT
    )

    await campaign.insert()

    return {
        "message": "Campaign created successfully",
        "campaign_id": str(campaign.id),
        "status": campaign.status
    }


@router.patch("/{campaign_id}")
async def update_campaign(
    campaign_id: str,
    request: UpdateCampaignRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Update campaign (owner only)
    """
    if not ObjectId.is_valid(campaign_id):
        raise HTTPException(status_code=400, detail="Invalid campaign ID")

    campaign = await Campaign.get(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    # Check ownership
    if campaign.heir_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Update fields
    if request.title:
        campaign.title = request.title
    if request.story:
        campaign.story = request.story
    if request.location:
        campaign.location = request.location
    if request.images is not None:
        campaign.images = request.images
    if request.status:
        campaign.status = request.status

    await campaign.save()

    return {
        "message": "Campaign updated successfully",
        "campaign_id": str(campaign.id)
    }


@router.get("/my/campaigns")
async def my_campaigns(current_user: User = Depends(get_current_user)):
    """
    Get campaigns created by current user
    """
    campaigns = await Campaign.find(Campaign.heir_id == current_user.id).to_list()

    return {
        "campaigns": [
            {
                "id": str(c.id),
                "title": c.title,
                "status": c.status,
                "target_amount": c.target_amount,
                "current_amount": c.current_amount,
                "backers_count": c.backers_count,
                "created_at": c.created_at,
            }
            for c in campaigns
        ]
    }
