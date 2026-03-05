// api/repurpose.js
// Vercel Serverless Function — CORS sorununu çözer

export default async function handler(req, res) {
  // CORS başlıkları — tüm domainlerden erişime izin ver
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflight isteğini yanıtla
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sadece POST destekleniyor.' });
  }

  const { content, apiKey } = req.body;

  if (!content || !apiKey) {
    return res.status(400).json({ error: 'content ve apiKey zorunlu.' });
  }

  if (!apiKey.startsWith('gsk_')) {
    return res.status(400).json({ error: 'Geçersiz Groq API key.' });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Sen bir içerik repurpose uzmanısın. Verilen metni 10 formata çevir. Türkçe cevap ver.
Formatlar:
1. TikTok/Reels Scripti
2. Twitter/X Thread
3. LinkedIn Postu
4. YouTube Shorts
5. Email Bülteni
6. Meme Fikirleri (5 tane)
7. Pinterest Pin
8. Facebook Postu
9. Blog Özeti
10. Sesli Özet

Çıktıyı SADECE geçerli JSON formatında ver:
{
  "formatlar": [
    {"isim": "TikTok/Reels", "icerik": "..."},
    {"isim": "Twitter/X Thread", "icerik": "..."},
    {"isim": "LinkedIn", "icerik": "..."},
    {"isim": "YouTube Shorts", "icerik": "..."},
    {"isim": "Email Bülteni", "icerik": "..."},
    {"isim": "Meme Fikirleri", "icerik": "..."},
    {"isim": "Pinterest", "icerik": "..."},
    {"isim": "Facebook", "icerik": "..."},
    {"isim": "Blog Özeti", "icerik": "..."},
    {"isim": "Sesli Özet", "icerik": "..."}
  ]
}`
          },
          { role: 'user', content }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json({
        error: errData.error?.message || `Groq API hatası: ${groqRes.status}`
      });
    }

    const data = await groqRes.json();
    let aiContent = data.choices?.[0]?.message?.content || '';

    // JSON bloğunu çıkar
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'AI geçerli JSON döndürmedi. Tekrar dene.' });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsed.formatlar) || parsed.formatlar.length === 0) {
      return res.status(500).json({ error: 'Format listesi boş. Tekrar dene.' });
    }

    return res.status(200).json({ formatlar: parsed.formatlar });

  } catch (err) {
    console.error('Sunucu hatası:', err);
    return res.status(500).json({ error: 'Sunucu hatası: ' + err.message });
  }
}
