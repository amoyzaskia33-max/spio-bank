# SPIO Intelligence - AI Integration Guide

Phase 4: Connecting the Web Terminal to the VPS AI Backend

## 🎯 Overview

SPIO Intelligence enables AI-powered code generation directly from the SPIO OS interface. Users can describe what they want to create, and the AI will generate the code, save it to the vault, and automatically sync it to the registry.

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  SPIO Frontend  │────▶│  FastAPI Backend │────▶│  AI Model       │
│  (Code Terminal)│     │  (Port 8000)     │     │  (Ollama/Qwen)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Vault Writer    │
                       │  (raw-experiments)│
                       └──────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Librarian       │
                       │  (sync-vault)    │
                       └──────────────────┘
```

## 📦 Backend Setup

### 1. Install Python Dependencies

```bash
cd 2-backend-vault
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your settings
SPIO_API_KEY=your-secret-key
AI_API_URL=http://localhost:11434/api/generate
AI_MODEL=qwen2.5-coder:7b
```

### 3. Install Ollama (for local AI)

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows: Download from https://ollama.com

# Pull Qwen2.5-Coder model
ollama pull qwen2.5-coder:7b
```

### 4. Run Backend Server

```bash
cd 2-backend-vault
python main.py
```

Server will start at: `http://localhost:8000`

## 🖥️ Frontend Setup

### 1. Configure Environment

```bash
# In project root, create .env.local
NEXT_PUBLIC_SPIO_API_URL=http://localhost:8000
NEXT_PUBLIC_SPIO_API_KEY=spio-secret-key-2024
```

### 2. Restart Next.js Dev Server

```bash
npm run dev
```

## 🎮 Using SPIO Intelligence

### Interactive Mode

1. **Open Code Terminal** from the taskbar
2. **Click the Sparkles icon** (✨) to enable Interactive Mode
3. **Type your request**, e.g.:
   - "Create a glassmorphism login form"
   - "Make an animated button with hover effects"
   - "Generate a responsive navbar component"
4. **Press Enter** or click Send
5. **Wait for AI** to generate code (shows "SPIO is thinking...")
6. **Code is auto-saved** to vault and synced to registry

### The Golden Loop

```
User types prompt
    ↓
AI generates code
    ↓
Backend saves to /vault/raw-experiments
    ↓
Backend triggers `npm run sync-vault`
    ↓
Librarian adds to spio-registry.tsx
    ↓
Component appears in SPIO Explorer ✅
```

## 📡 API Endpoints

### POST /v1/generate

Generate code from a prompt.

**Request:**
```json
{
  "prompt": "Create a glassmorphism login form",
  "language": "tsx",
  "category": "Frontend"
}
```

**Response:**
```json
{
  "success": true,
  "code": "export function LoginForm() {...}",
  "filename": "glassmorphism_login_form_20240225_143022.tsx",
  "filepath": "/vault/raw-experiments/glassmorphism_login_form_20240225_143022.tsx",
  "message": "Successfully generated glassmorphism_login_form_20240225_143022.tsx"
}
```

### POST /v1/chat

Chat with AI for code generation.

**Request:**
```json
{
  "message": "Create a button component"
}
```

**Response:**
```json
{
  "success": true,
  "response": "✅ Generated button_component_20240225_143022.tsx and saved to vault!",
  "code_generated": true,
  "filepath": "/vault/raw-experiments/button_component_20240225_143022.tsx"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "ai_model": "qwen2.5-coder:7b",
  "ai_api_url": "http://localhost:11434/api/generate",
  "vault_path": "../vault/raw-experiments"
}
```

## 🔒 Security

### API Key Authentication

All endpoints require Bearer token authentication:

```bash
curl -X POST http://localhost:8000/v1/generate \
  -H "Authorization: Bearer spio-secret-key-2024" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a button"}'
```

### Environment Variables

Never commit `.env` files:
- `.env` (backend) - GitIgnored
- `.env.local` (frontend) - GitIgnored

## 🛠️ Troubleshooting

### Backend won't start

```bash
# Check Python version (need 3.8+)
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### AI not responding

```bash
# Check Ollama is running
ollama list

# Test Ollama directly
ollama run qwen2.5-coder:7b "Hello"

# Check AI_API_URL in .env
```

### Code not appearing in Explorer

```bash
# Manually trigger sync
npm run sync-vault

# Check vault/raw-experiments for the file
ls vault/raw-experiments

# Check for errors in librarian output
```

### CORS errors

Update `main.py` CORS settings:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📊 Example Session

```
User: "Create a glassmorphism login form"

SPIO AI: 👋 Generating code...
         💾 Saved to: glassmorphism_login_form_20240225_143022.tsx
         🔄 Triggering sync-vault...
         ✅ Code generated and saved to vault!

[Backend logs]
🤖 Generating code for: Create a glassmorphism login form
💾 Saved to: /vault/raw-experiments/glassmorphism_login_form_20240225_143022.tsx
🔄 Triggering sync-vault...
🤖 SPIO OS Librarian - Starting...
📂 Found 1 new file(s)
📄 Processing: glassmorphism_login_form_20240225_143022.tsx
✨ Added to registry: Glassmorphism Login Form (Frontend)
📁 Archived: glassmorphism_login_form_20240225_143022.tsx
```

## 🚀 Production Deployment

### VPS Setup

1. **Install Ollama on VPS:**
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ollama pull qwen2.5-coder:7b
   ```

2. **Run Backend with systemd:**
   ```bash
   sudo nano /etc/systemd/system/spio-backend.service
   ```

   ```ini
   [Unit]
   Description=SPIO OS Backend API
   After=network.target

   [Service]
   User=www-data
   WorkingDirectory=/path/to/spio-bank/2-backend-vault
   ExecStart=/usr/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

3. **Enable and start:**
   ```bash
   sudo systemctl enable spio-backend
   sudo systemctl start spio-backend
   sudo systemctl status spio-backend
   ```

4. **Update frontend .env.local:**
   ```
   NEXT_PUBLIC_SPIO_API_URL=https://api.your-domain.com
   ```

## 📝 Files Created

| File | Purpose |
|------|---------|
| `2-backend-vault/main.py` | FastAPI backend |
| `2-backend-vault/requirements.txt` | Python dependencies |
| `2-backend-vault/.env` | Backend configuration |
| `.env.local` | Frontend API config |
| `src/components/apps/CodeTerminal.tsx` | Upgraded with Interactive Mode |

## 🎯 Next Steps

1. Start backend: `cd 2-backend-vault && python main.py`
2. Start frontend: `npm run dev`
3. Open SPIO OS in browser
4. Click Code Terminal → Sparkles icon
5. Type: "Create a button with gradient"
6. Watch the Golden Loop in action! 🎉
