require('dotenv').config();
const connectDB = require('../config/db');
const DonorModel = require('../models/donor.model');

const fetchAndPrintData = async () => {
    try {
        await connectDB();

        const donors = await DonorModel.find({});
        console.log(`Found ${donors.length} donors in the collection.\n`);

        console.table(donors.map(d => ({
            Name: d.Name,
            Age: d.Age,
            BloodGroup: d.BloodGroup,
            Pincode: d.Pincode,
            Phone: d.PhoneNumber,
            Email: d.Username
        })));

        process.exit(0);
    } catch (error) {
        console.error('Error fetching data:', error);
        process.exit(1);
    }
};

fetchAndPrintData();
