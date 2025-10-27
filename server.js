import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const TMDB = 'https://api.themoviedb.org/3';
const TMDB_HEADERS = {
  Authorization: `Bearer ${process.env.TMDB_BEARER}`,
  'Content-Type': 'application/json;charset=utf-8'
};

const WATCHMODE = 'https://api.watchmode.com/v1';

// map kvaliteta u skor (viši je bolje)
const QUALITY_SCORE = { '4k': 3, 'uhd': 3, 'hd': 2, 'sd': 1, 'cam': 0 };
// grubi skor popularnosti servisa (po potrebi proširi)
const POP_SCORE = {
  'netflix': 10, 'prime': 9, 'disney_plus': 9, 'max': 8, 'apple_tv_plus': 7,
  'hulu': 7, 'peacock': 6, 'paramount_plus': 6,
  // AVOD/FAST
  'tubi': 8, 'pluto_tv': 7, 'freevee': 6, 'rakuten_tv': 6, 'plex_free': 5
};

// pomoćna: normalize provider "name" u ključ
const keyfy = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_');

function rankOffer(o) {
  const q = keyfy(o.quality || '');
  const quality = QUALITY_SCORE[q] ?? 2; // default ~HD
  const providerKey = keyfy(o.source || o.name || '');
  const pop = POP_SCORE[providerKey] ?? 4;
  // cena: niža je bolje; rent < sub < buy (heuristika)
  const price = typeof o.price === 'number' ? o.price : (o.type === 'rent' ? 2.99 : o.type === 'sub' ? 5.99 : 9.99);
  const priceScore = Math.max(0, 12 - price); // 0..12
  // ukupni skor (podesivo)
  return quality * 2 + pop * 1.2 + priceScore;
}

// TMDB: pretraga filmova
app.get('/api/search/movie', async (req, res) => {
  try {
    const { q, language = 'en-US' } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const r = await fetch(`${TMDB}/search/movie?query=${encodeURIComponent(q)}&language=${language}`, { headers: TMDB_HEADERS });
    const json = await r.json();
    res.json(json);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// TMDB: pretraga serija
app.get('/api/search/tv', async (req, res) => {
  try {
    const { q, language = 'en-US' } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const r = await fetch(`${TMDB}/search/tv?query=${encodeURIComponent(q)}&language=${language}`, { headers: TMDB_HEADERS });
    const json = await r.json();
    res.json(json);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Legacy endpoint - podrazumevano pretraga filmova
app.get('/api/search', async (req, res) => {
  try {
    const { q, language = 'en-US' } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const r = await fetch(`${TMDB}/search/movie?query=${encodeURIComponent(q)}&language=${language}`, { headers: TMDB_HEADERS });
    const json = await r.json();
    res.json(json);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// TMDB: poster i osnovni meta podaci (filmovi)
app.get('/api/movie/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en-US' } = req.query;
    const r = await fetch(`${TMDB}/movie/${id}?language=${language}`, { headers: TMDB_HEADERS });
    res.json(await r.json());
  } catch (error) {
    console.error('Movie details error:', error);
    res.status(500).json({ error: error.message });
  }
});

// TMDB: poster i osnovni meta podaci (serije)
app.get('/api/tv/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en-US' } = req.query;
    const r = await fetch(`${TMDB}/tv/${id}?language=${language}`, { headers: TMDB_HEADERS });
    res.json(await r.json());
  } catch (error) {
    console.error('TV details error:', error);
    res.status(500).json({ error: error.message });
  }
});

// WATCHMODE: ponude (region-aware)
app.get('/api/offers/:imdb_or_tmdb', async (req, res) => {
  try {
    const { imdb_or_tmdb } = req.params;
    let { region = 'RS' } = req.query; // tvoja default regija
    
    // Lista fallback regiona ako glavni nema rezultate
    const fallbackRegions = [region, 'US', 'GB', 'DE'];
    let allOffers = [];
    let usedRegion = region;

    // 1) pokušaj direktno po TMDB ID → Watchmode "sources" traže internal ID,
    // pa prvo resolve title_id:
    const lookup = await fetch(`${WATCHMODE}/search/?apiKey=${process.env.WATCHMODE_API_KEY}&search_field=tmdb_id&search_value=${encodeURIComponent(imdb_or_tmdb)}`);
    const ljson = await lookup.json();
    const title = ljson.title_results?.[0];
    
    if (!title) {
      console.log(`Watchmode: No title found for TMDB ID ${imdb_or_tmdb}`);
      return res.json({ topFree: [], topPaid: [], message: 'Film nije pronađen u Watchmode bazi' });
    }

    // Pokušaj sa više regiona
    for (const tryRegion of fallbackRegions) {
      try {
        const offersR = await fetch(`${WATCHMODE}/title/${title.id}/sources/?apiKey=${process.env.WATCHMODE_API_KEY}&regions=${tryRegion}`);
        const offers = await offersR.json();
        
        if (Array.isArray(offers) && offers.length > 0) {
          allOffers = offers;
          usedRegion = tryRegion;
          console.log(`Found ${offers.length} offers for region ${tryRegion}`);
          break;
        }
      } catch (err) {
        console.log(`Failed to get offers for region ${tryRegion}:`, err.message);
      }
    }

    // normalizuj i rangiraj
    const normalized = allOffers.map(o => ({
      name: o.name || 'Unknown',
      source: o.source_id || o.name,
      type: o.type || 'sub', // sub|rent|buy|free
      price: o.price || 0,
      currency: o.currency || 'USD',
      quality: (o.format || 'hd').toLowerCase(), // '4k','hd','sd'
      web_url: o.web_url || '#',
      region: usedRegion
    }));

    const freeLegal = normalized.filter(o => o.type === 'free' || o.type === 'ads');
    const paid = normalized.filter(o => o.type !== 'free' && o.type !== 'ads');

    const topFree = freeLegal
      .sort((a,b) => rankOffer(b) - rankOffer(a))
      .slice(0, 5);

    const topPaid = paid
      .sort((a,b) => rankOffer(b) - rankOffer(a))
      .slice(0, 5);

    console.log(`Returning ${topFree.length} free and ${topPaid.length} paid offers from region ${usedRegion}`);
    res.json({ 
      topFree, 
      topPaid, 
      region: usedRegion,
      message: usedRegion !== region ? `Prikazani rezultati za region ${usedRegion} (${region} nema podataka)` : null
    });
  } catch (error) {
    console.error('Offers error:', error);
    res.status(500).json({ error: error.message, topFree: [], topPaid: [] });
  }
});

// AI (opciono): kratke preporuke/opis preko Cloudflare Workers AI ili Groq
app.post('/api/ai/suggest', async (req, res) => {
  const { prompt, provider = 'cloudflare' } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  try {
    if (provider === 'groq' && process.env.GROQ_API_KEY) {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'You are a concise movie assistant. Provide helpful, brief recommendations.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.4
        })
      });
      const j = await r.json();
      res.json({ text: j.choices?.[0]?.message?.content || 'No response from AI' });
    } else if (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN) {
      const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a concise movie assistant. Provide helpful, brief recommendations.' },
            { role: 'user', content: prompt }
          ]
        })
      });
      const j = await r.json();
      res.json({ text: j.result?.response || 'No response from AI' });
    } else {
      res.status(400).json({ error: 'AI provider not configured. Please set GROQ_API_KEY or CLOUDFLARE credentials in .env' });
    }
  } catch (e) {
    console.error('AI error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
  console.log(`📝 Environment check:`);
  console.log(`   - TMDB: ${process.env.TMDB_BEARER ? '✓ configured' : '✗ missing'}`);
  console.log(`   - Watchmode: ${process.env.WATCHMODE_API_KEY ? '✓ configured' : '✗ missing'}`);
  console.log(`   - AI (Groq): ${process.env.GROQ_API_KEY ? '✓ configured' : '✗ optional'}`);
  console.log(`   - AI (Cloudflare): ${process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN ? '✓ configured' : '✗ optional'}`);
});
