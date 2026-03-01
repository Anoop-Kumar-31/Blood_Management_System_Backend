const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    Name: {
        type: String,
        required: [true, 'Please add a name']
    },
    Age: {
        type: Number,              // changed from String to Number
        required: [true, 'Please add an age']
    },
    PhoneNumber: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    Username: {
        type: String,
        sparse: true,
        unique: true
    },
    BloodGroup: {                   // renamed from 'Blood Group' (no space)
        type: String,
        required: [true, 'Please add a blood group']
    },
    Pincode: {
        type: Number,
        required: [true, 'Please add a pincode']
    },
    State: {
        type: String,
        required: [true, 'Please add a state']
    },
    Address: {
        type: String,
        required: [true, 'Please add an address']
    },
    Gender: {
        type: String
    },
    // Availability: embedded array to store weekly days
    Availability: [{
        dayOfWeek: {
            type: String
        }
    }]
}, {
    timestamps: true,               // automatically adds createdAt and updatedAt
    collection: 'donors'             // more meaningful collection name
});

// Removed old specificDate validator

const DonorModel = mongoose.model('Donor', donorSchema);

module.exports = DonorModel;