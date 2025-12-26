from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
from pydantic import BaseModel

from app.models.user import User, UserRole
from app.dependencies import get_current_user

router = APIRouter()


class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    iban: Optional[str] = None


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current user profile
    """
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "avatar_url": current_user.avatar_url,
        "phone": current_user.phone,
        "role": current_user.role,
        "kyc_status": current_user.kyc_status,
        "bank_verified": current_user.bank_verified,
        "created_at": current_user.created_at,
    }


@router.patch("/me")
async def update_me(
    update: UpdateProfileRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Update current user profile
    """
    if update.full_name:
        current_user.full_name = update.full_name
    if update.phone:
        current_user.phone = update.phone
    if update.iban:
        current_user.iban = update.iban

    await current_user.save()

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": str(current_user.id),
            "email": current_user.email,
            "full_name": current_user.full_name,
            "phone": current_user.phone,
        }
    }


@router.post("/me/role")
async def update_role(
    role: UserRole,
    current_user: User = Depends(get_current_user)
):
    """
    Update user role (heir, investor, notary)
    """
    current_user.role = role
    await current_user.save()

    return {
        "message": f"Role updated to {role}",
        "role": current_user.role
    }
