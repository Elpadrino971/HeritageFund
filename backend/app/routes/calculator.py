from fastapi import APIRouter
from pydantic import BaseModel

from app.services.succession import calculate_succession_tax, calculate_monthly_payment

router = APIRouter()


class CalculateRequest(BaseModel):
    asset_value: float
    relation: str  # 'direct', 'spouse', 'siblings', 'nephews', 'other'


class CalculateResponse(BaseModel):
    assetValue: float
    abatement: float
    taxableAmount: float
    taxAmount: float
    effectiveRate: float


class LoanCalculateRequest(BaseModel):
    principal: float
    annual_rate: float
    duration_months: int


class LoanCalculateResponse(BaseModel):
    monthly_payment: float
    total_return: float
    total_interest: float


@router.post("/succession", response_model=CalculateResponse)
async def calculate_succession(request: CalculateRequest):
    """
    Calculer les droits de succession selon le barème français
    """
    result = calculate_succession_tax(request.asset_value, request.relation)
    return CalculateResponse(**result)


@router.post("/loan", response_model=LoanCalculateResponse)
async def calculate_loan(request: LoanCalculateRequest):
    """
    Calculer les mensualités d'un prêt
    """
    monthly_payment = calculate_monthly_payment(
        request.principal,
        request.annual_rate,
        request.duration_months
    )

    total_return = monthly_payment * request.duration_months
    total_interest = total_return - request.principal

    return LoanCalculateResponse(
        monthly_payment=round(monthly_payment, 2),
        total_return=round(total_return, 2),
        total_interest=round(total_interest, 2)
    )
