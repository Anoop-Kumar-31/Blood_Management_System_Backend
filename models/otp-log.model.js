const mongoose = require('mongoose');

const otpLogSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    otpRequestCount: {
        type: Number,
        default: 0
    },
    otpVerifiedCount: {
        type: Number,
        default: 0
    },
    lastRequestedAt: {
        type: Date
    },
    lastVerifiedAt: {
        type: Date
    }
}, {
    timestamps: true,
    collection: 'otp_logs'
});

const OtpLogModel = mongoose.model('OtpLog', otpLogSchema);

module.exports = OtpLogModel;
