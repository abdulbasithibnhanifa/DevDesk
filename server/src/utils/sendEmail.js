const nodemailer = require("nodemailer");
const dns = require("dns");
const util = require("util");
const resolve4 = util.promisify(dns.resolve4);

const sendEmail = async (to, subject, text) => {
    let host = "smtp.gmail.com";

    // 🌍 Manually resolve to IPv4 to bypass Render's IPv6 preference
    try {
        const addresses = await resolve4("smtp.gmail.com");
        if (addresses && addresses.length > 0) {
            host = addresses[0];
            console.log(`✅ IPv4 DNS Resolution Success: smtp.gmail.com -> ${host}`);
        }
    } catch (err) {
        console.error("⚠️ DNS resolution failed, falling back to hostname:", err);
    }

    const transporter = nodemailer.createTransport({
        host: host, // Use the resolved IP if available
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            servername: "smtp.gmail.com", // ⚠️ CRITICAL: Must set servername when using IP address for correct SNI/Cert validation
            rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
    });

    try {
        await transporter.verify();
        console.log("SMTP connection verified");
    } catch (error) {
        console.error("SMTP verification failed:", error);
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
