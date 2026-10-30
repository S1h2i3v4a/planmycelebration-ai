# PlanMyCelebration AI

**PromptWars 2026 — Main Challenge 05: Celebration & Event Planner**

PlanMyCelebration AI is a production-inspired SaaS web application designed to help people plan weddings, milestone birthdays, anniversaries, college festivals, and community events in one organized workspace.

---

## Features & Screens

1. **Landing & Welcome Screen:** Product introduction, empty state, and 3 category previews.
2. **Overview Dashboard:** Personalized greeting, 4 summary metric cards, task/budget progress bars, and recent event switcher.
3. **Event Creation Wizard:** 4-step guided form with inline validation, currency selection, and priority weighting.
4. **AI Event Planner:** Secure backend integration with Google Gemini (`gemini-2.5-flash`) and an honest offline Demo Mode.
5. **Budget Management:** Dedicated INR ledger with auto-balancing, stacked visual allocation bars, and over-budget warning banners.
6. **Timeline & Task Management:** 5-phase preparation schedule with status filters and relative date calculation.
7. **Vendor Shortlist:** Venue and service provider comparison with quotation tracking and essential checklist questions.
8. **Settings & About:** Local storage metrics, JSON backup export, and data erasure controls.

---

## Technology Stack

- **Frontend:** React 18, Vite 5, JavaScript (ESM).
- **Styling:** Modular CSS custom properties with warm ivory canvas, deep plum primary, and muted coral accents.
- **Backend:** Node.js & Express server proxying Google Gen AI SDK (`@google/genai`).
- **Persistence:** LocalStorage (`pmc_ai_v1_*`) with defensive sanitization.

---

## Local Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation Commands

```bash
# 1. Navigate to the project directory
cd "virtual prompt war"

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for live AI mode)
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Running the Application

```bash
# Option A: Run frontend Vite dev server only (Demo Mode active)
npm run dev

# Option B: Run Express backend + frontend concurrently (Live AI mode)
npm run server
# In another terminal:
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Testing & Acceptance Criteria

- **App Initialization:** Starts without build errors.
- **Persistence:** Created events and task progress persist after refreshing the browser (`localStorage`).
- **Calculations:** Budget totals and task progress percentages recalculate instantly and consistently across the Dashboard, Budget, and My Events pages.
- **AI & Demo Mode:** Gracefully handles missing API keys by falling back to Demo Mode without crashing.

---

## Deployment Instructions

1. **Build the production frontend assets:**
```bash
npm run build
```
2. **Deploy the Express backend (`server.js`)** to a Node.js hosting provider (Render, Railway, Fly.io) with `GEMINI_API_KEY` set in the environment variables.
3. **Deploy the static `dist/` frontend bundle** to Vercel, Netlify, or GitHub Pages.
