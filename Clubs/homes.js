/* Explore Now JS Start */

function smoothScrolls(target) {
    const targetElement = document.querySelector(target);
    if (targetElement) {
      const targetPosition = targetElement.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 800;
      let start = null;
  
      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
        if (progress < duration) {
          window.requestAnimationFrame(step);
        }
      }
  
      function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
      }
  
      window.requestAnimationFrame(step);
    }
  }
  
  /* Explore Now JS End */
  
  /* Menu in Phone View Start */
  function toggleMenu() {
    var sideMenu = document.querySelector('.side-menu');
    sideMenu.classList.toggle('menu-open');
  }
  /* Menu in Phone View end */
  
  /* About Code Start */
  
  function smoothScroll(target) {
    var targetElement = document.querySelector(target);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
    }
  }
  
  document.querySelector('.about').addEventListener('click', function (event) {
    event.preventDefault();
    smoothScroll(this.getAttribute('href'));
  });
  
  /* About Code End */
  
  /* Innovatoion Cards automatic Start */
  
  var myIndex = 0;
  var slideshowTimer;
  
  function carousel() {
    var i;
    var x = document.getElementsByClassName("slide");
  
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
  
    myIndex++;
    if (myIndex > x.length) {
      myIndex = 1;
    }
  
    x[myIndex - 1].style.display = "block";
  
    // Clear the existing timer
    clearTimeout(slideshowTimer);
  
    // Set a new timer for the next image
    slideshowTimer = setTimeout(carousel, 6000);
  }
  
  function plusSlides(n) {
    showSlides(myIndex += n);
  }
  
  function showSlides(n) {
    var slides = document.getElementsByClassName("slide");
  
    if (n > slides.length) {
      myIndex = 1;
    } else if (n < 1) {
      myIndex = slides.length;
    }
  
    for (var i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
  
    slides[myIndex - 1].style.display = "block";
  }
  
  function pauseSlideshow() {
    clearTimeout(slideshowTimer);
  }
  
  function resumeSlideshow() {
    // Ensure that the slideshow continues after resuming
    slideshowTimer = setTimeout(carousel, 6000);
  }
  
  document.querySelector(".prev").addEventListener("click", function () {
    plusSlides(-1);
    pauseSlideshow();
  });
  
  document.querySelector(".next").addEventListener("click", function () {
    plusSlides(1);
    pauseSlideshow();
  });
  
  // Initial call to start the carousel
  carousel();
  