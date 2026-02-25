# SPIO OS Auto-Vault

[![E2E Tests](https://github.com/amoyzaskia33-max/spio-bank/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/amoyzaskia33-max/spio-bank/actions/workflows/e2e-tests.yml)
[![CI](https://github.com/amoyzaskia33-max/spio-bank/actions/workflows/ci.yml/badge.svg)](https://github.com/amoyzaskia33-max/spio-bank/actions/workflows/ci.yml)

Web-Based Operating System Interface - Private Boilerplate Bank

## 🚀 Features

### Boot Sequence
- Fake terminal loading screen (1.5 seconds)
- Authentic boot logs before transitioning to Desktop

### Desktop Environment
- Full-screen canvas with dark, high-tech aesthetic
- Subtle glowing grid background
- Taskbar/Dock at the bottom

### Window Manager
- Draggable windows with Framer Motion
- Constrained to screen bounds
- Window controls: Close (X), Maximize, Minimize
- Z-index sorting (click to bring to front)

### Core Applications

#### 1. SPIO Explorer
- File manager UI with folder tree navigation
- Categories: Frontend, Backend, Prompts
- Click files to preview content
- Opens code snippets in Code Terminal

#### 2. Code Terminal
- Raw code snippets viewer
- Copy to clipboard functionality
- Create new snippets
- Delete snippets
- Language indicators (TS, TSX, JS, JSX)

#### 3. UI Canvas
- Live component previews
- View code snippets
- Responsive device preview (Full, Tablet, Mobile)
- Toggle between Preview and Code view
- Components: Button, Card, Input, Badge, Modal, Alert Banner, Skeleton Loader

### SPIO Librarian
- Auto-sync boilerplate components
- Drop files in `vault/raw-experiments/`
- Run `npm run sync-vault`
- Components automatically added to registry

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Icons:** Lucide React
- **Testing:** Playwright (E2E)
- **CI/CD:** GitHub Actions

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run E2E tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run tests in headed mode
npm run test:e2e:headed

# View test report
npm run test:e2e:report
```

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── apps/
│   │   ├── SpioExplorer.tsx
│   │   ├── CodeTerminal.tsx
│   │   └── UICanvas.tsx
│   ├── Window.tsx
│   ├── Desktop.tsx
│   ├── Taskbar.tsx
│   └── BootScreen.tsx
├── data/
│   └── spio-registry.tsx
└── store/
    └── useOSStore.ts
```

## 🤖 SPIO Librarian

Automated boilerplate entry system:

```bash
# Sync new components
npm run sync-vault

# Deploy (sync + build)
npm run deploy
```

### Usage:
1. Drop `.tsx`, `.ts`, `.js`, `.txt` files in `vault/raw-experiments/`
2. (Optional) Add frontmatter for metadata
3. Run `npm run sync-vault`
4. Components appear in SPIO Explorer

## 🚀 Deployment (Dokploy)

This project is Dokploy-compatible:

1. Connect GitHub repo to Dokploy
2. Build command: `npm run build`
3. Start command: `npm start`
4. Auto-deploy on push

## 📊 Test Coverage

- **38 E2E Tests** - 100% pass rate
- Boot Sequence (4 tests)
- Window Manager (5 tests)
- SPIO Explorer (7 tests)
- Code Terminal (7 tests)
- UI Canvas (10 tests)
- Librarian Integration (5 tests)

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run sync-vault` | Sync vault components |
| `npm run deploy` | Sync + Build |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:e2e:headed` | Run tests with browser |
| `npm run test:e2e:report` | View HTML report |

## 🎨 Design System

### Colors
- Background: Deep black with subtle grid
- Accent: Green (#00ff88)
- Borders: White with varying opacity

### Typography
- Font: System fonts (-apple-system, BlinkMacSystemFont, etc.)
- Monospace: For code blocks

### Animations
- Window open/close: Scale + opacity fade
- Drag: Smooth with Framer Motion
- Hover effects: Scale and glow

## 📄 Documentation

- [README.md](README.md) - This file
- [LIBRARIAN.md](docs/LIBRARIAN.md) - Librarian usage guide

## 🔗 Links

- **GitHub:** https://github.com/amoyzaskia33-max/spio-bank
- **Actions:** https://github.com/amoyzaskia33-max/spio-bank/actions

## 📄 License

Private - For internal use only
