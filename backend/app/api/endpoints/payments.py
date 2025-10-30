from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.billing import Payment
from app.db.database import database
from app.api.deps import require_role, get_current_user

router = APIRouter()

@router.post("/", response_model=Payment, dependencies=[Depends(require_role("LANDLORD"))])
async def create_payment(payment: Payment, current_user = Depends(get_current_user)):
    lease = await database.leases.find_one({"_id": payment.lease_id})
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")

    property = await database.properties.find_one({"_id": lease["property_id"], "landlord_id": current_user.id})
    if not property:
        raise HTTPException(status_code=403, detail="Not authorized to create a payment for this lease")

    payment_dict = payment.dict(by_alias=True)
    result = await database.payments.insert_one(payment_dict)
    created_payment = await database.payments.find_one({"_id": result.inserted_id})
    return Payment(**created_payment)

@router.get("/", response_model=List[Payment])
async def read_payments(current_user = Depends(get_current_user)):
    if current_user.role == "LANDLORD":
        properties = await database.properties.find({"landlord_id": current_user.id}).to_list(1000)
        property_ids = [p["_id"] for p in properties]
        leases = await database.leases.find({"property_id": {"$in": property_ids}}).to_list(1000)
        lease_ids = [l["_id"] for l in leases]
        payments = await database.payments.find({"lease_id": {"$in": lease_ids}}).to_list(1000)
    else: # TENANT
        payments = await database.payments.find({"tenant_id": current_user.id}).to_list(1000)
    return [Payment(**payment) for payment in payments]

@router.get("/{payment_id}", response_model=Payment)
async def read_payment(payment_id: str, current_user = Depends(get_current_user)):
    payment = await database.payments.find_one({"_id": payment_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if current_user.role == "LANDLORD":
        lease = await database.leases.find_one({"_id": payment["lease_id"]})
        property = await database.properties.find_one({"_id": lease["property_id"], "landlord_id": current_user.id})
        if not property:
            raise HTTPException(status_code=403, detail="Not authorized to access this payment")

    if current_user.role == "TENANT" and payment["tenant_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this payment")

    return Payment(**payment)
