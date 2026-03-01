require('dotenv').config();
const connectDB = require('../config/db'); // Path assumes it's placed in seeders folder
const DonorModel = require('../models/donor.model');

const clearDatabase = async () => {
    try {
        await connectDB();
        console.log('Database connected for cleanup...');

        const result = await DonorModel.deleteMany({});
        console.log(`Successfully deleted ${result.deletedCount} donors from the database.`);

        process.exit(0);
    } catch (error) {
        console.error('Failed to clear database:', error);
        process.exit(1);
    }
};

clearDatabase();
