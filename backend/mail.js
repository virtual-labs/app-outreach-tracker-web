const nodemailer = require("nodemailer");
const username = process.env.SENDER_EMAIL;
const password = process.env.SENDER_PASSWORD;

const sendmail = async (to, content) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",  // Gmail SMTP server
        port: 465,
        secure: true, // true for port 465, false for port 587
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
        subject: content.subject,
        text: content.body,
        html: content.html
    })
        .then(() => console.log("Mail sent"))
        .catch(error => console.error("Error sending email:", error));
};

module.exports = sendmail;