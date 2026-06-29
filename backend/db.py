import pymysql
import sqlite3
import os
import re

class SQLiteCursorWrapper:
    def __init__(self, cursor):
        self.cursor = cursor
        
    def execute(self, sql, params=None):
        # Translate MySQL %s placeholder to SQLite ?
        sql = sql.replace("%s", "?")
        if params is not None:
            return self.cursor.execute(sql, params)
        return self.cursor.execute(sql)
        
    def fetchall(self):
        rows = self.cursor.fetchall()
        # Convert sqlite3.Row to standard dicts for 100% DictCursor compatibility
        return [dict(row) for row in rows]
        
    def fetchone(self):
        row = self.cursor.fetchone()
        return dict(row) if row else None
        
    def close(self):
        self.cursor.close()

class SQLiteConnectionWrapper:
    def __init__(self, conn):
        self.conn = conn
        
    def cursor(self):
        return SQLiteCursorWrapper(self.conn.cursor())
        
    def commit(self):
        self.conn.commit()
        
    def close(self):
        self.conn.close()
        
    def select_db(self, dbname):
        pass

def init_sqlite_db(conn):
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    if not os.path.exists(schema_path):
        print("schema.sql not found! Cannot initialize SQLite DB.")
        return
    with open(schema_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    cleaned_sql = []
    for line in sql_content.split('\n'):
        # Ignore comments and empty lines
        stripped = line.strip()
        if stripped.startswith('--') or stripped.startswith('#') or not stripped:
            continue
            
        # Ignore CREATE DATABASE or USE statements
        if 'CREATE DATABASE' in line or 'USE `' in line or 'USE lipjanmi_db' in line:
            continue
            
        cleaned_line = line
        
        # Clean MySQL tail statements (like ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;)
        cleaned_line = re.sub(r'ENGINE\s*=\s*\w+(?:\s+DEFAULT\s+CHARSET\s*=\s*\w+)?', '', cleaned_line, flags=re.IGNORECASE)
        
        # Translate AUTO_INCREMENT to SQLite syntax
        if 'AUTO_INCREMENT' in cleaned_line:
            cleaned_line = re.sub(r'INT\s+AUTO_INCREMENT\s+PRIMARY\s+KEY', 'INTEGER PRIMARY KEY AUTOINCREMENT', cleaned_line, flags=re.IGNORECASE)
            cleaned_line = re.sub(r'INT\s+AUTO_INCREMENT', 'INTEGER PRIMARY KEY AUTOINCREMENT', cleaned_line, flags=re.IGNORECASE)
            
        cleaned_sql.append(cleaned_line)
        
    full_sql = '\n'.join(cleaned_sql)
    
    # Split by semicolon to execute statement by statement
    statements = full_sql.split(';')
    cursor = conn.cursor()
    for stmt in statements:
        stmt_text = stmt.strip()
        if not stmt_text:
            continue
        try:
            cursor.execute(stmt_text)
        except Exception as e:
            print(f"Failed to execute SQLite statement:\n{stmt_text}\nError: {e}")
    conn.commit()
    cursor.close()
    print("SQLite Database initialization completed.")

def get_db_connection():
    try:
        # 1. Provo të lidhesh me MySQL
        conn = pymysql.connect(
            host="localhost",
            user="root",
            password="",
            cursorclass=pymysql.cursors.DictCursor
        )
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS `lipjanmi_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        cursor.execute("USE `lipjanmi_db`;")
        
        # Kontrollo nëse tabelat ekzistojnë
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        # Nëse nuk ka tabela, ngarko skemën fillestare
        if not tables:
            print("MySQL database is empty. Initializing tables from schema.sql...")
            schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
            if os.path.exists(schema_path):
                with open(schema_path, 'r', encoding='utf-8') as f:
                    sql_content = f.read()
                statements = sql_content.split(';')
                for stmt in statements:
                    if stmt.strip():
                        cursor.execute(stmt)
                conn.commit()
                print("MySQL Database initialized successfully with schema.sql!")
        cursor.close()
        
        # Kthe lidhjen me databazën e specifikuar
        return pymysql.connect(
            host="localhost",
            user="root",
            password="",
            database="lipjanmi_db",
            cursorclass=pymysql.cursors.DictCursor
        )
    except Exception as mysql_err:
        # 2. Nëse MySQL dështon, kalo tek SQLite
        print(f"MySQL connection failed ({mysql_err}). Falling back to SQLite...")
        db_path = os.path.join(os.path.dirname(__file__), 'lipjanmi_db.db')
        
        sqlite_conn = sqlite3.connect(db_path)
        sqlite_conn.row_factory = sqlite3.Row
        
        # Kontrollo nëse ka tabela në SQLite
        cursor = sqlite_conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        cursor.close()
        
        if not tables:
            init_sqlite_db(sqlite_conn)
            
        return SQLiteConnectionWrapper(sqlite_conn)