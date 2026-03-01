require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const connectDB = require('../config/db');
const DonorModel = require('../models/donor.model');
const { v4: uuidv4 } = require('uuid');

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('Database connected for seeding...');

        const results = [];

        fs.createReadStream('seeders/DATAforDB.csv')
            .pipe(csv())
            .on('data', (data) => {
                // Parse availability string from CSV into the array format
                let availabilityArray = [];
                const availabilityStr = data.Available || 'Yes';
                if (availabilityStr && availabilityStr !== 'Yes') {
                    const parts = availabilityStr.split(';').map(s => s.trim());
                    parts.forEach(part => {
                        availabilityArray.push({ dayOfWeek: part });
                    });
                } else if (availabilityStr === 'Yes') {
                    // Default to all days if just 'Yes'
                    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
                        availabilityArray.push({ dayOfWeek: day });
                    });
                }

                // Map CSV fields to new DonorModel fields
                const donorData = {
                    uuid: uuidv4(),
                    Name: data.Name,
                    Age: Number(data.Age),
                    PhoneNumber: data.PhoneNumber,
                    Username: data.Username,
                    BloodGroup: data['Blood Group'],
                    Pincode: Number(data.Pincode),
                    State: data.State,
                    Address: data.Address,
                    Gender: data.Gender || '',
                    Availability: availabilityArray
                };
                results.push(donorData);
            })
            .on('end', async () => {
                try {
                    console.log(`Parsed ${results.length} rows from CSV.`);

                    // Clear existing data first
                    await DonorModel.deleteMany({});
                    console.log('Existing donors cleared.');

                    // Deduplicate results based on Username (email) before inserting
                    const uniqueResults = [];
                    const seenEmails = new Set();
                    for (const row of results) {
                        if (!seenEmails.has(row.Username)) {
                            seenEmails.add(row.Username);
                            uniqueResults.push(row);
                        } else {
                            console.log(`Skipping duplicate email from CSV: ${row.Username}`);
                        }
                    }

                    // Insert using Mongoose
                    const inserted = await DonorModel.insertMany(uniqueResults, { ordered: false });
                    console.log(`Successfully inserted ${inserted.length} donors!`);
                    process.exit();
                } catch (insertError) {
                    console.error('Error during bulk insert:', insertError.message);
                    process.exit(1);
                }
            });

    } catch (error) {
        console.error('Failed to connect or seed:', error);
        process.exit(1);
    }
};

seedDatabase();
