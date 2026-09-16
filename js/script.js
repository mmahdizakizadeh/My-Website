const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-menu a");
const themeToggle = document.getElementById("themeToggle");
const header = document.querySelector(".header");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
if (menuToggle && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  };
  const openMenu = () => {
    navMenu.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
  };
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("active");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (
      target instanceof Node &&
      !navMenu.contains(target) &&
      !menuToggle.contains(target)
    ) {
      closeMenu();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("active")) {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) {
      closeMenu();
    }
  });
}

if (themeToggle) {
  const savedTheme = localStorage.getItem("theme");

  const setTheme = (isDark = false) => {
    document.body.classList.toggle("dark-mode", isDark);

    themeToggle.setAttribute(
      "aria-pressed",
      String(isDark)
    );

    themeToggle.setAttribute(
      "aria-label",
      isDark
        ? "Switch to light mode"
        : "Switch to dark mode"
    );
  };

  if (savedTheme === "dark") {
    setTheme(true);
  } else {
    setTheme(false);
  }

  themeToggle.addEventListener("click", () => {
    const isDark =
      !document.body.classList.contains("dark-mode");

    setTheme(isDark);

    localStorage.setItem(
      "theme",
      isDark ? "dark" : "light"
    );
  });
}

if (header) {
  let lastScroll = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 150) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );
}

const revealElements = document.querySelectorAll(
  ".section-heading, .about-grid, .timeline-item, .project, .article, .contact-content"
);

revealElements.forEach((element) => {
  element.classList.add("reveal");
});

if (prefersReducedMotion) {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
} else if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}