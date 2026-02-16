const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        family: 4, // Force IPv4
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false // Note: strictly not recommended for production but helps debug
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 5000,
        socketTimeout: 10000,
    });

    try {
        await transporter.verify();
        console.log("SMTP connection verified");
    } catch (error) {
        console.error("SMTP verification failed:", error);
        // Don't throw here, trying to send might still give a better error or work if verify is blocked specifically
    }

    try {
        await transporter.sendMail({
            from: `"DevDesk" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Email send failed to ${to}:`, error);
        throw new Error("Email sending failed");
    }
};

module.exports = sendEmail;
