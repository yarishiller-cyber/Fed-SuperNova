/* Shared behavior: drawer, scroll reveal, year, floating CTA. */
(function () {
  "use strict";
  var body = document.body;
  var openBtn = document.querySelector("[data-drawer-open]");
  document.querySelectorAll("[data-drawer-close]").forEach(function (el) {
    el.addEventListener("click", function () { body.classList.remove("drawer-open"); });
  });
  if (openBtn) openBtn.addEventListener("click", function () { body.classList.add("drawer-open"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") body.classList.remove("drawer-open"); });
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add("in"); }); }
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  if (!document.querySelector(".float-cta")) {
    var onContact = /\/contact(\.html)?$/.test(location.pathname);
    var mail = "mailto:info@nasa-simulation-funding.com?subject=" + encodeURIComponent("Ansys evals — quick question") +
      "&body=" + encodeURIComponent("Hi — a bit about my project:\n\nStage (idea / stealth / incorporated): \nWhat I'm building: \nFunding I'm chasing: \nWhat I need to simulate: \n");
    var wrap = document.createElement("div");
    wrap.className = "float-cta";
    wrap.innerHTML = '<div class="fc-card"><span class="fc-note"><i></i> We reply in under 20 minutes</span>' +
      '<div class="fc-row"><a class="btn btn-ghost btn-sm" href="' + mail + '">Email us</a>' +
      '<a class="btn btn-primary btn-sm" href="' + (onContact ? "#form" : "/contact#form") + '">Ask about evals</a></div></div>';
    document.body.appendChild(wrap);
  }
})();
