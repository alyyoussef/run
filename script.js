(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const progress = document.querySelector(".scroll-progress__bar");
  const parallaxNodes = document.querySelectorAll("[data-parallax]");
  const sectionIds = ["brief", "start", "constraint", "people", "split", "prototypes", "choices"];

  function closeNav() {
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function () {
    const open = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) closeNav();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    header.classList.toggle("is-scrolled", y > 8);

    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
    progress.style.width = pct + "%";

    if (!reduceMotion) {
      parallaxNodes.forEach(function (node) {
        const speed = parseFloat(node.getAttribute("data-parallax") || "0");
        node.style.transform = "translate3d(0, " + (y * speed) + "px, 0)";
      });
    }

    let current = "";
    sectionIds.forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.35) current = id;
    });

    nav.querySelectorAll("a").forEach(function (link) {
      const href = link.getAttribute("href") || "";
      const match = current && href === "#" + current;
      if (match) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );

  onScroll();
})();
