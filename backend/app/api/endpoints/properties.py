from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.property import Property
from app.db.database import database
from app.api.deps import require_role, get_current_user

router = APIRouter()

@router.post("/", response_model=Property, dependencies=[Depends(require_role("LANDLORD"))])
async def create_property(property: Property, current_user = Depends(get_current_user)):
    property.landlord_id = current_user.id
    property_dict = property.dict(by_alias=True)
    result = await database.properties.insert_one(property_dict)
    created_property = await database.properties.find_one({"_id": result.inserted_id})
    return Property(**created_property)

@router.get("/", response_model=List[Property], dependencies=[Depends(require_role("LANDLORD"))])
async def read_properties(current_user = Depends(get_current_user)):
    properties = await database.properties.find({"landlord_id": current_user.id}).to_list(1000)
    return [Property(**property) for property in properties]

@router.get("/{property_id}", response_model=Property)
async def read_property(property_id: str, current_user = Depends(get_current_user)):
    property = await database.properties.find_one({"_id": property_id})
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    if current_user.role == "LANDLORD" and property["landlord_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this property")

    if current_user.role == "TENANT":
        lease = await database.leases.find_one({"property_id": property_id, "tenant_id": current_user.id})
        if not lease:
            raise HTTPException(status_code=403, detail="Not authorized to access this property")

    return Property(**property)
