/* NB Holdings Partnership — /start link-in-bio page */
(function () {
  "use strict";

  // Expand / collapse each path. Opening one closes the others.
  var buttons = document.querySelectorAll("button.path-btn");
  function setOpen(btn, open) {
    btn.setAttribute("aria-expanded", String(open));
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (panel) panel.hidden = !open;
    btn.closest(".path").classList.toggle("open", open);
  }
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var willOpen = btn.getAttribute("aria-expanded") !== "true";
      buttons.forEach(function (b) { setOpen(b, false); });
      setOpen(btn, willOpen);
      if (willOpen) btn.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Open a path directly from the URL, e.g. /start/#business-idea
  var target = window.location.hash && document.querySelector(window.location.hash + " button.path-btn");
  if (target) setOpen(target, true);

  // Lead forms → Formspree
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  document.querySelectorAll("form.lead-form").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var success = form.parentElement.querySelector(".lead-success");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var first = form.querySelector('[name="first"]');
      var email = form.querySelector('[name="email"]');
      var consent = form.querySelector('[name="email_consent"]');
      var bad = [];
      if (!first.value.trim()) bad.push(first);
      if (!EMAIL_RE.test(email.value.trim())) bad.push(email);
      if (!consent.checked) bad.push(consent);
      form.querySelectorAll(".invalid").forEach(function (el) { el.classList.remove("invalid"); });
      if (bad.length) {
        bad.forEach(function (el) { el.closest("label").classList.add("invalid"); });
        status.className = "form-status error";
        status.textContent = "Please enter your first name and a valid email, and tick the box.";
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      status.className = "form-status";
      status.textContent = "Sending…";

      fetch(form.getAttribute("data-endpoint"), {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          form.hidden = true;
          if (success) success.hidden = false;
          var file = form.getAttribute("data-download");
          if (file) {
            var a = document.createElement("a");
            a.href = file; a.download = ""; document.body.appendChild(a); a.click(); a.remove();
          }
        })
        .catch(function () {
          btn.disabled = false;
          status.className = "form-status error";
          status.textContent = "Something went wrong. Please try again in a moment.";
        });
    });

    ["input", "change"].forEach(function (evt) { form.addEventListener(evt, function (e) {
      var l = e.target.closest("label"); if (l) l.classList.remove("invalid");
      if (!form.querySelector(".invalid")) { status.textContent = ""; status.className = "form-status"; }
    }); });
  });
})();
