import milestones from "./milestones.js";

function rippleEffect(el) {
  const ripple = document.createElement("div");
  ripple.classList.add("ripple");

  const size = Math.max(el.offsetWidth, el.offsetHeight);
  ripple.style.width = ripple.style.height = `${size}px`;

  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  el.appendChild(ripple);

  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}

function triggerClick(index) {
  const barContainer = document.querySelector(".bar-container");
  const barElement = document.querySelector(".bar");
  const rect = barContainer.getBoundingClientRect();
  const x = rect.left + (rect.width / 14) * index + (rect.width / 14) * 4;
  const y = rect.top + 10;

  const clickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: x,
    clientY: y,
  });
  barElement.dispatchEvent(clickEvent);
}

function renderMilestones(container) {
  const text = milestones.map((milestone, index) => {
    const el = document.createElement("div");
    el.className = "milestone";
    el.dataset.index = index;
    const header = document.createElement("h2");
    header.textContent = milestone.milestone;
    el.appendChild(header);
    const body = document.createElement("p");
    body.textContent = milestone.focus;
    el.appendChild(body);
    return el;
  });
  text.forEach((child) => {
    container.appendChild(child);
  });
  const containerRect = container.getBoundingClientRect();
  const topOffset = containerRect.top;
  const height = containerRect.height;
  const part = height / text.length;
  let currentIndex = -1;
  globalThis.addEventListener("scroll", () => {
    const scrollY = globalThis.scrollY;
    requestAnimationFrame(() => {
      const newIndex = Math.floor((scrollY - topOffset) / part);
      if (currentIndex !== newIndex && newIndex >= 0) {
        if (newIndex - currentIndex < 0) {
          container.classList.add("reverse");
        } else {
          container.classList.remove("reverse");
        }
        currentIndex = newIndex;
        triggerClick(newIndex);
      }
    });
  });
}

function initialize() {
  const barContainer = document.querySelector(".bar-container");
  const actionElement = document.querySelector(".action");
  const barElement = document.querySelector(".bar");
  const comfortZone = document.querySelector(".comfort-zone");
  const growthZone = document.querySelector(".growth-zone");
  const narrativeContainer = document.querySelector(".narrative");
  let newPosition = 0;

  barElement.addEventListener("click", (event) => {
    rippleEffect(barElement);

    barContainer.classList.remove(
      "comfort-zone-clicked",
      "growth-zone-clicked",
    );

    const rect = barContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    newPosition = clickX; // No need for percentage

    barContainer.style.setProperty("--action-position", `${newPosition}px`);
    actionElement.classList.remove("visible");
    void actionElement.offsetWidth; // Force reflow
    actionElement.classList.add("visible");
    if (event.target === comfortZone) {
      barContainer.classList.add("comfort-zone-clicked");
    }
    if (event.target === growthZone) {
      barContainer.classList.add("growth-zone-clicked");
    }
  });

  actionElement.addEventListener("animationend", () => {
    actionElement.classList.remove("visible");
  });

  renderMilestones(narrativeContainer);
}

initialize();
