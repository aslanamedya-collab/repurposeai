# RepurposeAI — Vercel Deploy Rehberi 🚀

## Klasör Yapısı
```
repurposeai/
├── index.html          ← Frontend
├── vercel.json         ← Vercel ayarları
└── api/
    └── repurpose.js    ← Backend (CORS çözümü)
```

---

## Adım 1 — GitHub'a Yükle

1. https://github.com adresine git
2. **"New repository"** tıkla
3. İsim: `repurposeai`
4. **"Create repository"** tıkla
5. Bilgisayarında terminal aç, şu komutları çalıştır:

```bash
cd repurposeai
git init
git add .
git commit -m "ilk commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/repurposeai.git
git push -u origin main
```

---

## Adım 2 — Vercel'e Deploy Et

1. https://vercel.com adresine git
2. GitHub hesabınla giriş yap
3. **"Add New Project"** tıkla
4. `repurposeai` reposunu seç → **"Import"**
5. Hiçbir ayarı değiştirme → **"Deploy"** tıkla
6. 1-2 dakika bekle ✅

Vercel sana şöyle bir URL verecek:
`https://repurposeai-abc123.vercel.app`

---

## Adım 3 — Test Et

1. Vercel URL'ini aç
2. Groq API key'ini gir (gsk_ ile başlayan)
3. Bir içerik yapıştır
4. "REPURPOSE ET" tıkla
5. CORS hatası olmadan çalışmalı ✅

---

## Adım 4 — Kendi Domain'ini Bağla (İsteğe Bağlı)

1. Vercel dashboard → Projen → **"Settings"** → **"Domains"**
2. Domain adını yaz (örn: `repurposeai.com`)
3. Domain satıcında (Namecheap, GoDaddy vs.) DNS ayarını yap
4. Vercel'in gösterdiği nameserver'ları ekle

---

## Sorun Çıkarsa

### "Function timeout" hatası
→ `vercel.json` içindeki `maxDuration: 30` zaten ayarlandı, sorun olmaz.

### "API key geçersiz" hatası
→ Groq panelinden yeni key al: https://console.groq.com/keys

### "404 not found /api/repurpose"
→ Klasör yapısının tam olarak `api/repurpose.js` şeklinde olduğunu kontrol et.

---

## Sonraki Adım

Deploy başarılıysa → **Aşama 2'ye** geçeriz:
- Kullanıcı girişi (email ile)
- Kullanım sayacı database'e kaydedilsin
- PDF/Word indirme
