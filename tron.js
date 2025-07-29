

function flipContent() {
  const front = document.querySelector('.animation-front');
  const back = document.querySelector('.animation-back');
  const frontTitle = document.getElementById('animation-title');
  const backTitle = document.getElementById('animation-title-back');

  const frontCards = front.querySelectorAll('.card');
  const backCards = back.querySelectorAll('.card');

  const currentTitle = isExperienceFront ? frontTitle : backTitle;
  const currentCards = isExperienceFront ? frontCards : backCards;

  const nextTitle = isExperienceFront ? backTitle : frontTitle;
  const nextCards = isExperienceFront ? backCards : frontCards;

  // Step 1: Delete cards
  deleteCards(currentCards, () => {
    // Step 2: Delete title text
    deleteText(currentTitle, () => {
      // Toggle view
      front.classList.toggle('show');
      back.classList.toggle('show');
      // Ensure the full text is present before typing animation starts
      nextTitle.textContent = nextTitle.dataset.full || '';
      // Step 3: Type new title
      typeText(nextTitle, () => {
        // Step 4: Show new cards
        showCards(nextCards);
      });
    });
  });

  isExperienceFront = !isExperienceFront;
}

function deleteCards(cards, callback) {
  let i = cards.length - 1;
  function hide() {
    if (i >= 0) {
      cards[i--].style.opacity = 0;
      setTimeout(hide, 100);
    } else {
      callback();
    }
  }
  hide();
}

function deleteText(el, callback) {
  console.log('deleteText: Deleting text from element:', el.id, 'Current text:', el.textContent);
  let text = el.textContent;
  let i = text.length;
  function erase() {
    if (i > 0) {
      el.textContent = text.slice(0, --i);
      setTimeout(erase, 30);
    } else {
      console.log('deleteText: Text deletion complete for element:', el.id);
      el.textContent = ''; // Ensure text is fully cleared
      callback();
    }
  }
  erase();
}

function typeText(el, callback) {
  const fullText = el.dataset.full || '';
  console.log('typeText: Typing text into element:', el.id, 'Full text to type:', fullText);
  // Ensure the element is visible and correctly oriented before typing
  el.style.opacity = 1;
  el.style.transform = 'rotateX(0deg)';
  let i = 0;
  function type() {
    if (i <= fullText.length) {
      el.textContent = fullText.slice(0, i++);
      setTimeout(type, 40);
    } else {
      console.log('typeText: Text typing complete for element:', el.id);
      callback();
    }
  }
  type();
}

function showCards(cards) {
  let i = 0;
  function show() {
    if (i < cards.length) {
      cards[i++].style.opacity = 1;
      setTimeout(show, 100);
    }
  }
  show();
}

// Global variable to store the currently active flickering elements for the current burst
let currentActiveFlickerElements = [];

// Function to apply/remove glow based on random chance (for rapid flickering)
// This function now operates ONLY on the elements passed to it.
function applyFlickerGlow(elementsToFlicker) {
  elementsToFlicker.forEach(el => {
    if (Math.random() < 0.5) { // 50% chance to be glowing
      el.classList.add('glow-effect');
    } else {
      el.classList.remove('glow-effect');
    }
  });
}

// Function to clear all glow effects (remains the same)
function clearAllGlows() {
  const allGlowElements = document.querySelectorAll('.container, .navbar, .fantasy-header, .fantasy-card, .profile-block, .skill-badge, .animation-card, .card, .parchment-footer, .icon-container');
  allGlowElements.forEach(el => {
    el.classList.remove('glow-effect');
  });
}

let flickerInterval; // To store the rapid flicker interval ID
let isFlickering = false;

function startFlickeringBurst() {
  if (isFlickering) return; // Prevent multiple bursts from starting

  isFlickering = true;

  // 1. Determine the subset of elements that will flicker for THIS burst
  const allPossibleGlowElements = Array.from(document.querySelectorAll('.container, .navbar, .fantasy-header, .fantasy-card, .profile-block, .skill-badge, .animation-card, .card, .parchment-footer, .icon-container'));
  currentActiveFlickerElements = [];
  allPossibleGlowElements.forEach(el => {
    if (Math.random() < 0.2) { // 50% chance for an element to be part of the active flickering set for this burst
      currentActiveFlickerElements.push(el);
    }
  });

  // Start rapid flickering for the selected subset
  flickerInterval = setInterval(() => {
    applyFlickerGlow(currentActiveFlickerElements);
  }, 100); // Rapid flickering every 100ms

  // Stop flickering after a random duration (e.g., 1 to 3 seconds)
  const flickerDuration = Math.random() * 2000 + 1000; // 1000ms (1s) to 3000ms (3s)
  setTimeout(() => {
    clearInterval(flickerInterval); // Stop rapid flickering
    clearAllGlows(); // Ensure all glows are off
    isFlickering = false;
    currentActiveFlickerElements = []; // Clear the active set for the next burst

    // Wait for a random rest period (e.g., 3 to 7 seconds) before the next burst
    const restDuration = Math.random() * 2000 + 1000; // 3000ms (3s) to 7000ms (7s)
    setTimeout(startFlickeringBurst, restDuration);
  }, flickerDuration);
}

// Start the first flickering burst when the script loads
startFlickeringBurst();


