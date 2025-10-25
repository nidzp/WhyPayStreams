#!/usr/bin/env node

/**
 * Test script za API endpoint-e
 * Koristi se za brzo testiranje backend funkcionalnosti
 * 
 * Pokretanje: node test-api.js
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:8787';

async function testAPI() {
  console.log('🧪 Testiram WhyPayStreams API...\n');

  // Test 1: Health check
  console.log('1️⃣ Health check...');
  try {
    const health = await fetch(`${API_BASE}/health`);
    const healthData = await health.json();
    console.log('✅ Server je aktivan:', healthData);
  } catch (error) {
    console.log('❌ Server nije pokrenut! Prvo pokreni: npm start');
    process.exit(1);
  }

  // Test 2: Search movies
  console.log('\n2️⃣ Pretražujem filmove (query: "Inception")...');
  try {
    const search = await fetch(`${API_BASE}/api/search?q=Inception&language=en-US`);
    const searchData = await search.json();
    console.log(`✅ Pronađeno ${searchData.results?.length || 0} filmova`);
    if (searchData.results?.[0]) {
      const movie = searchData.results[0];
      console.log(`   → ${movie.title} (${movie.release_date?.slice(0, 4)})`);
      console.log(`   → TMDB ID: ${movie.id}`);
      console.log(`   → Ocena: ${movie.vote_average}/10`);
    }
  } catch (error) {
    console.log('❌ Greška pri pretrazi:', error.message);
  }

  // Test 3: Get movie details
  console.log('\n3️⃣ Dohvatam detalje filma (Inception, ID: 27205)...');
  try {
    const details = await fetch(`${API_BASE}/api/movie/27205?language=en-US`);
    const detailsData = await details.json();
    console.log(`✅ Film: ${detailsData.title}`);
    console.log(`   → Runtime: ${detailsData.runtime} min`);
    console.log(`   → Budget: $${detailsData.budget?.toLocaleString()}`);
    console.log(`   → Revenue: $${detailsData.revenue?.toLocaleString()}`);
  } catch (error) {
    console.log('❌ Greška pri dohvatanju detalja:', error.message);
  }

  // Test 4: Get streaming offers
  console.log('\n4️⃣ Dohvatam streaming ponude (Inception, region: US)...');
  try {
    const offers = await fetch(`${API_BASE}/api/offers/27205?region=US`);
    const offersData = await offers.json();
    console.log(`✅ Top FREE ponude: ${offersData.topFree?.length || 0}`);
    if (offersData.topFree?.[0]) {
      offersData.topFree.slice(0, 3).forEach((offer, i) => {
        console.log(`   ${i + 1}. ${offer.name} - ${offer.quality?.toUpperCase() || 'N/A'} (${offer.type})`);
      });
    }
    console.log(`✅ Top PAID ponude: ${offersData.topPaid?.length || 0}`);
    if (offersData.topPaid?.[0]) {
      offersData.topPaid.slice(0, 3).forEach((offer, i) => {
        const price = offer.price ? `$${offer.price}` : 'N/A';
        console.log(`   ${i + 1}. ${offer.name} - ${offer.quality?.toUpperCase() || 'N/A'} (${price})`);
      });
    }
  } catch (error) {
    console.log('❌ Greška pri dohvatanju ponuda:', error.message);
  }

  // Test 5: AI suggestion (opciono)
  console.log('\n5️⃣ Testiram AI funkciju (ako je konfigurisana)...');
  try {
    const ai = await fetch(`${API_BASE}/api/ai/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'groq',
        prompt: 'In one sentence, what is the movie Inception about?'
      })
    });
    const aiData = await ai.json();
    if (aiData.text) {
      console.log(`✅ AI odgovor: "${aiData.text}"`);
    } else {
      console.log('⚠️ AI nije konfigurisan (opciono)');
    }
  } catch (error) {
    console.log('⚠️ AI test preskočen (opciono):', error.message);
  }

  console.log('\n✅ Svi osnovni testovi završeni!\n');
  console.log('💡 Sledeći korak: Otvori index.html u browser-u');
}

// Pokreni testove
testAPI().catch(console.error);
