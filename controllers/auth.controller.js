const emailService = require('../services/email.service');
const OtpLogModel = require('../models/otp-log.model');

// Optional: Use a database backed session, but for now we mimic the previous Map setup
// Map to store OTPs with their expiration times (e.g., email -> {otp, expiresAt})
const otpStore = new Map();
const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

class AuthController {

    // @desc    Send OTP to email
    // @route   POST /api/auth/send-otp
    // @access  Public
    async sendOtp(req, res) {
        console.log("sendOtp initiated!");
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        console.log(`Generated OTP for ${email}: ${otp}`);

        try {
            await emailService.sendOTPEmail(email, otp);

            // Store OTP with expiration
            const expiresAt = Date.now() + OTP_EXPIRATION_TIME;
            otpStore.set(email, { otp: otp.toString(), expiresAt });

            // Log OTP request in database
            await OtpLogModel.findOneAndUpdate(
                { email },
                { $inc: { otpRequestCount: 1 }, lastRequestedAt: new Date() },
                { upsert: true, returnDocument: 'after' }
            );

            // Clean up expired OTPs periodically (lazy evaluation here)
            for (const [key, value] of otpStore.entries()) {
                if (Date.now() > value.expiresAt) {
                    otpStore.delete(key);
                }
            }

            res.status(200).json({ success: true, message: 'OTP sent successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to send OTP' });
        }
    }

    // @desc    Verify OTP
    // @route   POST /api/auth/verify-otp
    // @access  Public
    async verifyOtp(req, res) {
        console.log("verifyOtp initiated!");
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const storedData = otpStore.get(email);

        if (!storedData) {
            return res.status(400).json({ error: 'No OTP requested for this email or OTP expired' });
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ error: 'OTP has expired' });
        }

        if (otp.toString() === storedData.otp) {
            // Correct OTP and not expired, delete it so it can't be reused
            otpStore.delete(email);

            // Log successful verification in database
            await OtpLogModel.findOneAndUpdate(
                { email },
                { $inc: { otpVerifiedCount: 1 }, lastVerifiedAt: new Date() },
                { upsert: true, returnDocument: 'after' }
            );

            res.status(200).json({ success: true, message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    }
}

module.exports = new AuthController();
