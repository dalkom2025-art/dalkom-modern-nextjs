#!/usr/bin/env python3
import json
import os
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

KEYWORDS = [
    "Kling AI",
    "Gemini",
    "ChatGPT",
    "Sydance",
    "Freepik",
    "Higgsfield",
    "AI image workflow",
    "AI video workflow",
]

GITHUB_FEEDS = ["https://github.blog/changelog/feed/"]

# 사용자 요청: AI 공식 계정은 기본 대상에 고정
X_OFFICIAL_ACCOUNTS = [
    "OpenAI",
    "AnthropicAI",  # Claude
    "grok",
    "Kling_ai",
    "midjourney",
    "freepik",
    "krea_ai",
    "ComfyUI",
    "MeshyAI",
]


def load_env(path: str):
    env = {}
    if not os.path.exists(path):
        return env
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k] = v
    return env


def fetch_xml(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (DalKomAI-NewsBot)"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return ET.fromstring(r.read())


def clean_html(text: str):
    text = re.sub(r"<[^>]+>", " ", text or "")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def parse_rfc822(s: str):
    try:
        return datetime.strptime(s, "%a, %d %b %Y %H:%M:%S %z").astimezone(timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)


def parse_iso_or_now(s: str):
    try:
        return datetime.fromisoformat((s or "").replace("Z", "+00:00")).astimezone(timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)


def slugify(text: str):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:90]


def add_item(items, source, keyword, title, link, summary, dt):
    if not title or not link:
        return

    ko_excerpt = f"[{source}] {keyword} 관련 핵심 내용을 짧게 정리한 기사입니다."
    content = (
        f"한줄 요약: {ko_excerpt}\n"
        f"원문 링크: {link}\n\n"
        "핵심 내용: 기능 변경 포인트와 활용 관점을 중심으로 확인할 수 있습니다."
    )
    items.append(
        {
            "slug": f"ai-news-{slugify(title)}",
            "title": title.strip(),  # 사용자 요청: 원문 제목 그대로 사용
            "excerpt": f"{ko_excerpt} · {summary[:140]}",
            "content": content,
            "source_url": link,
            "tags": ["ai", "news", source.lower(), keyword.lower().replace(" ", "-")],
            "published_at": dt.isoformat().replace("+00:00", "Z"),
        }
    )


def collect_from_github(out):
    for feed in GITHUB_FEEDS:
        try:
            root = fetch_xml(feed)
            channel = root.find("channel")
            if channel is None:
                continue
            for it in channel.findall("item")[:20]:
                title = (it.findtext("title") or "").strip()
                link = (it.findtext("link") or "").strip()
                desc = clean_html(it.findtext("description") or "")
                pub = parse_rfc822((it.findtext("pubDate") or "").strip())
                lowered = f"{title} {desc}".lower()
                if any(k in lowered for k in ["copilot", "ai", "model", "llm", "chatgpt", "gemini"]):
                    add_item(out, "GitHub", "AI", title, link, desc, pub)
        except Exception:
            pass


def collect_from_reddit(out):
    for kw in KEYWORDS:
        q = urllib.parse.quote(kw)
        feed = f"https://www.reddit.com/search.rss?q={q}&sort=new&t=week"
        try:
            root = fetch_xml(feed)
            channel = root.find("channel")
            if channel is None:
                continue
            for it in channel.findall("item")[:4]:
                title = (it.findtext("title") or "").strip()
                link = (it.findtext("link") or "").strip()
                desc = clean_html(it.findtext("description") or "")
                pub = parse_rfc822((it.findtext("pubDate") or "").strip())
                add_item(out, "Reddit", kw, title, link, desc, pub)
        except Exception:
            pass


def collect_from_x(out, env):
    api_key = env.get("SOCIAL_SCRAPER_API_KEY") or env.get("SCRAPER_API_KEY")
    if not api_key:
        return

    base_url = env.get("SOCIAL_SCRAPER_BASE_URL", "https://api.codewithgenie.com").rstrip("/")

    for username in X_OFFICIAL_ACCOUNTS:
        payload = {
            "platform": "x",
            "username": username,
            "limit": 3,
            "offline": False,
            "refresh": True,
        }
        try:
            req = urllib.request.Request(
                f"{base_url}/scrape",
                data=json.dumps(payload).encode("utf-8"),
                method="POST",
                headers={
                    "Content-Type": "application/json",
                    "X-API-Key": api_key,
                },
            )
            with urllib.request.urlopen(req, timeout=30) as r:
                result = json.loads(r.read().decode("utf-8"))

            for item in result.get("items", []):
                title = (item.get("text") or "").strip()
                link = (item.get("url") or "").strip()
                created = item.get("created_at")
                dt = parse_iso_or_now(created)
                add_item(out, "X", username, title, link, title, dt)
        except Exception:
            continue


def collect_items(env):
    out = []
    collect_from_github(out)
    collect_from_reddit(out)
    collect_from_x(out, env)

    seen = set()
    deduped = []
    for x in out:
        key = (x["slug"], x["source_url"])
        if key in seen or x["slug"] in seen:
            continue
        seen.add(key)
        seen.add(x["slug"])
        deduped.append(x)

    return deduped[:60]


def upsert_supabase(rows, env):
    if not rows:
        print("no rows")
        return
    sb = env.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    key = env.get("SUPABASE_SERVICE_ROLE_KEY", "")
    api = f"{sb}/rest/v1/posts?on_conflict=slug"
    req = urllib.request.Request(api, data=json.dumps(rows).encode("utf-8"), method="POST")
    req.add_header("apikey", key)
    req.add_header("Authorization", f"Bearer {key}")
    req.add_header("Content-Type", "application/json")
    req.add_header("Prefer", "resolution=merge-duplicates,return=representation")
    with urllib.request.urlopen(req, timeout=30) as r:
        body = json.loads(r.read().decode("utf-8"))
        print("status", r.status)
        print("upserted", len(body))


def main():
    env = load_env("/root/.openclaw/workspace/portfolio-dalkom/.env.local")
    rows = collect_items(env)
    upsert_supabase(rows, env)


if __name__ == "__main__":
    main()
