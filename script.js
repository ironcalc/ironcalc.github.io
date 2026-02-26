// script.js

window.onscroll = function () {
  addScrollTopButtonOnScroll();
};

function addScrollTopButtonOnScroll() {
  const scrollup = document.getElementById("scroll-up");
  if (!scrollup) return;
  if (
    document.body.scrollTop > 800 ||
    document.documentElement.scrollTop > 800
  ) {
    scrollup.classList.remove("hidden");
  } else {
    scrollup.classList.add("hidden");
  }
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  const mobileBreakpoint = 480;
  const tabletBreakpoint = 800;

  function calculateOffset(width) {
    if (width < mobileBreakpoint) {
      return 100 + (width / mobileBreakpoint) * 412;
    } else if (width < tabletBreakpoint) {
      return (
        512 +
        ((width - mobileBreakpoint) / (tabletBreakpoint - mobileBreakpoint)) *
          376
      );
    } else {
      return 0;
    }
  }

  links.forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const windowWidth = window.innerWidth;
        const offset = calculateOffset(windowWidth);
        if (windowWidth < tabletBreakpoint) {
          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            offset;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        } else {
          targetElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    });
  });
}

function initMobileMenu() {
  const menuButton = document.getElementById("menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuLinks = mobileMenu.querySelectorAll("a");

  menuButton.addEventListener("click", function () {
    mobileMenu.classList.toggle("show");
    menuButton.setAttribute("aria-expanded", mobileMenu.classList.contains("show"));
  });

  menuLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("show");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

function syncUseCasesHeight() {
  const rightCol = document.getElementById("use-cases-content");
  const leftCol = document.getElementById("use-cases-buttons");
  if (!leftCol || !rightCol) return;
  if (window.matchMedia("(min-width: 1025px)").matches) {
    rightCol.style.height = leftCol.offsetHeight + "px";
  } else {
    rightCol.style.height = "";
  }
}

function initUseCasesTabs() {
  const useCases = document.getElementById("use-cases");
  if (!useCases) return;
  const buttons = useCases.querySelectorAll("button[data-tab]");
  const panels = document.querySelectorAll(".use-cases-panel");
  syncUseCasesHeight();
  window.addEventListener("resize", syncUseCasesHeight);
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const tabIndex = this.getAttribute("data-tab");
      buttons.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      panels.forEach(function (p) {
        p.classList.remove("active");
      });
      this.classList.add("active");
      this.setAttribute("aria-selected", "true");
      const panel = document.querySelector(
        '.use-cases-panel[data-panel="' + tabIndex + '"]'
      );
      if (panel) panel.classList.add("active");
      this.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  });
}

function initLogoContextMenu() {
  const logoLink = document.getElementById("logo-link");
  const contextMenu = document.getElementById("logo-context-menu");
  const downloadBtn = document.getElementById("logo-download-svg");
  const logoImg = logoLink && logoLink.querySelector("img");
  const svgUrl = logoImg
    ? logoImg.getAttribute("src")
    : "images/ironcalc-logo.svg";

  if (!logoLink || !contextMenu || !downloadBtn) return;

  logoLink.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    contextMenu.style.left = e.clientX + "px";
    contextMenu.style.top = e.clientY + "px";
    contextMenu.hidden = false;
  });

  function closeContextMenu() {
    contextMenu.hidden = true;
  }

  downloadBtn.addEventListener("click", function () {
    closeContextMenu();
    const a = document.createElement("a");
    a.href = svgUrl;
    a.download = "ironcalc-logo.svg";
    a.click();
  });

  document.addEventListener("click", closeContextMenu);
  document.addEventListener("contextmenu", function (e) {
    if (
      !contextMenu.contains(e.target) &&
      e.target !== logoLink &&
      !logoLink.contains(e.target)
    ) {
      closeContextMenu();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !contextMenu.hidden) {
      closeContextMenu();
    }
  });
}

function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    const trigger = item.querySelector(".faq-item__trigger");
    if (!trigger) return;
    trigger.addEventListener("click", function () {
      const willExpand = !item.classList.contains("faq-item--expanded");
      faqItems.forEach(function (other) {
        other.classList.remove("faq-item--expanded");
        const otherTrigger = other.querySelector(".faq-item__trigger");
        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
      });
      if (willExpand) {
        item.classList.add("faq-item--expanded");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function initTerminalCopy() {
  const btn = document.querySelector(".terminal-window__copy");
  if (!btn) return;

  const text = "docker compose up --build";

  function showCopied() {
    btn.classList.add("copied");
    setTimeout(function () {
      btn.classList.remove("copied");
    }, 2000);
  }

  function showFailed() {
    btn.classList.add("copy-failed");
    setTimeout(function () {
      btn.classList.remove("copy-failed");
    }, 2000);
  }

  function fallbackCopy() {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      var ok = document.execCommand("copy");
      if (ok) showCopied();
      else showFailed();
    } catch (e) {
      showFailed();
    }
    document.body.removeChild(textarea);
  }

  btn.addEventListener("click", function () {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard.writeText(text).then(showCopied, function () {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }
  });
}

function initGitHubStarCount() {
  const countEls = document.querySelectorAll(".github-star-count");
  if (!countEls.length) return;

  const CACHE_KEY = "ironcalc_github_stars";
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

  function fromCache() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (Date.now() - data.timestamp > CACHE_TTL_MS) return null;
      return data.count;
    } catch (e) {
      return null;
    }
  }

  function toCache(count) {
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ count: count, timestamp: Date.now() })
      );
    } catch (e) {}
  }

  function setCount(count) {
    const text = typeof count === "number" ? count.toLocaleString() : "—";
    countEls.forEach(function (el) {
      el.textContent = text;
    });
  }

  const cached = fromCache();
  if (cached !== null) {
    setCount(cached);
    return;
  }

  fetch("https://api.github.com/repos/ironcalc/ironcalc")
    .then(function (res) {
      if (!res.ok) throw new Error("GitHub API error");
      return res.json();
    })
    .then(function (data) {
      const count = data.stargazers_count;
      toCache(count);
      setCount(count);
    })
    .catch(function () {
      setCount("—");
    });
}

function initContributorsAvatars() {
  const container = document.getElementById("contributors-avatars");
  if (!container) return;

  const CACHE_KEY = "ironcalc_contributors";
  const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

  function render(contributors) {
    const loading = container.querySelector(".contributors-loading");
    if (loading) loading.remove();
    contributors.forEach(function (c) {
      const wrap = document.createElement("span");
      wrap.className = "avatar-tooltip-wrap";
      const tooltip = document.createElement("span");
      tooltip.className = "avatar-tooltip";
      tooltip.textContent = c.login + (c.contributions ? " (" + c.contributions + " contributions)" : "");
      const a = document.createElement("a");
      a.href = c.html_url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.title = c.login + (c.contributions ? " (" + c.contributions + " contributions)" : "");
      const img = document.createElement("img");
      img.src = c.avatar_url;
      img.alt = "";
      img.width = 36;
      img.height = 36;
      img.loading = "lazy";
      a.appendChild(img);
      wrap.appendChild(tooltip);
      wrap.appendChild(a);
      container.appendChild(wrap);
    });
  }

  function fromCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (Date.now() - data.timestamp > CACHE_TTL_MS) return null;
      return data.contributors;
    } catch (e) {
      return null;
    }
  }

  function toCache(contributors) {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ contributors: contributors, timestamp: Date.now() })
      );
    } catch (e) {}
  }

  const cached = fromCache();
  if (cached && cached.length > 0) {
    render(cached);
    return;
  }

  fetch("https://api.github.com/repos/ironcalc/IronCalc/contributors?per_page=100")
    .then(function (res) {
      if (!res.ok) throw new Error("GitHub API error");
      return res.json();
    })
    .then(function (data) {
      toCache(data);
      render(data);
    })
    .catch(function () {
      const loading = container.querySelector(".contributors-loading");
      if (loading) loading.textContent = "Contributors could not be loaded.";
    });
}

function initRoadmapExpandableCards() {
  const cards = document.querySelectorAll(".roadmap-card--expandable");
  cards.forEach(function (card) {
    const header = card.querySelector(".roadmap-card__header");
    const details = card.querySelector(".roadmap-card-details");
    if (!header || !details) return;
    function setDetailsExpanded(expanded) {
      header.setAttribute("aria-expanded", expanded);
      details.setAttribute("aria-hidden", !expanded);
      details.querySelectorAll("a").forEach(function (link) {
        if (expanded) link.removeAttribute("tabindex");
        else link.setAttribute("tabindex", "-1");
      });
    }
    setDetailsExpanded(card.classList.contains("is-expanded"));
    header.setAttribute("role", "button");
    header.setAttribute("tabindex", "0");
    if (details.id) header.setAttribute("aria-controls", details.id);
    card.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      const expanded = card.classList.toggle("is-expanded");
      setDetailsExpanded(expanded);
    });
    header.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const expanded = card.classList.toggle("is-expanded");
        setDetailsExpanded(expanded);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initSmoothScroll();
  initMobileMenu();
  initUseCasesTabs();
  initLogoContextMenu();
  initFaqAccordion();
  initTerminalCopy();
  initGitHubStarCount();
  initContributorsAvatars();
  initRoadmapExpandableCards();
});
