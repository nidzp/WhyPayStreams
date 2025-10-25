# 🔑 Vodič za nabavku API ključeva

Svi API-ji koji se koriste u ovom projektu imaju **BESPLATNE** tier-ove. Ovde su detaljne instrukcije kako dobiti svaki ključ.

---

## 1. TMDB (The Movie Database) - **OBAVEZNO**

### Šta dobijamo?
- Pretragu filmova po naslovu
- Postere i slike visokog kvaliteta
- Osnovne informacije (reziser, glumci, opis)
- Release date, ocena, popularnost

### Kako dobiti ključ?

1. **Registruj se** na [themoviedb.org](https://www.themoviedb.org/signup)
   - Besplatno, potreban samo email

2. **Verifikuj email** koji dobiješ

3. **Idi na Settings → API**
   - Direct link: [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

4. **Klikni "Request an API Key"**
   - Izaberi **"Developer"** (ne Commercial)
   - Popuni kratak formular:
     - Application Name: `WhyPayStreams` (ili šta god želiš)
     - Application URL: `http://localhost:8787` (za development)
     - Application Summary: `Personal project for finding legal streaming sources`

5. **Kopiraj "API Read Access Token (v4)"**
   - **VAŽNO**: NE koristi "API Key (v3)", već **Bearer Token (v4)**
   - Token će izgledati: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`

6. **Dodaj u `.env`**:
   ```env
   TMDB_BEARER=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Free Tier Limiti
- ✅ **Unlimited** requests (sa rate limiting)
- ✅ ~40 requests/10 sekundi (sasvim dovoljno)
- ✅ Svi osnovni endpoints besplatni

---

## 2. Watchmode - **OBAVEZNO**

### Šta dobijamo?
- Streaming dostupnost za 200+ servisa
- Cene (subscription, rent, buy)
- Kvalitet streams (4K, HD, SD)
- Region-specific dostupnost
- Direktni linkovi ka streaming platformama

### Kako dobiti ključ?

1. **Idi na Watchmode API stranicu**
   - [https://api.watchmode.com/](https://api.watchmode.com/)

2. **Klikni "Request Free API Key"**
   - [Direct link](https://api.watchmode.com/requestApiKey)

3. **Popuni formular**:
   - **Email**: Tvoj email
   - **Name**: Tvoje ime
   - **Company**: (opciono) "Personal Project"
   - **Use Case**: `Building a legal streaming finder to help users discover where to watch movies legally across different platforms`

4. **Proveri email**
   - Dobićeš API key odmah u email-u
   - Key će izgledati: `abcd1234efgh5678`

5. **Dodaj u `.env`**:
   ```env
   WATCHMODE_API_KEY=abcd1234efgh5678
   ```

### Free Tier Limiti
- ✅ **1,000 requests** pri registraciji
- ✅ ~250 requests/dan nakon toga
- ⚠️ Requests se broje po title, ne po API call-u
- 💡 Tip: Cache rezultate da uštediš requests

---

## 3. Cloudflare Workers AI - **OPCIONO** (za AI funkcije)

### Šta dobijamo?
- Besplatno pokretanje LLaMA 3.1 i drugih modela
- Serverless inference (nema servera za održavanje)
- Brzi odgovori (Workers edge network)

### Kako dobiti ključ?

1. **Napravi Cloudflare account**
   - [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
   - Besplatno, potreban samo email

2. **Idi na Workers & Pages**
   - Iz sidebar-a: Workers & Pages → Overview

3. **Uzmi Account ID**
   - Nalazi se na desnoj strani dashboard-a
   - Kopiraj ga (npr. `1a2b3c4d5e6f7g8h9i0j`)

4. **Kreiraj API Token**
   - Idi na: My Profile → API Tokens
   - Klikni **"Create Token"**
   - Template: **"Edit Cloudflare Workers"**
   - Permissions:
     - Account → Workers AI → Edit
   - Klikni **"Continue to summary"** → **"Create Token"**
   - **KOPIRAJ TOKEN ODMAH** (videćeš ga samo jednom!)

5. **Dodaj u `.env`**:
   ```env
   CLOUDFLARE_ACCOUNT_ID=1a2b3c4d5e6f7g8h9i0j
   CLOUDFLARE_API_TOKEN=tvoj_token_ovde
   ```

### Free Tier Limiti
- ✅ **10,000 Neurons/day** (requests)
- ✅ Models: LLaMA 3.1, Mistral, CodeLlama...
- ✅ Sasvim dovoljno za MVP

---

## 4. Groq - **OPCIONO** (alternativa Cloudflare-u)

### Šta dobijamo?
- Ultra-brzi LLaMA inference (LPU čipovi)
- OpenAI-kompatibilan API
- Besplatan tier sa velikim limitima

### Kako dobiti ključ?

1. **Registruj se na Groq**
   - [https://console.groq.com/](https://console.groq.com/)
   - Možeš koristiti GitHub ili Google account

2. **Idi na API Keys**
   - Sidebar → API Keys
   - Klikni **"Create API Key"**

3. **Ime ključa**
   - Name: `WhyPayStreams`
   - Klikni **"Submit"**

4. **Kopiraj ključ**
   - Prikaže se odmah nakon kreiranja
   - Izgleda kao: `gsk_1234567890abcdefghijklmnop`
   - **SAČUVAJ GA** - nećeš videti ponovo!

5. **Dodaj u `.env`**:
   ```env
   GROQ_API_KEY=gsk_1234567890abcdefghijklmnop
   ```

### Free Tier Limiti (April 2024+)
- ✅ **30 requests/minute** (LLaMA 3.1)
- ✅ **7,000 requests/day**
- ✅ Ultra brzo (~300 tokens/sec)
- 💡 Groq je često **brži** od Cloudflare

---

## 📝 Finalni `.env` primer

```env
# ===== OBAVEZNI API KLJUČEVI =====
TMDB_BEARER=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI...
WATCHMODE_API_KEY=abcd1234efgh5678ijklmnop

# ===== OPCIONI (AI funkcije) =====
# Izaberi JEDAN od ova dva (ili oba):

# Opcija 1: Cloudflare Workers AI
CLOUDFLARE_ACCOUNT_ID=1a2b3c4d5e6f7g8h9i0j
CLOUDFLARE_API_TOKEN=abcdefghijklmnopqrstuvwxyz1234567890

# Opcija 2: Groq (brži, veći free tier)
GROQ_API_KEY=gsk_1234567890abcdefghijklmnop

# ===== SERVER CONFIG =====
PORT=8787
```

---

## ✅ Validacija

Nakon što popuniš `.env`, pokreni server:

```bash
npm start
```

Trebaš videti:

```
✅ API server running on http://localhost:8787
📝 Environment check:
   - TMDB: ✓ configured
   - Watchmode: ✓ configured
   - AI (Groq): ✓ configured
   - AI (Cloudflare): ✗ optional
```

Ako vidiš `✗ missing` za TMDB ili Watchmode, proveri:
1. Da li si dobro copy/paste-ovao ključeve?
2. Da li ima razmaka na kraju ključa?
3. Da li postoji `.env` fajl u root folderu?

---

## 🔒 Bezbednost

### ✅ Dobra praksa:
- Čuvaj `.env` **lokalno** (već je u `.gitignore`)
- Nikad ne commit-uj ključeve na GitHub
- Ne deli API ključeve javno
- Resetuj ključ ako slučajno leak-uješ

### ❌ Loša praksa:
- Stavljanje ključeva direktno u kod
- Deljenje `.env` fajla
- Screenshot-ovanje `.env` fajla
- Hardkodovanje u `index.html`

---

## 🆘 Pomoć

### TMDB errors:
- **401 Unauthorized**: Loš Bearer token
- **429 Too Many Requests**: Prečesto pozivas API (čekaj 10 sec)

### Watchmode errors:
- **403 Forbidden**: Loš API key ili potrošio si kvotu
- **404 Not Found**: Film nema streaming podatke

### Cloudflare errors:
- **401/403**: Loš API token ili Account ID
- **10000**: Model ne postoji (koristi `@cf/meta/llama-3.1-8b-instruct`)

### Groq errors:
- **401**: Loš API key
- **429**: Rate limit (30 req/min) - čekaj malo

---

## 📧 Pitanja?

Ako imaš problema sa API ključevima:

1. **TMDB**: [Support Forum](https://www.themoviedb.org/talk)
2. **Watchmode**: Email support sa njihove stranice
3. **Cloudflare**: [Discord Community](https://discord.gg/cloudflaredev)
4. **Groq**: [Discord Community](https://discord.gg/groq)

---

**Sretno! 🚀**
