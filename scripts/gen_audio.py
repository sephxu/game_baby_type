#!/usr/bin/env python3
"""用 edge-tts（en-US-JennyNeural）预生成所有字母卡片的朗读音频。

- 输入：scripts/cards.json（由 extract_cards.mjs 生成）
- 输出：assets/audio/<library>/<slug>.mp3 + assets/audio/manifest.json
- manifest.json: { spokenText: "<library>/<slug>.mp3" }
  index.html 用 spoken 文本查表，命中则播放音频，未命中回退 Web Speech。
"""
import asyncio
import json
import re
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
CARDS = ROOT / "scripts" / "cards.json"
AUDIO_DIR = ROOT / "assets" / "audio"

VOICE = "en-US-JennyNeural"
RATE = "-5%"
PITCH = "+10Hz"

# 并发数：edge-tts 是在线服务，太高易被限流
CONCURRENCY = 8


def slugify(text: str) -> str:
    s = text.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "clip"


async def gen_one(sem, spoken, out_path):
    if out_path.exists():
        return True  # 已生成则跳过，支持断点续传
    async with sem:
        try:
            communicate = edge_tts.Communicate(spoken, VOICE, rate=RATE, pitch=PITCH)
            await communicate.save(str(out_path))
            return True
        except Exception as e:
            print(f"  ✗ 失败: {spoken!r} -> {e}", file=sys.stderr)
            return False


async def main():
    data = json.loads(CARDS.read_text())
    sem = asyncio.Semaphore(CONCURRENCY)

    manifest = {}
    tasks = []
    total = 0
    for library in ("bluey", "emoji"):
        out_lib_dir = AUDIO_DIR / library
        out_lib_dir.mkdir(parents=True, exist_ok=True)
        for key, cards in data[library].items():
            for i, card in enumerate(cards):
                spoken = card["spoken"]
                slug = f"{key}-{slugify(card['word'])}-{i}"
                rel = f"{library}/{slug}.mp3"
                manifest[spoken] = rel
                tasks.append(gen_one(sem, spoken, AUDIO_DIR / rel))
                total += 1

    print(f"开始生成 {total} 条音频（voice={VOICE}, rate={RATE}, pitch={PITCH}, 并发={CONCURRENCY}）…")
    results = await asyncio.gather(*tasks)
    ok = sum(1 for r in results if r)
    print(f"完成：{ok}/{total} 成功")

    (AUDIO_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
    print(f"已写入 manifest.json（{len(manifest)} 条）-> {AUDIO_DIR / 'manifest.json'}")


if __name__ == "__main__":
    asyncio.run(main())
