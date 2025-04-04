const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let otpStore = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/generate-otp", async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;
  
    otpStore[email] = { otp, expiresAt };
  
    try {
      await sendOTPEmail(email, otp);
      res.json({ message: "OTP sent to email" });
    } catch (error) {
      console.error("Email sending failed:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });
  

app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ error: "OTP not found" });
  if (Date.now() > record.expiresAt) return res.status(400).json({ error: "OTP expired" });

  if (record.otp === otp) {
    delete otpStore[email];
    return res.json({ message: "OTP verified successfully" });
  }

  return res.status(400).json({ error: "Invalid OTP" });
});

app.get("/", (req, res) => res.send("OTP Generator Backend Running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
async function sendOTPEmail(to, otp) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: `"OTP Service" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };
  
    await transporter.sendMail(mailOptions);
  }
  