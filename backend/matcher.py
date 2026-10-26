import re
from typing import List, Dict, Any

def tokenize(text: str) -> set:
    words = re.findall(r"\w+", text.lower())
    # remove very common stop words
    stopwords = {"a", "an", "the", "for", "in", "of", "and", "to", "textbook", "book"}
    return {w for w in words if w not in stopwords and len(w) > 1}

def calculate_token_similarity(text1: str, text2: str) -> float:
    set1 = tokenize(text1)
    set2 = tokenize(text2)
    if not set1 or not set2:
        return 0.0
    intersection = set1.intersection(set2)
    union = set1.union(set2)
    return len(intersection) / len(union)

def match_books(
    query_title: str,
    query_class: str,
    query_subject: str,
    available_books: List[Dict[str, Any]],
    query_edition: str = ""
) -> List[Dict[str, Any]]:
    """
    Ranks available books against the student's learning requirement.
    Uses transparent, explainable scoring criteria (no fabricated percentages).
    Distinguishes rule-based matching vs AI predictions.
    """
    ranked_results = []
    norm_query_class = query_class.strip().lower()
    norm_query_subject = query_subject.strip().lower()

    for book in available_books:
        # Only evaluate available books or requested books
        if book.get("status") not in ("available", "requested"):
            continue

        book_class = book.get("class_level", "").strip().lower()
        book_subject = book.get("subject", "").strip().lower()
        book_title = book.get("title", "").strip()

        score = 0
        breakdown = []
        explanations = []

        # 1. Class Match (Max 40 points)
        if norm_query_class and book_class:
            if norm_query_class == book_class:
                score += 40
                breakdown.append({"factor": "Class Level", "points": 40, "max": 40, "detail": f"Exact match for {book.get('class_level')}"})
                explanations.append(f"Exact class match ({book.get('class_level')})")
            elif "7" in norm_query_class and ("6" in book_class or "8" in book_class):
                score += 15
                breakdown.append({"factor": "Class Level", "points": 15, "max": 40, "detail": f"Adjacent class ({book.get('class_level')}) - useful for revision/preview"})
                explanations.append(f"Adjacent grade ({book.get('class_level')})")
            else:
                breakdown.append({"factor": "Class Level", "points": 0, "max": 40, "detail": f"Different class ({book.get('class_level')})"})

        # 2. Subject Match (Max 35 points)
        if norm_query_subject and book_subject:
            if norm_query_subject == book_subject:
                score += 35
                breakdown.append({"factor": "Subject Match", "points": 35, "max": 35, "detail": f"Exact subject match for {book.get('subject')}"})
                explanations.append(f"Subject aligns with {book.get('subject')}")
            elif norm_query_subject in book_subject or book_subject in norm_query_subject:
                score += 20
                breakdown.append({"factor": "Subject Match", "points": 20, "max": 35, "detail": f"Partial subject overlap ({book.get('subject')})"})
                explanations.append(f"Partial subject overlap ({book.get('subject')})")
            else:
                breakdown.append({"factor": "Subject Match", "points": 0, "max": 35, "detail": f"Different subject ({book.get('subject')})"})

        # 3. Title Similarity (Max 20 points)
        sim = calculate_token_similarity(query_title, book_title)
        title_points = int(sim * 20)
        # Bonus if query keywords are inside book title
        if query_title.lower() in book_title.lower() or book_title.lower() in query_title.lower():
            title_points = max(title_points, 18)
        score += title_points
        breakdown.append({"factor": "Title Similarity", "points": title_points, "max": 20, "detail": f"Token overlap score ({int(sim*100)}%)"})
        if title_points > 10:
            explanations.append("High title keyword similarity")

        # 4. Condition Bonus (Max 5 points)
        cond = book.get("condition", "").lower()
        if cond == "like new":
            score += 5
            breakdown.append({"factor": "Book Condition", "points": 5, "max": 5, "detail": "Condition is Like New"})
            explanations.append("Excellent condition (Like New)")
        elif cond == "good":
            score += 3
            breakdown.append({"factor": "Book Condition", "points": 3, "max": 5, "detail": "Condition is Good"})
            explanations.append("Good usable condition")
        else:
            score += 1
            breakdown.append({"factor": "Book Condition", "points": 1, "max": 5, "detail": "Condition is Used/Fair"})

        # Classify Match Level
        if score >= 80:
            match_badge = "Excellent Match"
            match_tier = "top"
        elif score >= 55:
            match_badge = "Strong Match"
            match_tier = "medium"
        elif score >= 30:
            match_badge = "Potential Match"
            match_tier = "low"
        else:
            match_badge = "Low Relevance"
            match_tier = "minimal"

        # Only return books with some relevance
        if score >= 20:
            explanation_summary = " | ".join(explanations) if explanations else "Generic match"
            ranked_results.append({
                "book": book,
                "score": score,
                "max_score": 100,
                "match_badge": match_badge,
                "match_tier": match_tier,
                "algorithm_type": "RULE_BASED_MULTIVARIATE_MATCH",
                "breakdown": breakdown,
                "rationale": explanation_summary
            })

    # Sort descending by score
    ranked_results.sort(key=lambda x: x["score"], reverse=True)
    return ranked_results
