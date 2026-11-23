import { spawn } from 'child_process';

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}/api`;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('--- Starting NestJS Backend Server for E2E Verification ---');
  const server = spawn('node', ['backend/dist/main.js'], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'inherit',
  });

  server.on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

  // Wait for server to become ready
  let ready = false;
  for (let i = 0; i < 20; i++) {
    await sleep(400);
    try {
      const res = await fetch(`${BASE_URL}/tarot-cards`);
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch {}
  }

  if (!ready) {
    server.kill();
    console.error('Server failed to start within 8 seconds.');
    process.exit(1);
  }

  console.log('--- Server is ready. Running E2E API Tests ---\n');

  try {
    // 1. GET all cards
    console.log('1. Testing GET /api/tarot-cards ...');
    const allRes = await fetch(`${BASE_URL}/tarot-cards`);
    const allCards = await allRes.json();
    console.log(`   Status: ${allRes.status}, Total cards: ${allCards.length}`);
    if (allRes.status !== 200 || allCards.length !== 22) {
      throw new Error(`Expected 22 cards with status 200, got ${allCards.length} (${allRes.status})`);
    }
    console.log(`   ✓ All 22 Major Arcana cards loaded. Card #0: "${allCards[0].name}", Card #21: "${allCards[21].name}"`);

    // 2. GET one card (The Fool, ID: 0)
    console.log('\n2. Testing GET /api/tarot-cards/0 (The Fool) ...');
    const card0Res = await fetch(`${BASE_URL}/tarot-cards/0`);
    const card0 = await card0Res.json();
    console.log(`   Status: ${card0Res.status}, Name: "${card0.name}", Element: "${card0.element}", Planet: "${card0.planet}"`);
    if (card0Res.status !== 200 || card0.name !== 'The Fool') {
      throw new Error(`Expected The Fool, got ${card0.name}`);
    }
    console.log('   ✓ Single card retrieval verified.');

    // 3. POST create new card
    console.log('\n3. Testing POST /api/tarot-cards (Create Card #22 "The Cosmos") ...');
    const newCardData = {
      name: 'The Cosmos',
      number: 22,
      numeral: 'XXII',
      arcana: 'Major Arcana',
      uprightMeaning: 'Infinite potential, Universal consciousness, Cosmic harmony',
      reversedMeaning: 'Disconnection from source, Chaos, Feeling lost in the vastness',
      description: 'The Cosmos transcends the earthly cycle, representing universal soul integration.',
      symbolism: 'A spiraling galaxy cradled by celestial hands.',
      element: 'Aether',
      planet: 'Pluto',
      zodiac: 'Ophiuchus',
      image: 'https://gfx.tarot.com/images/site/decks/english-magic/full_size/21.jpg',
      keywords: ['Infinity', 'Cosmic Unity', 'Transcendence'],
      isFavorite: true,
      quote: 'In the dance of stars, we discover the light within.',
    };
    const createRes = await fetch(`${BASE_URL}/tarot-cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCardData),
    });
    const createdCard = await createRes.json();
    console.log(`   Status: ${createRes.status}, Created ID: ${createdCard.id}, Name: "${createdCard.name}"`);
    if (createRes.status !== 201 || createdCard.name !== 'The Cosmos') {
      throw new Error(`Failed to create card: ${JSON.stringify(createdCard)}`);
    }

    const checkAllRes = await fetch(`${BASE_URL}/tarot-cards`);
    const checkAll = await checkAllRes.json();
    console.log(`   Total cards after POST: ${checkAll.length}`);
    if (checkAll.length !== 23) throw new Error(`Expected 23 cards after POST, got ${checkAll.length}`);
    console.log('   ✓ Card creation verified.');

    // 4. PATCH update card #22
    console.log('\n4. Testing PATCH /api/tarot-cards/22 ...');
    const patchRes = await fetch(`${BASE_URL}/tarot-cards/22`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isFavorite: false,
        quote: 'Updated cosmic quote.',
      }),
    });
    const patchedCard = await patchRes.json();
    console.log(`   Status: ${patchRes.status}, isFavorite: ${patchedCard.isFavorite}, Quote: "${patchedCard.quote}"`);
    if (patchRes.status !== 200 || patchedCard.isFavorite !== false || patchedCard.quote !== 'Updated cosmic quote.') {
      throw new Error(`Failed to patch card: ${JSON.stringify(patchedCard)}`);
    }
    console.log('   ✓ Card update (PATCH) verified.');

    // 5. DELETE card #22
    console.log('\n5. Testing DELETE /api/tarot-cards/22 ...');
    const deleteRes = await fetch(`${BASE_URL}/tarot-cards/22`, {
      method: 'DELETE',
    });
    const deleteJson = await deleteRes.json();
    console.log(`   Status: ${deleteRes.status}, Message: "${deleteJson.message}"`);
    if (deleteRes.status !== 200) {
      throw new Error(`Failed to delete card: ${JSON.stringify(deleteJson)}`);
    }

    const afterDelRes = await fetch(`${BASE_URL}/tarot-cards`);
    const afterDel = await afterDelRes.json();
    console.log(`   Total cards after DELETE: ${afterDel.length}`);
    if (afterDel.length !== 22) throw new Error(`Expected 22 cards after DELETE, got ${afterDel.length}`);
    console.log('   ✓ Card deletion verified.');

    // 6. Test 404 NotFoundException
    console.log('\n6. Testing 404 NotFoundException (GET /api/tarot-cards/999) ...');
    const notFoundRes = await fetch(`${BASE_URL}/tarot-cards/999`);
    const notFoundJson = await notFoundRes.json();
    console.log(`   Status: ${notFoundRes.status}, Error: "${notFoundJson.message}"`);
    if (notFoundRes.status !== 404) {
      throw new Error(`Expected 404, got ${notFoundRes.status}`);
    }
    console.log('   ✓ NotFoundException verified.');

    // 7. Test 409 ConflictException (Duplicate Name)
    console.log('\n7. Testing 409 ConflictException (Duplicate Name "The Fool") ...');
    const dupNameRes = await fetch(`${BASE_URL}/tarot-cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'The Fool',
        number: 99,
        arcana: 'Major Arcana',
        uprightMeaning: 'Test',
        reversedMeaning: 'Test',
        description: 'Duplicate name test.',
        image: 'https://example.com/0.jpg',
      }),
    });
    const dupNameJson = await dupNameRes.json();
    console.log(`   Status: ${dupNameRes.status}, Error: "${dupNameJson.message}"`);
    if (dupNameRes.status !== 409) {
      throw new Error(`Expected 409, got ${dupNameRes.status}`);
    }
    console.log('   ✓ ConflictException (Duplicate Name) verified.');

    // 8. Test 409 ConflictException (Duplicate Number)
    console.log('\n8. Testing 409 ConflictException (Duplicate Number 0) ...');
    const dupNumRes = await fetch(`${BASE_URL}/tarot-cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Unique Card Name',
        number: 0,
        arcana: 'Major Arcana',
        uprightMeaning: 'Test',
        reversedMeaning: 'Test',
        description: 'Duplicate number test.',
        image: 'https://example.com/0.jpg',
      }),
    });
    const dupNumJson = await dupNumRes.json();
    console.log(`   Status: ${dupNumRes.status}, Error: "${dupNumJson.message}"`);
    if (dupNumRes.status !== 409) {
      throw new Error(`Expected 409, got ${dupNumRes.status}`);
    }
    console.log('   ✓ ConflictException (Duplicate Number) verified.');

    // 9. Test 400 BadRequestException (Validation Pipe)
    console.log('\n9. Testing 400 BadRequestException (Missing required fields) ...');
    const badDtoRes = await fetch(`${BASE_URL}/tarot-cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'X' }), // name too short, missing required fields
    });
    const badDtoJson = await badDtoRes.json();
    console.log(`   Status: ${badDtoRes.status}, Validation Errors:`, badDtoJson.message);
    if (badDtoRes.status !== 400) {
      throw new Error(`Expected 400, got ${badDtoRes.status}`);
    }
    console.log('   ✓ BadRequestException (class-validator) verified.');

    console.log('\n============================================================');
    console.log('  ALL ENDPOINT, CRUD, VALIDATION & ERROR TESTS PASSED!      ');
    console.log('============================================================');
  } finally {
    server.kill();
    console.log('Server shut down cleanly.');
  }
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});

