# ⚡ Quick Start - Brzi početak

## 1️⃣ Nabavi API ključeve (5 minuta)

### TMDB (OBAVEZNO)
1. Registruj se: https://www.themoviedb.org/signup
2. Idi na: https://www.themoviedb.org/settings/api
3. Klikni "Request an API Key" → Developer
4. Kopiraj **"API Read Access Token (v4)"** (ne API Key v3!)

### Watchmode (OBAVEZNO)
1. Idi na: https://api.watchmode.com/requestApiKey
2. Popuni formular (Email, Name, Use Case: "Legal streaming finder")
3. Proveri email i kopiraj API key

### AI (OPCIONO)
**Groq** (preporučeno, brži i jednostavniji):
1. Registruj se: https://console.groq.com/
2. Idi na API Keys → Create API Key
3. Kopiraj key (počinje sa `gsk_`)

**Cloudflare** (alternativa):
1. Registruj se: https://dash.cloudflare.com/sign-up
2. Workers & Pages → Kopiraj Account ID
3. My Profile → API Tokens → Create Token → Edit Cloudflare Workers

---

## 2️⃣ Konfiguriši projekat (2 minute)

Otvori `.env` fajl i popuni:

```env
TMDB_BEARER=tvoj_tmdb_token_ovde
WATCHMODE_API_KEY=tvoj_watchmode_key_ovde
GROQ_API_KEY=tvoj_groq_key_ovde
```

Sačuvaj fajl!

---

## 3️⃣ Pokreni server

```bash
npm start
```

Trebalo bi da vidiš:
```
✅ API server running on http://localhost:8787
📝 Environment check:
   - TMDB: ✓ configured
   - Watchmode: ✓ configured
   - AI (Groq): ✓ configured
```

---

## 4️⃣ Otvori aplikaciju

**Opcija A:** Otvori `index.html` direktno u browseru
- Ctrl+O → izaberi `index.html`

**Opcija B:** Koristi static server (preporučeno)
```bash
npx serve .
```
Zatim otvori: http://localhost:3000

---

## 5️⃣ Testiranje

1. **Unesi film**: npr. "Inception"
2. **Jezik**: `sr-RS` (ili `en-US`)
3. **Region**: `RS` (Srbija), `US`, `DE` (Nemačka)...
4. Klikni **"Pretraži"**

Trebalo bi da vidiš:
- ✅ Postere filmova
- ✅ Top 5 FREE legal sources
- ✅ Top 5 PAID sources (Netflix, Prime, etc.)

---

## 🐛 Problemi?

### "TMDB: ✗ missing"
- Proveri da li si koristio **Bearer Token v4** (ne API Key v3)
- Token treba da počinje sa `eyJhbG...`

### "Watchmode: ✗ missing"
- Proveri email za API key
- API key je obični string (npr. `abcd1234...`)

### "No results"
- Watchmode možda nema podatke za taj region
- Probaj `US` umesto `RS`

### CORS greške
- Proveri da je server pokrenut na `localhost:8787`
- Nemoj menjati port bez update-a u `index.html`

---

## 📚 Dokumentacija

- **Detaljna dokumentacija**: Vidi `README.md`
- **Vodič za API ključeve**: Vidi `API_KEYS_GUIDE.md`
- **Claude prompt**: Vidi `CLAUDE_PROMPT.md`

---

## 🎯 Sledeći koraci

Nakon što radi:
1. Isprobaj različite regione (US, UK, DE, FR...)
2. Testiraj AI funkciju (kratke preporuke)
3. Čitaj kod u `server.js` da vidiš kako funkcioniše rangiranje

---

**Uživaj u legalnom streaming finder-u! 🚀**
