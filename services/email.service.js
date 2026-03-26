const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendOTPEmail(email, otp) {
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Your OTP Verification Code | HeartBeat',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
                    .email-wrapper { width: 100%; background-color: #f8fafc; padding: 40px 20px; text-align: center; box-sizing: border-box; }
                    .email-card { max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9; text-align: center; padding: 48px 40px; }
                    .logo-img { width: 180px; height: auto; margin-bottom: 32px; }
                    .greeting { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0; letter-spacing: -0.5px; }
                    .message { font-size: 15px; color: #64748b; line-height: 1.6; margin: 0 0 32px 0; }
                    .otp-container { background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); border: 1px solid #fecdd3; border-radius: 16px; padding: 32px 24px; margin-bottom: 32px; box-shadow: inset 0 2px 4px rgba(225, 29, 72, 0.05); }
                    .otp-label { font-size: 12px; font-weight: 700; color: #e11d48; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
                    .otp-code { font-size: 36px; font-weight: 900; color: #e11d48; letter-spacing: 8px; margin: 0; }
                    .footer { font-size: 13px; color: #94a3b8; line-height: 1.6; border-top: 1px solid #f8fafc; padding-top: 24px; margin-top: 16px; }
                    .footer b { color: #475569; }
                    .hero-text { color: #e11d48; font-weight: 600; }
                    @media only screen and (max-width: 600px) {
                        .email-card { padding: 32px 20px; }
                        .otp-code { font-size: 28px; letter-spacing: 4px; }
                    }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="email-card">
                        <img src="cid:logo" alt="HeartBeat Logo" class="logo-img">
                        <h1 class="greeting">Secure Verification</h1>
                        <p class="message">Thank you for joining <b>HeartBeat</b>. To continue, please use the verification code below to confirm your email address. Every drop counts, and so does every verified user!</p>
                        
                        <div class="otp-container">
                            <div class="otp-label">Your One-Time Password</div>
                            <h2 class="otp-code">${otp}</h2>
                        </div>
                        
                        <p class="message" style="font-size: 14px; margin-bottom: 40px;">This code is valid for 10 minutes. Please do not share this code with anyone.</p>
                        
                        <div class="footer">
                            <p style="margin: 0 0 8px 0;"><b>HeartBeat Pvt. Limited</b><br> By- <a href="https://github.com/Anoop-Kumar-31" style="color: #e11d48; text-decoration: none;">Anoop Kumar</a></p>
                            <p style="margin: 0;">Be the reason for someone's <span class="hero-text">heartbeat</span>.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `,
            attachments: [{
                filename: 'LOGO.png',
                path: './LOGO.png', // We'll need to move the logo image to the new folder
                cid: 'logo'
            }]
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            console.error('Failed to send OTP email', error);
            throw new Error('Failed to send OTP email');
        }
    }
}

module.exports = new EmailService(); // Exporting as singleton
