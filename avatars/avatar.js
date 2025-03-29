export class Avatar {
  element;
  moods = [
    "neutral",
    "anxious",
    "happy",
    "happier",
    "happiest",
    "embarrassed",
    "unhappy",
  ];
  mood = "unhappy";
  confidenceLevel = 0;
  flashTimer = null;
  className = "avatar-sho";
  name = "Sho";
  pronouns = ["his", "he", "him"];

  constructor(element, className, name, pronouns) {
    this.element = element;
    this.setMood(this.mood);
    if (className) {
      this.className = className;
      this.name = name;
      this.pronouns = pronouns;
    }
    element.classList.add(this.className);
  }

  setMood(mood) {
    this.mood = mood;
    this.resetClasses();
    this.element.classList.add(mood);
  }

  setConfidenceLevel(num) {
    this.confidenceLevel = num;
    if (num > 0.9) {
      return this.setMood("happiest");
    }
    if (num > 0.7) {
      return this.setMood("happier");
    }
    if (num > 0.5) {
      return this.setMood("happy");
    }
    if (num > 0.3) {
      return this.setMood("neutral");
    }
    this.setMood("unhappy");
  }

  flashAnxious() {
    this.flashMood("anxious");
  }

  flashMood(mood) {
    this.resetClasses();
    this.element.classList.add(mood);
    this.flashTimer = setTimeout(() => {
      this.resetClasses();
      this.element.classList.add(this.mood);
    }, 1000);
  }

  resetClasses() {
    clearTimeout(this.flashTimer);
    this.flashTimer = null;
    this.element.classList.remove(...this.moods);
  }
}
