# Clario

**Clario** is a smart, modern bookmarking platform that combines a **Chrome Extension** and a **Next.js Dashboard** to make saving, organizing, and retrieving content effortless.

Whether you’re browsing and want to save a link instantly, or sitting down to organize your collection, Clario keeps everything in sync and beautifully simple.

---

## 🌟 Features

- **Instant Bookmarking via Extension**  
  Capture links, articles, and resources directly while browsing without breaking your flow.

- **Organize into Folders**  
  Group bookmarks into folders for clean, structured organization.

- **Unified Dashboard**  
  Manage all your saved bookmarks in a responsive Next.js web app with a minimal, distraction-free UI.

- **Cross-Platform Sync**  
  Everything you save is available in both the extension and dashboard.

- **Smart Search & Filters**  
  Find bookmarks quickly by folder, tags, or location.

- **Light & Dark Mode**  
  Seamless theme switching that adapts to your preferences.

---

## 🛠️ Tech Stack

- **Extension**: Vite + React + TypeScript
- **Web Dashboard**: Next.js + Tailwind CSS + TypeScript
- **State Management**: Zustand
- **Auth**: Better Auth
- **Build System**: Turborepo + pnpm

---

## 🚀 Getting Started

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/your-username/clario.git
cd clario
```

### 2️⃣ Install Dependencies

```bash
pnpm install
```

### 3️⃣ Run the Dashboard

```bash
cd apps/web
pnpm dev
```

- Then visit: http://localhost:3000

### 4️⃣ Load the Extension

1.Build the extension:

```bash
cd apps/extension
pnpm build
```

2. Go to Chrome → Extensions → Manage Extensions.

3. Enable Developer Mode.

4. Click Load unpacked and select the dist/ folder.

🤝 Contributing

- Contributions, feedback, and ideas are welcome!

- Fork the repo

- Create a feature branch (git checkout -b feature-name)

- Commit your changes (git commit -m 'Add new feature')

- Push and open a PR 🚀
