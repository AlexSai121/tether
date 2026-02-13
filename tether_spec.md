Project Specification: Tether (MVP)

1. Executive Summary

App Name: Tether
Tagline: "Don't Drift Away."
Core Concept: A "Ranked Mode" for academic focus. Students are paired (tethered) for 50-minute deep work sessions. If they leave the app (tab switch) or quit early, they lose "Elo" (Rank).
Target Audience: College students who procrastinate and feel isolated.

2. Tech Stack Requirements

Framework: React (Vite)

Styling: Tailwind CSS (Mobile-first, Dark Mode default)

Icons: Lucide-React

State Management: React Context API (or local state for MVP)

Routing: React Router (if needed, or conditional rendering for simplicity)

Deployment Target: Vercel

3. Design System & Aesthetics

Theme: "Academic E-Sports." Dark slate backgrounds (bg-slate-900), glowing accents (indigo-500, green-500), monospace fonts for numbers.

Vibe: High stakes, serious, premium. Not "cute" or "cozy."

Responsive: Must be fully responsive (mobile view is priority).

4. Core Features & User Flow

A. The Lobby (Home View)

Display User's Current Rank (e.g., "Bronze II - 1240 Elo").

Big Action Button: "FIND MATCH".

Mode Selector: "Deep Work" (50m) vs "Sprint" (25m).

Leaderboard Preview: Static list of top 3 majors (e.g., Engineering, Pre-Med).

B. Matchmaking (Simulation for Phase 1)

User clicks "Find Match."

Show a scanning animation ("Scanning campus network...").

After 3 seconds, auto-match with a Mock User (Name: "Alex", Major: "CompSci", Avatar: Lion).

Transition to Session View.

C. The Session (Active View)

Timer: Countdown (50m or 25m).

Partner Status: Visual indicator of partner (Online/Away).

Controls: Mic Toggle (UI only), Video Toggle (UI only), "Give Up" button.

The "Psycho" Feature:

Use document.visibilityState to detect if the user switches tabs.

If they switch tabs: Play a sound (optional) and show a visual "TETHER STRAINING" warning.

If they stay away > 10s: Auto-fail the session.

D. Results Screen

Success: Timer hits 0:00 -> Play confetti -> Show "+25 Elo".

Failure: User quits or tabs out -> Show Red Screen -> Show "-15 Elo".

Action: "Return to Lobby".

5. Implementation Steps (Instructions for AI)

Phase 1: The UI Shell (Mock Data Only)

Do not connect to Firebase yet. Use local React State to manage the user's Elo and the current session status.

Build the App.jsx to switch between Lobby, Matchmaking, Session, and Results components based on state.

Style it to look like a finished product using Tailwind.

Phase 2: The Logic

Implement the Countdown timer.

Implement the useTabFocus hook to detect backgrounding.

Implement the Elo calculation logic (+25 / -15).

6. Data Structure (For Reference)

User Object: { name: string, elo: number, major: string }

Session Object: { duration: number, partner: UserObject, status: 'active' | 'completed' | 'failed' }