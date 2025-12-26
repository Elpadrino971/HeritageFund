from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field
from enum import Enum
from bson import ObjectId


class PropertyType(str, Enum):
    HOUSE = "house"
    FARM = "farm"
    BUSINESS = "business"
    LAND = "land"
    APARTMENT = "apartment"


class CampaignStatus(str, Enum):
    DRAFT = "draft"
    PENDING_VALIDATION = "pending_validation"
    ACTIVE = "active"
    FUNDED = "funded"
    REPAYING = "repaying"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Campaign(Document):
    # Ownership
    heir_id: ObjectId
    notary_id: Optional[ObjectId] = None

    # Campaign Details
    title: str
    story: str
    location: str
    property_type: PropertyType

    # Financial
    asset_value: float
    tax_amount: float
    target_amount: float
    current_amount: float = 0
    interest_rate: float  # Annual rate (4-10%)
    duration_months: int  # 12-120 months

    # Media
    images: List[str] = []
    videos: List[str] = []
    documents: List[str] = []

    # Status
    status: CampaignStatus = CampaignStatus.DRAFT
    validation_notes: Optional[str] = None

    # Stats
    backers_count: int = 0
    views_count: int = 0

    # Dates
    created_at: datetime = Field(default_factory=datetime.utcnow)
    published_at: Optional[datetime] = None
    funded_at: Optional[datetime] = None
    deadline: Optional[datetime] = None

    class Settings:
        name = "campaigns"
        indexes = [
            "heir_id",
            "status",
            "property_type",
            "published_at"
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Maison familiale en Guadeloupe",
                "story": "Ma grand-mère a construit cette maison en 1965...",
                "location": "Pointe-à-Pitre, Guadeloupe",
                "property_type": "house",
                "asset_value": 300000,
                "tax_amount": 70000,
                "target_amount": 70000,
                "interest_rate": 5.5,
                "duration_months": 36
            }
        }
