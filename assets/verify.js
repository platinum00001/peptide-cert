(function () {
  "use strict";
  var B = window.PC1Backend;
  var form = document.getElementById("verify-form");
  var input = document.getElementById("cert-id");
  var out = document.getElementById("verify-result");
  document.getElementById("year").textContent = new Date().getFullYear();

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function fmtDate(d) { return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }); }

  var banner = document.getElementById("mode-banner");
  if (B.initError) {
    banner.hidden = false; banner.className = "mode-banner error";
    banner.textContent = "Configuration error: " + B.initError.message;
  } else if (B.mode === "demo") {
    banner.hidden = false;
    banner.innerHTML = "<strong>Local demo mode.</strong> Only certificates issued in this browser can be verified. Connect Supabase in <code>assets/config.js</code> for public verification.";
  }

  async function run(id) {
    id = B.normalizeCertId(id);
    if (!id) return;
    input.value = id;
    out.innerHTML = '<p class="muted">Checking…</p>';
    try {
      if (B.initError) throw B.initError;
      var c = await B.verify(id);
      if (!c) {
        out.innerHTML = '<div class="result result-bad" role="status"><h2>Not found</h2><p>No certificate with ID <code>' + esc(id) + '</code> was found. Check the ID for typos and try again.</p></div>';
      } else if (c.revoked) {
        out.innerHTML = '<div class="result result-bad" role="status"><h2>Revoked</h2><p>Certificate <code>' + esc(c.certificate_id) + '</code> has been revoked and is no longer valid.</p></div>';
      } else {
        out.innerHTML = '<div class="result result-ok" role="status"><h2><span aria-hidden="true">✓</span> Valid certificate</h2>' +
          '<dl class="facts"><dt>Name</dt><dd>' + esc(c.full_name) + '</dd>' +
          '<dt>Course</dt><dd>' + esc(c.course || "Peptide Certification Level 1") + '</dd>' +
          '<dt>Level</dt><dd>' + esc(c.level || "Level 1") + '</dd>' +
          '<dt>Issued</dt><dd>' + esc(fmtDate(c.issued_at)) + '</dd>' +
          '<dt>Certificate ID</dt><dd><code>' + esc(c.certificate_id) + '</code></dd></dl></div>';
      }
      history.replaceState(null, "", "?id=" + encodeURIComponent(id));
    } catch (e) {
      out.innerHTML = '<div class="result result-bad" role="alert"><h2>Could not verify</h2><p>' + esc(e.message) + '</p></div>';
    }
  }
  form.addEventListener("submit", function (e) { e.preventDefault(); run(input.value); });
  var q = new URLSearchParams(location.search).get("id");
  if (q) run(q);
})();
