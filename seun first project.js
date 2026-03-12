document.addEventListener("DOMContentLoaded", function () {
  const jsButton = document.getElementById("jsButton");
  if (jsButton) {
    jsButton.addEventListener("click", function () {
      alert("JavaScript is working! 🎉");
    });
  }

  const typedTextNode = document.getElementById("typedText");
  const phrases = ["Web Developer", "UI/UX Enthusiast", "JavaScript Ninja", "Problem Solver"];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    if (!typedTextNode) return;
    const current = phrases[phraseIndex];
    typedTextNode.textContent = current.substring(0, charIndex);

    if (!isDeleting && charIndex < current.length) {
      charIndex++;
      setTimeout(typeLoop, 120);
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      setTimeout(typeLoop, 60);
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) {
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      setTimeout(typeLoop, isDeleting ? 500 : 1200);
    }
  }
  typeLoop();

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = contactForm.querySelector("input[type='text']").value.trim();
      const email = contactForm.querySelector("input[type='email']").value.trim();
      const message = contactForm.querySelector("textarea").value.trim();

      if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      alert("Message sent successfully! Thank you, " + name + " 👏");
      contactForm.reset();
    });
  }

  // Scroll reveal for elements with class .reveal
  const reveals = document.querySelectorAll(".reveal");
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, observerOptions);

  reveals.forEach((el) => revealObserver.observe(el));

  // Theme persistence with localStorage
  const nav = document.querySelector(".navbar");
  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  if (nav) {
    const btn = document.createElement("button");
    btn.textContent = savedTheme === "dark" ? "Light Mode" : "Dark Mode";
    btn.className = "btn";
    btn.style.marginLeft = "10px";

    btn.addEventListener("click", function () {
      const isDark = document.body.classList.toggle("dark-theme");
      btn.textContent = isDark ? "Light Mode" : "Dark Mode";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    nav.appendChild(btn);
  }
});