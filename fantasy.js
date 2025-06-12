(function () {
  let isExperienceFront = true;

  window.flipContent = function () {
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

    // Step 1: Shrink and fade out current cards
    deleteCards(currentCards, () => {
      // Step 2: Flip the title
      flipTitle(currentTitle, nextTitle, () => {
        // Step 3: Swap content
        front.classList.toggle('show');
        back.classList.toggle('show');

        // Step 4: Enlarge and fade in new cards
        showCards(nextCards);
      });
    });

    isExperienceFront = !isExperienceFront;
  };

  function deleteCards(cards, callback) {
    let i = cards.length - 1;
    function shrink() {
      if (i >= 0) {
        const card = cards[i--];
        card.style.transition = 'transform 0.2s, opacity 0.2s';
        card.style.transform = 'scale(0.8)';
        card.style.opacity = 0;
        setTimeout(shrink, 100);
      } else {
        callback();
      }
    }
    shrink();
  }

  function showCards(cards) {
    let i = 0;
    function grow() {
      if (i < cards.length) {
        const card = cards[i++];
        card.style.transition = 'transform 0.2s, opacity 0.2s';
        card.style.transform = 'scale(1)';
        card.style.opacity = 1;
        setTimeout(grow, 100);
      }
    }
    grow();
  }

  function flipTitle(oldEl, newEl, callback) {
    // Hide old title with flip
    oldEl.style.transition = 'transform 0.3s ease, opacity 0.3s';
    oldEl.style.transform = 'rotateX(90deg)';
    oldEl.style.opacity = 0;

    setTimeout(() => {
      // Prep new title (flipped backward and hidden)
      newEl.style.transform = 'rotateX(-90deg)';
      newEl.style.opacity = 0;
      newEl.style.display = 'block';

      setTimeout(() => {
        // Animate new title into view
        newEl.style.opacity = 1;
        newEl.style.transition = 'transform 0.3s ease, opacity 0.3s';
        newEl.style.transform = 'rotateX(0deg)';

        setTimeout(callback, 300);
      }, 50);
    }, 300);
  }
})();
