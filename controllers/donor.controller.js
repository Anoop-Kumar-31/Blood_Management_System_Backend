const DonorModel = require('../models/donor.model');
const { v4: uuidv4 } = require('uuid');

// create a map for whcihc blood can take from which blood
const bloodCompatibility = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
};

class DonorController {

    // @desc    Register a new donor
    // @route   POST /api/donors/register
    // @access  Public
    async registerDonor(req, res) {
        try {
            const { name, bloodtype, pin, phone, email, address, state, age, availability } = req.body;

            // Basic validation
            if (!name || !bloodtype || !pin || !phone || !email || !address || !state || !age) {
                return res.status(400).json({ success: false, message: 'All fields are required' });
            }

            // Parse availability: expecting a string like "Saturday" or "Saturday;Sunday"
            let availabilityArray = [];
            if (availability) {
                const parts = availability.split(';').map(s => s.trim());
                parts.forEach(part => {
                    availabilityArray.push({ dayOfWeek: part });
                });
            }

            const donor = await DonorModel.create({
                uuid: uuidv4(),
                Name: name,
                Age: Number(age),               // ensure number
                PhoneNumber: phone,
                Username: email,
                BloodGroup: bloodtype,           // use new field name
                Pincode: Number(pin),
                State: state,
                Address: address,
                Gender: req.body.gender || '',   // optional
                Availability: availabilityArray
            });

            res.status(201).json({ success: true, message: 'Registration successful', data: donor });
        } catch (error) {
            console.error('Error registering donor:', error);
            if (error.code === 11000) {
                return res.status(400).json({ success: false, message: 'Email already registered' });
            }
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    // @desc    Fetch donors by blood type and pincode proximity
    // @route   GET /api/donors/fetch
    // @access  Public
    async fetchDonors(req, res) {
        try {
            let { pin, bloodtype, state } = req.query;

            if (!pin || !bloodtype) {
                return res.status(400).json({ error: 'Pincode and bloodtype are required' });
            }

            // Clean up blood type format (if frontend sends e.g., "A+1" -> "A+")
            let fetchBtype = bloodtype.length > 2
                ? bloodtype.charAt(0) + bloodtype.charAt(1) + (bloodtype.charAt(2) === '1' ? '+' : '-')
                : bloodtype.charAt(0) + (bloodtype.charAt(1) === '1' ? '+' : '-');

            const pincodeNum = Number(pin);

            // Find donors within a +/- 10 range of the pincode with the exact blood type
            const donors = await DonorModel.find({
                BloodGroup: { $in: bloodCompatibility[fetchBtype] },
                State: state
            });

            console.log(`Fetched ${donors.length} donors for ${fetchBtype} near ${pincodeNum}`);
            res.status(200).json(donors);
        } catch (error) {
            console.error('Error fetching donors:', error);
            res.status(500).json({ error: 'Internal server error during fetch' });
        }
    }
}

module.exports = new DonorController();