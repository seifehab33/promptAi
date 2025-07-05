# 🧠 PromptSmith

**PromptSmith** is a full-stack AI prompt engineering platform that allows developers, marketers, and prompt creators to design, test, manage, and share prompts across multiple AI models like **OpenAI's ChatGPT** and **Anthropic's Claude** **Gork** **DeepSeek** — all in one place.

> Designed as a professional-grade portfolio project demonstrating advanced full-stack architecture, AI API integration, and modern developer tooling.

---

## 🚀 Features

### 🛠 Prompt Editor
- Rich editor with Markdown/code support
- Prompt templates and version history

### 🧪 Prompt Testing
- Send prompts to multiple models (ChatGPT, Claude, etc.)
- View side-by-side responses (A/B testing)

### 📚 Prompt Library
- Organize prompts by tags, use case, and model
- Full-text search and filters

### 🌍 Prompt Sharing & Community
- Share prompts publicly to the community
- Users can like and view shared prompts

### 👥 Authentication & Dashboards
- JWT-based auth system (Register/Login)
- Personal dashboards



---

## 🧱 Tech Stack

### 🔧 Backend (NestJS)
- **NestJS** – Modular backend framework
- **TypeORM** – Database ORM
- **MySQL** – Relational database
- **JWT** – Authentication (access & refresh tokens)
- **Axios** – Outbound API calls to OpenAI & Anthropic
- **Environment Config** – `.env` support for API keys and DB config

### 🎨 Frontend (Next.js)
- **Next.js (App Router)** – React-based frontend framework
- **Tailwind CSS** – Utility-first styling
- **shadcn/ui** – Modern, accessible UI components
- **Lucide React** – Icon system
- **TanStack Query (React Query)** – API state management
- **Axios** – HTTP client for frontend/backend communication
- **Sonner** – Toast notifications

---

## ⚙️ Setup & Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/promptsmith.git
cd promptsmith
