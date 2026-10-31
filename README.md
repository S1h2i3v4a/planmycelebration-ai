# PlanMyCelebration AI

> **PromptWars 2026 — Main Challenge 05: Celebration & Event Planner**  
> An intelligent, single-workspace event management web application for orchestrating weddings, milestone birthdays, anniversaries, and community celebrations.

---

## 🌐 Live Demo & Repository

* **Deployed Website:** `[https://planmycelebration-ai.onrender.com]` *(Replace with your live Render URL)*
* **GitHub Repository:** [https://github.com/S1h2i3v4a/planmycelebration-ai](https://github.com/S1h2i3v4a/planmycelebration-ai)
* **Demo Video:** `[https://youtu.be/your-video-link]` *(Replace with your unlisted video URL)*

---

## 📌 Problem & Solution

### The Problem
Organizing a milestone celebration—whether an intimate 50-guest anniversary or a 500-guest community festival—is fragmented and chaotic:
* Critical event details are scattered across chat threads, notes apps, and messy spreadsheets.
* Unmonitored expenses lead to sudden budget overruns and unexpected vendor costs.
* Organizers lack a structured roadmap, leading to forgotten milestones, rushed vendor bookings, and last-minute panic.

### The Solution
**PlanMyCelebration AI** brings the entire planning lifecycle into one cohesive workspace:
1. **Guided 4-Step Event Wizard** to define scope, master budget cap, and priorities.
2. **Generative AI Event Planner** powered by Google Gemini to synthesize bespoke themes, preparation roadmaps, and category budget ratios.
3. **Auto-Balancing Budget Manager** with category breakdowns, paid/unpaid tracking, and visual over-budget warning alerts.
4. **Phased Milestone Checklist** with date countdown offsets.
5. **Vendor Shortlist Comparison** with quote tracking and negotiation questions.
6. **100% Private Local Storage Persistence** with single-click JSON backup export.

### Target Users
* **Couples & Families** coordinating weddings, milestone birthdays, and family reunions.
* **Community Organizers & Student Committees** planning cultural festivals, galas, and college celebrations.
* **Independent Event Coordinators** needing a lightweight, zero-bloat planning tool.

---

## ✨ Implemented Core Features

| Feature | Implementation Details |
| :--- | :--- |
| **Guided Event Wizard** | 4-step modal with real-time validation, multi-currency support (INR ₹, USD $, EUR €, GBP £), and priority weighting. |
| **AI Event Planner** | Generates concept title, executive summary, theme directions, 4-phase preparation roadmap, suggested activities, and budget percentage advice. |
| **Honest Mode Toggle** | Clearly displays **"Live AI Generated"** (coral) vs. **"Demo Mode (Offline Sample)"** (gold) badges. Allows 1-click demo plan loading. |
| **Overview Dashboard** | Real-time metric cards (Days Remaining, Budget Cap vs. Allocated, Paid vs. Pending, Task Progress) and recent event switcher. |
| **Budget Manager** | Auto-balancing ledger with category breakdowns (Venue, Catering, Decor, Photography, Buffer), paid status toggles, and over-budget alert banners. |
| **Timeline & Tasks** | 5-phase preparation checklist (Initial Planning, Bookings, Preparation, Final Checks, Wrap Up) with completion counters and custom task additions. |
| **Vendor Shortlist** | Side-by-side vendor evaluation, price quotation comparisons, booking status badges, and vendor interview checklist questions. |
| **Data Portability** | Full JSON backup export, browser storage statistics, and safe data erasure modal. |

---

## 🤖 Actual GenAI Integration Disclosure

* **Active Models:** Google Gemini (`gemini-3.5-flash-lite`, `gemini-flash-latest`, and `gemini-3.8-flash`) via the official `@google/genai` SDK and Generative Language REST endpoints.
* **Architecture:** The application employs a secure dual-path architecture:
  1. **Primary Backend Path:** The Express server (`/api/ai-plan`) proxies requests to Google Gemini, keeping credentials secure on the server.
  2. **Zero-Friction Fallback:** If the backend server is sleeping or unavailable (e.g. static hosting on CDN), the app seamlessly executes client-side generation without crashing.
* **Offline Demo Mode:** When completely offline or if API limits are reached, the application falls back gracefully to pre-packaged, domain-accurate sample plans. The UI transparently identifies offline data with a gold **Demo Mode (Offline Sample)** badge.

---

## 🛠️ Technology Stack

* **Frontend:** React 18, Vite 5, JavaScript (ES Modules).
* **Styling:** Custom Modular CSS Architecture (`tokens.css`, `global.css`) utilizing WCAG AA-compliant variables (Warm Ivory canvas `#FAF7F2`, Deep Plum primary `#4A2545`, Muted Coral `#D96B52`).
* **Backend:** Node.js, Express 5, CORS, Dotenv.
* **AI SDK:** Google Gen AI SDK (`@google/genai`).
* **Persistence:** Browser `localStorage` (`pmc_ai_v1_*`) with automated sanitization.
* **Icons & UI:** Custom inline SVG icon system (`Icon.jsx`). Zero heavy third-party UI dependencies.

---

## 🚀 Local Setup & Installation

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/S1h2i3v4a/planmycelebration-ai.git
cd planmycelebration-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```bash
cp .env.example .env
```
Populate `.env` with your Google Gemini API key:
```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Port for Express server
PORT=3001
```

### 4. Run the Application

#### Option A: Unified Full-Stack Mode (Recommended)
Build the frontend and run the Express server (serves both frontend and API on port 3001):
```bash
npm run build
npm start
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

#### Option B: Independent Vite Dev Mode
Run the Express backend:
```bash
npm run server
```
In a separate terminal, launch Vite dev server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Verification

1. **Production Build Verification:**
   ```bash
   npm run build
   ```
   *Expected outcome:* Builds successfully with zero syntax or bundling errors.

2. **Persistence Test:**
   * Create an event using the guided wizard.
   * Add a custom budget expense and check off a task in Timeline.
   * Refresh the browser (`F5`).
   * *Expected outcome:* All events, budget ledgers, and task completion states persist accurately.

3. **AI Generation & Fallback Test:**
   * Navigate to the **AI Planner** page.
   * Click **"Generate AI Plan"** — verifies live synthesis.
   * Click **"Load Demo Plan"** — verifies offline demo mode and badge switching.

4. **Calculation Consistency Test:**
   * Add an expense that exceeds the event's master budget cap.
   * *Expected outcome:* The progress bar turns red, and an over-budget alert banner displays on both Dashboard and Budget screens.

---

## ⚠️ Known Limitations & Future Improvements

### Current Limitations
* **Local Device Storage:** Workspace data is stored in the browser's `localStorage`; data does not automatically sync across different devices without exporting the JSON backup.
* **Single Active Currency per Event:** Currencies are assigned per event workspace rather than supporting multi-currency exchange conversion within a single budget.

### Future Roadmap
* **Cloud Database Sync:** User authentication and multi-user workspace sharing via PostgreSQL / Supabase.
* **Automated PDF Itinerary Export:** One-click downloadable run-of-show schedules for coordinators and photographers.
* **Direct Vendor Inquiries:** Automated email draft generation populated with event specs and shortlist questions.

---

## 📄 License

Built for **PromptWars 2026 Challenge 05**. Distributed under the MIT License.
