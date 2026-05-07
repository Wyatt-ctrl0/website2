from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import subprocess
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

THEME_DIR = Path('/app/shopify-theme')
THEME_FOLDER = THEME_DIR / 'molly-and-sophie'
THEME_ZIP = THEME_DIR / 'molly-and-sophie-theme.zip'

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============ Models ============
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = ""
    message: str


class NewsletterSignup(BaseModel):
    email: EmailStr


class ThemeInfo(BaseModel):
    name: str
    version: str
    size_kb: int
    files: int
    download_url: str


# ============ Routes ============
@api_router.get("/")
async def root():
    return {"message": "Molly & Sophie Shopify Theme Builder"}


def _rebuild_zip():
    """Re-zip the theme folder to ensure latest files are bundled."""
    if THEME_ZIP.exists():
        THEME_ZIP.unlink()
    subprocess.run(
        ["zip", "-r", "molly-and-sophie-theme.zip", "molly-and-sophie", "-x", "*.DS_Store"],
        cwd=str(THEME_DIR),
        check=True,
        capture_output=True,
    )


def _count_files() -> int:
    if not THEME_FOLDER.exists():
        return 0
    return sum(1 for p in THEME_FOLDER.rglob("*") if p.is_file())


@api_router.get("/theme/info", response_model=ThemeInfo)
async def theme_info():
    if not THEME_ZIP.exists():
        _rebuild_zip()
    size_kb = max(1, THEME_ZIP.stat().st_size // 1024)
    return ThemeInfo(
        name="Molly & Sophie",
        version="1.0.0",
        size_kb=size_kb,
        files=_count_files(),
        download_url="/api/theme/download",
    )


@api_router.get("/theme/download")
async def download_theme():
    if not THEME_ZIP.exists():
        _rebuild_zip()
    if not THEME_ZIP.exists():
        raise HTTPException(status_code=404, detail="Theme zip not found")
    return FileResponse(
        path=str(THEME_ZIP),
        media_type="application/zip",
        filename="molly-and-sophie-theme.zip",
    )


@api_router.post("/theme/rebuild")
async def rebuild_theme():
    _rebuild_zip()
    return {"status": "ok", "size_kb": THEME_ZIP.stat().st_size // 1024}


@api_router.post("/contact")
async def submit_contact(payload: ContactMessage):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.contact_messages.insert_one(doc.copy())
    return {"status": "ok", "id": doc["id"]}


@api_router.post("/newsletter")
async def newsletter_signup(payload: NewsletterSignup):
    doc = {
        "id": str(uuid.uuid4()),
        "email": payload.email,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.newsletter_signups.insert_one(doc.copy())
    return {"status": "ok"}


# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
