# EVAL — Knowhere

> **Evaluation Date:** 2026-05-29  
> **Evaluator:** Automated Portfolio Review  
> **Maturity Level:** Production-Ready / Advanced MVP

---

## 1. Project Purpose & Problem Statement

Developers, agency leaders, and hiring managers often struggle with GitHub repository sprawl. With dozens of repositories spanning different tech stacks (Frontend, Backend, AI/ML), there is a lack of clean, visually engaging, and privacy-preserving organization dashboards.

**Knowhere** is a 100% client-side React single-page application (SPA) that acts as an intelligent workspace companion for GitHub. It securely pulls a user's repositories, integrates with the **Google Gemini API** (using `gemini-1.5-flash`) for automated semantic classification of uncategorized codebases, and provides full drag-and-drop categorization capabilities. It maintains high privacy by storing all GitHub Personal Access Tokens (PATs) and Gemini keys locally in the browser (`localStorage`), eliminating the need for a database or backend server.

---

## 2. Technical Architecture & Tech Stack

*   **Core UI:** React 19 + TypeScript 5.x.
*   **Build Tooling & Server:** Vite 6 + Nginx Alpine (Multi-stage Docker).
*   **State Management:** Zustand (providing lightweight, reactive global state synchronized with browser `localStorage`).
*   **Styling & Animations:** Premium Glassmorphic UI with dynamic variables supporting Light, Dark, and Cyberpunk themes, fluid transitions handled by Framer Motion, and 3D parallax hover cards powered by `react-parallax-tilt`.
*   **Power User Tools:**
    *   `Cmd+K` global command palette (powered by `cmdk`) for keyboard-driven folder navigation and project search.
    *   Standard browser multi-select (`Shift + Click`) bulk drag-and-drop folder assignments.
    *   Top-level "Needs Love" warning logs identifying repositories lacking descriptions or documentation.
    *   Tech Stack analytics using `recharts` to render interactive global programming language breakdowns.

---

## 3. Core ML Models & Integration

*   **API Backbone:** Google Generative AI Client SDK (`@google/generative-ai`).
*   **Model Tier:** `gemini-1.5-flash` (via REST API).
*   **Prompt Pipeline:** Prepares a minimized repository JSON metadata package containing the project's `name`, `description`, `language`, and `topics` to preserve context windows and reduce token costs. It requests a strictly formatted JSON array payload matching uncategorized projects directly against user-configured workspace directories.
*   **Local Storage Integration:** The user's Gemini API key is securely saved on-device (`localStorage.getItem('geminiToken')`), bypassing backend exposure risks.

---

## 4. Strengths

*   **Excellent Local Privacy Model:** Storing credentials exclusively inside the user's browser `localStorage` completely avoids hosting/data leakage liabilities and backend operational costs.
*   **Power-User UI polish:** The combination of `cmdk` command palettes, bulk multi-select, Framer Motion, and 3D card tilt provides a highly engaging desktop-app-like experience.
*   **Containerized Production Model:** The multi-stage Docker build encapsulates Vite and outputs an extremely small static build inside an Nginx Alpine container, making self-hosting trivial.
*   **Intelligent Heuristic Flags:** "Needs Love" flag highlights missing documentation proactively, serving as a useful developer checklist.

---

## 5. Limitations & Technical Debt

*   **Rate Limits and Token Usage:** Huge GitHub accounts with hundreds of repositories might exceed Gemini API payload sizes or run into rate limits during batch "Auto-Organize" operations.
*   **Client-Side Storage Sync Risks:** Clear-site-data browser operations will completely wipe the user's categories, folders, pinned states, and tokens unless manual JSON backup methods are built.
*   **Static Category Bounds:** While custom categories can be created, the classification engine relies on hardcoded semantic rules within the system prompt to guide Gemini's behavior.

---

## 6. Code Quality Assessment

*   **Structure:** Extremely clean structure. The Zustand store manages all states (`store.ts`) with side-effect calls (`fetchRepositories`) beautifully, minimizing file coupling.
*   **Modularity:** Distinct Setup and Dashboard view layouts. Custom folder logic uses clear, zero-dependency helper scripts (`utils/autoOrganize.ts`).

---

## 7. Maturity Breakdown

| Dimension | Score | Notes |
|-----------|-------|-------|
| Functionality | 9/10 | Seamless drag-and-drop, automated LLM categorization, command palettes, Recharts. |
| Code Quality | 9/10 | Exceptional react 19/TS patterns, beautiful Zustand store structure. |
| Documentation | 8/10 | Comprehensive setup, API explanations, Docker guides, and local launch scripts. |
| Scalability | 7/10 | Limited by local storage size limits (~5MB) and LLM token payload restrictions. |
| Security | 9/10 | 100% client-side privacy model; no remote database exposure. |
| **Overall** | **8.4/10** | Genuinely useful and high-fidelity Git client experience. Extremely close to SaaS-ready. |

---

## 8. Suggested Next Steps

1.  **Build Category Import/Export Backups:** Provide a one-click "Backup Configuration" option that downloads categories, custom rules, and pins to a local `knowhere-config.json` file.
2.  **Add Batch LLM Pagination:** Process Auto-Organize collections in smaller, segmented chunks (e.g., 20 repositories at a time) to prevent Gemini timeout and token limits.
3.  **Incorporate GitHub API Writing:** Enable users to sync local categories back to GitHub by programmatically creating repository topics based on assigned folders.

---
<p align="center">Made by Devansh Tyagi @ 2026</p>
