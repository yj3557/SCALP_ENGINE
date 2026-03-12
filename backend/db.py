import psycopg2
from psycopg2 import sql

DB_CONFIG = {
    "dbname": "scalp_engine",
    "user": "your_username",
    "password": "your_password",
    "host": "localhost",
    "port": 5432
}

def connect_db():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        print("✅ DB 연결 성공")
        return conn
    except Exception as e:
        print("❌ DB 연결 실패:", e)
        return None

def insert_news(conn, title, source, published_at, published_local, url):
    try:
        with conn.cursor() as cur:
            query = sql.SQL("""
                INSERT INTO news (title, source, published_at, published_local, url)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id;
            """)
            cur.execute(query, (title, source, published_at, published_local, url))
            news_id = cur.fetchone()[0]
            conn.commit()
            print(f"📰 뉴스 저장 완료 (ID: {news_id})")
            return news_id
    except Exception as e:
        print("❌ 뉴스 저장 실패:", e)
        conn.rollback()
        return None