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

## Deployment on Render

### Option A: Unified Full-Stack Web Service (Recommended)
Deploy both the React frontend and Express Gemini backend together in a single Render Web Service:
1. Create a new **Web Service** on Render and connect your repository: `https://github.com/S1h2i3v4a/planmycelebration-ai`.
2. Configure settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
3. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key
4. Deploy! The unified server will serve both the React web application and the `/api/ai-plan` route.

### Option B: Static Site + Client-Side API Key
If deploying as a **Render Static Site**:
1. Build Command: `npm run build`, Publish Directory: `dist`.
2. In the deployed web application, open **Settings**, paste your Gemini API Key into the **Gemini API Key** field, and click **Save Key**. The app will generate live AI plans directly from the browser!
