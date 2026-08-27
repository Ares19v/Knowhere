<div align="center">

<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sparkles.svg" alt="Knowhere Logo" width="80" />

# Knowhere
### Intelligent GitHub Project Intelligence & Portfolio Tracker

[![CI](https://github.com/Ares19v/Knowhere/actions/workflows/ci.yml/badge.svg)](https://github.com/Ares19v/Knowhere/actions/workflows/ci.yml)


[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-Enabled-8E75C2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

<p align="center">
  <b>A real-time GitHub telemetry cockpit and intelligent project dashboard. Track repository commit velocity, automated CI/CD pipeline health, issue resolution times, and generate AI-powered repository summaries with Google Gemini.</b>
</p>

</div>

---

## ?? Overview

**Knowhere** is a developer intelligence dashboard designed to monitor and organize sprawling software ecosystems. By integrating GitHub REST and GraphQL APIs with client-side reactive charts and optional Google Gemini AI synthesis, Knowhere turns chaotic git histories into structured, actionable engineering insights.

---

## ? Key Features

- **?? Real-Time Commit & Velocity Tracking**: Visual commit heatmaps, language distribution breakdowns, and branch activity timelines.
- **?? AI Repository Summarizer**: Integrated `@google/generative-ai` SDK generates executive release notes and changelog recaps from recent commits.
- **? 3D Parallax Interface**: Interactive repository cards with 3D tilt effects (`react-parallax-tilt`), quick search palettes (`cmdk`), and smooth Framer Motion layout transitions.
- **?? Multi-Stage Docker Containerization**: Pre-configured Alpine Nginx container ready for instant production deployment with `docker-compose.yml`.
- **? Windows Launcher Scripts**: Includes `INSTALL.bat`, `Run_Project.bat`, and `UNINSTALL.bat` for seamless local setup.

---

## ??? Tech Stack & Directory Structure

```
Knowhere/
??? src/
?   ??? assets/             # Vector icons and hero graphics
?   ??? components/         # Repository cards, AI summarizer modal, commit charts
?   ??? store.ts            # Zustand global state store
?   ??? App.tsx             # Main dashboard layout
?   ??? main.tsx            # Application bootstrap
??? public/                 # Favicons and manifest assets
??? Dockerfile              # Production multi-stage Nginx container
??? docker-compose.yml      # Docker compose configuration
??? INSTALL.bat             # Windows one-click installation script
??? Run_Project.bat         # Windows automated launcher
??? package.json            # Project dependencies and build scripts
```

---

## ?? Quick Start

### 1. Local Development

```bash
# Clone the repository
git clone https://github.com/Ares19v/Knowhere.git
cd Knowhere

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

### 2. Docker Compose Deployment

```bash
docker compose up -d --build
```
Access Knowhere at `http://localhost:80` (or `http://localhost:5173` in development mode).

---

© 2025 Devansh Tyagi (Ares19v). All Rights Reserved.

Unauthorized copying, modification, distribution, or use of this project or any of its components, in whole or in part, without explicit written permission from the author is strictly prohibited.