import sqlite3
from datetime import datetime, timezone
import os

DEMO_BOOKS = [
    {
        "title": "NCERT Science - Textbook for Class VII",
        "subject": "Science",
        "class_level": "Class 7",
        "edition": "2024 Revised Edition",
        "condition": "Good",
        "listing_type": "Free Donation",
        "exchange_preference": "Open to any student in need",
        "handover_method": "School Library Handover",
        "pickup_area": "Junior Library Counter (Mrs. Mehra Desk)",
        "cover_image_url": "/images/class7_science_cover.jpg",
        "notes": "Covers Nutrition in Plants, Acids, Bases and Salts, and Respiration. All pages intact with clean margins.",
        "owner_name": "Harshit",
        "owner_student_id": "STU-701",
        "owner_grade": "Class 7th",
        "status": "available",
        "ai_scanned": 1,
        "ocr_raw_text": "SCIENCE\nTextbook for Class VII\nNCERT 2024"
    },
    {
        "title": "Mathematics - Textbook for Class VII",
        "subject": "Mathematics",
        "class_level": "Class 7",
        "edition": "2023-2024 Edition",
        "condition": "Like New",
        "listing_type": "Exchange",
        "exchange_preference": "Looking for Class 8 Mathematics or Science",
        "handover_method": "Classroom 7-B Handover",
        "pickup_area": "Section 7-B after 3:15 PM bell",
        "cover_image_url": "/images/class7_math_cover.jpg",
        "notes": "Crisp pages, no pen marks. Formulas and chapter summaries all clear.",
        "owner_name": "Priya Nair",
        "owner_student_id": "STU-703",
        "owner_grade": "Class 7-B",
        "status": "available",
        "ai_scanned": 1,
        "ocr_raw_text": "MATHEMATICS\nTextbook for Class VII\nNCERT"
    },
    {
        "title": "Our Pasts - II: History for Class VII",
        "subject": "Social Science",
        "class_level": "Class 7",
        "edition": "2024 Edition",
        "condition": "Good",
        "listing_type": "Free Donation",
        "exchange_preference": "Free gift for incoming Class 7 batch",
        "handover_method": "School Library Handover",
        "pickup_area": "Main Library Drop-box",
        "cover_image_url": "/images/class7_history_cover.jpg",
        "notes": "Includes colorful Mughal and Chola dynasty maps. Good binding.",
        "owner_name": "Rohan Gupta",
        "owner_student_id": "STU-801",
        "owner_grade": "Class 8-C",
        "status": "available",
        "ai_scanned": 0,
        "ocr_raw_text": ""
    },
    {
        "title": "Honeycomb - English Textbook for Class VII",
        "subject": "English",
        "class_level": "Class 7",
        "edition": "2023 Reprint",
        "condition": "Like New",
        "listing_type": "Exchange",
        "exchange_preference": "Seeking Class 7 English Supplementary 'An Alien Hand'",
        "handover_method": "Teacher-Assisted Exchange",
        "pickup_area": "English Staff Room (Mr. D'Souza)",
        "cover_image_url": "/images/class7_english_cover.jpg",
        "notes": "Includes stories by Ruskin Bond and Isaac Asimov. Very neat copy.",
        "owner_name": "Diya Patel",
        "owner_student_id": "STU-702",
        "owner_grade": "Class 7-A",
        "status": "available",
        "ai_scanned": 1,
        "ocr_raw_text": "HONEYCOMB\nTextbook in English for Class VII\nNCERT"
    },
    {
        "title": "Social and Political Life - II (Civics)",
        "subject": "Social Science",
        "class_level": "Class 7",
        "edition": "2024 Edition",
        "condition": "Good",
        "listing_type": "Free Donation",
        "exchange_preference": "Free Donation",
        "handover_method": "School Library Handover",
        "pickup_area": "Senior Reading Room desk",
        "cover_image_url": "/images/class7_history_cover.jpg",
        "notes": "Covers Equality in Indian Democracy, State Government, and Media.",
        "owner_name": "Ananya Sen",
        "owner_student_id": "STU-704",
        "owner_grade": "Class 7-C",
        "status": "available",
        "ai_scanned": 0,
        "ocr_raw_text": ""
    },
    {
        "title": "NCERT Mathematics for Class 8",
        "subject": "Mathematics",
        "class_level": "Class 8",
        "edition": "2023 Edition",
        "condition": "Used",
        "listing_type": "Exchange",
        "exchange_preference": "Want Class 8 Science or Olympiad Book",
        "handover_method": "Classroom 8-C Handover",
        "pickup_area": "Science Block Hallway",
        "cover_image_url": "/images/class8_math_cover.jpg",
        "notes": "Useful practice problems. Minor wear on spine but pages are complete.",
        "owner_name": "Rohan Gupta",
        "owner_student_id": "STU-801",
        "owner_grade": "Class 8-C",
        "status": "available",
        "ai_scanned": 0,
        "ocr_raw_text": ""
    },
    {
        "title": "Science Curiosity - Textbook for Class VI",
        "subject": "Science",
        "class_level": "Class 6",
        "edition": "2024 New Curriculum",
        "condition": "Like New",
        "listing_type": "Free Donation",
        "exchange_preference": "Gift to incoming 6th grader",
        "handover_method": "School Library Handover",
        "pickup_area": "Library Reference Counter",
        "cover_image_url": "/images/class6_science_cover.jpg",
        "notes": "New NEP curriculum edition. Never used, plastic cover still on.",
        "owner_name": "Kabir Verma",
        "owner_student_id": "STU-601",
        "owner_grade": "Class 6-A",
        "status": "available",
        "ai_scanned": 1,
        "ocr_raw_text": "CURIOSITY\nTextbook of Science for Class 6"
    }
]

DEMO_STUDENTS = [
    {
        "student_id": "STU-701",
        "name": "Harshit",
        "grade": "Class 7th",
        "avatar_bg": "#147D64",
        "role_badge": "Listing Contributor"
    },
    {
        "student_id": "STU-702",
        "name": "Diya Patel",
        "grade": "Class 7-A",
        "avatar_bg": "#2357A5",
        "role_badge": "Book Seeker"
    },
    {
        "student_id": "STU-703",
        "name": "Priya Nair",
        "grade": "Class 7-B",
        "avatar_bg": "#F2B544",
        "role_badge": "Peer Exchanger"
    },
    {
        "student_id": "STU-801",
        "name": "Rohan Gupta",
        "grade": "Class 8-C",
        "avatar_bg": "#0E5B48",
        "role_badge": "Senior Donor"
    }
]

def seed_database(db_path: str):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Clear existing demo data
    cursor.execute("DELETE FROM exchange_records;")
    cursor.execute("DELETE FROM requests;")
    cursor.execute("DELETE FROM saved_books;")
    cursor.execute("DELETE FROM books;")

    now = datetime.now(timezone.utc).isoformat()

    # Insert Books
    book_ids = []
    for b in DEMO_BOOKS:
        cursor.execute("""
        INSERT INTO books (
            title, subject, class_level, edition, condition,
            listing_type, exchange_preference, handover_method, pickup_area,
            cover_image_url, notes, owner_name, owner_student_id, owner_grade,
            status, ai_scanned, ocr_raw_text, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            b["title"], b["subject"], b["class_level"], b["edition"], b["condition"],
            b["listing_type"], b["exchange_preference"], b["handover_method"], b["pickup_area"],
            b["cover_image_url"], b["notes"], b["owner_name"], b["owner_student_id"], b["owner_grade"],
            b["status"], b["ai_scanned"], b["ocr_raw_text"], now
        ))
        book_ids.append(cursor.lastrowid)

    # Insert a sample active exchange request from Diya Patel requesting Harshit's Science Book
    # This prepares the exact scenario for the Class 7 competition demonstration!
    cursor.execute("""
    INSERT INTO requests (
        book_id, requester_name, requester_student_id, requester_grade,
        owner_student_id, message, proposed_handover, status,
        parent_teacher_contact_note, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        book_ids[0],
        "Diya Patel",
        "STU-702",
        "Class 7-A",
        "STU-701",
        "Hi Harshit! I am starting our Term 1 Science project on Plant Respiration and need the NCERT Science Class 7 book. Can we do a library exchange tomorrow?",
        "School Library Reading Desk (Mrs. Mehra supervising)",
        "pending",
        "Teacher Supervisor: Mrs. Anita Mehra, Class Teacher 7th",
        now,
        now
    ))
    req1_id = cursor.lastrowid

    # Insert a completed exchange record for impact stats
    # For example: Priya exchanged a book with Rohan last week
    cursor.execute("""
    INSERT INTO requests (
        book_id, requester_name, requester_student_id, requester_grade,
        owner_student_id, message, proposed_handover, status,
        parent_teacher_contact_note, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        book_ids[2],
        "Harshit",
        "STU-701",
        "Class 7th",
        "STU-801",
        "Completed exchange of Class 7 History book for Term exams.",
        "School Library Counter",
        "completed",
        "Librarian Mr. Sharma verified handover",
        now,
        now
    ))
    req2_id = cursor.lastrowid

    cursor.execute("""
    INSERT INTO exchange_records (
        request_id, book_id, giver_name, giver_student_id,
        receiver_name, receiver_student_id, handover_location, supervisor_role, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        req2_id,
        book_ids[2],
        "Rohan Gupta",
        "STU-801",
        "Harshit",
        "STU-701",
        "School Central Library",
        "School Librarian",
        now
    ))

    # Save a book for Diya
    cursor.execute("""
    INSERT INTO saved_books (book_id, student_id, created_at)
    VALUES (?, ?, ?)
    """, (book_ids[1], "STU-702", now))

    conn.commit()
    conn.close()
    print("Database successfully seeded with realistic Class 7 demo data!")
