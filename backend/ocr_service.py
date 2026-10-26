import os
import re
import io
from typing import Dict, Any, List, Optional
from PIL import Image

# Global EasyOCR reader cache
_easyocr_reader = None

def get_easyocr_reader():
    global _easyocr_reader
    if _easyocr_reader is None:
        try:
            import easyocr
            # Initialize with English, CPU mode for high portability
            _easyocr_reader = easyocr.Reader(['en'], gpu=False, verbose=False)
        except Exception as e:
            print(f"[OCR] EasyOCR init warning: {e}")
            _easyocr_reader = False
    return _easyocr_reader

# Subject detection patterns
SUBJECT_KEYWORDS = {
    "Science": [r"\bscience\b", r"\bphysics\b", r"\bchemistry\b", r"\bbiology\b", r"\bgeneral science\b"],
    "Mathematics": [r"\bmathematics\b", r"\bmaths?\b", r"\balgebra\b", r"\bgeometry\b", r"\barithmetic\b"],
    "Social Science": [r"\bsocial science\b", r"\bhistory\b", r"\bgeography\b", r"\bcivics\b", r"\bour pasts\b", r"\bsocial and political\b"],
    "English": [r"\benglish\b", r"\bhoneycomb\b", r"\ban alien hand\b", r"\bhoneydew\b", r"\blanguage & literature\b", r"\bfirst flight\b"],
    "Hindi": [r"\bhindi\b", r"\bvasant\b", r"\bdurva\b", r"\bsparsh\b", r"\bsanchayan\b"],
    "Sanskrit": [r"\bsanskrit\b", r"\bruchira\b"],
    "Computer Science": [r"\bcomputer\b", r"\bcoding\b", r"\bcyber\b", r"\binformation technology\b"]
}

# Class detection patterns
CLASS_PATTERNS = [
    (r"\bclass\s*(?:7|vii)\b", "Class 7"),
    (r"\bgrade\s*(?:7|vii)\b", "Class 7"),
    (r"\bclass\s*(?:6|vi)\b", "Class 6"),
    (r"\bclass\s*(?:8|viii)\b", "Class 8"),
    (r"\bclass\s*(?:9|ix)\b", "Class 9"),
    (r"\bclass\s*(?:10|x)\b", "Class 10"),
    (r"\bstandard\s*(?:7|vii)\b", "Class 7"),
]

# Edition patterns
EDITION_PATTERNS = [
    r"\b(202[0-6](?:[-–]20?2[1-7])?)\b",
    r"\b(revised\s+(?:edition|curriculum|syllabus))\b",
    r"\b(ncert\s+latest\s+edition)\b",
    r"\b(\d{1,2}(?:st|nd|rd|th)\s+edition)\b",
]

# Realistic preset demo samples for Class 7 competition scenarios
DEMO_SAMPLES = [
    {
        "sample_id": "demo_sci_7",
        "title": "NCERT Science - Textbook for Class 7",
        "subject": "Science",
        "class_level": "Class 7",
        "edition": "2024-2025 Revised Edition",
        "condition": "Good",
        "raw_text": "SCIENCE\nTextbook for Class VII\nNational Council of Educational Research and Training\nRationalised 2024-25\nISBN 978-81-7450-717-4",
        "evidence": [
            {"field": "Subject", "detected_text": "SCIENCE", "confidence": "high"},
            {"field": "Class", "detected_text": "Textbook for Class VII", "confidence": "high"},
            {"field": "Publisher", "detected_text": "NCERT", "confidence": "high"},
            {"field": "Edition", "detected_text": "Rationalised 2024-25", "confidence": "medium"}
        ],
        "notes": "Class 7 Science textbook covering Nutrition in Plants, Heat, Acids & Bases, and Respiration in Organisms. Minor pencil annotations on chapter 2."
    },
    {
        "sample_id": "demo_math_7",
        "title": "Mathematics - Textbook for Class VII",
        "subject": "Mathematics",
        "class_level": "Class 7",
        "edition": "2023-2024 Edition",
        "condition": "Like New",
        "raw_text": "MATHEMATICS\nTextbook for Class VII\nNCERT New Delhi\nIntegers, Fractions, Decimals and Simple Equations",
        "evidence": [
            {"field": "Subject", "detected_text": "MATHEMATICS", "confidence": "high"},
            {"field": "Class", "detected_text": "Class VII", "confidence": "high"},
            {"field": "Publisher", "detected_text": "NCERT", "confidence": "high"}
        ],
        "notes": "Covers Integers, Fractions, Lines & Angles. Clean pages without markings."
    },
    {
        "sample_id": "demo_social_7",
        "title": "Our Pasts - II: History for Class VII",
        "subject": "Social Science",
        "class_level": "Class 7",
        "edition": "2024 Edition",
        "condition": "Good",
        "raw_text": "OUR PASTS - II\nTextbook in History for Class VII\nSocial Science\nNCERT",
        "evidence": [
            {"field": "Subject", "detected_text": "Social Science / History", "confidence": "high"},
            {"field": "Class", "detected_text": "Class VII", "confidence": "high"},
            {"field": "Title", "detected_text": "Our Pasts - II", "confidence": "high"}
        ],
        "notes": "Medieval Indian history textbook for Class 7 students. Includes maps and illustrations."
    }
]

def parse_extracted_text(text: str) -> Dict[str, Any]:
    """Extract structured book metadata from raw OCR text with clear evidence."""
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    lower_text = text.lower()
    
    evidence = []
    
    # 1. Detect Subject
    detected_subject = "Other"
    for subject, patterns in SUBJECT_KEYWORDS.items():
        for pat in patterns:
            match = re.search(pat, lower_text, re.IGNORECASE)
            if match:
                detected_subject = subject
                evidence.append({
                    "field": "Subject",
                    "detected_text": match.group(0).capitalize(),
                    "confidence": "high"
                })
                break
        if detected_subject != "Other":
            break

    # 2. Detect Class Level
    detected_class = "Class 7" # Default reasonable fallback if Class 7 competition
    class_found = False
    for pat, cls_name in CLASS_PATTERNS:
        match = re.search(pat, lower_text, re.IGNORECASE)
        if match:
            detected_class = cls_name
            class_found = True
            evidence.append({
                "field": "Class",
                "detected_text": match.group(0),
                "confidence": "high"
            })
            break
            
    if not class_found:
        evidence.append({
            "field": "Class",
            "detected_text": "Not clearly visible (suggested default: Class 7)",
            "confidence": "low"
        })

    # 3. Detect Edition
    detected_edition = "Standard Curriculum Edition"
    for pat in EDITION_PATTERNS:
        match = re.search(pat, text, re.IGNORECASE)
        if match:
            detected_edition = match.group(0)
            evidence.append({
                "field": "Edition",
                "detected_text": detected_edition,
                "confidence": "medium"
            })
            break

    # 4. Infer Title from most prominent lines
    detected_title = ""
    # Look for NCERT / CBSE or Subject line
    for line in lines[:5]:
        if len(line) > 3 and not re.match(r"^\d+$", line):
            if any(k.lower() in line.lower() for k in ["science", "mathematics", "history", "english", "ncert", "our pasts", "honeycomb", "textbook"]):
                detected_title = line
                break
                
    if not detected_title and len(lines) > 0:
        detected_title = lines[0]
        
    if not detected_title or len(detected_title) < 4:
        detected_title = f"{detected_subject} Textbook for {detected_class}"

    return {
        "title": detected_title,
        "subject": detected_subject,
        "class_level": detected_class,
        "edition": detected_edition,
        "evidence": evidence
    }

def scan_book_cover(image_bytes: bytes, filename: str, force_demo: bool = False, demo_index: int = 0) -> Dict[str, Any]:
    """
    Scans a book cover image.
    Uses EasyOCR if available and not forced to demo.
    If EasyOCR is not available, or image cannot be read, or force_demo is True,
    it returns a clearly labelled Demo Mode result.
    NEVER pretends real AI OCR took place when demo mode is used!
    """
    # Check if Gemini API key is configured
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    
    if force_demo:
        sample = DEMO_SAMPLES[demo_index % len(DEMO_SAMPLES)]
        return {
            "success": True,
            "is_demo_mode": True,
            "engine": "DEMO_MODE_SIMULATION",
            "badge": "Demo Mode (Sample Data)",
            "title": sample["title"],
            "subject": sample["subject"],
            "class_level": sample["class_level"],
            "edition": sample["edition"],
            "condition": sample["condition"],
            "notes": sample["notes"],
            "raw_text": sample["raw_text"],
            "evidence": sample["evidence"],
            "message": "Demo mode active: Pre-configured verified sample used for demonstration. No external API was called."
        }

    # Attempt Real OCR via EasyOCR
    reader = get_easyocr_reader()
    if reader:
        try:
            # Convert bytes to PIL Image to verify
            pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            
            # Run EasyOCR
            results = reader.readtext(image_bytes)
            extracted_lines = [res[1] for res in results if res[1].strip()]
            full_text = "\n".join(extracted_lines)
            
            if len(extracted_lines) > 0:
                parsed = parse_extracted_text(full_text)
                return {
                    "success": True,
                    "is_demo_mode": False,
                    "engine": "EASYOCR_PYTORCH_LOCAL",
                    "badge": "Real AI OCR (EasyOCR Engine)",
                    "title": parsed["title"],
                    "subject": parsed["subject"],
                    "class_level": parsed["class_level"],
                    "edition": parsed["edition"],
                    "condition": "Good",
                    "notes": f"Scanned from cover text: {len(extracted_lines)} lines detected.",
                    "raw_text": full_text,
                    "evidence": parsed["evidence"],
                    "message": f"Real local OCR scan successful! Detected {len(extracted_lines)} text regions."
                }
            else:
                # Image contained no legible text -> Fallback to honest message
                return {
                    "success": False,
                    "is_demo_mode": False,
                    "engine": "EASYOCR_PYTORCH_LOCAL",
                    "badge": "OCR Alert",
                    "title": "",
                    "subject": "Other",
                    "class_level": "Class 7",
                    "edition": "",
                    "condition": "Good",
                    "notes": "",
                    "raw_text": "",
                    "evidence": [],
                    "message": "Real OCR ran successfully, but no text could be recognized on this image. Please take a clearer photo or use Demo Mode."
                }
        except Exception as e:
            print(f"[OCR] EasyOCR error: {e}")

    # Fallback if EasyOCR fails or isn't usable
    sample = DEMO_SAMPLES[demo_index % len(DEMO_SAMPLES)]
    return {
        "success": True,
        "is_demo_mode": True,
        "engine": "DEMO_MODE_FALLBACK",
        "badge": "Demo Mode (OCR Service Unavailable)",
        "title": sample["title"],
        "subject": sample["subject"],
        "class_level": sample["class_level"],
        "edition": sample["edition"],
        "condition": sample["condition"],
        "notes": sample["notes"],
        "raw_text": sample["raw_text"],
        "evidence": sample["evidence"],
        "message": "Demo mode active: Local OCR is initializing or unavailable. Using Class 7 demonstration sample."
    }
