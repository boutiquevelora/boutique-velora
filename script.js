(function () {
  "use strict";

  /* ===================================================
     WHATSAPP CONFIG — replace with the real number.
     Use full international format, digits only, no "+".
     Example: Algeria number 0555 12 34 56 -> "213555123456"
     =================================================== */
  const WHATSAPP_NUMBER = "213000000000";

  const COLOR_LABELS = {
    pink: "Pink",
    lavender: "Lavender",
    sky: "Light Blue"
  };

  let selectedColor = "pink";

  function buildWhatsAppMessage() {
    const colorLabel = COLOR_LABELS[selectedColor] || "Pink";
    return (
      "Hello Boutique Velora \uD83D\uDC4B\n\n" +
      "I would like to order the Women's Electric Hair Removal & Body Trimmer.\n\n" +
      "Color: " + colorLabel + "\n" +
      "Price: 2900 DZD\n\n" +
      "Please send me the delivery details."
    );
  }

  function buildWhatsAppUrl() {
    const encodedMessage = encodeURIComponent(buildWhatsAppMessage());
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodedMessage;
  }

  function refreshOrderLinks() {
    const url = buildWhatsAppUrl();
    document.querySelectorAll(".js-order").forEach(function (el) {
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  document.addEventListener("click", function (e) {
    const trigger = e.target.closest(".js-order");
    if (!trigger) return;
    // href already points to the live wa.me URL; nothing else needed.
  });

  /* ===================================================
     Color selector — swaps the live accent used across
     the page (orbs, icon chips, delivery icons) to match
     the chosen product color.
     =================================================== */
  const swatches = document.querySelectorAll(".color-swatch");
  const selectedColorName = document.getElementById("selectedColorName");
  const root = document.documentElement;

  const ACCENT_MAP = {
    pink: { solid: "#F7C8D8", soft: "#F7C8D833" },
    lavender: { solid: "#CDB4DB", soft: "#CDB4DB33" },
    sky: { solid: "#A9D6E5", soft: "#A9D6E533" }
  };

  function setAccent(colorKey) {
    const accent = ACCENT_MAP[colorKey];
    if (!accent) return;
    root.style.setProperty("--live-accent", accent.solid);
    root.style.setProperty("--live-accent-soft", accent.soft);
  }

  swatches.forEach(function (btn) {
    btn.addEventListener("click", function () {
      swatches.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");

      selectedColor = btn.dataset.color;
      setAccent(selectedColor);

      if (selectedColorName) {
        selectedColorName.textContent = COLOR_LABELS[selectedColor] || "Pink";
      }

      refreshOrderLinks();
    });
  });

  /* ===================================================
     Product anatomy hotspots — tap to pin open on touch
     devices, hover works natively on desktop.
     =================================================== */
  const hotspots = document.querySelectorAll(".hotspot");
  hotspots.forEach(function (hs) {
    hs.addEventListener("click", function (e) {
      e.preventDefault();
      const isOpen = hs.classList.contains("is-open");
      hotspots.forEach(function (other) {
        other.classList.remove("is-open");
        other.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        hs.classList.add("is-open");
        hs.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".hotspot")) {
      hotspots.forEach(function (hs) {
        hs.classList.remove("is-open");
        hs.setAttribute("aria-expanded", "false");
      });
    }
  });

  /* ===================================================
     Scroll reveal — lightweight, respects reduced motion.
     =================================================== */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealTargets = document.querySelectorAll(
    ".feature-card, .delivery-card, .why-row, .anatomy-wrap, .color-selector"
  );

  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
  });

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ===================================================
     Init
     =================================================== */
  setAccent(selectedColor);
  refreshOrderLinks();
})();
