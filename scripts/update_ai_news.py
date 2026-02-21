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

GITHUB_FEEDS = [
    "https://github.blog/changelog/feed/",
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


def slugify(text: str):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:90]


def to_korean_title(source: str, keyword: str, title: str) -> str:
    text = title
    replacements = {
        "organization-level": "조직 단위",
        "public preview": "퍼블릭 프리뷰",
        "workflow": "워크플로우",
        "returns": "반환",
        "run ids": "실행 ID",
        "support": "지원",
        "available": "지원",
        "now": "이제",
        "changes to": "변경",
        "merge commit": "머지 커밋",
        "generation": "생성",
        "pull requests": "풀 리퀘스트",
        "github": "깃허브",
        "copilot": "코파일럿",
        "dashboard": "대시보드",
        "usage metrics": "사용 지표",
        "test": "테스트",
    }
    for en, ko in replacements.items():
        text = re.sub(en, ko, text, flags=re.IGNORECASE)

    # Reddit 제목은 너무 길고 영어가 많아서 한국어형 제목으로 정규화
    if source.lower() == "reddit":
        return f"{keyword} 관련 커뮤니티 최신 이슈"

    # 영어가 과도하면 앞부분 한국어 라벨로 보강
    if re.fullmatch(r"[\x00-\x7F\s\W]+", text or ""):
        return f"깃허브 소식: {title[:70]}"

    return text


def add_item(items, source, keyword, title, link, summary, dt):
    if not title or not link:
        return
    ko_title = to_korean_title(source, keyword, title)
    ko_excerpt = f"[{source}] {keyword} 관련 핵심 요약"
    content = (
        f"한줄 요약: {ko_excerpt}\n"
        f"원문 제목: {title}\n"
        f"원문 링크: {link}\n\n"
        f"핵심 내용: {summary[:700]}"
    )
    items.append(
        {
            "slug": f"ai-news-{slugify(title)}",
            "title": ko_title,
            "excerpt": f"{ko_excerpt} · {summary[:140]}",
            "content": content,
            "source_url": link,
            "tags": ["ai", "news", source.lower(), keyword.lower().replace(" ", "-")],
            "published_at": dt.isoformat().replace("+00:00", "Z"),
        }
    )


def collect_items():
    out = []

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
                # GitHub general AI-related filter
                lowered = f"{title} {desc}".lower()
                if any(k.lower() in lowered for k in ["copilot", "ai", "model", "llm", "chatgpt", "gemini"]):
                    add_item(out, "GitHub", "AI", title, link, desc, pub)
        except Exception:
            pass

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

    # dedupe by slug/link
    seen = set()
    deduped = []
    for x in out:
        key = (x["slug"], x["source_url"])
        if key in seen or x["slug"] in seen:
            continue
        seen.add(key)
        seen.add(x["slug"])
        deduped.append(x)

    return deduped[:30]


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
    rows = collect_items()
    upsert_supabase(rows, env)


if __name__ == "__main__":
    main()
