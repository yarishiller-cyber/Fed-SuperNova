/* =========================================================================
   Shared site behavior: mobile drawer, scroll reveal, year stamp.
   ========================================================================= */
(function () {
  "use strict";

  /* ---- Mobile nav drawer ---- */
  var body = document.body;
  var openBtn = document.querySelector("[data-drawer-open]");
  var closeEls = document.querySelectorAll("[data-drawer-close]");
  if (openBtn) openBtn.addEventListener("click", function () { body.classList.add("drawer-open"); });
  closeEls.forEach(function (el) {
    el.addEventListener("click", function () { body.classList.remove("drawer-open"); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") body.classList.remove("drawer-open");
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Year stamp ---- */
  var y = document.querySelectorAll("[data-year]");
  y.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Floating "reply in under 20 minutes" CTA (all pages) ---- */
  if (!document.querySelector(".float-cta")) {
    var onContact = /\/contact(\.html)?$/.test(location.pathname);
    var mail = "mailto:info@sbir-simulation-funding.com" +
      "?subject=" + encodeURIComponent("Free Ansys access — quick question") +
      "&body=" + encodeURIComponent(
        "Hi — a bit about my project:\n\nStage (idea / stealth / incorporated): \nWhat I'm building: \nFunding I'm chasing: \nWhat I need to simulate: \n");
    var wrap = document.createElement("div");
    wrap.className = "float-cta";
    wrap.innerHTML =
      '<div class="fc-card">' +
        '<span class="fc-note"><i></i> We reply in under 20 minutes</span>' +
        '<div class="fc-row">' +
          '<a class="btn btn-ghost btn-sm" href="' + mail + '">Email us</a>' +
          '<a class="btn btn-primary btn-sm" href="' + (onContact ? "#form" : "/contact#form") + '">Get free Ansys</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
  }
})();
