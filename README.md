# WhyPayStreams - Legal Streaming Finder MVP

🎬 **Pronađi gde da gledaš filmove legalno** - besplatno (AVOD/FAST) ili uz pretplatu/iznajmljivanje.

## 📋 O projektu

WhyPayStreams je MVP aplikacija koja koristi **TMDB** i **Watchmode** API-je da pronađe legalne streaming izvore za filmove. Rangira ponude po kvalitetu (4K > HD > SD), ceni i popularnosti servisa.

### ✨ Funkcionalnosti

- 🔍 **Pretraga filmova** po naslovu i jeziku
- 🌍 **Region-aware** streaming ponude (RS, DE, US, itd.)
- 🆓 **Top 5 besplatnih** legalnih izvora (Tubi, Pluto TV, Freevee...)
- 💳 **Top 5 plaćenih** izvora (Netflix, Prime, Disney+...)
- 📊 **Pametno rangiranje** po kvalitetu, ceni i popularnosti
- 🤖 **AI preporuke** (opciono, Cloudflare Workers AI ili Groq)

### 🚫 Šta NIJE

Ova aplikacija **NE** predlaže:
- ❌ Piratske sajtove
- ❌ Torrent linkove
- ❌ VPN zaobilaženje geo-blokova za piratstvo
- ❌ Kršenje autorskih prava

Sve je **100% legalno** i u skladu sa Terms of Service korišćenih API-ja.

---

## 🚀 Quick Start

### Preduslov

- **Node.js** 18+ ([preuzmi ovde](https://nodejs.org/))
- **npm** (dolazi sa Node.js)

### Instalacija

1. **Kloniraj/preuzmi projekat**
   ```bash
   cd WhyPayStreams
   ```

2. **Instaliraj zavisnosti**
   ```bash
   npm install
   ```

3. **Podesi environment varijable**
   
   Kopiraj `.env.example` u `.env`:
   ```bash
   copy .env.example .env
   ```

4. **Nabavi API ključeve** (BESPLATNO):

   | API | Gde | Link | Free Tier |
   |-----|-----|------|-----------|
   | **TMDB** | The Movie Database | [TMDB API](https://www.themoviedb.org/settings/api) | ✅ Da (Read Access Token) |
   | **Watchmode** | Watchmode | [Request API Key](https://api.watchmode.com/requestApiKey) | ✅ Da (~1000 poziva) |
   | **Cloudflare** (opciono) | Cloudflare Dashboard | [Workers AI](https://dash.cloudflare.com/) | ✅ Da |
   | **Groq** (opciono) | Groq Console | [Groq API](https://console.groq.com/) | ✅ Da |

5. **Popuni `.env` fajl**:
   ```env
   TMDB_BEARER=tvoj_tmdb_read_access_token
   WATCHMODE_API_KEY=tvoj_watchmode_key
   # Opciono za AI funkcije:
   CLOUDFLARE_ACCOUNT_ID=tvoj_cf_account_id
   CLOUDFLARE_API_TOKEN=tvoj_cf_token
   GROQ_API_KEY=tvoj_groq_key
   ```

6. **Pokreni server**
   ```bash
   npm start
   ```

7. **Otvori frontend**
   
   Otvori `index.html` u browseru ili koristi:
   ```bash
   npx serve .
   ```
   Pa idi na `http://localhost:3000`

---

## 📖 Kako koristiti

1. **Unesi naziv filma** (npr. "Inception", "Interstellar")
2. **Podesi jezik** (sr-RS, en-US...) - za TMDB metadata
3. **Izaberi region** (RS, DE, US...) - za streaming dostupnost
4. Klikni **"Pretraži"**
5. Pregledaj **Top 5 besplatnih** i **Top 5 plaćenih** ponuda
6. Klikni na link da otvoriš streaming servis

### Opciono: AI preporuke

- Unesi upit (npr. "Sažetak filma Inception i predloži slične filmove")
- Izaberi AI provider (Cloudflare ili Groq)
- Klikni **"Generiši AI odgovor"**

---

## 🏗️ Arhitektura

```
WhyPayStreams/
├── server.js           # Express API server
├── index.html          # Frontend (vanilla JS)
├── package.json        # Dependencies
├── .env.example        # Template za environment variables
├── .env                # Tvoji API ključevi (ne commit-ovati!)
├── .gitignore          # Git ignore rules
├── README.md           # Ova datoteka
└── CLAUDE_PROMPT.md    # System prompt za AI asistenta
```

### Backend Endpoints

| Endpoint | Method | Opis |
|----------|--------|------|
| `/api/search` | GET | Pretraga filmova (TMDB) |
| `/api/movie/:id` | GET | Detalji filma (TMDB) |
| `/api/offers/:tmdbId` | GET | Streaming ponude (Watchmode) |
| `/api/ai/suggest` | POST | AI preporuke (Cloudflare/Groq) |
| `/health` | GET | Health check |

### Rangiranje algoritam

```javascript
score = (quality * 2) + (popularity * 1.2) + (12 - price)
```

Gde:
- **quality**: 4K=3, HD=2, SD=1
- **popularity**: Netflix=10, Prime=9, Tubi=8...
- **price**: $0-12 (niža je bolja)

---

## 🔧 Development

### Pokretanje u dev modu

```bash
npm run dev
```

Ovo koristi `--watch` flag, server se automatski restartuje pri izmeni koda.

### Testing API-ja

Koristi REST klijent (Thunder Client, Postman) ili `curl`:

```bash
# Search movies
curl "http://localhost:8787/api/search?q=Inception"

# Get offers
curl "http://localhost:8787/api/offers/27205?region=RS"

# AI suggestion
curl -X POST http://localhost:8787/api/ai/suggest \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Summarize Inception", "provider":"groq"}'
```

---

## 📦 Tehnologije

### Backend
- **Node.js** - runtime
- **Express** - web framework
- **node-fetch** - HTTP client
- **dotenv** - environment variables
- **cors** - CORS middleware

### Frontend
- **Vanilla JavaScript** - no frameworks
- **HTML5 + CSS3** - modern styling
- **Fetch API** - HTTP requests

### APIs
- **TMDB API** - movie metadata, posters
- **Watchmode API** - streaming availability, pricing
- **Cloudflare Workers AI** - AI suggestions (opciono)
- **Groq** - AI suggestions alternativa (opciono)

---

## 🌍 Podržani regioni

Watchmode API podržava 40+ regiona. Najčešći:

| Region | Kod | Primeri servisa |
|--------|-----|-----------------|
| Srbija | RS | ... |
| USA | US | Netflix, Hulu, Tubi, Peacock |
| Germany | DE | Netflix DE, Amazon Prime DE |
| UK | GB | BBC iPlayer, Channel 4 |

**Napomena**: Dostupnost zavisi od Watchmode podataka za taj region.

---

## 🐛 Troubleshooting

### "TMDB_BEARER missing"
- Proveri `.env` fajl
- Uzmi Read Access Token sa [TMDB Settings](https://www.themoviedb.org/settings/api)
- **NE** koristi API Key v3, već **Bearer Token v4**

### "No results" za ponude
- Watchmode možda nema podatke za taj film/region
- Pokušaj sa različitim regionom (npr. US umesto RS)
- Proveri da li film ima TMDB ID

### CORS greške
- Pokreni backend na `localhost:8787`
- Nemoj menjati port bez update-a u `index.html`

### AI nije konfigurisan
- AI funkcije su **opcione**
- Trebaš ili Cloudflare ili Groq ključeve
- Proveri `.env` da li su `CLOUDFLARE_*` ili `GROQ_API_KEY` postavljeni

---

## 🔮 Budućnost (roadmap)

Moguća poboljšanja:
- [ ] TV shows podrška
- [ ] User reviews (TMDB ratings)
- [ ] IMDb rating integracija
- [ ] Watch history (localStorage)
- [ ] Price alerts
- [ ] Multi-language UI (i18n)
- [ ] PWA support
- [ ] Next.js/Vite migration
- [ ] Database za caching

---

## 📄 Licenca

MIT License - slobodno koristite, modifikujte i distribuirajte.

---

## 🙏 Credits

- **TMDB** - Movie metadata ([themoviedb.org](https://www.themoviedb.org/))
- **Watchmode** - Streaming availability ([watchmode.com](https://www.watchmode.com/))
- **Cloudflare** - Workers AI ([cloudflare.com](https://www.cloudflare.com/))
- **Groq** - Fast inference ([groq.com](https://groq.com/))

---

## ⚖️ Legal Disclaimer

Ova aplikacija je kreirana isključivo za **legalne svrhe**. Ne podržava niti omogućava piratstvo, kršenje autorskih prava ili zaobilaženje geo-restrikcija radi pristupa ilegalnom sadržaju. Svi predloženi streaming servisi su legalni i licencirani distributori sadržaja.

Korisnici su odgovorni za poštovanje Terms of Service streaming platformi koje koriste.
