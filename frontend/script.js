const backendURL = "https://your-render-url.onrender.com"; // 🔁 Replace with your actual backend URL

async function generateOTP() {
  const email = document.getElementById("email").value;
  const res = await fetch(`${backendURL}/generate-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  document.getElementById("message").innerText = data.message || data.error;
}

async function verifyOTP() {
  const email = document.getElementById("email").value;
  const otp = document.getElementById("otp").value;
  const res = await fetch(`${backendURL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp })
  });

  const data = await res.json();
  document.getElementById("message").innerText = data.message || data.error;
}
