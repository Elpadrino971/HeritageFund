from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import EmailStr, Field
from enum import Enum


class UserRole(str, Enum):
    INVESTOR = "investor"
    HEIR = "heir"
    NOTARY = "notary"
    ADMIN = "admin"


class KYCStatus(str, Enum):
    PENDING = "pending"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"


class User(Document):
    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    phone: Optional[str] = None

    # Auth
    google_id: Optional[str] = None
    hashed_password: Optional[str] = None

    # Role & Status
    role: UserRole = UserRole.INVESTOR
    kyc_status: KYCStatus = KYCStatus.PENDING
    kyc_documents: List[str] = []

    # Banking
    iban: Optional[str] = None
    bank_verified: bool = False
    stripe_customer_id: Optional[str] = None
    stripe_account_id: Optional[str] = None

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

    class Settings:
        name = "users"
        indexes = [
            "email",
            "google_id",
            "role"
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "email": "jean@example.com",
                "full_name": "Jean Sébastien",
                "role": "heir",
                "phone": "+590690123456"
            }
        }
