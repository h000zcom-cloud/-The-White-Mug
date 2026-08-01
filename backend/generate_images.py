"""
One-off image generation script for The White Mug – Cafe.
Uses Gemini Nano Banana via the Emergent LLM key to generate
a curated set of hero-quality product / interior photographs
and caches them to /app/backend/static/images/.

Idempotent: skips any image that already exists.
Run: `python /app/backend/generate_images.py`
"""
import asyncio
import base64
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Local import (script is in the same directory as this module)
sys.path.insert(0, str(ROOT_DIR))
from image_prompts import IMAGE_PROMPTS  # noqa: E402

from emergentintegrations.llm.chat import LlmChat, UserMessage  # noqa: E402


OUT_DIR = ROOT_DIR / "static" / "images"
OUT_DIR.mkdir(parents=True, exist_ok=True)

MODEL_ID = "gemini-3.1-flash-image-preview"


async def generate_one(key: str, prompt: str, api_key: str) -> None:
    out_path = OUT_DIR / f"{key}.png"
    if out_path.exists() and out_path.stat().st_size > 5000:
        print(f"[skip] {key} already exists ({out_path.stat().st_size} bytes)")
        return

    print(f"[gen ] {key} ...")
    t0 = time.time()

    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=f"twm-image-{key}-{int(time.time())}",
            system_message=(
                "You are an award-winning food and interior photographer. "
                "Generate a single hyper-realistic editorial photograph based "
                "on the user prompt. No text overlays."
            ),
        )
        chat.with_model("gemini", MODEL_ID).with_params(modalities=["image", "text"])

        _text, images = await chat.send_message_multimodal_response(
            UserMessage(text=prompt)
        )

        if not images:
            print(f"[FAIL] {key}: no image returned")
            return

        img = images[0]
        image_bytes = base64.b64decode(img["data"])
        out_path.write_bytes(image_bytes)
        dt = time.time() - t0
        print(f"[ ok ] {key} -> {out_path.name}  ({len(image_bytes)/1024:.1f} KB, {dt:.1f}s)")
    except Exception as e:  # noqa: BLE001
        print(f"[FAIL] {key}: {type(e).__name__}: {e}")


async def main() -> None:
    api_key = os.getenv("EMERGENT_LLM_KEY")
    if not api_key:
        print("ERROR: EMERGENT_LLM_KEY not set")
        sys.exit(1)

    print(f"Generating {len(IMAGE_PROMPTS)} images -> {OUT_DIR}")
    # Run sequentially — Gemini image gen can rate-limit under parallel load
    for key, prompt in IMAGE_PROMPTS.items():
        await generate_one(key, prompt, api_key)

    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
