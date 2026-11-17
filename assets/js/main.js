/* NB Holdings Partnership LLC — site interactions */
(function () {
  "use strict";

  // Investor inquiries are delivered to this address (see README to switch to a form service).
  var IR_EMAIL = "ir@nbholdingspartnership.com";

  document.documentElement.classList.remove("no-js");

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header state on scroll
  var header = document.querySelector(".site-header");
  var isLegal = document.body.classList.contains("legal-page");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", isLegal || window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("open", !open);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("open");
      }
    });
  }

  // Reveal on scroll
  var revealTargets = document.querySelectorAll(".reveal, .process-track");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(function (el, i) {
      // Stagger siblings slightly
      var parent = el.parentElement;
      var siblings = parent ? Array.prototype.filter.call(parent.children, function (c) { return c.classList.contains("reveal"); }) : [];
      var idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = (idx * 0.09) + "s";
      io.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in-view"); });
  }

  // Active nav link
  var navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');
  var sections = Array.prototype.map.call(navLinks, function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  if ("IntersectionObserver" in window && sections.length) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { if (s) navIO.observe(s); });
  }

  // Investor inquiry form
  var form = document.getElementById("inquiry-form");
  if (!form) return;
  var status = form.querySelector(".form-status");

  function setInvalid(el, bad) {
    var wrap = el.closest(".field") || el.closest(".attest");
    if (wrap) wrap.classList.toggle("invalid", bad);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    ["f-first", "f-last", "f-email", "f-type"].forEach(function (id) {
      var el = document.getElementById(id);
      var bad = !el.value.trim() || (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
      setInvalid(el, bad);
      if (bad) ok = false;
    });
    var accredited = document.getElementById("f-accredited");
    setInvalid(accredited, !accredited.checked);
    if (!accredited.checked) ok = false;

    if (!ok) {
      status.className = "form-status error";
      status.textContent = "Please complete the required fields and confirm the accredited investor representation.";
      return;
    }

    var data = new FormData(form);
    var interests = data.getAll("interest");

    // If a form endpoint is configured (data-endpoint attribute), POST to it.
    var endpoint = form.getAttribute("data-endpoint");
    if (endpoint) {
      status.className = "form-status";
      status.textContent = "Submitting…";
      fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          form.reset();
          status.className = "form-status success";
          status.textContent = "Thank you. A member of our Investor Relations team will be in touch shortly.";
        })
        .catch(function () {
          status.className = "form-status error";
          status.textContent = "Something went wrong. Please email " + IR_EMAIL + " directly.";
        });
      return;
    }

    // Fallback: open the visitor's email client with a pre-filled message.
    var body = [
      "Name: " + data.get("first") + " " + data.get("last"),
      "Email: " + data.get("email"),
      "Phone: " + (data.get("phone") || "—"),
      "Investor Type: " + data.get("type"),
      "Areas of Interest: " + (interests.length ? interests.join(", ") : "—"),
      "Accredited Investor Representation: Confirmed",
      "",
      data.get("message") || ""
    ].join("\n");
    var href = "mailto:" + IR_EMAIL +
      "?subject=" + encodeURIComponent("Investor Inquiry — " + data.get("first") + " " + data.get("last")) +
      "&body=" + encodeURIComponent(body);
    window.location.href = href;
    status.className = "form-status success";
    status.textContent = "Thank you. Your email client should open with your inquiry ready to send.";
  });

  form.addEventListener("input", function (e) { setInvalid(e.target, false); });
  form.addEventListener("change", function (e) { setInvalid(e.target, false); });
})();
