(function () {
  // isExperienceFront is now a global variable declared in index.html

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
    console.log('flipTitle: Starting title flip.');
    console.log('flipTitle: oldEl ID:', oldEl.id, 'newEl ID:', newEl.id);
    console.log('flipTitle: oldEl textContent:', oldEl.textContent);
    console.log('flipTitle: newEl data-full:', newEl.dataset.full);

    // Hide old title with flip
    oldEl.style.transition = 'transform 0.3s ease, opacity 0.3s';
    oldEl.style.transform = 'rotateX(90deg)';
    oldEl.style.opacity = 0;

    setTimeout(() => {
      console.log('flipTitle: Old title hidden. Preparing new title.');
      // Prep new title (flipped backward and hidden)
      newEl.style.transform = 'rotateX(-90deg)';
      newEl.style.opacity = 0;
      newEl.style.display = 'block';
      newEl.textContent = newEl.dataset.full; // Set the text content

      setTimeout(() => {
        console.log('flipTitle: New title prepared. Animating into view.');
        // Animate new title into view
        newEl.style.opacity = 1;
        newEl.style.transition = 'transform 0.3s ease, opacity 0.3s';
        newEl.style.transform = 'rotateX(0deg)';

        setTimeout(() => {
          console.log('flipTitle: New title animation complete. Calling callback.');
          callback();
        }, 300);
      }, 50);
    }, 300);
  }

  // Make cards clickable if data-href is set
  function enableCardLinks() {
    document.querySelectorAll('.card[data-href]').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function (e) {
        const href = card.getAttribute('data-href');
        if (href) {
          window.open(href, '_blank');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', enableCardLinks);
})();
