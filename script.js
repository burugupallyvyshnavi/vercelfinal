// =========================
// CHAT BOX FUNCTIONALITY
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const chatBubble = document.getElementById("chat-bubble");
  const chatBox = document.getElementById("chat-box");
  const closeChat = document.getElementById("close-chat");
  const whatsappBtn = document.querySelector(".floating-whatsapp");
  const sendBtn = document.getElementById("send-btn");
  const chatInput = document.getElementById("chat-input");
  const chatBody = document.querySelector(".chat-body");

  if (chatBubble && chatBox && closeChat) {

    chatBubble.addEventListener("click", () => {
      chatBox.style.display = "flex";
      chatBubble.style.display = "none";
      whatsappBtn?.classList.add("chat-open");
    });

    closeChat.addEventListener("click", () => {
      chatBox.style.display = "none";
      chatBubble.style.display = "flex";
      whatsappBtn?.classList.remove("chat-open");
    });

    sendBtn?.addEventListener("click", () => {
      const message = chatInput.value.trim();
      if (message) {
        const userMsg = document.createElement("p");
        userMsg.textContent = "You: " + message;
        chatBody.appendChild(userMsg);
        chatInput.value = "";
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    });
  }
});


// =========================
// GET FREE QUOTE POPUP
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const quoteBtn = document.querySelector(".quote-btn");
  const designerModal = document.getElementById("designerModal");
  const closeDesigner = document.getElementById("closeDesigner");

  if (quoteBtn && designerModal) {
    quoteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      designerModal.style.display = "flex";
    });

    closeDesigner?.addEventListener("click", () => {
      designerModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === designerModal) designerModal.style.display = "none";
    });
  }
});


// =========================
// CONSULTATION TWO-STEP POPUP
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const openBtns = document.querySelectorAll(".consult-btn, .consultation-btn");
  const consultModal = document.getElementById("consultModal");
  const closeConsult = document.getElementById("closeConsult");

  const step1 = document.querySelector(".step-1");
  const step2 = document.querySelector(".step-2");

  const nextBtn = step1?.querySelector(".next-btn");
  const backBtn = step2?.querySelector(".back-btn");

  openBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (consultModal) {
        consultModal.style.display = "flex";
        step1.classList.add("active");
        step2.classList.remove("active");
      }
    });
  });

  closeConsult?.addEventListener("click", () => {
    consultModal.style.display = "none";
    step1?.classList.add("active");
    step2?.classList.remove("active");
  });

  nextBtn?.addEventListener("click", () => {
    step1.classList.remove("active");
    step2.classList.add("active");
  });

  backBtn?.addEventListener("click", () => {
    step2.classList.remove("active");
    step1.classList.add("active");
  });

  window.addEventListener("click", (e) => {
    if (e.target === consultModal) {
      consultModal.style.display = "none";
      step1?.classList.add("active");
      step2?.classList.remove("active");
    }
  });
});


// =========================
// CONNECT ALL FORMS TO MONGODB API
// =========================
document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "http://localhost:3000/submit";

  function collectFormData(container) {
    const data = {};
    const fields = container.querySelectorAll("input, select, textarea");

    fields.forEach((field) => {
      if ((field.type === "radio" || field.type === "checkbox") && !field.checked) return;
      if (!field.name) return;
      data[field.name] = field.value;
    });

    return data;
  }

  // ALL <form> tags
  const allForms = document.querySelectorAll("form");

  allForms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = collectFormData(form);
      data.formType = form.dataset.formType || form.id || "general-form";

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.message || "Thank you! We will contact you soon.");
        form.reset();

      } catch (err) {
        alert("Something went wrong, please try again.");
        console.error(err);
      }
    });
  });

  // KITCHEN ESTIMATE PAGE
  if (window.location.href.includes("kitchen-estimate.html")) {
    const container = document.querySelector(".form-wrapper");
    const submitBtn = document.querySelector(".submit-btn");

    submitBtn.addEventListener("click", async () => {
      const data = collectFormData(container);
      data.formType = "kitchen-estimate";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert(result.message || "Kitchen estimate submitted!");
    });
  }

  // WARDROBE ESTIMATE PAGE
  if (window.location.href.includes("wardrobe-estimate.html")) {
    const container = document.querySelector(".form-wrapper");
    const submitBtn = document.querySelector(".submit-btn");

    submitBtn.addEventListener("click", async () => {
      const data = collectFormData(container);
      data.formType = "wardrobe-estimate";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert(result.message || "Wardrobe estimate submitted!");
    });
  }
});


// =========================
// CONSULTATION FORM STEP DATA COPY
// =========================
document.querySelector(".next-btn")?.addEventListener("click", () => {
  const name = document.querySelector('#consultFormStep1 input[name="name"]').value;
  const phone = document.querySelector('#consultFormStep1 input[name="phone"]').value;
  const whatsapp = document.querySelector('#consultFormStep1 input[name="whatsapp_updates"]').checked;

  document.querySelector('#consultFormFinal input[name="name"]').value = name;
  document.querySelector('#consultFormFinal input[name="phone"]').value = phone;
  document.querySelector('#consultFormFinal input[name="whatsapp_updates"]').value = whatsapp;
});


// =========================
// UNIVERSAL MULTI-STEP FORM HANDLER
// Works for estimate, kitchen, wardrobe
// =========================

document.addEventListener("DOMContentLoaded", () => {

  // --- ESTIMATE PAGE ---
  if (window.location.href.includes("estimate.html")) {

    const steps = document.querySelectorAll(".form-step");
    const nextBtns = document.querySelectorAll(".next-btn");
    const backBtns = document.querySelectorAll(".back-btn");
    const indicator = document.querySelectorAll(".progress-step");
    const bar = document.getElementById("progress");

    let i = 0;

    function update() {
      steps.forEach((s, idx) => s.classList.toggle("active", idx === i));
      indicator.forEach((d, idx) => d.classList.toggle("active", idx <= i));
      bar.style.width = (i / (steps.length - 1)) * 100 + "%";
    }

    nextBtns.forEach(btn => btn.addEventListener("click", () => {
      if (i < steps.length - 1) {
        i++;
        update();
      }
    }));

    backBtns.forEach(btn => btn.addEventListener("click", () => {
      if (i > 0) {
        i--;
        update();
      }
    }));

    update();
  }


  // --- KITCHEN PAGE ---
  if (window.location.href.includes("kitchen-estimate.html")) {

    const steps = document.querySelectorAll(".kitchen-step");
    const nextBtns = document.querySelectorAll(".kitchen-next");
    const backBtns = document.querySelectorAll(".kitchen-back");
    const indicator = document.querySelectorAll(".kitchen-progress-step");
    const bar = document.getElementById("kitchen-progress");

    let i = 0;

    function update() {
      steps.forEach((s, idx) => s.classList.toggle("active", idx === i));
      indicator.forEach((d, idx) => d.classList.toggle("active", idx <= i));
      bar.style.width = (i / (steps.length - 1)) * 100 + "%";
    }

    nextBtns.forEach(btn => btn.addEventListener("click", () => {
      if (i < steps.length - 1) {
        i++;
        update();
      }
    }));

    backBtns.forEach(btn => btn.addEventListener("click", () => {
      if (i > 0) {
        i--;
        update();
      }
    }));

    update();
  }


  // --- WARDROBE PAGE ---
  if (window.location.href.includes("wardrobe-estimate.html")) {

    const steps = document.querySelectorAll(".wardrobe-step");
    const nextBtns = document.querySelectorAll(".wardrobe-next");
    const backBtns = document.querySelectorAll(".wardrobe-back");
    const indicator = document.querySelectorAll(".wardrobe-progress-step");
    const bar = document.getElementById("wardrobe-progress");

    let i = 0;

    function update() {
      steps.forEach((s, idx) => s.classList.toggle("active", idx === i));
      indicator.forEach((d, idx) => d.classList.toggle("active", idx <= i));
      bar.style.width = (i / (steps.length - 1)) * 100 + "%";
    }

    nextBtns.forEach(btn => btn.addEventListener("click", () => {
      if (i < steps.length - 1) {
        i++;
        update();
      }
    }));

    backBtns.forEach(btn => btn.addEventListener("click", () => {
      if (i > 0) {
        i--;
        update();
      }
    }));

    update();
  }

});

