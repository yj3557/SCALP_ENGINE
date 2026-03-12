import json
import requests
from datetime import datetime
import pytz
from backend.db import connect_db, insert_news   # 앞에서 만든 db.py 모듈 불러오기

# API 키 불러오기
def load_keys():
    with open("51579850_appkey.txt", "r") as f:
        appkey = f.read().strip()
    with open("51579850_secretkey.txt", "r") as f:
        secretkey = f.read().strip()
    return appkey, secretkey

# 설정 파일 불러오기
def load_config():
    with open("config.json", "r") as f:
        config = json.load(f)
    return config

# 해외 뉴스 데이터 가져오기
def fetch_news(appkey, query="stock market"):
    url = f"https://newsapi.org/v2/everything?q={query}&apiKey={appkey}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get("articles", [])
    else:
        print("뉴스 API 호출 실패:", response.status_code)
        return []

# UTC → 한국 시간 변환
def convert_to_kst(utc_time_str):
    utc_time = datetime.strptime(utc_time_str, "%Y-%m-%dT%H:%M:%SZ")
    kst = pytz.timezone("Asia/Seoul")
    return utc_time.replace(tzinfo=pytz.utc).astimezone(kst)

# 메인 실행
def main():
    print("=== SCALP_ENGINE 실행 ===")
    appkey, secretkey = load_keys()
    config = load_config()

    conn = connect_db()
    if not conn:
        return

    # 뉴스 데이터 가져오기
    articles = fetch_news(appkey, query="finance")

    print("\n=== 최신 해외 뉴스 저장 ===")
    for article in articles[:5]:  # 최근 5개 기사만 저장
        local_time = convert_to_kst(article["publishedAt"])
        news_id = insert_news(
            conn,
            title=article["title"],
            source=article["source"]["name"],
            published_at=article["publishedAt"],
            published_local=local_time.strftime("%Y-%m-%d %H:%M:%S"),
            url=article["url"]
        )
        print(f"저장된 뉴스 ID: {news_id}")

    conn.close()
    print("\n연결 실행 완료!")

if __name__ == "__main__":
    main()