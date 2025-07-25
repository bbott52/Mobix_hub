// ✅ Promo codes database with associated phone numbers (for reference only)
const promoList = [
  { code: "FREE00", phone: "08012345678" },
  { code: "DISCOUNT25", phone: "07098765432" },
  // Add more promo codes and phone numbers here
];

function goToSignup() {
  const enteredCode = document.getElementById("promoCode").value.trim().toUpperCase();

  const match = promoList.find(promo => promo.code === enteredCode);

  if (match) {
    // ✅ Redirect to signup.html with promo code and associated phone (for tracking)
    const url = `signup.html?promo=${encodeURIComponent(match.code)}&phone=${encodeURIComponent(match.phone)}`;
    window.location.href = url;
  } else if (enteredCode === "") {
    // ✅ No promo, go to signup without params
    window.location.href = "signup.html";
  } else {
    // ❌ Invalid code entered
    alert("Invalid promo code");
  }
}

function scrollToPromo() {
  document.getElementById("promo-section").scrollIntoView({ behavior: "smooth" });
}

// ✅ On the signup.html page (Auto-fill promo code)
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const promo = params.get("promo");
  if (promo) {
    const promoInput = document.getElementById("promoInput");
    if (promoInput) {
      promoInput.value = promo;
    }
  }
});