const emailTemplate = (title, greeting, body, actionUrl, actionText) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #333; text-align: center;">${title}</h2>
            <p style="color: #555;">${greeting}</p>
            <p style="color: #555;">${body}</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${actionUrl}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">${actionText}</a>
            </div>
            <p style="font-size: 12px; color: #888; text-align: center;">If you didn't request this, please ignore this email.</p>
        </div>
    `;
};

module.exports = emailTemplate;
