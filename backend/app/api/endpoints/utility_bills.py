from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.billing import UtilityBill
from app.db.database import database
from app.api.deps import require_role, get_current_user

router = APIRouter()

@router.post("/", response_model=UtilityBill, dependencies=[Depends(require_role("LANDLORD"))])
async def create_utility_bill(utility_bill: UtilityBill, current_user = Depends(get_current_user)):
    lease = await database.leases.find_one({"_id": utility_bill.lease_id})
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")

    property = await database.properties.find_one({"_id": lease["property_id"], "landlord_id": current_user.id})
    if not property:
        raise HTTPException(status_code=403, detail="Not authorized to create a utility bill for this lease")

    utility_bill_dict = utility_bill.dict(by_alias=True)
    result = await database.utility_bills.insert_one(utility_bill_dict)
    created_utility_bill = await database.utility_bills.find_one({"_id": result.inserted_id})
    return UtilityBill(**created_utility_bill)

@router.get("/", response_model=List[UtilityBill])
async def read_utility_bills(current_user = Depends(get_current_user)):
    if current_user.role == "LANDLORD":
        properties = await database.properties.find({"landlord_id": current_user.id}).to_list(1000)
        property_ids = [p["_id"] for p in properties]
        leases = await database.leases.find({"property_id": {"$in": property_ids}}).to_list(1000)
        lease_ids = [l["_id"] for l in leases]
        utility_bills = await database.utility_bills.find({"lease_id": {"$in": lease_ids}}).to_list(1000)
    else: # TENANT
        utility_bills = await database.utility_bills.find({"tenant_id": current_user.id}).to_list(1000)
    return [UtilityBill(**utility_bill) for utility_bill in utility_bills]

@router.get("/{utility_bill_id}", response_model=UtilityBill)
async def read_utility_bill(utility_bill_id: str, current_user = Depends(get_current_user)):
    utility_bill = await database.utility_bills.find_one({"_id": utility_bill_id})
    if not utility_bill:
        raise HTTPException(status_code=404, detail="Utility bill not found")

    if current_user.role == "LANDLORD":
        lease = await database.leases.find_one({"_id": utility_bill["lease_id"]})
        property = await database.properties.find_one({"_id": lease["property_id"], "landlord_id": current_user.id})
        if not property:
            raise HTTPException(status_code=403, detail="Not authorized to access this utility bill")

    if current_user.role == "TENANT" and utility_bill["tenant_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this utility bill")

    return UtilityBill(**utility_bill)
