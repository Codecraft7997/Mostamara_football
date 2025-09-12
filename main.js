window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});


const API_URL = "https://example.com/api/predictions";
function updateCountdowns() {
  const now = new Date().getTime();
  document.querySelectorAll(".match").forEach(match => {
    const deadline = new Date(match.dataset.deadline).getTime();
    const diff = deadline - now;
    const countdownEl = match.querySelector(".countdown");
    const input = match.querySelector("input");
    const button = match.querySelector(".submit");

    if (diff <= 0) {
      countdownEl.textContent = "تم إغلاق التوقع";
      countdownEl.classList.add("closed");
      input.disabled = true;
      button.disabled = true;
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      countdownEl.textContent = `يغلق بعد: ${hours} س ${mins} د ${secs} ث`;
    }
  });
}

document.querySelectorAll(".match").forEach(match => {
  const id = match.dataset.id;
  const input = match.querySelector("input");
  const button = match.querySelector(".submit");
  const savedMsg = match.querySelector(".saved");

  button.addEventListener("click", async () => {
    const prediction = input.value.trim();
    if (!prediction) {
      savedMsg.textContent = " من فضلك اكتب توقع أولاً";
      savedMsg.style.color = "red";
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: id, prediction })
      });
      if (res.ok) {
        savedMsg.textContent = " تم إرسال التوقع";
        savedMsg.style.color = "green";
      } else {
        savedMsg.textContent = " حصل خطأ أثناء الإرسال";
        savedMsg.style.color = "red";
      }
    } catch (err) {
      savedMsg.textContent = " السيرفر غير متاح";
      savedMsg.style.color = "red";
    }
  });
});

setInterval(updateCountdowns, 1000);
updateCountdowns();
