from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.user import Landlord
from app.db.database import database
from app.api.deps import require_role
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/", response_model=Landlord)
async def create_landlord(landlord: Landlord):
    landlord.hashed_password = get_password_hash(landlord.hashed_password)
    landlord_dict = landlord.dict(by_alias=True)
    result = await database.landlords.insert_one(landlord_dict)
    created_landlord = await database.landlords.find_one({"_id": result.inserted_id})
    return Landlord(**created_landlord)

@router.get("/", response_model=List[Landlord], dependencies=[Depends(require_role("LANDLORD"))])
async def read_landlords():
    landlords = await database.landlords.find().to_list(1000)
    return [Landlord(**landlord) for landlord in landlords]

@router.get("/{landlord_id}", response_model=Landlord, dependencies=[Depends(require_role("LANDLORD"))])
async def read_landlord(landlord_id: str):
    landlord = await database.landlords.find_one({"_id": landlord_id})
    if landlord:
        return Landlord(**landlord)
    raise HTTPException(status_code=404, detail="Landlord not found")
