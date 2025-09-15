require('dotenv').config(); // Load environment variables from .env

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// POST route to send email
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  // Log incoming data for debugging
  console.log("📩 Incoming data:", req.body);

  // Basic validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ success: false, message: "❌ All fields are required." });
  }

  try {
    // Create transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Use TLS port for better compatibility on cloud platforms
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // Helps avoid SSL issues on Render
      },
      logger: true,
      debug: true
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: "New Contact Form Submission",
      text: `You got a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Wrap sendMail in a Promise to ensure proper async handling
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("❌ Email error:", err);
          reject(err);
        } else {
          console.log("✅ Email sent:", info.response);
          resolve(info);
        }
      });
    });

    res.status(200).json({ success: true, message: "✅ Email sent successfully!" });
  } catch (err) {
    console.error("❌ Error while sending email:", err);
    res.status(500).json({ success: false, message: "❌ Failed to send email. Check server logs." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});