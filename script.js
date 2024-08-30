// script.js
window.onscroll = function () {
  addBorderOnScroll();
  addScrollTopButtonOnScroll();
};

// this add a border to the navbar when the content is scrolled

function addBorderOnScroll() {
  const navbar = document.getElementById("navbar");
  if (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60) {
    navbar.classList.add("scroll-border");
  } else {
    navbar.classList.remove("scroll-border");
  }
}

// this add a button on the bottom right corner that allows to scroll up to the top

function addScrollTopButtonOnScroll() {
  const scrollup = document.getElementById("scroll-up");
  if (
    document.body.scrollTop > 800 ||
    document.documentElement.scrollTop > 800
  ) {
    scrollup.classList.remove("hidden");
  } else {
    scrollup.classList.add("hidden");
  }
}

// this makes the content scroll smoothly when anchors are clicked

document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll('a[href^="#"]');
  const mobileBreakpoint = 480;
  const tabletBreakpoint = 800;

  function calculateOffset(width) {
    if (width < mobileBreakpoint) {
      // For mobile, let's say we want the offset to range from 100 to 512
      return 100 + (width / mobileBreakpoint) * 412;
    } else if (width < tabletBreakpoint) {
      // For tablet, let's say we want the offset to range from 512 to 888
      return (
        512 +
        ((width - mobileBreakpoint) / (tabletBreakpoint - mobileBreakpoint)) *
          376
      );
    } else {
      // For desktop, let's return a fixed value or 0 if no offset is needed
      return 0;
    }
  }

  links.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const windowWidth = window.innerWidth;
        const offset = calculateOffset(windowWidth);

        if (windowWidth < tabletBreakpoint) {
          // Mobile and Tablet behavior
          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            offset;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        } else {
          // Desktop behavior
          targetElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    });
  });
});

// mobile menu

document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuLinks = mobileMenu.querySelectorAll("a");

  menuButton.addEventListener("click", function () {
    mobileMenu.classList.toggle("show");
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("show");
    });
  });
});
