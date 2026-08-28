# TripMate AI — Multi-Agent Travel Planner

A state-of-the-art AI Travel Agent powered by **LangGraph**, **Groq AI**, **FastAPI**, and a modern **React + Tailwind CSS v4** frontend.

---

## 🚀 Features

- **Multi-Agent Orchestration**: Specialized agents for Flight Search, Hotel Search, Itinerary Synthesis, and Formatting using LangGraph & PostgreSQL Checkpoints.
- **Modern React + Tailwind v4 UI**: Glassmorphism aesthetic, dark gradient mode, markdown parsing, and tabbed view for flights, hotels, and day-by-day itineraries.
- **Export & PDF**: Copy plan to clipboard or export directly to styled PDF.
- **FastAPI Integration**: CORS-enabled REST API backend.

---

## 🛠️ How to Run

### 1. Backend (FastAPI)
```bash
# Activate your environment
conda activate tripai

# Install Python requirements
pip install -r requirements.txt

# Start FastAPI server
python app.py
```
FastAPI will run at `http://127.0.0.1:8000`.

### 2. Frontend (React + Vite)
```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```
Vite dev server will run at `http://localhost:5173`.
