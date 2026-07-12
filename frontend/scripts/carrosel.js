document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("[data-hero-carousel]");

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll(".hero__slide"));
  const backgrounds = Array.from(carousel.querySelectorAll(".hero__background"));
  const dots = Array.from(carousel.querySelectorAll("[data-hero-dot]"));
  const prevButton = carousel.querySelector("[data-hero-prev]");
  const nextButton = carousel.querySelector("[data-hero-next]");
  const intervalTime = 6000;
  let currentSlide = 0;
  let intervalId;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentSlide);
    });

    backgrounds.forEach((background, backgroundIndex) => {
      background.classList.toggle("is-active", backgroundIndex === currentSlide);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentSlide);
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function restartTimer() {
    clearInterval(intervalId);
    intervalId = setInterval(nextSlide, intervalTime);
  }

  if (slides.length <= 1) {
    return;
  }

  nextButton?.addEventListener("click", () => {
    nextSlide();
    restartTimer();
  });

  prevButton?.addEventListener("click", () => {
    prevSlide();
    restartTimer();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.heroDot));
      restartTimer();
    });
  });

  restartTimer();
});
