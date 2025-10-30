from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import date, timedelta
from app.db.database import database
from app.services.notification import (
    send_rent_due_notification,
    send_rent_overdue_notification,
    send_lease_expiry_notification,
)

scheduler = AsyncIOScheduler(timezone="Asia/Kolkata")

async def check_due_dates():
    today = date.today()

    # Rent due in 3 days
    three_days_from_now = today + timedelta(days=3)
    rent_due_leases = await database.leases.find({"end_date": {"$gte": three_days_from_now}, "start_date": {"$lte": three_days_from_now}}).to_list(1000)
    for lease in rent_due_leases:
        tenant = await database.tenants.find_one({"_id": lease["tenant_id"]})
        landlord = await database.landlords.find_one({"_id": tenant["landlord_id"]})
        await send_rent_due_notification(tenant["email"], landlord["email"], str(three_days_from_now))

    # Rent overdue by 1 day
    yesterday = today - timedelta(days=1)
    overdue_payments = await database.payments.find({"payment_date": {"$lt": today}, "status": "OVERDUE", "last_notified": {"$ne": today}}).to_list(1000)
    for payment in overdue_payments:
        lease = await database.leases.find_one({"_id": payment["lease_id"]})
        tenant = await database.tenants.find_one({"_id": lease["tenant_id"]})
        landlord = await database.landlords.find_one({"_id": tenant["landlord_id"]})
        await send_rent_overdue_notification(tenant["email"], landlord["email"], str(payment["payment_date"]))
        await database.payments.update_one({"_id": payment["_id"]}, {"$set": {"last_notified": today}})

    # Leases expiring in 60 days
    sixty_days_from_now = today + timedelta(days=60)
    expiring_leases = await database.leases.find({"end_date": sixty_days_from_now}).to_list(1000)
    for lease in expiring_leases:
        tenant = await database.tenants.find_one({"_id": lease["tenant_id"]})
        landlord = await database.landlords.find_one({"_id": tenant["landlord_id"]})
        await send_lease_expiry_notification(landlord["email"], str(lease["end_date"]))


def start_scheduler():
    scheduler.add_job(check_due_dates, 'cron', hour=9, minute=0)
    scheduler.start()
