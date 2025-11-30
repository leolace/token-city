import psycopg2
import os
import time

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/projeto_bd")

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    max_retries = 30
    retry_delay = 1
    
    for attempt in range(max_retries):
        try:
            conn = psycopg2.connect(DATABASE_URL)
            conn.close()
            print("Conexão com banco estabelecida!")
            return
        except psycopg2.OperationalError:
            if attempt < max_retries - 1:
                print(f"Tentativa {attempt + 1}/{max_retries} - aguardando banco...")
                time.sleep(retry_delay)
            else:
                raise
