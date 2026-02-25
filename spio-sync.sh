#!/bin/bash
# SPIO LOCAL SYNC (The Half-Bridge)

echo "🔍 [SPIO-QC] Scanning vault-data folder..."

# Scan vault-data dan generate index.ts
npm run scan-vault

echo ""
echo "🔍 [SPIO-QC] Mengecek kesehatan kode..."

# Cek apakah Next.js bisa di-build tanpa error
npm run build

if [ $? -eq 0 ]; then
    echo "✅ [SPIO-OK] Kode sehat! Mengirim ke GitHub..."
    git add .
    git commit -m "Automated update from Spio Local Agent: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin main
    echo "🚀 [SPIO-SENT] Kode sudah di Brankas GitHub."
else
    echo "❌ [SPIO-FAIL] Ada error di kode. Cek terminal, Agen!"
    exit 1
fi