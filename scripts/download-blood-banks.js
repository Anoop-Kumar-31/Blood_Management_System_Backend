/**
 * Download ALL blood bank records from data.gov.in
 * Run: node scripts/download-blood-banks.js
 * Saves to: blood_bank.json (resumes from where it left off)
 */
const fs = require('fs');
const path = require('path');

const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const RESOURCE_ID = 'fced6df9-a360-4e08-8ca0-f283fc74ce15';
const BASE = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json`;
const PER_PAGE = 10;
const OUT_FILE = path.join(__dirname, '..', 'blood_bank.json');
const DELAY_MS = 500;        // delay between normal requests
const RETRY_DELAY_MS = 60000; // 60 second wait on 429 error

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function download() {
    // Load existing data if resuming
    let allRecords = [];
    if (fs.existsSync(OUT_FILE)) {
        try {
            allRecords = JSON.parse(fs.readFileSync(OUT_FILE, 'utf-8'));
            console.log(`� Resuming — found ${allRecords.length} existing records in blood_bank.json`);
        } catch (e) {
            allRecords = [];
        }
    }

    // Get total count
    const firstRes = await fetch(`${BASE}&offset=0&limit=10`);
    const firstData = await firstRes.json();
    const total = firstData.total;
    console.log(`📥 Total records on server: ${total}`);

    // Start from where we left off
    let offset = allRecords.length;
    if (offset >= total) {
        console.log('✅ Already have all records!');
        return;
    }
    console.log(`⏩ Starting from offset ${offset}\n`);

    while (offset < total) {
        const url = `${BASE}&offset=${offset}&limit=${PER_PAGE}`;
        try {
            const res = await fetch(url);

            if (res.status === 429) {
                console.warn(`\n⚠️  Rate limited (429) at offset ${offset}. Saving progress & waiting 60s...`);
                fs.writeFileSync(OUT_FILE, JSON.stringify(allRecords));
                await sleep(RETRY_DELAY_MS);
                continue; // retry same offset
            }

            if (!res.ok) {
                console.warn(`\n⚠️  Error ${res.status} at offset ${offset}. Saving progress & waiting 30s...`);
                fs.writeFileSync(OUT_FILE, JSON.stringify(allRecords));
                await sleep(30000);
                continue;
            }

            const data = await res.json();
            const records = data.records || [];
            allRecords = allRecords.concat(records);

            const pct = ((allRecords.length / total) * 100).toFixed(1);
            process.stdout.write(`\r  Fetched: ${allRecords.length} / ${total} (${pct}%)`);

            // Save progress every 100 records
            if (allRecords.length % 100 === 0) {
                fs.writeFileSync(OUT_FILE, JSON.stringify(allRecords));
            }

            offset += PER_PAGE;
            await sleep(DELAY_MS);
        } catch (err) {
            console.warn(`\n⚠️  Network error: ${err.message}. Saving progress & waiting 60s...`);
            fs.writeFileSync(OUT_FILE, JSON.stringify(allRecords));
            await sleep(RETRY_DELAY_MS);
        }
    }

    // Final save
    fs.writeFileSync(OUT_FILE, JSON.stringify(allRecords));
    console.log(`\n\n✅ Done! Saved ${allRecords.length} records to blood_bank.json`);
}

download().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
