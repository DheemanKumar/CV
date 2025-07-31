(function () {
  // isExperienceFront is now a global variable declared in index.html

  // Particle system variables
  let canvas, ctx, particles, animationFrameId;
  const numParticles = 100; // Number of snowflakes
  const particleMinRadius = 10; // Increased size for image
  const particleMaxRadius = 20; // Increased size for image
  const particleMinVelocity = 0.5;
  const particleMaxVelocity = 2;
  let snowflakeImage; // To hold the loaded image

  function initParticles() {
    canvas = document.createElement('canvas');
    canvas.id = 'snow-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // Allow clicks to pass through
    canvas.style.zIndex = '9999'; // Ensure it's on top
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    snowflakeImage = new Image();
    snowflakeImage.src = '/images/Snowflakes.png'; // Path to your snowflake image
    snowflakeImage.onload = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle());
      }
      startParticles(); // Start particles after image loads
    };
    snowflakeImage.onerror = () => {
      console.error("Failed to load snowflake image. Falling back to circles.");
      // Fallback to drawing circles if image fails to load
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle(true)); // Pass true for fallback
      }
      startParticles(); // Start particles even if image fails
    };
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle(isFallback = false) {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * (particleMaxRadius - particleMinRadius) + particleMinRadius,
      velocity: Math.random() * (particleMaxVelocity - particleMinVelocity) + particleMinVelocity,
      opacity: Math.random() * 0.5 + 0.3,
      isFallback: isFallback // Flag to indicate if it's a fallback particle
    };
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.globalAlpha = p.opacity;

      // Apply glow effect
      ctx.shadowBlur = 10; // Adjust for desired glow intensity
      ctx.shadowColor = 'rgba(0, 191, 255, 0.8)'; // Blue glow

      if (snowflakeImage.complete && snowflakeImage.naturalWidth > 0 && !p.isFallback) {
        // Draw image if loaded and not fallback
        ctx.drawImage(snowflakeImage, p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      } else {
        // Draw circle as fallback
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }

      // Reset shadow properties to avoid affecting other elements
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      ctx.globalAlpha = 1; // Reset alpha
    });
  }

  function updateParticles() {
    particles.forEach(p => {
      p.y += p.velocity;
      if (p.y > canvas.height) {
        p.y = -p.radius; // Reset to top
        p.x = Math.random() * canvas.width; // New random x position
      }
    });
  }

  function animateParticles() {
    updateParticles();
    drawParticles();
    animationFrameId = requestAnimationFrame(animateParticles);
  }

  // Expose start and stop functions globally
  window.startParticles = function() {
    if (!canvas) {
      initParticles();
    } else if (!animationFrameId) {
      animateParticles();
    }
  };

  window.stopParticles = function() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Existing functions...
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
        // Add a small delay to allow the 'show' class transition to complete
        setTimeout(() => {
          showCards(nextCards);
        }, 200); // Adjust delay as needed
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

  document.addEventListener('DOMContentLoaded', () => {
    enableCardLinks();
    // Do NOT call initParticles here. It will be called by toggleTheme.
  });
})();
