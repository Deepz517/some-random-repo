
async def send_rent_due_notification(tenant_email: str, landlord_email: str, due_date: str):
    print(f"Reminder: Rent is due on {due_date} for tenant {tenant_email}. Notifying landlord {landlord_email}.")

async def send_rent_overdue_notification(tenant_email: str, landlord_email: str, due_date: str):
    print(f"ALERT: Rent was due on {due_date} for tenant {tenant_email} and is now overdue. Notifying landlord {landlord_email}.")

async def send_lease_expiry_notification(landlord_email: str, end_date: str):
    print(f"INFO: A lease is set to expire on {end_date}. Notifying landlord {landlord_email}.")
