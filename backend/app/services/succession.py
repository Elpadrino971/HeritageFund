from typing import Dict, List


# Abattements selon le lien de parenté
ABATEMENTS = {
    "direct": 100000,      # Enfants, parents (ligne directe)
    "spouse": 80724,       # Conjoint, PACS
    "siblings": 15932,     # Frères et sœurs
    "nephews": 7967,       # Neveux et nièces
    "other": 1594,         # Autres
}

# Barèmes d'imposition
TAX_BRACKETS = {
    "direct": [
        {"limit": 8072, "rate": 5},
        {"limit": 12109, "rate": 10},
        {"limit": 15932, "rate": 15},
        {"limit": 552324, "rate": 20},
        {"limit": 902838, "rate": 30},
        {"limit": 1805677, "rate": 40},
        {"limit": float('inf'), "rate": 45},
    ],
    "siblings": [
        {"limit": 24430, "rate": 35},
        {"limit": float('inf'), "rate": 45},
    ],
    "other": [
        {"limit": float('inf'), "rate": 60},
    ],
}


def calculate_succession_tax(asset_value: float, relation: str) -> Dict:
    """
    Calcule les droits de succession selon le barème français 2025

    Args:
        asset_value: Valeur du bien hérité en euros
        relation: Type de relation ('direct', 'spouse', 'siblings', 'nephews', 'other')

    Returns:
        Dict contenant: assetValue, abatement, taxableAmount, taxAmount, effectiveRate
    """
    # Appliquer l'abattement
    abatement = ABATEMENTS.get(relation, ABATEMENTS["other"])
    taxable_amount = max(0, asset_value - abatement)

    # Déterminer les tranches applicables
    if relation == "direct":
        brackets = TAX_BRACKETS["direct"]
    elif relation == "siblings":
        brackets = TAX_BRACKETS["siblings"]
    else:
        brackets = TAX_BRACKETS["other"]

    # Calculer l'impôt par tranches
    tax = 0
    remaining = taxable_amount
    previous_limit = 0

    for bracket in brackets:
        bracket_amount = min(remaining, bracket["limit"] - previous_limit)
        tax += bracket_amount * (bracket["rate"] / 100)
        remaining -= bracket_amount
        previous_limit = bracket["limit"]

        if remaining <= 0:
            break

    return {
        "assetValue": asset_value,
        "abatement": abatement,
        "taxableAmount": taxable_amount,
        "taxAmount": round(tax, 2),
        "effectiveRate": round((tax / asset_value * 100), 2) if asset_value > 0 else 0
    }


def calculate_monthly_payment(principal: float, annual_rate: float, months: int) -> float:
    """
    Calcule le remboursement mensuel d'un prêt

    Args:
        principal: Montant emprunté
        annual_rate: Taux annuel (ex: 5.5 pour 5,5%)
        months: Durée en mois

    Returns:
        Montant du remboursement mensuel
    """
    if annual_rate == 0:
        return principal / months

    monthly_rate = annual_rate / 100 / 12
    payment = (principal * monthly_rate * (1 + monthly_rate) ** months) / ((1 + monthly_rate) ** months - 1)

    return round(payment, 2)


def calculate_total_return(principal: float, annual_rate: float, months: int) -> float:
    """
    Calcule le retour total (principal + intérêts)
    """
    monthly_payment = calculate_monthly_payment(principal, annual_rate, months)
    return round(monthly_payment * months, 2)
