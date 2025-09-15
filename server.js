app.post("/send", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "dreamer250321@gmail.com",   // your Gmail
        pass: "wdho qbnk kago tdpm",       // your Gmail App Password
      },
      logger: true,
      debug: true
    });

    let mailOptions = {
      from: "dreamer250321@gmail.com",  // must match auth user
      to: "dreamer250321@gmail.com",    // recipient email
      replyTo: email,                   // user's email
      subject: subject,                 // ✅ user-provided subject
      text: `You got a new message:

Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "✅ Email sent successfully!" });
  } catch (err) {
    console.error("❌ Error while sending email:", err);
    res.status(500).json({ success: false, message: "❌ Failed to send email. Check server logs." });
  }
});
