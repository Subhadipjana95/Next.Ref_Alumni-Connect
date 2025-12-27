<div align="center">

# 🎓 NextRef - Alumni Connect

### NextRef - Modern Alumni Referral Platform

*Connecting students with alumni for authentic job referrals and career opportunities*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

[Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Smart Contract](#-smart-contract) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 Overview

**Alumni Connect** (NextRef) is a modern full-stack web application that bridges the gap between students, universities, and alumni networks. Built with **React**, **Node.js**, and **MongoDB**, this platform creates a transparent and efficient referral ecosystem for campus recruitment.

The platform empowers:
- **Students** to create profiles, upload resumes, and apply to exclusive job opportunities
- **Verifiers** (Universities/Institutions) to validate student credentials
- **Alumni** to post job openings and connect with verified talent from their alma mater

All interactions are managed through a secure REST API with JWT authentication, ensuring data integrity and user privacy.

---

## ✨ Features

### 🔐 Authentication System
- **JWT-Based Authentication** - Secure token-based auth with HTTP-only cookies
- **Role-Based Access Control** - Student, Alumni, and Verifier roles
- **Multi-Role Support** - Dynamic role-based dashboards
- **Secure Password Hashing** - Bcrypt encryption for user passwords
- **Session Management** - Persistent login with token refresh

### 📄 Resume Management System
- **PDF Upload** - Upload resumes via backend API
- **Cloudinary Storage** - Secure cloud storage for documents
- **Database Storage** - Resume metadata stored in MongoDB
- **Verification System** - Manual verification by authorized verifiers
- **Profile Management** - Complete student profile with resume links
- **QR Code Generation** - Quick verification via scannable QR codes
- **ML Resume Analysis** - Automatic skill extraction and parsing (via Python ML service)

### 💼 Job Referral Marketplace
- **Alumni Job Posting** - Create and manage job opportunities
- **Backend API Integration** - Full CRUD operations via REST API
- **Smart Application System** - Only verified students can apply
- **Applicant Tracking** - Complete application tracking in database
- **Shortlisting & Referrals** - Direct candidate recommendations
- **Edit & Delete Jobs** - Full opportunity management for alumni
- **Application Status** - Track application lifecycle (Applied, Shortlisted, Referred, Rejected)
- **External Job Integration** - Support for third-party job postings

### 🎨 Modern User Experience
- **Responsive Design** - Mobile-first, fully responsive UI
- **Dark/Light Mode** - Customizable theme with next-themes
- **Smooth Animations** - Framer Motion powered interactions
- **Lenis Smooth Scroll** - Buttery-smooth scrolling experience
- **Toast Notifications** - Real-time transaction feedback with Sonner

### 🔍 Transparency Features
- **Application Status Tracking** - Real-time application status updates
- **Activity Dashboard** - Comprehensive analytics for all users
- **API Documentation** - Complete REST API reference guide
- **Integration Guides** - Detailed API integration documentation
- **Toast Notifications** - Real-time feedback for all actions

### 🤖 ML-Powered Features
- **Resume Parsing** - Automatic skill extraction from PDFs
- **Job Recommendations** - ML-based job matching algorithm
- **Skill Analysis** - Advanced text preprocessing and analysis

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                          │
│  React + TypeScript + Vite + Shadcn/UI + TailwindCSS        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │   Student    │ │    Alumni    │ │   Verifier   │        │
│  │  Dashboard   │ │  Dashboard   │ │  Dashboard   │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST API
                     │
┌────────────────────▼────────────────────────────────────────┐
│           Backend API Layer (Express + Node.js)             │
│  ┌──────────────────────────────────────────┐              │
│  │      REST API Endpoints                  │              │
│  │  - Authentication (JWT)                  │              │
│  │  - Alumni & Student Profiles             │              │
│  │  - Opportunity Management                │              │
│  │  - Application Tracking                  │              │
│  │  - Resume Upload & Verification          │              │
│  └──────────────────────────────────────────┘              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   MongoDB    │  │  Cloudinary  │  │  Firebase    │    │
│  │   Database   │  │ Image Storage│  │   (Optional) │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└───────────────────┬─────────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
┌────────▼──────────┐  ┌───────▼────────────┐
│ ML Service        │  │  External APIs     │
│ (Flask + Python)  │  │  - Job Boards      │
│ - Resume Analysis │  │  - Email Service   │
│ - Job Matching    │  │  - Notifications   │
│ - Recommendations │  │                    │
└───────────────────┘  └────────────────────┘
```

### Key Components

#### Frontend (`/Frontend`)
- **Pages**: Landing page, role-based dashboards, authentication pages, profile management
- **Components**: 40+ reusable UI components built with Radix UI and Shadcn/UI
- **Auth Module**: Complete authentication system with JWT, role-based access control
- **Hooks**: Custom React hooks for mobile detection, toast notifications
- **Services**: API service layer for backend communication (applications, opportunities, jobs)
- **Contexts**: Theme management, authentication state

#### Backend (`/Backend`)
- **Language**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with role-based access control
- **APIs**: RESTful endpoints for all application features
- **File Upload**: Cloudinary integration for image/document uploads, express-fileupload middleware
- **Middleware**: Auth middleware, CORS configuration, cookie-parser, file upload handling
- **Security**: Bcrypt password hashing, JWT tokens, HTTP-only cookies

**API Base URL**: `http://localhost:4000/api/v1` (development)
**Production**: `https://nextref-alumni-connect.onrender.com/api/v1`

**Key Endpoints**:
- `/api/v1/student/*` - Student authentication and profile management
- `/api/v1/alumni/*` - Alumni authentication and profile management  
- `/api/v1/opportunities/*` - Job opportunity CRUD operations
- `/api/v1/applications/*` - Application management
- `/api/v1/external-jobs/*` - External job postings integration

#### ML Service (`/ML`)
- **Language**: Python + Flask
- **Features**: Resume parsing, job recommendation, skill matching
- **ML Libraries**: Scikit-learn for matching algorithms, NLTK for NLP
- **PDF Processing**: pdfplumber for resume text extraction
- **Data Processing**: Pandas and NumPy for data manipulation

#### Cloud Services
- **Cloudinary**: Image and document storage with secure URLs
- **MongoDB Atlas**: Cloud-hosted database (production)
- **Render**: Backend API hosting (production)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **bun** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Python 3.8+** (for ML service)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Subhadipjana95/NextRef_Alumni-Connect.git
   cd Alumni-Connect
   ```

2. **Install dependencies**
   
   **Frontend:**
   ```bash
   cd Frontend
   npm install
   # or
   bun install
   ```
   
   **Backend:**
   ```bash
   cd Backend
   npm install
   ```
   
   **ML Service:**
   ```bash
   cd ML
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   
   **Frontend (.env in /Frontend directory)**
   ```bash
   # API Configuration
   VITE_API_BASE_URL=http://localhost:4000/api/v1
   
   # Builder.io Configuration (Optional - for CMS features)
   VITE_PUBLIC_BUILDER_KEY=your_builder_key
   ```
   
   **Backend (.env in /Backend directory)**
   ```bash
   # Server Configuration
   PORT=4000
   
   # Database Configuration
   DB_URL=mongodb://localhost:27017/alumni-connect
   # OR for MongoDB Atlas:
   # DB_URL=mongodb+srv://username:password@cluster.mongodb.net/alumni-connect
   
   # JWT Authentication
   JWT_SECRET=your_jwt_secret_key_here
   
   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start development servers**
   
   **Backend:**
   ```bash
   cd Backend
   npm run dev
   # Runs on http://localhost:4000
   ```
   
   **Frontend:**
   ```bash
   cd Frontend
   npm run dev
   # Runs on http://localhost:5173
   ```
   
   **ML Service (Optional):**
   ```bash
   cd ML
   python app.py
   # Runs on http://localhost:5000
   ```

5. **Access the application**
   ```
   Frontend: http://localhost:5173
   Backend API: http://localhost:4000/api/v1
   ML Service: http://localhost:5000
   ```

### First Time Setup

1. **Install MongoDB** locally or create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. **Setup Cloudinary** account for image storage at [Cloudinary](https://cloudinary.com/)
3. **Configure environment variables** as shown above
4. **Install dependencies** for Frontend, Backend, and ML services

---

## � Backend API

### API Overview

The Backend API is built with **Express.js** and **MongoDB**, providing a robust REST API for all application features.

**Base URL**: `http://localhost:4000/api/v1` (Development)  
**Production**: `https://nextref-alumni-connect.onrender.com/api/v1`

### Authentication

All protected routes require JWT authentication via:
- **Cookie**: `token`
- **Header**: `Authorization: Bearer <token>`
- **Body**: `token` field

### API Endpoints

#### Student Authentication
- `POST /api/v1/student/signup` - Student registration
- `POST /api/v1/student/login` - Student login

#### Alumni Authentication
- `POST /api/v1/alumni/signup` - Alumni registration
- `POST /api/v1/alumni/login` - Alumni login

#### Opportunity Management
- `POST /api/v1/opportunities/create` - Create job opportunity (Alumni)
- `PUT /api/v1/opportunities/:opportunityId` - Update opportunity (Alumni - Owner)
- `DELETE /api/v1/opportunities/:opportunityId` - Close opportunity (Alumni - Owner)
- `GET /api/v1/opportunities` - Get all opportunities (Same college)
- `GET /api/v1/my-opportunities` - Get my posted opportunities (Alumni)

#### Application Management
- `POST /api/v1/applications/apply` - Apply for referral (Student)
- `GET /api/v1/applications/my-applications` - Get my applications (Student)
- `GET /api/v1/applications/:opportunityId` - Get applicants (Alumni - Owner)
- `PUT /api/v1/applications/:applicationId/shortlist` - Shortlist candidate (Alumni)
- `PUT /api/v1/applications/:applicationId/refer` - Provide referral (Alumni)
- `PUT /api/v1/applications/:applicationId/reject` - Reject application (Alumni)

#### Profile Management
- `GET /api/v1/student/profile` - Get student profile
- `PUT /api/v1/student/profile` - Update student profile
- `GET /api/v1/alumni/profile` - Get alumni profile
- `PUT /api/v1/alumni/profile` - Update alumni profile

#### Resume Management
- `POST /api/v1/student/resume/upload` - Upload resume (PDF)
- `GET /api/v1/student/resume` - Get resume data

For complete API documentation, see [Backend/API_REFERENCE.md](Backend/API_REFERENCE.md)

---

## �📜 Smart Contract

### Contract Overview

The NextRef smart contract is written in **Move** and deployed on **Aptos Devnet**.

**Module Address**: `nextref::nextref`

### Core Functions

#### Entry Functions (Transactions)

| Function | Role | Description |
|----------|------|-------------|
| `initialize` | Deployer | Initialize contract with verifier address |
| `register_alumni` | Alumni | Register as an alumni user |
| `submit_resume` | Student | Submit resume hash to blockchain |
| `verify_resume` | Verifier | Approve/reject student resumes |
| `create_job` | Alumni | Create new job posting |
| `apply_to_job` | Student | Apply to job (requires verification) |

#### View Functions (Read-Only)

| Function | Description |
|----------|-------------|
| `get_student` | Retrieve student data and verification status |
| `is_student_verified` | Check if student is verified |
| `get_job_applicants` | Get list of applicants for a job |
| `get_verifier` | Get verifier address |
| `is_alumni` | Check if address is registered alumni |

### Events Emitted

- `ResumeSubmitted` - When student uploads resume
- `ResumeVerified` - When verifier approves/rejects
- `JobCreated` - When alumni posts new job
- `JobApplication` - When student applies to job

### Deployment

```bash
# Navigate to contracts directory
cd Frontend/contracts

# Initialize Aptos CLI
aptos init --network devnet

# Fund your account
aptos account fund-with-faucet --account default

# Compile contract
aptos move compile --named-addresses nextref=default

# Deploy to Devnet
aptos move publish --named-addresses nextref=default

# Initialize contract
aptos move run \
  --function-id 'default::nextref::initialize' \
  --args 'address:<VERIFIER_ADDRESS>'
```

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.3.1 |
| **TypeScript** | Type Safety | 5.8.3 |
| **Vite** | Build Tool | 5.4.19 |
| **TailwindCSS** | Styling | 3.4.17 |
| **Shadcn/UI** | Component Library | Latest |
| **Framer Motion** | Animations | 12.23.26 |
| **React Router** | Navigation | 6.30.1 |
| **Tanstack Query** | State Management | 5.83.0 |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | Latest |
| **Express.js** | Web Framework | 4.18.2 |
| **MongoDB** | Database | Latest |
| **Mongoose** | ODM | 8.0.3 |
| **JWT** | Authentication | 9.0.2 |
| **Bcrypt** | Password Hashing | 5.1.1 |
| **Cloudinary** | Image Storage | 1.41.0 |
| **Axios** | HTTP Client | 1.13.2 |

### ML Service

| Technology | Purpose |
|------------|---------|
| **Python** | Programming Language |
| **Flask** | Web Framework |
| **PyPDF2** | PDF Processing |
| **Scikit-learn** | ML Algorithms |
| **Pandas** | Data Processing |
| **NumPy** | Numerical Computing |

### Development Tools

| Technology | Purpose |
|------------|---------|
| **Vite** | Fast build tool and dev server |
| **ESLint** | Code linting and quality |
| **Nodemon** | Auto-restart for backend development |

### Storage & Utilities

| Technology | Purpose |
|------------|---------|
| **MongoDB** | Primary database |
| **Cloudinary** | Image and document CDN |
| **html5-qrcode** | QR code scanning |
| **date-fns** | Date utilities |
| **zod** | Schema validation |
| **Axios** | HTTP client |
| **Validator** | Input validation |
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications
- **Recharts** - Data visualization
- **Lenis** - Smooth scrolling

---

## 📁 Project Structure

```
Alumni Connect/
├── Frontend/                  # React + TypeScript frontend
│   │
│   ├── src/
│   │   ├── Auth/              # Authentication module
│   │   │   ├── api.ts         # Auth API calls
│   │   │   ├── config.ts      # API endpoints config
│   │   │   ├── AuthContext.tsx
│   │   │   ├── hooks.ts
│   │   │   ├── storage.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── components/         # React components
│   │   │   ├── alumni/        # Alumni dashboard
│   │   │   ├── student/       # Student dashboard
│   │   │   ├── verifier/      # Verifier dashboard
│   │   │   ├── ui/            # Shadcn UI components
│   │   │   ├── Home/          # Landing page sections
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── WalletButton.tsx
│   │   │   └── QRScanner.tsx
│   │   │
│   │   ├── contexts/          # React contexts
│   │   │   ├── WalletContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   │
│   │   ├── lib/               # Utility libraries
│   │   │   ├── storage.ts     # Local storage helpers
│   │   │   ├── types.ts       # TypeScript types
│   │   │   └── utils.ts       # Utility functions
│   │   │
│   │   ├── services/          # API services
│   │   │   ├── applications.ts    # Application API calls
│   │   │   ├── externalJobs.ts    # External job integration
│   │   │   └── (other services)   # Additional API services
│   │   │
│   │   ├── pages/             # Route pages
│   │   │   ├── Index.tsx      # Main app page
│   │   │   ├── Home.tsx       # Landing page
│   │   │   └── About.tsx      # About page
│   │   │
│   │   ├── App.tsx            # App component
│   │   └── main.tsx           # Entry point
│   │
│   ├── public/                # Static assets
│   ├── package.json           # Dependencies
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.ts     # Tailwind config
│   └── .env                   # Environment variables
│
├── Backend/                   # Node.js + Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js    # MongoDB connection
│   │   │   └── cloudinary.js  # Cloudinary config
│   │   │
│   │   ├── controllers/       # Route controllers
│   │   │   ├── AlumniAuth.js
│   │   │   ├── AlumniProfile.js
│   │   │   ├── StudentAuth.js
│   │   │   ├── StudentProfile.js
│   │   │   ├── StudentResume.js
│   │   │   ├── OpportunityController.js
│   │   │   ├── ApplicationController.js
│   │   │   └── ExternalJobController.js
│   │   │
│   │   ├── middlewares/       # Express middlewares
│   │   │   └── auth.js        # JWT authentication
│   │   │
│   │   ├── models/            # Mongoose models
│   │   │   ├── AlumniModel.js
│   │   │   ├── StudentModel.js
│   │   │   ├── CollegeModel.js
│   │   │   ├── OpportunityModel.js
│   │   │   └── ApplicationModel.js
│   │   │
│   │   ├── routes/            # API routes
│   │   │   ├── AlumniAuthRoutes.js
│   │   │   ├── AlumniProfileRoutes.js
│   │   │   ├── StudentAuthRoutes.js
│   │   │   ├── StudentProfileRoutes.js
│   │   │   ├── StudentResumeRoutes.js
│   │   │   ├── OpportunityRoutes.js
│   │   │   ├── ApplicationRoutes.js
│   │   │   └── ExternalJobRoutes.js
│   │   │
│   │   ├── utils/             # Utility functions
│   │   │   ├── imageUploader.js
│   │   │   ├── tokenGenerator.js
│   │   │   └── getStringFromPdf.js
│   │   │
│   │   └── index.js           # Server entry point
│   │
│   ├── package.json           # Dependencies
│   ├── .env                   # Environment variables
│   └── API_REFERENCE.md       # API documentation
│
├── ML/                        # Python ML service
│   ├── app.py                 # Flask application
│   ├── recommend.py           # Job recommendation engine
│   ├── preprocessing.py       # Text preprocessing
│   ├── pdf_utils.py           # PDF parsing utilities
│   ├── requirements.txt       # Python dependencies
│   ├── notebooks/
│   │   └── job-recommendation.ipynb
│   └── uploads/               # Resume upload directory
│
├── README.md                  # This file
├── OPPORTUNITY_API_INTEGRATION.md
├── COMPLETE_INTEGRATION_SUMMARY.md
└── API_CONNECTION_MAP.md
```

---

## 🎯 Use Cases

### 1. Student Journey
1. Sign up with email and password
2. Select "Student" role
3. Fill profile details and upload resume (PDF)
4. Resume is uploaded to Cloudinary, metadata stored in database
5. Wait for university verifier to approve
6. Browse and apply to jobs posted by alumni
7. Track application status in dashboard
8. Generate QR code for quick verification

### 2. Verifier Journey
1. Sign in with verifier credentials
2. Review pending resume submissions
3. Verify student credentials
4. Approve or reject resumes in system
5. Track verification history and analytics

### 3. Alumni Journey
1. Sign up as alumni with email and password
2. Complete alumni profile with professional details
3. Create job postings with company and role details
4. Job stored in database, visible to verified students
5. View applicants for posted jobs
6. Shortlist, refer, or reject candidates
7. Track application pipeline and analytics
8. Edit or close job postings

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication system
- **Password Hashing** - Bcrypt encryption for all passwords
- **Role-Based Access Control** - Middleware enforces role permissions
- **HTTP-Only Cookies** - Secure token storage
- **CORS Protection** - Configured allowed origins
- **Input Validation** - Server-side validation for all inputs
- **Secure File Uploads** - Cloudinary handles file storage securely

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
cd Frontend
npm run build
# Deploy to Vercel
vercel --prod
```

### Backend Deployment (Render/Railway)

1. **Environment Variables**: Set all required env vars in your hosting platform
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Port**: Uses `process.env.PORT` or `4000`

**Current Production URL**: https://nextref-alumni-connect.onrender.com

### Database (MongoDB Atlas)

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Add to `DB_URL` in backend `.env`

### Environment Variables

Ensure all required environment variables are set in your hosting platform:
- Backend: `DB_URL`, `JWT_SECRET`, `CLOUDINARY_*` credentials
- Frontend: `VITE_API_BASE_URL`

---

## 🌐 Deployment Information

- **Backend API**: https://nextref-alumni-connect.onrender.com/api/v1
- **Frontend**: https://next-ref-alumni-connect.vercel.app
- **Database**: MongoDB Atlas (Production)
- **Storage**: Cloudinary
- **Hosting**: Render (Backend) + Vercel (Frontend)

---

## 🚧 Roadmap

### Phase 1 - Core Features ✅
- [x] Backend API with Express + MongoDB
- [x] Frontend with React + TypeScript
- [x] Authentication system (JWT)
- [x] Opportunity management (CRUD)
- [x] Application tracking system
- [x] ML-based job recommendations
- [x] Resume upload and verification
- [x] Cloudinary file storage
- [x] Role-based dashboards

### Phase 2 - Enhancements 🚀
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced analytics dashboard
- [ ] Email notification system
- [ ] Multi-file resume uploads
- [ ] Video interview integration
- [ ] Calendar integration for interviews
- [ ] Automated interview scheduling

### Phase 3 - Expansion 🌟
- [ ] Blockchain integration (optional) for credential verification
- [ ] Enhanced AI-powered resume matching
- [ ] Reputation scoring system
- [ ] Direct messaging between alumni and students
- [ ] Mobile app (React Native)
- [ ] Integration with LinkedIn/GitHub
- [ ] Referral reward system
- [ ] Company partnerships module
- [ ] Advanced analytics and reporting

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE` file for details.

---

## 🙏 Acknowledgments

- **MongoDB** - For the robust database platform
- **Cloudinary** - For reliable cloud storage
- **Shadcn/UI** - For beautiful UI components
- **Vercel** - For frontend hosting and deployment
- **Render** - For backend API hosting

---

## 📞 Support

For questions, issues, or feature requests:

- **GitHub Issues**: [Create an issue](https://github.com/Subhadipjana95/NextRef_Alumni-Connect/issues)
- **Discussions**: [Join discussions](https://github.com/Subhadipjana95/NextRef_Alumni-Connect/discussions)

### 📚 Additional Documentation

- **[Backend API Reference](Backend/API_REFERENCE.md)** - Complete API endpoint documentation
- **[Opportunity API Integration](OPPORTUNITY_API_INTEGRATION.md)** - Detailed integration guide
- **[Complete Integration Summary](COMPLETE_INTEGRATION_SUMMARY.md)** - Full feature integration status
- **[API Connection Map](API_CONNECTION_MAP.md)** - Backend-Frontend connection overview

---

## 👥 Team

<div align="center">

### **Built with ❤️ by Team CODE KINETICS⚡**

*Empowering the future of decentralized recruitment*

---

**⭐ Star this repository if you found it helpful!**

</div>
