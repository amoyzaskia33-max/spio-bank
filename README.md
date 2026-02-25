# NEXUS OS Auto-Vault

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

#### 1. Nexus Explorer
- File manager UI with folder tree navigation
- Categories: Frontend, Backend, AI Prompts
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
- Components: Button, Card, Input, Badge

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Icons:** Lucide React

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

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── apps/
│   │   ├── NexusExplorer.tsx
│   │   ├── CodeTerminal.tsx
│   │   └── UICanvas.tsx
│   ├── Window.tsx
│   ├── Desktop.tsx
│   ├── Taskbar.tsx
│   └── BootScreen.tsx
└── store/
    └── useOSStore.ts
```

## 🎮 Usage

1. **Boot Sequence** - Wait 1.5 seconds for the fake boot to complete
2. **Open Apps** - Click icons in the taskbar to open applications
3. **Window Management**:
   - Drag windows by the title bar
   - Double-click title bar to maximize/restore
   - Use window controls (Minimize, Maximize, Close)
   - Click a window to bring it to front
4. **Nexus Explorer** - Browse files, click to preview in Code Terminal
5. **Code Terminal** - View/copy code snippets, create new ones
6. **UI Canvas** - Preview components, toggle device sizes

## 🚀 Deployment (Dokploy)

This project is Dokploy-compatible. Standard Next.js build scripts are used:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

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

## 📄 License

Private - For internal use only
