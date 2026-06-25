# ⚡ Tempo — Disposable Temporary Email

A sleek, **frontend-only** temporary (throwaway) email web app. Open the page and
instantly get a working disposable inbox — no sign-up, no spam, no commitment.
Use it to register on websites, grab OTPs, or test email flows while keeping your
real address private.

> 🔒 **Privacy-first** · 🚀 **Zero backend** · 🎨 **Glassmorphism UI**

![Tech](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?logo=tailwindcss&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952b3?logo=bootstrap&logoColor=white)

---

## ✨ Features

- 🎲 **Instant inbox** — a disposable address is auto-generated the moment the page loads (no registration).
- 📋 **One-click copy** — copy the address to your clipboard with a toast confirmation.
- 🔄 **New address on demand** — mint a fresh mailbox anytime with a single click.
- 📥 **Live inbox** — auto-polls for new mail every 8 seconds, plus a manual refresh.
- 📨 **Full email reader** — renders HTML emails (and plain-text fallback) in a clean glass modal.
- 🗑️ **Manage mail** — delete messages, unread indicators, sender avatars, and relative timestamps ("2m ago").
- 💾 **Survives refresh** — the mailbox is saved to `localStorage` and re-authenticated automatically on reload.
- ⌨️ **Keyboard friendly** — press `Esc` to close the email reader.
- 📱 **Fully responsive** — looks great on mobile and desktop.
- 🎨 **Sexy UI** — animated aurora background, glassmorphism cards, gradient text, and a dark theme.

---

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | React 19 |
| **Build tool / dev server** | Vite 8 |
| **Styling (primary)** | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| **UI components** | Bootstrap 5 + React-Bootstrap (toast notifications) |
| **Custom styling** | Hand-written CSS for aurora blobs, glass effect & animations |
| **Fonts** | Outfit + JetBrains Mono (Google Fonts) |
| **Email service (3rd-party API)** | [**mail.tm**](https://docs.mail.tm) — free, no API key, CORS-enabled |
| **State management** | React Hooks + a custom `useTempMail` hook |
| **Persistence** | Browser `localStorage` |
| **Linting** | Oxlint |
| **Language** | JavaScript (JSX) |

---

## 📂 Project Structure

```
temp-email-proj/
├─ index.html                 # Entry HTML (fonts, meta, root)
├─ vite.config.js             # Vite + React + Tailwind plugins
├─ src/
│  ├─ main.jsx                # App bootstrap (imports Bootstrap + Tailwind CSS)
│  ├─ App.jsx                 # Layout: header, hero, inbox, footer, toasts
│  ├─ index.css               # Tailwind import + theme & animations
│  ├─ api/
│  │  └─ mailtm.js            # mail.tm API client (domains, accounts, messages)
│  ├─ hooks/
│  │  └─ useTempMail.js       # Core logic: create/login/poll/delete inbox
│  └─ components/
│     ├─ EmailCard.jsx        # Address display + copy + "new address"
│     ├─ Inbox.jsx            # Message list (avatars, unread, time-ago)
│     ├─ MessageReader.jsx    # Full email modal (HTML/text)
│     └─ Icons.jsx            # Inline SVG icon set (no icon library)
└─ README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation & run

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev          # → http://localhost:5173

# 3. Production build
npm run build

# 4. Preview the production build
npm run preview

# 5. Lint
npm run lint
```

No `.env` or API keys are required — **mail.tm** is free and key-less.

---

## 🔌 How It Works

1. On load, the app fetches an active domain from mail.tm, then creates a random
   account (`POST /accounts`) and requests an auth token (`POST /token`).
2. The address + password are stored in `localStorage`; on refresh the app simply
   re-authenticates to restore the same inbox.
3. The inbox polls `GET /messages` every 8 seconds. Clicking a message fetches its
   full content via `GET /messages/{id}`; deleting calls `DELETE /messages/{id}`.

All of this happens **client-side** — there is no server in this project.

---

## ⚠️ Disclaimer

This is a frontend demo built on a public disposable-mail service. Messages are
**public and ephemeral** — never use this for anything sensitive, private, or
important. It's intended for sign-ups, OTPs, and testing only.

---

## 📜 License

MIT — free to use, learn from, and modify.
