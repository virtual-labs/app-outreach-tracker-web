const nodemailer = require("nodemailer");
const fs = require('fs').promises;
const username = process.env.SENDER_EMAIL;
const password = process.env.SENDER_PASSWORD;

async function loadJSON() {
    try {
        const jsonString = await fs.readFile('./secrets/sendermail.json', 'utf8');
        const data = JSON.parse(jsonString);
        return data;
    } catch (err) {
        console.error('Error reading or parsing file:', err);
        throw err;
    }
}

const sendmail = async (subject, to, text) => {
    loadJSON()
        .then(data => {
            let transporter = nodemailer.createTransport({
                host: "smtp.office365.com",  // Outlook SMTP server
                port: 587, // Port for TLS/STARTTLS
                secure: false, // true for port 465, false for port 587
                auth: {
                    user: username,
                    pass: password
                },
                tls: {
                    rejectUnauthorized: false  // Important for sending mail from localhost
                }
            });

            transporter.sendMail({
                from: username,
                to: to,
                subject: subject,
                text: text,
            })
            .then(() => console.log("Mail sent"))
            .catch(error => console.error("Error sending email:", error));
        })
        .catch(error => console.error("Error creating email transporter:", error));
};

module.exports = sendmail;