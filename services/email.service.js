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
            subject: 'One Time Password from HeatBeat',
            html: `<div style="text-align: center;">
                    <img src="cid:logo" alt="Logo" width="200px" height="auto">
                    <h1 style="color: #FF9BA1;">Thank you for visiting our website.</h1>
                    <p>If possible, please consider helping others by registering as a donor and saving the lives of people in need.</p>
                    <p>Below is your One Time Password (OTP):</p>
                    <h2>OTP: ${otp}</h2>
                  </div><br/><br/><br/><br/>
                  <div>
                    <p style="font-weight:bold;">HeartBeat Pvt. Limited<br>Chandigarh University,<br>Mohali - 140413</p>
                  </div>`,
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
