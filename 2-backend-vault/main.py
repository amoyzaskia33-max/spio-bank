"""
SPIO OS Backend API
AI Integration for Code Generation
"""

from fastapi import FastAPI, HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import os
import asyncio
import httpx
import aiofiles
from datetime import datetime
import subprocess

# ============================================
# CONFIGURATION
# ============================================

API_KEY = os.getenv("SPIO_API_KEY", "spio-secret-key-2024")
AI_API_URL = os.getenv("AI_API_URL", "http://localhost:11434/api/generate")  # Ollama default
AI_MODEL = os.getenv("AI_MODEL", "qwen2.5-coder:7b")
VAULT_PATH = os.getenv("VAULT_PATH", "../vault/raw-experiments")

# ============================================
# FASTAPI APP
# ============================================

app = FastAPI(
    title="SPIO OS Backend API",
    description="AI-powered code generation backend for SPIO OS Auto-Vault",
    version="1.0.0"
)

# CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://your-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# ============================================
# MODELS
# ============================================

class GenerateRequest(BaseModel):
    prompt: str = Field(..., description="User's code generation prompt")
    language: Optional[str] = Field("tsx", description="Target language (tsx, ts, js, jsx, md)")
    category: Optional[str] = Field("Frontend", description="Component category")

class GenerateResponse(BaseModel):
    success: bool
    code: Optional[str] = None
    filename: Optional[str] = None
    filepath: Optional[str] = None
    message: str
    error: Optional[str] = None

class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    success: bool
    response: str
    code_generated: Optional[bool] = False
    filepath: Optional[str] = None

# ============================================
# HELPER FUNCTIONS
# ============================================

async def call_ai_model(prompt: str) -> str:
    """
    Call the local AI model (Ollama/Qwen) to generate code
    """
    system_prompt = """You are SPIO OS AI - an expert code generator.
Generate clean, production-ready React/TypeScript code.
Always include proper imports, types, and exports.
Use Tailwind CSS for styling.
Use Framer Motion for animations.
Follow the existing code patterns in SPIO OS.

Output ONLY the code, no explanations or markdown fences."""

    payload = {
        "model": AI_MODEL,
        "prompt": f"{system_prompt}\n\nUser request: {prompt}",
        "stream": False,
        "options": {
            "temperature": 0.7,
            "max_tokens": 2048
        }
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(AI_API_URL, json=payload)
            response.raise_for_status()
            result = response.json()
            return result.get("response", "")
    except httpx.HTTPError as e:
        raise Exception(f"AI API error: {str(e)}")
    except Exception as e:
        raise Exception(f"Failed to generate code: {str(e)}")

def extract_code_from_response(response: str) -> str:
    """
    Extract code from AI response (remove markdown fences if present)
    """
    # Remove markdown code blocks
    if "```" in response:
        # Extract content between ```tsx or ```typescript or just ```
        import re
        match = re.search(r'```(?:tsx|typescript|ts|js|jsx)?\n([\s\S]*?)```', response)
        if match:
            return match.group(1).strip()
    
    return response.strip()

def generate_filename(prompt: str, language: str) -> str:
    """
    Generate a safe filename from the prompt
    """
    # Convert prompt to filename-friendly format
    words = prompt.lower().split()[:4]  # Use first 4 words
    filename_base = "_".join(w for w in words if w.isalnum())
    
    # Add timestamp to avoid conflicts
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    ext_map = {
        "tsx": ".tsx",
        "ts": ".ts",
        "js": ".js",
        "jsx": ".jsx",
        "md": ".md"
    }
    ext = ext_map.get(language, ".tsx")
    
    return f"{filename_base}_{timestamp}{ext}"

async def write_to_vault(code: str, filename: str) -> str:
    """
    Write generated code to vault/raw-experiments folder
    """
    # Ensure path exists
    vault_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), VAULT_PATH))
    os.makedirs(vault_dir, exist_ok=True)
    
    filepath = os.path.join(vault_dir, filename)
    
    async with aiofiles.open(filepath, 'w', encoding='utf-8') as f:
        await f.write(code)
    
    return filepath

async def trigger_sync_vault():
    """
    Trigger the librarian sync-vault script after saving new file
    """
    try:
        # Get the project root path
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        
        # Run sync-vault script
        result = subprocess.run(
            ["npm", "run", "sync-vault"],
            cwd=project_root,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            print(f"✅ Sync vault completed: {result.stdout}")
        else:
            print(f"⚠️ Sync vault warning: {result.stderr}")
            
    except subprocess.TimeoutExpired:
        print("⚠️ Sync vault timed out")
    except Exception as e:
        print(f"⚠️ Sync vault error: {str(e)}")

# ============================================
# ENDPOINTS
# ============================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "SPIO OS Backend API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "ai_model": AI_MODEL,
        "ai_api_url": AI_API_URL,
        "vault_path": VAULT_PATH
    }

@app.post("/v1/generate", response_model=GenerateResponse)
async def generate_code(
    request: GenerateRequest,
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """
    Generate code from a text prompt using AI
    
    This is the main endpoint for the Golden Loop:
    1. Receive prompt from frontend
    2. Call AI model to generate code
    3. Save code to vault/raw-experiments
    4. Trigger sync-vault to add to registry
    5. Return success with filepath
    """
    # Verify API key
    if credentials.credentials != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    try:
        # Step 1: Call AI model
        print(f"🤖 Generating code for: {request.prompt}")
        
        ai_response = await call_ai_model(request.prompt)
        
        # Step 2: Extract clean code
        code = extract_code_from_response(ai_response)
        
        if not code:
            raise Exception("AI returned empty code")
        
        # Step 3: Generate filename
        filename = generate_filename(request.prompt, request.language)
        
        # Step 4: Write to vault
        filepath = await write_to_vault(code, filename)
        print(f"💾 Saved to: {filepath}")
        
        # Step 5: Trigger sync-vault (Golden Loop)
        print("🔄 Triggering sync-vault...")
        asyncio.create_task(trigger_sync_vault())
        
        return GenerateResponse(
            success=True,
            code=code,
            filename=filename,
            filepath=filepath,
            message=f"Successfully generated {filename}"
        )
        
    except Exception as e:
        print(f"❌ Generation error: {str(e)}")
        return GenerateResponse(
            success=False,
            message="Failed to generate code",
            error=str(e)
        )

@app.post("/v1/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatMessage,
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """
    Chat with AI for code generation assistance
    Detects if user wants to generate code and handles accordingly
    """
    # Verify API key
    if credentials.credentials != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    try:
        # Detect if this is a code generation request
        generation_keywords = [
            "create", "generate", "make", "build", "write",
            "component", "form", "button", "card", "modal"
        ]
        
        message_lower = request.message.lower()
        is_generation_request = any(kw in message_lower for kw in generation_keywords)
        
        if is_generation_request:
            # Treat as code generation
            ai_response = await call_ai_model(request.message)
            code = extract_code_from_response(ai_response)
            
            if code:
                filename = generate_filename(request.message, "tsx")
                filepath = await write_to_vault(code, filename)
                asyncio.create_task(trigger_sync_vault())
                
                return ChatResponse(
                    success=True,
                    response=f"✅ Generated {filename} and saved to vault!",
                    code_generated=True,
                    filepath=filepath
                )
        
        # Regular chat response
        ai_response = await call_ai_model(f"Answer concisely: {request.message}")
        
        return ChatResponse(
            success=True,
            response=ai_response,
            code_generated=False
        )
        
    except Exception as e:
        return ChatResponse(
            success=False,
            response=f"System Error: {str(e)}",
            code_generated=False
        )

@app.post("/v1/sync")
async def manual_sync(
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """
    Manually trigger sync-vault
    """
    if credentials.credentials != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    try:
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        
        result = subprocess.run(
            ["npm", "run", "sync-vault"],
            cwd=project_root,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        return {
            "success": result.returncode == 0,
            "output": result.stdout,
            "error": result.stderr
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# MAIN
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Starting SPIO OS Backend API...")
    print(f"📦 AI Model: {AI_MODEL}")
    print(f"📂 Vault Path: {VAULT_PATH}")
    print(f"🔐 API Key: {'*' * len(API_KEY)}")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
