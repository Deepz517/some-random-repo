from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from .user import PyObjectId

class Property(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    name: str
    address: str
    landlord_id: PyObjectId

    model_config = {
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }

class Lease(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    property_id: PyObjectId
    tenant_id: PyObjectId
    start_date: date
    end_date: date
    rent_amount: float

    model_config = {
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }
