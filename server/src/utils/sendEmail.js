const { Resend } = require("resend");

let resend;
if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
} else {
    console.warn("⚠️ RESEND_API_KEY is missing. Email sending will be simulated.");
}

const sendEmail = async (to, subject, text) => {
    // If no API key, simulate sending
    if (!resend) {
        console.log(`[SIMULATION] Sending email to: ${to}`);
        console.log(`[SIMULATION] Subject: ${subject}`);
        console.log(`[SIMULATION] Body: ${text}`);
        return { id: "simulated_id", success: true };
    }

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
            // Don't throw if we want to continue despite email failure, or throw to block.
            // For now, let's just log it to be safe, or throw if critical.
            // But to prevent crash loop, let's just return null or rethrow.
            throw new Error(data.error.message);
        }

        console.log(`Email sent via Resend to ${to} | ID: ${data.id}`);
        return data;
    } catch (error) {
        console.error(`Resend API Error sending to ${to}:`, error);
        // Throwing here might block registration if handled strictly upstream.
        // Let's allow fallback or just return failure without crashing server.
        throw new Error("Email sending failed");
    }
};

module.exports = sendEmail;
