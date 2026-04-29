# Knowhere 🌌

<div align="center">
  <img src="public/favicon.svg" alt="Knowhere Logo" width="120" />
  <br/>
  <h3>An Intelligent, Client-Side GitHub Project Tracker</h3>
  <p>Seamlessly visualize, categorize, and auto-organize your GitHub repositories with a buttery-smooth UI.</p>
</div>

---

## 🚀 Features

- **Premium UI/UX:** Built with a glassmorphic design system, dynamic themes (Dark, Light, Cyberpunk), and 3D card tilt effects.
- **Auto-Organize Intelligence:** Leverages the Google Gemini API to read your uncategorized repositories and automatically sort them into the correct buckets (Frontend, Backend, AI/ML, etc.).
- **Zero Backend Footprint:** 100% Client-Side Architecture. Your API keys and categories are stored securely in your browser's Local Storage.
- **Power User Mechanics:** 
  - `Cmd+K` Command Palette for lightning-fast navigation.
  - Multi-select bulk drag-and-drop.
  - Pin-to-top functionality for your favorite projects.
- **Tech Stack Analytics:** Instantly view a breakdown of your most used programming languages.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Custom CSS Variables (No Tailwind)
- **State Management:** Zustand (with persist middleware)
- **Animations:** Framer Motion, React Parallax Tilt
- **Icons & Visuals:** Lucide React, Recharts
- **AI Integration:** `@google/generative-ai`

## ⚙️ Quick Start (Local)

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/Ares19v/Knowhere.git
   cd Knowhere
   \`\`\`

2. **Install dependencies & Run:**
   Simply double click the provided batch files on Windows:
   - Run `INSTALL.bat`
   - Run `Run_Project.bat`

   *Alternatively, run `npm install` and `npm run dev` in your terminal.*

3. **Setup:**
   Open the application in your browser. You will be greeted by the secure Setup Screen. Paste your GitHub Personal Access Token (and optional Gemini API Key) directly into the UI.

## 🐳 Docker Deployment

For a production-grade containerized deployment using Nginx:

\`\`\`bash
docker-compose up --build -d
\`\`\`
The application will be served at `http://localhost:8080`.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
