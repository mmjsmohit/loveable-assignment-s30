# Editable React Project - Walkthrough

Welcome to the **Editable React Project**! This project is a template/sandbox designed to be edited interactively via prompt-driven AI tool calls (such as Gemini models) and viewed instantly with a live preview.

This walkthrough outlines the structure of the project, details the key files, and explains how to run, build, and work with this code.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [File Breakdown](#file-breakdown)
   - [Core Source Files (`src/`)](#core-source-files-src)
   - [Configuration & Build Files](#configuration--build-files)
4. [Running the Application](#running-the-application)
5. [How to Edit and Customize](#how-to-edit-and-customize)

---

## Project Overview

The main objective of this project is to serve as a target React application inside an educational or agentic coding environment. When users interact with an AI or code agent, the agent reads and writes files in this project directory, and the results are instantly reflected via a Vite-powered dev server.

It is structured using:
- **React 19** for UI components.
- **Vite** for incredibly fast bundler speeds and Hot Module Replacement (HMR).
- **TypeScript** for robust type checking.
- **CSS** for modern styling with customized fonts and custom properties (CSS variables).

---

## Directory Structure

Here is a quick map of the files inside this project directory:

```text
├── index.html            # Main HTML entry point
├── package.json          # Dependency list and npm scripts
├── tsconfig.json         # TypeScript compiler configuration
├── vite.config.ts        # Vite bundler configuration
└── src/
    ├── main.tsx          # React application entry point
    ├── App.tsx           # Primary React component (edit this!)
    └── styles.css        # Global CSS styles and layout definitions
```

---

## File Breakdown

### Core Source Files (`src/`)

#### 1. `src/App.tsx`
This is the root component of the React application. By default, it displays a retro-themed card describing the project.

```tsx
const features = ["Prompt-driven edits", "Live React preview", "File tools"];

export function App() {
  return (
    <main className="project-page">
      <section className="hero">
        <p className="kicker">Editable project folder</p>
        <h1>Students update this app with Gemini tool calls.</h1>
        <p className="lede">
          This is the target React project. The main assignment app should inspect these files,
          ask Gemini what to change, write updates here, and show the running preview.
        </p>
        <div className="feature-row">
          {features.map((feature) => (
            <span key={feature}>{feature}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
```
* **Customization Point:** To build a completely different app (like a dashboard, to-do list, interactive chart, or game), this is the main file to update!

#### 2. `src/styles.css`
Contains modern and striking styling featuring retro colors, grid alignments, neon backgrounds, and bold shadows:
* Custom background grid/radial gradients.
* Box-shadow styling (`14px 14px 0 #211d18`) on the `.hero` card for a distinct neo-brutalist aesthetic.
* Responsive font sizing with CSS `clamp()` and modern typography.

#### 3. `src/main.tsx`
Boots up React using the new React 19 `createRoot` API and mounts the `<App />` component into the HTML root element while enabling strict mode:
```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### Configuration & Build Files

#### 1. `index.html`
The single-page entry point that contains the `<div id="root">` where Vite mounts our React application. It loads `/src/main.tsx` as an ES module.

#### 2. `package.json`
Declares external dependencies and defines the following essential scripts:
* `npm run dev`: Starts the local dev server using Vite on port `5174` (accessible externally).
* `npm run build`: Type-checks the code with TypeScript and builds the application optimized for production.
* `npm run preview`: Hosts a local server to preview the built application.

#### 3. `vite.config.ts`
Vite configuration utilizing `@vitejs/plugin-react` to support React Fast Refresh. It configures the server port to run on `5174`.

#### 4. `tsconfig.json`
Specifies standard compiler options for modern React projects targetting ES2020 features with the bundler module resolution option.

---

## Running the Application

To install the project dependencies and start the development server, run:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open your browser to `http://localhost:5174` (or the URL printed in the terminal) to view the running app!

---

## How to Edit and Customize

This setup is ideal for fast experimentation. You or an LLM/agent can:
1. **Modify the Components:** Introduce stateful features, APIs, and modular components inside `src/App.tsx` or new subdirectories.
2. **Add Dependencies:** Need packages like Lucide icons, Tailwind, or charting libraries? Install them via `npm install` and import them right away.
3. **Change Styles:** Tweak the styling in `src/styles.css` to completely alter the aesthetic of the layout.
