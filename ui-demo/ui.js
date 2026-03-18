// Buttons
document.getElementById("alertBtn").addEventListener("click", () => {
  alert("Accessible Button clicked!");
});

// Cards
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    alert(card.querySelector("h3").innerText + " clicked");
  });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      alert(card.querySelector("h3").innerText + " activated via keyboard");
    }
  });
});

// Modal
const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");

openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.classList.add("hidden");
});