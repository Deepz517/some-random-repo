from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.property import Lease
from app.db.database import database
from app.api.deps import require_role, get_current_user

router = APIRouter()

@router.post("/", response_model=Lease, dependencies=[Depends(require_role("LANDLORD"))])
async def create_lease(lease: Lease, current_user = Depends(get_current_user)):
    property = await database.properties.find_one({"_id": lease.property_id, "landlord_id": current_user.id})
    if not property:
        raise HTTPException(status_code=404, detail="Property not found or not owned by landlord")

    tenant = await database.tenants.find_one({"_id": lease.tenant_id, "landlord_id": current_user.id})
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found or not managed by landlord")

    lease_dict = lease.dict(by_alias=True)
    result = await database.leases.insert_one(lease_dict)
    created_lease = await database.leases.find_one({"_id": result.inserted_id})
    return Lease(**created_lease)

@router.get("/", response_model=List[Lease], dependencies=[Depends(require_role("LANDLORD"))])
async def read_leases(current_user = Depends(get_current_user)):
    properties = await database.properties.find({"landlord_id": current_user.id}).to_list(1000)
    property_ids = [p["_id"] for p in properties]
    leases = await database.leases.find({"property_id": {"$in": property_ids}}).to_list(1000)
    return [Lease(**lease) for lease in leases]

@router.get("/{lease_id}", response_model=Lease)
async def read_lease(lease_id: str, current_user = Depends(get_current_user)):
    lease = await database.leases.find_one({"_id": lease_id})
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")

    if current_user.role == "LANDLORD":
        property = await database.properties.find_one({"_id": lease["property_id"], "landlord_id": current_user.id})
        if not property:
            raise HTTPException(status_code=403, detail="Not authorized to access this lease")

    if current_user.role == "TENANT" and lease["tenant_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this lease")

    return Lease(**lease)

@router.get("/expiring", response_model=List[Lease], dependencies=[Depends(require_role("LANDLORD"))])
async def read_expiring_leases(current_user = Depends(get_current_user)):
    today = date.today()
    ninety_days_from_now = today + timedelta(days=90)

    properties = await database.properties.find({"landlord_id": current_user.id}).to_list(1000)
    property_ids = [p["_id"] for p in properties]

    leases = await database.leases.find({
        "property_id": {"$in": property_ids},
        "end_date": {"$gte": today, "$lte": ninety_days_from_now}
    }).to_list(1000)

    return [Lease(**lease) for lease in leases]
