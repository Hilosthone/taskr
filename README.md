# 🚀 Taskr — Modern Project & Task Management Platform

**Taskr** is a high-performance, collaborative workspace application designed for modern software, product, and engineering teams. Built with Next.js, React, Tailwind CSS, Framer Motion, and TypeScript, Taskr delivers a fast, responsive glassmorphic UI integrated with an OpenAPI 3.0 specification compliant REST API.

---

## ✨ Features

### 🔐 Authentication & Security
- **Email & Password Auth**: Separate First/Last Name inputs, real-time password strength indicators, match validation, and eye toggle visibility controls.
- **Google OAuth2 Integration**: One-click OAuth login and onboarding.
- **JWT Authentication**: Secure token handling stored in local state/storage with automatic authorization headers.

### 💼 Project Workspaces
- **Workspace Dashboard**: Overview of active, planning, on-hold, and completed projects with dynamic completion progress indicators.
- **Multi-View Task Management**: Toggle seamlessly between visual drag-and-drop Kanban boards and detailed list/table views.
- **Filtering & Search**: Search project workspace titles and filter tasks by status (`Working on it`, `Done`, `Stuck`), assignment, or creation dates.

### 👥 Team Collaboration & Roles
- **Granular Permissions**: Assign team roles (`Project Manager`, `Member`, `Viewer`) to control access within workspaces.
- **Scheduled Invitations**: Draft, schedule, send, or reschedule team invitation emails with tokenized acceptance flows.
- **Data Protection**: Soft-delete mechanisms (`PATCH`-driven) for archiving projects and tasks safely without accidental data loss.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom glassmorphic utilities
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: Axios / Fetch API connected to Taskr OpenAPI 3.0 backend

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local environment:
- **Node.js** v18.0.0 or higher
- **npm**, **pnpm**, or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hilosthone/taskr-frontend.git
   cd taskr-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://taskr-api.up.railway.app
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Folder Structure

```text
.
├── app/
│   ├── (app)/
│   │   ├── dashboard/          # Workspace overview
│   │   └── projects/           # Project workspace management
│   ├── (auth)/
│   │   ├── login/              # Login route with eye toggle & alert banners
│   │   └── signup/             # Signup route with strength meter & match check
│   ├── layout.tsx              # Root Layout with dark mode & dynamic metadata
│   ├── page.tsx                # Landing Page with interactive preview & pricing
│   └── globals.css             # Tailwind configuration & glassmorphism classes
├── components/
│   ├── landing/                # Navbar, Features, Pricing sections
│   ├── projects/               # Project cards, modal dialogs, filter bars
│   └── shared/                 # Ambient background effects & global components
├── lib/
│   └── api.ts                  # Axios instances and REST API service handlers
└── public/                     # Static assets and favicon files
```

---

## 🎨 Design System

Taskr utilizes a custom dark glassmorphic design system defined in `globals.css`:

```css
:root {
  --color-taskr-dark: #0B0F19;
  --color-taskr-surface: #151C2C;
  --color-taskr-blue: #2563EB;
  --color-taskr-purple: #7C3AED;
  --color-taskr-done: #10B981;
  --color-taskr-working: #3B82F6;
  --color-taskr-stuck: #EF4444;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.