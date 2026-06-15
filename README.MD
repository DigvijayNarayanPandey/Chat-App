# 💬 Chatty - A Real-Time Chat Application

A premium, modern full-stack real-time chat application engineered with React, Node.js, Express, Socket.io, MongoDB, and Tailwind CSS. Featuring custom JWT authentication, transactional welcome emails, Cloudinary-powered image sharing, interactive auditory micro-cues, and enterprise-grade security middleware.

![App Demo Screen](/frontend/public/image.png)

---

## ✨ Key Features

- **🔐 Custom JWT Authentication**: Robust cookie-based session management utilizing JSON Web Tokens with secure tokens and refresh logic.
- **⚡ Real-Time Messaging**: Immersive, instant communication powered by Socket.io, featuring real-time typing indicators, online/offline status, and message synchronization.
- **🎨 Glassmorphic & Modern UI**: A responsive interface built on React and styled with Tailwind CSS & DaisyUI, supporting theme-matching, layout transitions, and high-fidelity components.
- **🔊 Auditory Micro-Interactions**: Custom keyboard typing sounds, mouse click sounds, and notification chimes that users can toggle directly from the settings.
- **📨 Welcome Emails**: Automatic dispatch of customized HTML welcome emails via Resend API when new users register.
- **🗂️ Media & Image Uploads**: Direct profile and message image sharing integrated with Cloudinary for fast hosting and optimization.
- **🛡️ Enterprise Security**: Integrated rate limiting, bot protection, and attack prevention powered by Arcjet middleware, along with secure CORS policies.

---

## 🛠️ Technology Stack

| Frontend | Backend | Devops & Security |
| :--- | :--- | :--- |
| **React 18** (Vite) | **Node.js** & **Express** | **Arcjet** (Rate limiting, Bot protection) |
| **Tailwind CSS** & **DaisyUI** | **Socket.io** (WebSockets) | **Cloudinary API** (Media CDN) |
| **Zustand** (State Management) | **MongoDB** & **Mongoose** | **Resend API** (Transactional Email) |
| **Lucide React** (Icons) | **JSON Web Tokens (JWT)** | **CORS** & **Helmet** (Security Headers) |
| **Axios** (HTTP Client) | **Bcryptjs** (Password hashing) | **Cookie-Parser** (Secure Session Cookies) |

---

## 📂 Project Structure

```
Chat-App/
├── backend/                # Express server and WebSocket controllers
│   ├── src/
│   │   ├── controllers/    # Request handlers (auth, messages)
│   │   ├── emails/         # Resend email templates & handlers
│   │   ├── lib/            # Shared utilities (database, cloudinary, arcjet)
│   │   ├── middleware/     # Security, rate limiters, auth filters
│   │   ├── models/         # MongoDB schemas (User, Message)
│   │   ├── routes/         # Express router endpoints
│   │   └── server.js       # Main server entrypoint
│   └── .env.example
├── frontend/               # React client application (Vite-based)
│   ├── public/             # Static assets, local MP3 sound cues
│   ├── src/
│   │   ├── components/     # UI elements (chat container, lists, skeletons)
│   │   ├── hooks/          # Custom hooks (e.g. keyboard sounds)
│   │   ├── lib/            # Axios instance configuration
│   │   ├── pages/          # Application views (Chat, Login, Signup)
│   │   ├── store/          # Zustand global state stores (auth, chat)
│   │   ├── App.jsx         # App router and layout setup
│   │   └── index.css       # Tailwind base styles and custom utilities
│   └── .env.example
├── package.json            # Workspace orchestration script
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20 or higher)
- **npm** (v10 or higher)
- **MongoDB** (Local instance or Atlas URI)

### 1. Repository Setup

Clone this repository and navigate to the project directory:

```bash
git clone https://github.com/DigvijayNarayanPandey/Chat-App.git
cd Chat-App
```

### 2. Environment Configuration

You will need to configure environment variables for both the frontend and backend.

#### Backend (`/backend/.env`)

Create a `.env` file inside the `backend` folder and populate it with your credentials:

```ini
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=your_mongodb_connection_string

# Authentication Secrets
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key

# Cloudinary Setup (Image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Resend Setup (Email dispatch)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME="Chatify Team"

# Security (Arcjet Integration)
ARCJET_KEY=your_arcjet_api_key
ARCJET_ENV=development

# Client URL (Allowed origins for CORS)
CLIENT_URL=http://localhost:5173
```

#### Frontend (`/frontend/.env`)

Create a `.env` file inside the `frontend` folder and reference your backend URL:

```ini
VITE_API_URL=http://localhost:3000
```

---

## 🏃 Run the Application

You can spin up the application either by installing dependencies in each workspace or by using the orchestrator scripts.

### Option A: Independent Workspaces (Recommended for Dev)

#### Run the Backend:
```bash
cd backend
npm install
npm run dev
```

#### Run the Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Option B: Monorepo Scripts

Install dependencies and build assets from the root workspace directory:

```bash
# Build production bundle
npm run build

# Start the application
npm start
```

---

## 🛡️ Production Checklist

Before preparing this application for a live deployment, review the comprehensive checklist to verify:
- Secure database connections and automated backups.
- Hardened security headers and CORS configurations.
- Arcjet production environments and correct rate-limiting limits.
- Optimized static assets and CDN caching.
