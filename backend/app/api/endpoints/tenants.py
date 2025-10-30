from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.user import Tenant
from app.db.database import database
from app.api.deps import require_role, get_current_user
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/", response_model=Tenant, dependencies=[Depends(require_role("LANDLORD"))])
async def create_tenant(tenant: Tenant, current_user = Depends(get_current_user)):
    tenant.landlord_id = current_user.id
    tenant.hashed_password = get_password_hash(tenant.hashed_password)
    tenant_dict = tenant.dict(by_alias=True)
    result = await database.tenants.insert_one(tenant_dict)
    created_tenant = await database.tenants.find_one({"_id": result.inserted_id})
    return Tenant(**created_tenant)

@router.get("/", response_model=List[Tenant], dependencies=[Depends(require_role("LANDLORD"))])
async def read_tenants(current_user = Depends(get_current_user)):
    tenants = await database.tenants.find({"landlord_id": current_user.id}).to_list(1000)
    return [Tenant(**tenant) for tenant in tenants]

@router.get("/{tenant_id}", response_model=Tenant)
async def read_tenant(tenant_id: str, current_user = Depends(get_current_user)):
    tenant = await database.tenants.find_one({"_id": tenant_id})
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    if current_user.role == "LANDLORD" and tenant["landlord_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this tenant")

    if current_user.role == "TENANT" and tenant["_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this tenant")

    return Tenant(**tenant)
