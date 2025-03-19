function rippleEffect(el) {
  const ripple = document.createElement('div');
  ripple.classList.add('ripple');

  const size = Math.max(el.offsetWidth, el.offsetHeight);
  ripple.style.width = ripple.style.height = `${size}px`;

  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  el.appendChild(ripple);

  ripple.addEventListener('animationend', () => {
    ripple.remove();
  }, {});
}

export function initialize() {
  const barContainer = document.querySelector('.bar-container');
  const actionElement = document.querySelector('.action');
  const barElement = document.querySelector('.bar');
  const comfortZone = document.querySelector('.comfort-zone');
  const growthZone = document.querySelector('.growth-zone');
  let newPosition = 0;
  let isAnimating = false;

  barElement.addEventListener('click', (event) => {
    if (isAnimating) return;
    
    isAnimating = true;
    rippleEffect(barElement);

    barContainer.classList.remove('comfort-zone-clicked', 'growth-zone-clicked');

    const rect = barContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    newPosition = clickX; // No need for percentage

    barContainer.style.setProperty('--action-position', `${newPosition}px`);
    actionElement.classList.add('visible');
    if (event.target === comfortZone) {
      barContainer.classList.add('comfort-zone-clicked');
    }
    if (event.target === growthZone) {
      barContainer.classList.add('growth-zone-clicked');
    }
    
    // Trigger the animation
    void actionElement.offsetWidth; // Force reflow
    barElement.classList.add('animate'); // Start
  });

  actionElement.addEventListener('animationend', () => {
    actionElement.classList.remove('visible');
  });

  barElement.addEventListener('animationend', (event) => {
    if (event.target !== barElement) return;
    barElement.classList.remove('animate');
    barContainer.style.setProperty('--start-position', `calc(${newPosition}px - var(--comfort-percent) + 1px)`);
    isAnimating = false;
  });
}

initialize();
