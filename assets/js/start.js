/* NB Holdings Partnership — /start link-in-bio page */
(function () {
  "use strict";

  // ---- Expand / collapse paths (opening one closes the others) ----
  var buttons = document.querySelectorAll("button.path-btn");
  function setOpen(btn, open) {
    btn.setAttribute("aria-expanded", String(open));
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (panel) panel.hidden = !open;
    btn.closest(".path").classList.toggle("open", open);
  }
  function openPath(id) {
    var btn = document.querySelector("#" + id + " button.path-btn");
    if (!btn) return;
    buttons.forEach(function (b) { setOpen(b, false); });
    setOpen(btn, true);
    prefill(btn.closest(".path"));
    btn.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var willOpen = btn.getAttribute("aria-expanded") !== "true";
      buttons.forEach(function (b) { setOpen(b, false); });
      setOpen(btn, willOpen);
      if (willOpen) {
        prefill(btn.closest(".path"));
        btn.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Open a path directly from the URL, e.g. /start/#business-idea
  if (window.location.hash) {
    var initial = document.querySelector(window.location.hash + " button.path-btn");
    if (initial) setOpen(initial, true);
  }

  // "Also interested in…" links open another path
  document.querySelectorAll(".cross-path").forEach(function (link) {
    link.addEventListener("click", function () { openPath(link.getAttribute("data-open")); });
  });

  // ---- Remember name/email after a sign-up so a second path is one tap ----
  // Each path still submits its own lead, so someone interested in two paths
  // is captured once in each category.
  var known = null;
  function prefill(section) {
    if (!known || !section) return;
    var f = section.querySelector('form.lead-form [name="first"]');
    var e = section.querySelector('form.lead-form [name="email"]');
    if (f && !f.value) f.value = known.first;
    if (e && !e.value) e.value = known.email;
  }

  // ---- Lead forms → Formspree ----
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  document.querySelectorAll("form.lead-form").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var success = form.parentElement.querySelector(".lead-success");
    var picks = form.querySelector(".resource-picks");

    function fail(msg) {
      status.className = "form-status error";
      status.textContent = msg;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var first = form.querySelector('[name="first"]');
      var email = form.querySelector('[name="email"]');
      var consent = form.querySelector('[name="email_consent"]');
      var chosen = picks ? Array.prototype.slice.call(picks.querySelectorAll('input[name="resources"]:checked')) : [];

      form.querySelectorAll(".invalid").forEach(function (el) { el.classList.remove("invalid"); });
      var bad = [];
      if (picks && !chosen.length) { picks.classList.add("invalid"); bad.push(picks); }
      if (!first.value.trim()) bad.push(first);
      if (!EMAIL_RE.test(email.value.trim())) bad.push(email);
      if (!consent.checked) bad.push(consent);
      if (bad.length) {
        bad.forEach(function (el) { var l = el.closest("label"); if (l) l.classList.add("invalid"); });
        var onlyPicks = bad.length === 1 && bad[0] === picks;
        fail(onlyPicks ? "Please tick at least one download."
          : picks && !chosen.length ? "Please tick at least one download and complete the fields below."
          : "Please enter your first name and a valid email, and tick the box.");
        return;
      }

      var data = new FormData(form);
      // Send the chosen resources as one readable line, e.g. "Workbook, Template"
      if (picks) {
        data.delete("resources");
        data.append("resources", chosen.map(function (c) { return c.value; }).join(", "));
      }

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      status.className = "form-status";
      status.textContent = "Sending…";

      window.NBLeads.send(form.getAttribute("data-hubspot"), {
        firstname: data.get("first"),
        email: data.get("email"),
        nb_lead_category: data.get("category"),
        nb_resources_requested: data.get("resources"),
        nb_lead_source: data.get("source"),
        nb_email_consent: "true"
      }, data)
        .then(function () {
          known = { first: first.value.trim(), email: email.value.trim() };
          form.hidden = true;
          if (!success) return;
          success.hidden = false;

          // One download button per chosen file; items without a file (e.g. a waitlist) just show a note
          var files = chosen.filter(function (c) { return c.getAttribute("data-file"); });
          var list = success.querySelector(".download-list");
          if (list) {
            list.innerHTML = "";
            files.forEach(function (c) {
              var a = document.createElement("a");
              a.className = "btn btn-gold btn-block download-btn";
              a.href = c.getAttribute("data-file");
              a.setAttribute("download", "");
              a.textContent = "Download: " + c.value;
              list.appendChild(a);
            });
            // A single file downloads automatically; several are listed to tap
            if (files.length === 1) list.querySelector("a").click();
          }
          var note = success.querySelector(".waitlist-note");
          if (note) note.hidden = chosen.length === files.length;
        })
        .catch(function () {
          btn.disabled = false;
          fail("Something went wrong. Please try again in a moment.");
        });
    });

    ["input", "change"].forEach(function (evt) {
      form.addEventListener(evt, function (e) {
        var l = e.target.closest("label"); if (l) l.classList.remove("invalid");
        if (picks && e.target.name === "resources") picks.classList.remove("invalid");
        if (!form.querySelector(".invalid")) { status.textContent = ""; status.className = "form-status"; }
      });
    });
  });
})();
