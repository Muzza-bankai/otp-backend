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

app.post("/generate-otp", (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore[email] = { otp, expiresAt };
  console.log(`OTP for ${email}: ${otp}`);

  res.json({ message: "OTP generated", otp }); // Remove `otp` in production
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
