document.addEventListener("DOMContentLoaded", () => {
  const stars = document.getElementById("star-rating");
  const moodSelect = document.getElementById("mood-select");
  const messageBox = document.getElementById("message");
  const charCount = document.getElementById("char-count");
  const contactCheck = document.getElementById("contact-check");
  const contactInfo = document.getElementById("contact-info");
  const form = document.getElementById("feedback-form");
  const thankyou = document.getElementById("thankyou");

  if (!stars || !moodSelect || !messageBox || !form) {
    console.error("❌ One or more required elements are missing from the DOM.");
    return;
  }

  let selectedRating = 0;
  let selectedMood = "";

  // ⭐ Star rating setup
  stars.innerHTML = Array(5)
    .fill("☆")
    .map((s, i) => `<span data-val="${i + 1}" class="star">☆</span>`)
    .join("");

  stars.addEventListener("click", (e) => {
    if (e.target.dataset.val) {
      selectedRating = parseInt(e.target.dataset.val);
      [...stars.children].forEach((s, i) => {
        s.textContent = i < selectedRating ? "★" : "☆";
        s.classList.toggle("selected", i < selectedRating);
      });
    }
  });

  // 😊 Mood selection
  moodSelect.addEventListener("click", (e) => {
    if (e.target.dataset.mood) {
      selectedMood = e.target.dataset.mood;
      [...moodSelect.children].forEach((m) => m.classList.remove("active"));
      e.target.classList.add("active");
    }
  });

  // 📝 Character count
  messageBox.addEventListener("input", () => {
    charCount.textContent = `${messageBox.value.length} / 500`;
  });

  // ☑️ Contact info toggle
  if (contactCheck) {
    contactCheck.addEventListener("change", () => {
      contactInfo.style.display = contactCheck.checked ? "block" : "none";
    });
  }

  // 🚀 Submit feedback
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const category = document.getElementById("category")?.value || "";
    const message = messageBox.value.trim();
    const name = document.getElementById("name")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const screenshotFile = document.getElementById("screenshot")?.files[0];

    if (message.length < 20) {
      alert("Please enter at least 20 characters in feedback.");
      return;
    }

    const sendFeedback = async (screenshotBase64 = "") => {
      const feedbackEntry = {
        id: Date.now(),
        rating: selectedRating,
        mood: selectedMood,
        category,
        message,
        name,
        email,
        screenshot: screenshotBase64,
        timestamp: new Date().toISOString(),
      };

      try {
        // Get existing feedback from localStorage
        const existing = JSON.parse(localStorage.getItem("feedbackData") || "[]");
        existing.push(feedbackEntry);
        localStorage.setItem("feedbackData", JSON.stringify(existing));

        console.log("✅ Feedback saved:", feedbackEntry);

        form.reset();
        selectedRating = 0;
        selectedMood = "";
        [...stars.children].forEach((s) => {
          s.textContent = "☆";
          s.classList.remove("selected");
        });
        [...moodSelect.children].forEach((m) => m.classList.remove("active"));
        charCount.textContent = "0 / 500";

        thankyou.style.display = "block";
        setTimeout(() => (thankyou.style.display = "none"), 4000);
      } catch (err) {
        console.error("❌ Feedback error:", err);
        alert("⚠️ Failed to submit feedback");
      }
    };

    if (screenshotFile) {
      const reader = new FileReader();
      reader.onload = async () => {
        await sendFeedback(reader.result);
      };
      reader.readAsDataURL(screenshotFile);
    } else {
      await sendFeedback("");
    }
  });
});
