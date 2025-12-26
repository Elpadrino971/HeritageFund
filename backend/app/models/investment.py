from datetime import datetime, date
from typing import Optional
from beanie import Document
from pydantic import Field
from enum import Enum
from bson import ObjectId


class InvestmentStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    ACTIVE = "active"
    COMPLETED = "completed"
    DEFAULTED = "defaulted"


class Investment(Document):
    campaign_id: ObjectId
    investor_id: ObjectId

    # Investment Details
    amount: float  # Min 50€
    interest_rate: float
    duration_months: int

    # Payment
    status: InvestmentStatus = InvestmentStatus.PENDING
    payment_method: Optional[str] = None
    stripe_payment_intent_id: Optional[str] = None

    # Repayment Tracking
    monthly_payment: Optional[float] = None
    total_expected_return: Optional[float] = None
    total_returned: float = 0
    next_payment_date: Optional[date] = None

    # Dates
    created_at: datetime = Field(default_factory=datetime.utcnow)
    confirmed_at: Optional[datetime] = None

    class Settings:
        name = "investments"
        indexes = [
            "campaign_id",
            "investor_id",
            "status"
        ]


class Repayment(Document):
    investment_id: ObjectId
    campaign_id: ObjectId
    investor_id: ObjectId

    # Payment Details
    amount: float
    principal: float
    interest: float

    # Status
    status: str = "scheduled"  # scheduled, processing, completed, failed, late
    due_date: date
    paid_at: Optional[datetime] = None

    # Payment Info
    stripe_transfer_id: Optional[str] = None
    payment_method: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "repayments"
        indexes = [
            "investment_id",
            "due_date",
            "status"
        ]
