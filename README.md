# WealthFlow - Smart Finance Tracker

<div align="center">
  <img src="./public/favicon.svg" alt="WealthFlow Logo" width="120" height="120">
  
  <p align="center">
    <strong>Modern financial management platform for tracking expenses, budgets, and investments</strong>
  </p>
  
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

## Features

### Core Functionality
- **Multi-Account Management** - Track multiple bank accounts, credit cards, and wallets
- **Smart Categorization** - Automatic transaction categorization with customizable categories
- **Budget Tracking** - Set and monitor monthly budgets with progress indicators
- **Recurring Transactions** - Automate recurring income and expense tracking
- **Interactive Charts** - Beautiful data visualization with Recharts
- **Real-time Updates** - Live balance updates and transaction synchronization

### AI-Powered Features
- **Receipt Scanning** - Extract transaction details from receipt photos using Google AI
- **Smart Insights** - AI-generated financial insights and recommendations
- **Automated Categorization** - Machine learning-powered expense categorization

### Modern UI/UX
- **Glassmorphism Design** - Modern frosted glass aesthetic with backdrop blur
- **Dark/Light Mode** - Complete theme switching with system preference detection
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile
- **Gradient Theming** - Beautiful indigo/purple gradient color scheme
- **Micro-interactions** - Smooth animations and hover effects

### Security & Authentication
- **Clerk Authentication** - Secure user authentication and session management
- **Arcjet Protection** - Advanced security features and rate limiting
- **Data Encryption** - Secure handling of sensitive financial data
- **Role-based Access** - User permissions and data isolation

## 🛠 Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
- **[Recharts](https://recharts.org/)** - Composable charting library

### Backend & Database
- **[Prisma](https://www.prisma.io/)** - Type-safe database ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)** - Full-stack React with server-side logic

### Authentication & Security
- **[Clerk](https://clerk.com/)** - Complete authentication solution
- **[Arcjet](https://arcjet.com/)** - Security and rate limiting
- **[Zod](https://zod.dev/)** - Schema validation

### AI & External Services
- **[Google Generative AI](https://ai.google.dev/)** - Receipt scanning and insights
- **[Resend](https://resend.com/)** - Email notifications
- **[Inngest](https://www.inngest.com/)** - Background job processing

### Development Tools
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms
- **[Date-fns](https://date-fns.org/)** - Date manipulation
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **PostgreSQL** database
- **Clerk** account for authentication
- **Google AI** API key (optional, for receipt scanning)

### 1. Clone the Repository
```bash
git clone https://github.com/parasmaha1/finance-tracker.git
cd finance-tracker
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/wealthflow"
DIRECT_URL="postgresql://username:password@localhost:5432/wealthflow"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google AI (Optional)
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Email (Optional)
RESEND_API_KEY=your_resend_api_key

# Arcjet (Optional)
ARCJET_KEY=your_arcjet_key
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── ...               # Feature components
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── actions/              # Server actions
├── hooks/                # Custom React hooks
└── data/                 # Static data and configurations
```

## Design System

### Color Palette
- **Primary**: Indigo to Purple gradient (`#6366f1` → `#8b5cf6`)
- **Secondary**: Violet to Pink gradient (`#7c3aed` → `#ec4899`)
- **Success**: Emerald (`#10b981`)
- **Warning**: Amber (`#f59e0b`)
- **Error**: Red (`#ef4444`)

### Typography
- **Primary Font**: Plus Jakarta Sans
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## 🔧 Configuration

### Prisma Configuration
The application uses Prisma with PostgreSQL. Key models include:
- **User** - User accounts and profiles
- **Account** - Financial accounts (checking, savings, credit cards)
- **Transaction** - Income and expense records
- **Budget** - Monthly budget allocations

### Tailwind Configuration
Custom theme extensions for gradients, animations, and component styling.

## Features Walkthrough

### Dashboard
- Overview of all accounts and recent transactions
- Budget progress indicators
- Interactive charts and graphs
- Quick action buttons for common tasks

### Transaction Management
- Add income and expenses manually
- AI-powered receipt scanning
- Recurring transaction setup
- Advanced filtering and search

### Account Management
- Multiple account types support
- Real-time balance tracking
- Account-specific transaction history
- Default account settings

### Budget Tracking
- Monthly budget allocation
- Category-wise spending limits
- Progress tracking with visual indicators
- Budget vs. actual spending analysis

## Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every commit

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Database Migration
```bash
# Deploy database changes
npx prisma migrate deploy
```


