<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sparkles.svg" alt="Knowhere Logo" width="100" />
  <h1>Knowhere</h1>
  <p><strong>The Intelligent GitHub Project Tracker & Dashboard</strong></p>

  <p>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-19-blue.svg?style=flat-square&logo=react" alt="React 19" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6-646CFF.svg?style=flat-square&logo=vite" alt="Vite" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?style=flat-square&logo=typescript" alt="TypeScript" /></a>
    <a href="https://zustand-demo.pmnd.rs/"><img src="https://img.shields.io/badge/State-Zustand-orange.svg?style=flat-square" alt="Zustand" /></a>
    <a href="https://github.com/Ares19v/Knowhere/actions"><img src="https://img.shields.io/github/actions/workflow/status/Ares19v/Knowhere/ci.yml?style=flat-square&logo=github" alt="Build Status" /></a>
  </p>
</div>

---

**Knowhere** is a state-of-the-art, 100% client-side React SPA that securely connects to your GitHub account and helps you visualize, categorize, and organize your repositories through a buttery-smooth, interactive UI.

## ✨ Features

- 🧠 **Auto-Organize Intelligence**: Uses the Google Gemini API to analyze uncategorized repositories and automatically sort them into correct folders (e.g., Frontend, Backend, AI/ML).
- 🎨 **Premium Glassmorphic UI**: Dynamic theming (Dark, Light, Cyberpunk), buttery-smooth Framer Motion transitions, and 3D parallax tilt cards.
- 🚀 **Power User Tools**: 
  - `Cmd+K` Command Palette for instant global search.
  - Multi-select bulk drag-and-drop.
  - Pin-to-top functionality for your most important work.
- 📊 **Tech Stack Analytics**: A global dashboard pie-chart breaking down your most used programming languages.
- 🛡️ **Zero Backend / Maximum Privacy**: All GitHub PATs and API keys are stored securely in your browser's local storage. Your data never leaves your machine.

---

## 🚀 Quick Start (Local Development)

The fastest way to get Knowhere running locally on your machine.

### Prerequisites
- Node.js 20+

### Installation & Launch

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Ares19v/Knowhere.git
   cd Knowhere
   \`\`\`

2. **Windows Launch (.bat Scripts)**
   Simply double-click the provided batch files:
   - Run `INSTALL.bat` to cleanly install all dependencies.
   - Run `Run_Project.bat` to start the development server and open the app in your browser.

   *(To clean your environment, run `UNINSTALL.bat`)*

3. **Standard CLI Launch**
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

---

## 🐳 Docker Deployment (Production)

Knowhere includes a professional multi-stage Docker build, serving the optimized static bundle out of an incredibly fast, lightweight Nginx web server.

### Run with Docker Compose
\`\`\`bash
docker-compose up --build -d
\`\`\`
The application will be instantly available at `http://localhost:8080`.

---

## 🔑 Initial Setup & API Keys

When you first launch Knowhere, you will be greeted by the Setup Screen. You will need:
1. **GitHub Personal Access Token (PAT)**: Requires `Read-Only` access to "Contents" and "Metadata" for all repositories. This is used to fetch your projects securely.
2. **Google Gemini API Key (Optional)**: Required only if you wish to use the "Auto-Organize" magic button.

*Note: These keys are saved directly to your local storage and are never transmitted to any third-party servers.*

---

## 📜 License



<div align="center">
  <sub>Built for organizing the chaos of development.</sub>
</div>

---
<p align="center">
  Made by Devansh Tyagi @ 2026
</p>