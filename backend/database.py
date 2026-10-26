import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "bookbridge.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Books Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        class_level TEXT NOT NULL,
        edition TEXT DEFAULT '',
        condition TEXT NOT NULL,
        listing_type TEXT NOT NULL,
        exchange_preference TEXT DEFAULT '',
        handover_method TEXT NOT NULL,
        pickup_area TEXT NOT NULL,
        cover_image_url TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        owner_name TEXT NOT NULL,
        owner_student_id TEXT NOT NULL,
        owner_grade TEXT NOT NULL,
        status TEXT DEFAULT 'available',
        ai_scanned INTEGER DEFAULT 0,
        ocr_raw_text TEXT DEFAULT '',
        created_at TEXT NOT NULL
    );
    """)

    # Requests Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        requester_name TEXT NOT NULL,
        requester_student_id TEXT NOT NULL,
        requester_grade TEXT NOT NULL,
        owner_student_id TEXT NOT NULL,
        message TEXT DEFAULT '',
        proposed_handover TEXT DEFAULT '',
        status TEXT DEFAULT 'pending',
        parent_teacher_contact_note TEXT DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (book_id) REFERENCES books (id)
    );
    """)

    # Saved Books Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        student_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE(book_id, student_id),
        FOREIGN KEY (book_id) REFERENCES books (id)
    );
    """)

    # Exchange Records Table (Completed handovers for impact audit)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS exchange_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        giver_name TEXT NOT NULL,
        giver_student_id TEXT NOT NULL,
        receiver_name TEXT NOT NULL,
        receiver_student_id TEXT NOT NULL,
        handover_location TEXT NOT NULL,
        supervisor_role TEXT NOT NULL,
        completed_at TEXT NOT NULL,
        FOREIGN KEY (request_id) REFERENCES requests (id),
        FOREIGN KEY (book_id) REFERENCES books (id)
    );
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at", DB_PATH)
