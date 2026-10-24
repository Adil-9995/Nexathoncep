# CampusLoop — Learn One Skill. Teach Another. Grow Together.

**CampusLoop** is a student-powered circular platform where students learn directly from one another with zero course tuition, buy and sell second-hand textbooks and digital PDF lecture notes, and earn through assignment & lab record writing gigs with escrow protection.

---

## Key Pillars & Features

### 1. Peer-to-Peer Skill Exchange & Study Circles
- **1-on-1 Peer Sessions**: Connect with fellow verified students to learn skills like Figma, Flutter, Django, and Java for ₹0 course fees.
- **Group Study Circles (3-4 Peers)**: Create or join small collaborative cohort sessions.
- **Live Classroom Meets**: Virtual video rooms for real-time peer coding, whiteboard demonstrations, and design reviews.

### 2. Learning Credits Economy (Non-Cash Campus Points)
- **Request a Session**: **-2 Credits** deducted from the learner.
- **Complete a Teaching Session**: **+5 Credits** awarded to the mentor.
- **Marketplace & Writing Transactions**: **+2 Credits** bonus awarded to both parties on every completed transaction.
- **Interactive Credit Adjustments**: Real-time animated balance alerts and celebratory toast animations.

### 3. Book & Digital PDF Notes Marketplace (20+ Items)
- **Physical Textbooks**: Browse and sell affordable course books across Computer Science, Electronics, Mechanical, Mathematics, and Management.
- **Digital PDF Notes**: Buy, sell, and instantly download curated student lecture notes, exam formula cheat sheets, and lab manuals.
- **Filter by Format**: Toggle between Physical Books and Digital PDF Notes with real-time page count and file size previews.
- **Transparent 2% Platform Commission**: Simulated campus UPI escrow where 98% goes to the student seller and 2% platform fee maintains verification.

### 4. Assignment & Lab Record Writing Gigs (Escrow Protection)
- **Student Writers Hub**: Students who write neatly can list services (Lab Records, Assignments, Observation Notebooks, Diagrams & Engineering Graphs) with handwriting sample previews and asking rates (per page / per record).
- **Work Announcements**: Students needing urgent record/assignment writing can post jobs with deadlines and budgets.
- **₹10 Advance Escrow Protection**: Requesters pay a strictly enforced ₹10 advance deposit to lock in the writer before submitting materials.
- **Dual Confirmation & Fair Payout**: Once the writer submits preview images and completion notes, the requester reviews the work, releases the remaining balance (98% to writer, 2% platform fee to app), and both earn +2 bonus credits.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Vanilla CSS Design System, Lucide Icons
- **Effects & UI**: Canvas Confetti, Glassmorphism, Google Fonts (Outfit & Inter)
- **Database Schema**: Full PostgreSQL & Supabase schema (`supabase_schema.sql`) with Row-Level Security (RLS) for profiles, skills, credit wallets, book listings, writing gigs, and escrow orders.

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Adil-9995/Nexathoncep.git

# Navigate into the project directory
cd Nexathoncep

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be live at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

---

## License

MIT License. Designed and built for campus peer education.
