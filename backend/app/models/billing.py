from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import date
from .user import PyObjectId

class Payment(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    lease_id: PyObjectId
    tenant_id: PyObjectId
    amount: float
    payment_date: date
    payment_method: str
    note_receipt_reference: Optional[str]
    last_notified: Optional[date]

    @field_validator('note_receipt_reference')
    def validate_note_receipt_reference(cls, v, info):
        if info.data.get('payment_method') == 'CASH' and not v:
            raise ValueError('note_receipt_reference is required for cash payments')
        return v

    model_config = {
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }

class UtilityBill(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    lease_id: PyObjectId
    tenant_id: PyObjectId
    bill_type: str
    amount: float
    due_date: date
    billing_period: str
    image_url: str

    model_config = {
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }
