const mongoose = require('mongoose');

const bloodBankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        index: true
    },
    district: {
        type: String,
        index: true
    },
    city: {
        type: String,
        index: true
    },
    address: {
        type: String
    },
    pincode: {
        type: String,
        index: true
    },
    contactNo: String,
    mobile: String,
    helpline: String,
    email: String,
    website: String,
    nodalOfficer: String,
    category: {
        type: String,
        enum: ['Government', 'Charity', 'Private', 'Other'],
        default: 'Other'
    },
    bloodComponentAvailable: {
        type: Boolean,
        default: false
    },
    apheresis: {
        type: Boolean,
        default: false
    },
    serviceTime: String,
    licenseNo: String,
    // GeoJSON location for geo-spatial queries
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],   // [longitude, latitude]
            default: [0, 0]
        }
    }
}, {
    timestamps: true,
    collection: 'blood_banks'
});

// 2dsphere index for geo queries ($near, $geoWithin)
bloodBankSchema.index({ location: '2dsphere' });

const BloodBankModel = mongoose.model('BloodBank', bloodBankSchema);

module.exports = BloodBankModel;
