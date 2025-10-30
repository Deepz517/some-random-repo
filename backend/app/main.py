from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.api.endpoints import landlords, tenants, properties, leases, payments, utility_bills, auth
from app.core.scheduler import start_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(landlords.router, prefix="/landlords", tags=["landlords"])
app.include_router(tenants.router, prefix="/tenants", tags=["tenants"])
app.include_router(properties.router, prefix="/properties", tags=["properties"])
app.include_router(leases.router, prefix="/leases", tags=["leases"])
app.include_router(payments.router, prefix="/payments", tags=["payments"])
app.include_router(utility_bills.router, prefix="/utility_bills", tags=["utility_bills"])
app.include_router(auth.router, tags=["auth"])

@app.get("/")
async def root():
    return {"message": "Welcome to the RentRoll API"}
