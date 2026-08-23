# 🎨 Knowhere Study Guide (From-Scratch)

Welcome to the beginner's learning guide for **Knowhere**, an intelligent GitHub project tracker & dashboard. In this guide, you will learn how modern React development, global state management, local privacy patterns, and Generative AI work together.

---

## 🗺️ Architectural Map

Knowhere is a **100% client-side Single Page Application (SPA)**. It does not require a server, database, or backend API of its own.

```
┌─────────────────────────────────────────────────────────┐
│              User Browser (Local Storage)               │
│  - GitHub Personal Access Token (PAT)                   │
│  - Google Gemini API Key                                │
│  - User-Created Folders, Pins, Theme Settings           │
└────────────┬──────────────────────────────┬─────────────┘
             │ Reads / Writes               │ Dynamic API Requests
┌────────────▼─────────────┐   ┌────────────▼─────────────┐
│  Zustand Store           │   │  GitHub REST API         │
│  - Local state engine    │   │  - Fetches repository    │
│  - Feeds dashboard cards │   │    list and statistics   │
└──────────────────────────┘   └──────────────────────────┘
             │ Auto-Organize Magic
┌────────────▼─────────────┐
│  Google Gemini API       │
│  - gemini-1.5-flash      │
│  - Classifies projects   │
└──────────────────────────┘
```

---

## 🔑 Core Technologies

Let's break down the technologies that make Knowhere unique:

### 1. Zustand (State Management)
Instead of passing variables down through multiple components (prop drilling), Knowhere uses **Zustand**. 
*   **What it is**: A small, fast, and simple state management library for React.
*   **How it works**: A centralized `store.ts` file holds variables (repositories, categories, pinned repos) and functions (`fetchRepositories`, `updateRepoCategory`). Every component can subscribe to exactly what it needs, keeping the app fast and updates reactive.

### 2. Google Gemini API (`gemini-1.5-flash`)
When you click **Auto-Organize**:
1.  The app collects all repositories in your **Uncategorized** list.
2.  It strips out heavy files and creates a minimal package of metadata: `name`, `description`, `language`, and `topics`.
3.  It calls Gemini, asking it to classify each repository into one of your custom folders (e.g. Frontend, Backend, AI/ML).
4.  Gemini returns a clean JSON array, and the UI dynamically moves the cards into their new folders!

### 3. Glassmorphic UI & 3D Interactive Polish
*   **Glassmorphism**: Styling using transparent layers with `backdrop-filter: blur()` to create elegant "glass" cards.
*   **Framer Motion**: Smooth entry, exit, and list reordering animations when repos are dragged or pinned.
*   **React Parallax Tilt**: Creates 3D depth by tilting repo cards towards your mouse cursor as you hover over them.

---

## 🛠️ Step-by-Step Local Deployment

### 1. One-Click Setup (Windows)
*   **Install**: Double-click `INSTALL.bat` to download packages via `npm install`.
*   **Run**: Double-click `Run_Project.bat` to compile the Vite server and open `http://localhost:5173`.
*   **Uninstallation**: Run `UNINSTALL.bat` to clear the `node_modules` folder and clean the workspace.

### 2. Manual Terminal Setup
If you want to run it via CLI:
```bash
# Install NPM modules
npm install

# Start Vite hot-reloading dev server
npm run dev
```
Open `http://localhost:5173` in your browser!

### 3. Access Keys
To fully experience the application:
1.  Generate a **GitHub Personal Access Token (PAT)** from your GitHub Developer Settings with `read-only` access to repositories.
2.  Grab a free **Google Gemini API Key** from Google AI Studio.
3.  Input them on the setup screen. They are saved entirely in your local browser storage — nothing is sent to external servers!
