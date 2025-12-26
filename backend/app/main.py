from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from contextlib import asynccontextmanager

from app.config.settings import settings
from app.models import User, Campaign, Investment, Repayment
from app.routes import auth, campaigns, investments, users, calculator


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    database = client[settings.MONGODB_DB_NAME]

    await init_beanie(
        database=database,
        document_models=[User, Campaign, Investment, Repayment]
    )

    print(f"✅ Connected to MongoDB: {settings.MONGODB_DB_NAME}")
    yield

    # Shutdown
    client.close()
    print("👋 Closed MongoDB connection")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix=f"{settings.API_PREFIX}/auth", tags=["Authentication"])
app.include_router(users.router, prefix=f"{settings.API_PREFIX}/users", tags=["Users"])
app.include_router(calculator.router, prefix=f"{settings.API_PREFIX}/calculator", tags=["Calculator"])
app.include_router(campaigns.router, prefix=f"{settings.API_PREFIX}/campaigns", tags=["Campaigns"])
app.include_router(investments.router, prefix=f"{settings.API_PREFIX}/investments", tags=["Investments"])


@app.get("/")
async def root():
    return {
        "message": "HeritageFund API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
