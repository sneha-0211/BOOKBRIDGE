# 📚 BOOKBRIDGE - Educational Resource Exchange & AI Textbook Matching Platform

> **Bridging the educational divide by making textbook exchanges seamless, sustainable, and safe for students.**

---

## 🌟 Overview

**BOOKBRIDGE** is an intelligent textbook exchange and donation platform designed for schools and student communities. By combining **AI-driven OCR cover recognition**, **smart textbook matchmaking**, and **verified safe campus pickup zones**, BOOKBRIDGE helps students share syllabus books effortlessly while promoting circular sustainability.

---

## ✨ Key Features

- 🔍 **AI Book Cover Scanner**: Instant metadata recognition (Subject, Class level, Edition, Condition) from book cover photos using EasyOCR and Google Gemini Vision.
- 🔄 **Smart Exchange Matcher**: Algorithmic pairing of book donors and seekers based on syllabus, grade level, and exchange requests.
- 🏫 **Safe Campus Handover Zones**: Coordinated handovers at secure campus drop points (School Library Counter, Classroom desks) without sharing private contact information.
- 🌱 **Environmental & Financial Impact Tracker**: Live calculation of trees saved, water conserved, CO2 footprint prevented, and money saved through book reuse.
- 🎨 **Modern, Intuitive Interface**: Sleek, responsive user experience crafted with React, Vite, Tailwind CSS, and Lucide Icons.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Native Fetch API / Axios

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **Database**: SQLite (Zero configuration, lightweight persistence)
- **Computer Vision / OCR**: EasyOCR & Google Gemini Vision API
- **Data Validation**: Pydantic v2

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher) and `npm`
- **Python** (v3.10 or higher)

---

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/bookbridge.git
cd bookbridge
```

---

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Configure environment variables
copy .env.example .env

# Run database seed (optional demo data)
python seed_data.py

# Start FastAPI server
uvicorn main:app --reload --port 8000
```
Backend API will be live at: `http://localhost:8000`  
API Swagger Documentation: `http://localhost:8000/docs`

---

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd backend/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will be accessible at: `http://localhost:5173`

---

## 📁 Project Structure

```
BOOKBRIDGE/
├── .gitignore
├── README.md
└── backend/
    ├── database.py         # SQLite connection and schema setup
    ├── main.py             # FastAPI REST endpoints & routing
    ├── matcher.py          # Book matching algorithm
    ├── ocr_service.py      # AI OCR text extraction & book parsing
    ├── requirements.txt    # Python backend dependencies
    ├── seed_data.py        # Demo dataset & student profiles
    ├── .env.example        # Environment variable template
    ├── uploads/            # Uploaded book cover images
    └── frontend/           # React + Vite frontend application
        ├── index.html
        ├── package.json
        ├── vite.config.js
        ├── tailwind.config.js
        └── src/
            ├── components/ # Reusable UI components
            ├── pages/      # Application views & pages
            └── App.jsx     # Routing and core layout
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues tab.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
