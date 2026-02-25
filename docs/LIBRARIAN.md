# SPIO OS Librarian

Automated Boilerplate Entry System untuk SPIO OS Auto-Vault.

## 🎯 Fungsi

Librarian adalah script Node.js yang otomatis:
1. **Scan** folder `/vault/raw-experiments` untuk file baru
2. **Parse** metadata dari file (title, description, category)
3. **Inject** entry baru ke `src/data/spio-registry.tsx`
4. **Archive** file yang sudah diproses ke `/vault/archived-experiments`

## 📁 Struktur Folder

```
vault/
├── raw-experiments/       # Drop zone untuk file baru
│   └── (drop .tsx, .ts, .js, .jsx, .txt, .md files here)
└── archived-experiments/  # File yang sudah diproses
```

## 🚀 Cara Menggunakan

### 1. Drop File Baru

Letakkan file komponen/script/prompt baru di folder `vault/raw-experiments/`:

```
vault/raw-experiments/
└── MyNewComponent.tsx
```

### 2. (Opsional) Tambahkan Frontmatter

Untuk metadata yang lebih baik, tambahkan frontmatter YAML di awal file:

```tsx
---
title: My Awesome Component
description: A reusable component with cool features
category: Frontend
---

// Your component code here...
```

**Category options:**
- `Frontend` - UI components (React/TSX)
- `Backend` - API routes, utilities, database scripts
- `Prompt` - AI prompts dan documentation

### 3. Jalankan Librarian

```bash
npm run sync-vault
```

### 4. Hasil

- ✅ File ditambahkan ke `spio-registry.tsx`
- ✅ File dipindahkan ke `vault/archived-experiments/`
- ✅ Komponen Frontend akan muncul di SPIO Explorer

## 📦 Commands

| Command | Deskripsi |
|---------|-----------|
| `npm run sync-vault` | Scan dan sync file baru ke registry |
| `npm run deploy` | Sync vault + build production |

## 🔧 Format File yang Didukung

| Ekstensi | Category Default |
|----------|------------------|
| `.tsx` | Frontend |
| `.jsx` | Frontend |
| `.ts` | Backend |
| `.js` | Backend |
| `.txt` | Prompt |
| `.md` | Prompt |

## 📝 Contoh File

### Frontend Component

```tsx
---
title: Custom Button
description: Button dengan animasi glow
category: Frontend
---
import { motion } from 'framer-motion';

export function CustomButton({ children }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      className="px-4 py-2 bg-green-500 rounded-lg"
    >
      {children}
    </motion.button>
  );
}
```

### Backend Script

```typescript
---
title: Email Sender
description: Utility untuk mengirim email
category: Backend
---
import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, body: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
  });

  await transporter.sendMail({
    from: 'noreply@spio.os',
    to,
    subject,
    html: body,
  });
}
```

### AI Prompt

```markdown
---
title: Code Review Prompt
description: Prompt untuk code review otomatis
category: Prompt
---

# Code Review Assistant

You are a senior code reviewer. Review the following code for:
1. Security vulnerabilities
2. Performance issues
3. Code style consistency
4. Best practices

Provide actionable feedback with code examples.
```

## ⚠️ Catatan Penting

### Component Type untuk Live Preview

Untuk komponen Frontend yang ingin ditampilkan live di UI Canvas, Anda perlu manual menambahkan `componentType` di `spio-registry.tsx`:

```tsx
// 1. Import komponen di bagian atas file
import { CustomButton } from '@/components/CustomButton';

// 2. Tambahkan componentType di registry entry
{
  id: 'custom-button',
  title: 'Custom Button',
  category: 'Frontend',
  description: 'Button dengan animasi glow',
  componentType: CustomButton,  // ← Tambahkan ini
  codeSnippet: `...`,
}
```

### Duplicate Prevention

Librarian akan skip file jika ID sudah ada di registry. ID di-generate dari title:
- `My Component` → `my-component`
- `Alert Banner` → `alert-banner`

## 🐛 Troubleshooting

### Error: "Could not find spioRegistry array"
- Pastikan `src/data/spio-registry.tsx` tidak dimodifikasi secara manual
- Restore dari backup jika perlu

### File tidak muncul di Explorer
- Jalankan `npm run dev` untuk restart development server
- Clear browser cache

### Build error setelah sync
- Cek apakah ada file `.tsx` di folder `vault/` (seharusnya di-exclude oleh tsconfig.json)
- Pastikan tsconfig.json memiliki `"exclude": ["node_modules", "vault"]`

## 📄 License

Internal Use Only - SPIO OS
