# TrustNet – Lightweight Digital Identity Verification for Local Businesses

TrustNet empowers small-scale entrepreneurs and local businesses by giving them credible, verified digital identities. Traditional Know-Your-Customer (KYC) processes are too document-heavy for micro-businesses, street vendors, and home-based entrepreneurs. TrustNet solves this by offering community validation, UPI transaction-based trust signals, and analytics that help local entrepreneurs build and showcase their credibility online.

---

## 📁 Folder Structure

```
TrustNet/
│
├── app/
│   ├── page.tsx                 → Home page (frontend UI)
│   ├── dashboard/
│   │   └── page.tsx             → Dashboard view for business insights
│   └── api/
│       ├── users/
│       │   └── route.ts         → API endpoint for user management
│       ├── auth/
│       │   └── route.ts         → OTP-based authentication API
│       └── business/
│           └── route.ts         → Business profile CRUD operations
│
├── components/
│   ├── Navbar.tsx               → Top navigation bar component
│   ├── Footer.tsx               → Footer component
│   ├── BusinessCard.tsx         → Displays business details and trust score
│   └── AnalyticsChart.tsx       → Chart.js component for analytics dashboard
│
├── lib/
│   ├── db.ts                    → Database connection logic (PostgreSQL)
│   ├── auth.ts                  → Authentication and session utilities
│   ├── trustScore.ts            → Core logic for trust score calculation
│   └── redis.ts                 → Redis caching configuration
│
├── public/
│   └── logo.png                 → Project logo for README and UI
│
├── styles/
│   └── globals.css              → Global Tailwind CSS and style settings
│
├── .env.local                   → Environment variables (not committed)
├── next.config.js               → Next.js configuration
├── package.json                 → Dependencies and project metadata
└── README.md                    → Project documentation

```

---

## Setup and Installation

### 1. Prerequisites
- Node.js 20 or higher  
- PostgreSQL 15 or higher  
- Redis 7 or higher  
- Docker (optional but recommended)  
- AWS or Azure account for deployment  

### 2. Installation

Clone the repository
git clone https://github.com/kalviumcommunityS62_1025_API-nauts_Full-Stack-With-NextjsAnd-AWS-Azure-Supply-Chain_TrustNet.git
cd trustnet

Install dependencies
npm install

Setup environment variables
cp .env.example .env

Add your database URL, Redis URL, and required environment keys
Run Prisma migrations
npx prisma migrate dev

Seed initial data (optional)
npx prisma db seed


### 3. Running Locally

Start the Next.js development server
npm run dev


Visit http://localhost:3000 to view the application.

### 4. Using Docker

Build and run containers
docker-compose up --build


---

## Reflection: Structural Design Rationale

The structure and technologies were chosen to maximize modularity, scalability, and performance across future sprints.  

- Next.js 14 provides full-stack capabilities with built-in API routes, ensuring frontend and backend alignment.  
- PostgreSQL with Prisma offers a robust ORM layer and easily maintainable schema evolution.  
- Redis caching enhances performance for analytics and trust score computations.  
- Docker ensures consistent development and production environments.  

This structure supports collaborative scaling for future sprint pipelines where each subsystem (analytics, verification, dashboard) can evolve independently with minimal coupling.

---

## Screenshot

Add a screenshot of your local application running below.

Example placeholder:  

![TrustNet Dashboard](dashboard.png)

---

## Future Enhancements

- Mobile app integration for field agents and vendors  
- Advanced analytics with AI-driven trust prediction  
- Multi-language support for vernacular inclusivity  
- Integration with government micro-loan identity networks  

---

## Contributors

| Role | Team Member | Key Responsibilities |
|------|--------------|----------------------|
| Frontend Lead | Claudia Jerome | Next.js UI components, responsive design, analytics dashboard |
| Backend Lead | Tejas Philip Thomas | Database design, API routes, UPI verification system |
| Full-Stack & DevOps | Isaac Reji | Prisma schema, Redis integration, Docker setup, deployment |
| Quality Assurance | All Members | Testing, bug reporting, user experience validation |

---