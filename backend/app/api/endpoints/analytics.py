from fastapi import APIRouter, Depends
from app.db.database import database
from app.api.deps import get_current_user
from datetime import datetime, date

router = APIRouter()

@router.get("/total_monthly_rent_due")
async def get_total_monthly_rent_due(current_user = Depends(get_current_user)):
    today = date.today()
    start_of_month = today.replace(day=1)

    properties = await database.properties.find({"landlord_id": current_user.id}).to_list(1000)
    property_ids = [p["_id"] for p in properties]

    leases = await database.leases.find({"property_id": {"$in": property_ids}}).to_list(1000)

    total_rent_due = sum(lease["rent_amount"] for lease in leases)
    return {"total_monthly_rent_due": total_rent_due}

@router.get("/total_overdue_amount")
async def get_total_overdue_amount(current_user = Depends(get_current_user)):
    properties = await database.properties.find({"landlord_id": current_user.id}).to_list(1000)
    property_ids = [p["_id"] for p in properties]
    leases = await database.leases.find({"property_id": {"$in": property_ids}}).to_list(1000)
    lease_ids = [l["_id"] for l in leases]

    overdue_payments = await database.payments.find({"lease_id": {"$in": lease_ids}, "status": "OVERDUE"}).to_list(1000)

    total_overdue_amount = sum(payment["amount"] for payment in overdue_payments)
    return {"total_overdue_amount": total_overdue_amount}

@router.get("/collection_rate")
async def get_collection_rate(current_user = Depends(get_current_user)):
    today = date.today()
    start_of_month = today.replace(day=1)

    properties = await database.properties.find({"landlord_id": current_user.id}).to_list(1000)
    property_ids = [p["_id"] for p in properties]
    leases = await database.leases.find({"property_id": {"$in": property_ids}}).to_list(1000)
    lease_ids = [l["_id"] for l in leases]

    total_rent_due = sum(lease["rent_amount"] for lease in leases)

    paid_payments = await database.payments.find({"lease_id": {"$in": lease_ids}, "status": "PAID", "payment_date": {"$gte": start_of_month}}).to_list(1000)
    total_paid_amount = sum(payment["amount"] for payment in paid_payments)

    collection_rate = (total_paid_amount / total_rent_due) * 100 if total_rent_due > 0 else 0
    return {"collection_rate": collection_rate}

@router.get("/payment_method_breakdown")
async def get_payment_method_breakdown(current_user = Depends(get_current_user)):
    properties = await database.properties.find({"landlord_id": current_user.id}).to_list(1000)
    property_ids = [p["_id"] for p in properties]
    leases = await database.leases.find({"property_id": {"$in": property_ids}}).to_list(1000)
    lease_ids = [l["_id"] for l in leases]

    pipeline = [
        {"$match": {"lease_id": {"$in": lease_ids}}},
        {"$group": {"_id": "$payment_method", "total": {"$sum": "$amount"}}}
    ]

    breakdown = await database.payments.aggregate(pipeline).to_list(1000)
    return {"payment_method_breakdown": breakdown}

@router.get("/overdue_status_breakdown")
async def get_overdue_status_breakdown(current_user = Depends(get_current_user)):
    properties = await database.properties.find({"landlord_id": current_user.id}).to_list(1000)
    property_ids = [p["_id"] for p in properties]
    leases = await database.leases.find({"property_id": {"$in": property_ids}}).to_list(1000)
    lease_ids = [l["_id"] for l in leases]

    today = datetime.now()

    pipeline = [
        {"$match": {"lease_id": {"$in": lease_ids}, "status": "OVERDUE"}},
        {"$addFields": {
            "days_overdue": {
                "$dateDiff": {
                    "startDate": "$payment_date",
                    "endDate": today,
                    "unit": "day"
                }
            }
        }},
        {"$bucket": {
            "groupBy": "$days_overdue",
            "boundaries": [1, 8, 31, float('inf')],
            "default": "30+ days",
            "output": {
                "count": {"$sum": 1},
                "total_amount": {"$sum": "$amount"}
            }
        }}
    ]

    breakdown = await database.payments.aggregate(pipeline).to_list(1000)
    return {"overdue_status_breakdown": breakdown}
