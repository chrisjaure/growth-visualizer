import { Avatar } from "./avatar.js";
import skill from "./skills/public-speaking.js";

function createElementWithProps(tagName, props = {}) {
  const element = document.createElement(tagName);
  for (const key in props) {
    if (Object.hasOwn(props, key)) {
      if (key === "style") {
        Object.assign(element.style, props[key]);
      } else if (key === "textContent") {
        element.textContent = props[key];
      } else if (key === "innerHTML") {
        element.innerHTML = props[key];
      } else if (key === "children") {
        props[key].forEach((child) => element.appendChild(child));
      } else if (key.startsWith("on")) {
        element.addEventListener(key.substring(2).toLowerCase(), props[key]);
      } else {
        element[key] = props[key]; // For other properties like 'className', 'id', etc.
      }
    }
  }
  return element;
}

function rippleEffect(el) {
  const size = Math.max(el.offsetWidth, el.offsetHeight);
  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = createElementWithProps("div", {
    className: "ripple",
    style: {
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
    },
  });

  el.appendChild(ripple);

  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}

function triggerClick(index) {
  const barContainer = document.querySelector(".bar-container");
  const barElement = document.querySelector(".bar");
  const rect = barContainer.getBoundingClientRect();
  const parts = rect.width / 14;
  const x = rect.left + parts * index + parts * 4;
  const y = rect.top + rect.height / 2;

  const clickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: globalThis,
    clientX: x,
    clientY: y,
  });
  barElement.dispatchEvent(clickEvent);
}

function getSkillNode({ skill, onCancel, onProceed }) {
  return createElementWithProps("div", {
    className: "milestone",
    children: [
      createElementWithProps("h3", {
        textContent: skill.milestone,
      }),

      createElementWithProps("p", {
        textContent: skill.focus,
      }),

      createElementWithProps("div", {
        className: "actions",

        children: [
          createElementWithProps("button", {
            className: "cancel-button",
            textContent: "Don't do it... it's too scary.",
            onClick: onCancel,
          }),

          createElementWithProps("button", {
            className: "proceed-button",
            textContent: "Do it! Break outside your comfort zone!",
            onClick: (event) => onProceed(el, event),
          }),
        ],
      }),
    ],
  });
}

function renderSkillTree(container) {
  container.appendChild(
    createElementWithProps("h2", {
      className: "skill-description speech-bubble",
      textContent: `I want to improve in ${skill.description}.`,
    }),
  );

  container.appendChild(
    createElementWithProps("p", {
      textContent: `Alyssa's goal is: ⭐ ${skill.milestones.at(-1).milestone} ⭐`,
    }),
  );
  container.appendChild(
    createElementWithProps("p", {
      textContent: `Let's help Alyssa get there! Encourage her to do uncomfortable things to reach her goal. As you do, you will see her comfort zone growing!`,
    }),
  );

  container.appendChild(
    createElementWithProps("div", {
      className: "skill-tree",
      children: skill.milestones.map((skill, index) => {
        const el = getSkillNode({
          skill,
          onCancel: () => {
            el.classList.add("rejected");
            triggerClick(index - 1);
          },
          onProceed: (el) => {
            el.classList.remove("rejected");
            el.classList.add("complete");
            el.nextElementSibling?.scrollIntoView({ behavior: "smooth" });
            if (index === 9) {
              document.body.classList.add("complete");
              if (confetti) {
                // external lib
                confetti();
              }
            }
            triggerClick(index);
          },
        });
        return el;
      }),
    }),
  );
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
      avatar.setMood("embarrassed");
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
  renderSkillTree(narrativeContainer);
}

initialize();
