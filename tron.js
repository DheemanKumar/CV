

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
  let text = el.textContent;
  let i = text.length;
  function erase() {
    if (i > 0) {
      el.textContent = text.slice(0, --i);
      setTimeout(erase, 30);
    } else {
      callback();
    }
  }
  erase();
}

function typeText(el, callback) {
  const fullText = el.dataset.full || '';
  let i = 0;
  function type() {
    if (i <= fullText.length) {
      el.textContent = fullText.slice(0, i++);
      setTimeout(type, 40);
    } else {
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
