require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/send", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "❌ All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true,
      debug: true
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: subject,
      text: `You got a new message:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "✅ Email sent successfully!" });
  } catch (err) {
    console.error("❌ Error while sending email:", err);
    res.status(500).json({ success: false, message: "❌ Failed to send email. Check server logs." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});