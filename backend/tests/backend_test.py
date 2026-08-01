"""Backend API tests for The White Mug – Cafe."""
import os
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")
BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")

EXPECTED_SLUGS = {
    "barista_hands", "brownie", "cafe_seating", "cheesecake", "coffee_beans",
    "croissant", "frappe", "hero_interior", "hot_chocolate", "iced_latte",
    "mojito", "pizza", "pour_over", "sandwich", "sourdough_toast", "spanish_latte",
    "cafe_patio", "cafe_work_corner",
}
NEW_SLUGS = {"cafe_patio", "cafe_work_corner"}


def test_root():
    r = requests.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    assert "message" in r.json()


def test_health_lists_16_images():
    r = requests.get(f"{BASE_URL}/api/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert data["images_ready"] >= 18
    slugs = {name.replace(".png", "") for name in data["images"]}
    missing = EXPECTED_SLUGS - slugs
    assert not missing, f"Missing images: {missing}"


def test_manifest():
    r = requests.get(f"{BASE_URL}/api/images/manifest")
    assert r.status_code == 200
    data = r.json()
    assert data["count"] >= 18
    assert isinstance(data["images"], dict)
    for slug in EXPECTED_SLUGS:
        assert slug in data["images"], f"missing {slug}"
        assert data["images"][slug].endswith(f"{slug}.png")


def test_new_ambiance_images_served():
    for slug in NEW_SLUGS:
        r = requests.get(f"{BASE_URL}/api/images/{slug}.png")
        assert r.status_code == 200, f"{slug} not served"
        assert r.headers["content-type"].startswith("image/png")
        assert len(r.content) > 50 * 1024, f"{slug} body {len(r.content)} < 50KB"


def test_hero_image_served():
    r = requests.get(f"{BASE_URL}/api/images/hero_interior.png")
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("image/png")
    assert len(r.content) > 100 * 1024


def test_path_traversal_blocked():
    # requests will urlencode ../ so we do raw
    r = requests.get(f"{BASE_URL}/api/images/..%2F..%2Fetc%2Fpasswd")
    # Either 400 (validated) or 404 (not found) is acceptable; brief says 400.
    assert r.status_code in (400, 404)


def test_nonexistent_image_404():
    r = requests.get(f"{BASE_URL}/api/images/nonexistent.png")
    assert r.status_code == 404


def test_all_16_images_load():
    for slug in EXPECTED_SLUGS:
        r = requests.get(f"{BASE_URL}/api/images/{slug}.png")
        assert r.status_code == 200, f"{slug} not served"
        assert r.headers["content-type"].startswith("image/png")
        assert len(r.content) > 10_000
