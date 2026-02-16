const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
    try {
        const data = await resend.emails.send({
            from: "onboarding@resend.dev", // Use Resend's testing domain
            to: to,
            subject: subject,
            text: text,
            // html: text.replace(/\n/g, "<br>"), // Optional: basic text-to-html conversion
        });

        if (data.error) {
            console.error(`Resend API Returned Error:`, data.error);
            throw new Error(data.error.message);
        }

        console.log(`Email sent via Resend to ${to} | ID: ${data.id}`);
        return data;
    } catch (error) {
        console.error(`Resend API Error sending to ${to}:`, error);
        throw new Error("Email sending failed");
    }
};

module.exports = sendEmail;
