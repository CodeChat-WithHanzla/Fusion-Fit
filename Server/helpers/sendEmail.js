const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailTemplate = require("./emailTemplate");

const sendEmail = async ({ email, subject, title, greeting, body, actionUrl, actionText }) => {
    const message = emailTemplate(title, greeting, body, actionUrl, actionText);

    const msg = {
        to: email,
        from: {
            email: process.env.SENDGRID_VERIFIED_EMAIL,
            name: "WristWorks",
        },
        subject,
        html: message,
    };

    try {
        await sgMail.send(msg);
        console.log(`Verification email sent to: ${email}`);
    } catch (error) {
        console.error("Failed to send email:", error.response?.body || error.message);
        throw new Error("Email delivery failed. Please try again.");
    }
};

module.exports = sendEmail;
