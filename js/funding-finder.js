/* =========================================================================
   Funding Finder — client-side faceted filtering + detail modal.
   Depends on funding-data.js (FACETS, PROGRAMS, LAST_VERIFIED).
   ========================================================================= */
(function () {
  "use strict";

  var grid = document.getElementById("fundGrid");
  var facetHost = document.getElementById("facets");
  var countEl = document.getElementById("resultCount");
  var searchEl = document.getElementById("fundSearch");
  var clearBtn = document.getElementById("clearFilters");
  if (!grid || !facetHost) return;

  /* Active filter state: facetKey -> Set of selected values */
  var state = { dept: new Set(), mechanism: new Set(), capital: new Set(), award: new Set(), tech: new Set() };
  var query = "";

  var FACET_LABELS = {
    dept: "Department",
    mechanism: "Funding Mechanism",
    capital: "Capital Type",
    award: "Award Size",
    tech: "Technology Area"
  };

  /* ---------- Build facet UI ---------- */
  function buildFacets() {
    var html = "";
    Object.keys(FACET_LABELS).forEach(function (key) {
      var opts = FACETS[key].map(function (val) {
        var id = key + "-" + val.replace(/[^a-z0-9]/gi, "").toLowerCase();
        return '<label class="opt"><input type="checkbox" data-facet="' + key +
          '" value="' + escapeAttr(val) + '" id="' + id + '"> <span>' + escapeHtml(val) + "</span></label>";
      }).join("");
      html += '<div class="facet"><div class="flabel">' + FACET_LABELS[key] +
        '</div><div class="opts">' + opts + "</div></div>";
    });
    facetHost.innerHTML = html;
    facetHost.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener("change", function () {
        var f = cb.getAttribute("data-facet");
        if (cb.checked) state[f].add(cb.value); else state[f].delete(cb.value);
        render();
      });
    });
  }

  /* ---------- Filtering ---------- */
  function matches(p) {
    if (state.dept.size && !state.dept.has(p.dept)) return false;
    if (state.mechanism.size && !state.mechanism.has(p.mechanism)) return false;
    if (state.capital.size && !state.capital.has(p.capital)) return false;
    if (state.award.size && !state.award.has(p.award)) return false;
    if (state.tech.size) {
      var hit = p.tech.some(function (t) { return state.tech.has(t); });
      if (!hit) return false;
    }
    if (query) {
      var hay = (p.name + " " + p.funder + " " + p.desc + " " + p.tech.join(" ")).toLowerCase();
      if (hay.indexOf(query) === -1) return false;
    }
    return true;
  }

  function render() {
    var list = PROGRAMS.filter(matches);
    countEl.innerHTML = "<b>" + list.length + "</b> of " + PROGRAMS.length + " funding programs";
    if (!list.length) {
      grid.innerHTML = '<div class="no-results"><p>No programs match those filters.</p>' +
        '<button class="btn btn-ghost btn-sm" onclick="document.getElementById(\'clearFilters\').click()">Clear filters</button></div>';
      return;
    }
    grid.innerHTML = list.map(cardHtml).join("");
    grid.querySelectorAll("[data-open]").forEach(function (c) {
      c.addEventListener("click", function () { openModal(c.getAttribute("data-open")); });
    });
  }

  function cardHtml(p) {
    var capTag = p.capital === "Non-dilutive"
      ? '<span class="tag green">Non-dilutive</span>'
      : '<span class="tag amber">' + escapeHtml(p.capital) + "</span>";
    return '' +
      '<article class="fund-card" data-open="' + p.id + '" tabindex="0">' +
      '  <div class="fc-top"><span class="fc-funder">' + escapeHtml(p.funder) + "</span></div>" +
      "  <h3>" + escapeHtml(p.name) + "</h3>" +
      '  <p class="fc-desc">' + escapeHtml(p.desc) + "</p>" +
      '  <div class="fc-meta">' +
      '    <span class="tag">' + escapeHtml(p.dept) + "</span>" +
      '    <span class="tag teal">' + escapeHtml(p.mechanism) + "</span>" +
      capTag +
      "  </div>" +
      '  <div class="fc-award"><span class="lbl">Typical award</span><span class="val">' + escapeHtml(p.award) + "</span></div>" +
      '  <div class="fc-more">View details &rarr;</div>' +
      "</article>";
  }

  /* ---------- Modal ---------- */
  var backdrop = document.getElementById("fundModal");
  function openModal(id) {
    var p = PROGRAMS.find(function (x) { return x.id === id; });
    if (!p || !backdrop) return;
    backdrop.querySelector(".m-funder").textContent = p.funder;
    backdrop.querySelector(".m-title").textContent = p.name;
    backdrop.querySelector(".m-body").innerHTML =
      "<p>" + escapeHtml(p.detail) + "</p>" +
      '<dl class="kv">' +
      "<dt>Department</dt><dd>" + escapeHtml(p.dept) + "</dd>" +
      "<dt>Mechanism</dt><dd>" + escapeHtml(p.mechanism) + "</dd>" +
      "<dt>Capital type</dt><dd>" + escapeHtml(p.capital) + "</dd>" +
      "<dt>Typical award</dt><dd>" + escapeHtml(p.typical) + "</dd>" +
      "<dt>Eligibility</dt><dd>" + escapeHtml(p.eligibility) + "</dd>" +
      "<dt>Tech areas</dt><dd>" + p.tech.map(escapeHtml).join(", ") + "</dd>" +
      "</dl>" +
      '<p class="verify muted">Figures last verified ' + LAST_VERIFIED +
      '. Always confirm current amounts and open solicitations on the official source before relying on them.</p>';
    var src = backdrop.querySelector(".m-source");
    src.href = p.source;
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!backdrop) return;
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (backdrop) {
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop || e.target.hasAttribute("data-modal-close")) closeModal();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  }

  /* ---------- Search + clear ---------- */
  if (searchEl) {
    searchEl.addEventListener("input", function () { query = searchEl.value.trim().toLowerCase(); render(); });
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      Object.keys(state).forEach(function (k) { state[k].clear(); });
      query = "";
      if (searchEl) searchEl.value = "";
      facetHost.querySelectorAll('input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
      render();
    });
  }

  /* ---------- Mobile filter toggle ---------- */
  var mToggle = document.getElementById("filterToggle");
  var panel = document.getElementById("filterPanel");
  if (mToggle && panel) {
    mToggle.addEventListener("click", function () { panel.classList.toggle("mobile-collapsed"); });
    if (window.matchMedia("(max-width: 1080px)").matches) panel.classList.add("mobile-collapsed");
  }

  /* ---------- Helpers ---------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function escapeAttr(s) { return escapeHtml(s); }

  /* ---------- Init ---------- */
  buildFacets();
  render();
})();
