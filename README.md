# UniShare — Campus Inter-Departmental Resource Exchange Platform

UniShare is an enterprise-grade university property transfer, surplus exchange, and circular sustainability web platform. It connects university departments (computer science, chemistry, biology, engineering, library, fine arts, and campus facilities) to eliminate capital equipment waste, streamline transfer workflows, issue digital gate passes, and track institutional carbon reduction.

---

## 🌟 Key Features

### 1. Multi-Role Campus Simulation
- **Department Resource Custodian** (*Dr. Marcus Vance, Computer Science & Engineering*):
  - List lab instruments, computing gear, and surplus office equipment.
  - Approve or decline incoming transfer requests with review notes.
  - Issue official digital **Campus Transfer Gate Passes**.
- **Faculty & Lab Requester** (*Elena Rostova, M.Sc., Department of Chemistry*):
  - Search and filter available campus surplus.
  - Submit transfer requests with academic purpose and urgency.
  - Track custody pipeline and confirm handover upon receipt.
- **Campus Super-Admin & Procurement Officer** (*Director Sarah Jenkins, Central Procurement*):
  - Institutional governance, campus-wide savings analytics, and immutable audit logs.

### 2. Available Surplus Catalog
- Multi-faceted filter system: Category, Department, Condition, and Availability window.
- Quick 1-click filters for high-value items (`>$5k`), lab equipment, IT hardware, and consumables.
- Full technical specifications modal with safety hazards (EHS) and logistics notes.

### 3. Transfer & Custody Pipeline
- Visual 4-stage tracking:
  $$\text{1. Request Submitted} \longrightarrow \text{2. Approved \& Scheduled} \longrightarrow \text{3. In-Transit} \longrightarrow \text{4. Handover Sign-off}$$
- Streamlined actions: Approve, decline, schedule pickup, confirm in-transit, and recipient inspection sign-off.

### 4. Official Printable Transfer Gate Pass
- Generates official university property transfer vouchers.
- Features tamper-evident QR code, origin & destination room locations, asset tags, custodian sign-offs, and print-ready CSS (`window.print()`).

### 5. "Needed Resources" Wishlist Board
- Departments post urgent equipment requirements before issuing commercial purchase orders.
- Direct **"I Have This Item"** matching workflow linking surplus inventory to active needs.

### 6. Sustainability Impact & Leaderboards
- Quantified carbon avoided ($\text{kg CO}_2\text{e}$) and procurement funds repurposed ($\$$).
- Real-time environmental equivalents (trees planted, highway vehicle miles prevented).
- Departmental sustainability ranking leaderboard.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4 + Plus Jakarta Sans & JetBrains Mono
- **Icons**: Lucide React
- **Animations**: Motion
- **State & Storage**: React Context API + LocalStorage persistence

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, pnpm, or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/praloysaha60-tech/UniShare.git
cd UniShare

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production
```bash
npm run build
npm run preview
```

---

## 📄 License
Licensed under the Apache-2.0 License.
