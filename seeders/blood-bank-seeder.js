require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const BloodBankModel = require('../models/blood-bank.model');

const JSON_PATH = path.join(__dirname, '..', 'blood_bank.json');

function categorize(cat) {
    if (!cat) return 'Other';
    const c = cat.trim().toLowerCase();
    if (c.includes('govt') || c.includes('government')) return 'Government';
    if (c.includes('charit')) return 'Charity';
    if (c.includes('private') || c.includes('pvt')) return 'Private';
    return 'Other';
}

async function seedBloodBanks() {
    await connectDB();

    // Read local JSON file
    console.log('📂 Reading blood_bank.json...');
    const raw = fs.readFileSync(JSON_PATH, 'utf-8');
    const records = JSON.parse(raw);
    console.log(`Found ${records.length} records in JSON file`);

    // Clear existing data
    const deleted = await BloodBankModel.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing blood bank records.`);

    // Transform records
    const docs = records.map(r => {
        const lat = parseFloat(r._latitude) || 0;
        const lng = parseFloat(r._longitude) || 0;

        return {
            name: (r._blood_bank_name || '').trim(),
            state: (r._state || '').trim(),
            district: (r._district || '').trim(),
            city: (r._city || '').trim(),
            address: (r._address || '').replace(/\r\n|\r|\n/g, ', ').trim(),
            pincode: (r.pincode || '').trim(),
            contactNo: (r._contact_no || '').trim(),
            mobile: (r._mobile || '').trim(),
            helpline: (r._helpline || '').trim(),
            email: (r._email || '').trim(),
            website: (r._website || '').trim(),
            nodalOfficer: (r._nodal_officer_ || '').trim(),
            category: categorize(r._category),
            bloodComponentAvailable: (r._blood_component_available || '').toUpperCase() === 'YES',
            apheresis: (r._apheresis || '').toUpperCase() === 'YES',
            serviceTime: (r._service_time || '').trim(),
            licenseNo: (r._license__ || '').trim(),
            location: {
                type: 'Point',
                coordinates: [lng, lat]   // GeoJSON = [lng, lat]
            }
        };
    }).filter(d => d.name);  // skip empty names

    console.log(`📝 Inserting ${docs.length} blood banks...`);

    // Insert in batches of 500 to avoid memory issues
    const BATCH = 500;
    let inserted = 0;
    for (let i = 0; i < docs.length; i += BATCH) {
        const batch = docs.slice(i, i + BATCH);
        const result = await BloodBankModel.insertMany(batch, { ordered: false });
        inserted += result.length;
        console.log(`  Batch ${Math.floor(i / BATCH) + 1}: inserted ${result.length} (total: ${inserted}/${docs.length})`);
    }

    console.log(`\n✅ Done! Inserted ${inserted} blood banks into MongoDB.`);
    process.exit(0);
}

seedBloodBanks().catch(err => {
    console.error('Seeder error:', err);
    process.exit(1);
});
