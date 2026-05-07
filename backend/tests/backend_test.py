"""Backend API tests for Molly & Sophie Shopify theme builder."""
import os
import io
import zipfile
import uuid
import pytest
import requests
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else None
if not BASE_URL:
    # fallback to frontend env
    fenv = Path("/app/frontend/.env").read_text()
    for line in fenv.splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
            break

API = f"{BASE_URL}/api"


@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ============ Theme Info ============
class TestThemeInfo:
    def test_theme_info_returns_metadata(self, client):
        r = client.get(f"{API}/theme/info", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "Molly & Sophie"
        assert data["version"] == "1.0.0"
        assert isinstance(data["size_kb"], int) and data["size_kb"] > 0
        assert isinstance(data["files"], int) and data["files"] > 0
        assert data["download_url"] == "/api/theme/download"


# ============ Theme Download ============
class TestThemeDownload:
    def test_download_returns_zip(self, client):
        r = client.get(f"{API}/theme/download", timeout=60)
        assert r.status_code == 200
        assert "application/zip" in r.headers.get("content-type", "").lower() \
               or "octet-stream" in r.headers.get("content-type", "").lower()
        cd = r.headers.get("content-disposition", "")
        assert "molly-and-sophie-theme.zip" in cd
        assert len(r.content) > 1000

    def test_zip_contains_theme_files(self, client):
        r = client.get(f"{API}/theme/download", timeout=60)
        assert r.status_code == 200
        zf = zipfile.ZipFile(io.BytesIO(r.content))
        names = zf.namelist()
        # Must contain key Shopify theme files
        required_substrings = [
            "molly-and-sophie/layout/theme.liquid",
            "molly-and-sophie/config/settings_schema.json",
            "molly-and-sophie/sections/header.liquid",
            "molly-and-sophie/templates/index.json",
        ]
        for sub in required_substrings:
            assert any(sub in n for n in names), f"Missing {sub} in zip. Got: {names[:20]}"


# ============ Contact Form ============
class TestContact:
    def test_contact_submit_success(self, client):
        payload = {
            "name": "TEST_user",
            "email": f"test_{uuid.uuid4().hex[:6]}@example.com",
            "subject": "Hello",
            "message": "Test message",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0

    def test_contact_invalid_email_rejected(self, client):
        payload = {"name": "X", "email": "not-an-email", "message": "hi"}
        r = client.post(f"{API}/contact", json=payload, timeout=30)
        assert r.status_code in (400, 422)

    def test_contact_missing_required_fields(self, client):
        r = client.post(f"{API}/contact", json={"email": "a@b.com"}, timeout=30)
        assert r.status_code in (400, 422)


# ============ Newsletter ============
class TestNewsletter:
    def test_newsletter_signup_success(self, client):
        payload = {"email": f"news_{uuid.uuid4().hex[:6]}@example.com"}
        r = client.post(f"{API}/newsletter", json=payload, timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"

    def test_newsletter_invalid_email(self, client):
        r = client.post(f"{API}/newsletter", json={"email": "bad"}, timeout=30)
        assert r.status_code in (400, 422)


# ============ Theme Rebuild ============
class TestThemeRebuild:
    def test_rebuild_endpoint(self, client):
        r = client.post(f"{API}/theme/rebuild", timeout=60)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert data["size_kb"] > 0
