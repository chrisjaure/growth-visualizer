import { Avatar } from "./avatar.js";
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
  const y = rect.top + rect.height / 2;

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
  const topOffset = containerRect.top + globalThis.scrollY;
  const height = containerRect.height;
  const part = height / text.length;

  let currentIndex = -1;
  globalThis.addEventListener("scroll", () => {
    const scrollY = globalThis.scrollY;
    requestAnimationFrame(() => {
      const newIndex = Math.floor((scrollY - topOffset) / part);
      if (currentIndex !== newIndex && newIndex >= -1) {
        if (newIndex < currentIndex) {
          container.classList.add("reverse");
          container.children[currentIndex].classList.remove('complete');
        } else {
          container.classList.remove("reverse");
          container.children[newIndex].classList.add('complete');
        }
        currentIndex = newIndex;
        triggerClick(newIndex);
      }
    });
  });
}

function setHandlers({
  barContainer,
  actionElement,
  barElement,
  comfortZone,
  avatar,
}) {
  barElement.addEventListener("click", (event) => {
    rippleEffect(barElement);

    barContainer.classList.remove(
      "comfort-zone-clicked",
      "growth-zone-clicked",
    );

    const rect = barContainer.getBoundingClientRect();
    const comfortRect = comfortZone.getBoundingClientRect();
    const newPosition = event.clientX - rect.left;
    const confidenceLevel = newPosition / rect.width;

    barContainer.style.setProperty("--action-position", `${newPosition}px`);
    actionElement.classList.remove("visible");
    void actionElement.offsetWidth; // Force reflow
    actionElement.classList.add("visible");

    avatar.setConfidenceLevel(confidenceLevel);
    if (
      event.clientX >= comfortRect.left &&
      event.clientX <= comfortRect.left + comfortRect.width
    ) {
      barContainer.classList.add("comfort-zone-clicked");
      avatar.flashMood("embarrassed");
    } else {
      barContainer.classList.add("growth-zone-clicked");
      avatar.flashAnxious();
    }
  });

  actionElement.addEventListener("animationend", () => {
    actionElement.classList.remove("visible");
  });
}

function initialize() {
  const barContainer = document.querySelector(".bar-container");
  const actionElement = document.querySelector(".action");
  const barElement = document.querySelector(".bar");
  const comfortZone = document.querySelector(".comfort-zone");
  const narrativeContainer = document.querySelector(".narrative");
  const avatar = new Avatar(document.querySelector(".avatar"));

  setHandlers({
    barContainer,
    actionElement,
    barElement,
    comfortZone,
    avatar,
  });
  renderMilestones(narrativeContainer);
}

initialize();
