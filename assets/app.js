(function () {
  "use strict";
  var B = window.PC1Backend;
  var CFG = window.PC1_CONFIG || {};
  var LESSONS = window.PC1_LESSONS || [];
  var QUESTIONS = window.PC1_QUESTIONS || [];
  var PASS = B.passPercent;
  var NEED = Math.ceil(QUESTIONS.length * PASS / 100);
  var COURSE = CFG.COURSE_NAME || "Peptide Certification Level 1";
  var ISSUER = CFG.ISSUER_NAME || "Peptide Certification Program";

  var app = document.getElementById("app");
  var nav = document.getElementById("nav");
  var state = { user: null, cert: null, attempts: [], lastResult: null, recovery: false };

  /* ---------- utils ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function fmtDate(d) { return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }); }
  function go(route) { if (location.hash === "#/" + route) render(); else location.hash = "#/" + route; }
  function route() { return (location.hash.replace(/^#\/?/, "") || "").split("/"); }
  function verifyUrl(id) { return new URL("verify.html?id=" + encodeURIComponent(id), location.href.split("#")[0]).href; }
  function progressKey() { return "pc1_progress_" + (state.user ? state.user.id : "anon"); }
  function getProgress() { try { return JSON.parse(localStorage.getItem(progressKey())) || {}; } catch (e) { return {}; } }
  function setProgress(p) { localStorage.setItem(progressKey(), JSON.stringify(p)); }
  function completedCount() { var p = getProgress(); return LESSONS.filter(function (l) { return p[l.id]; }).length; }
  function allLessonsDone() { return completedCount() === LESSONS.length; }
  function bestAttempt() { return state.attempts.slice().sort(function (a, b) { return b.percent - a.percent; })[0] || null; }
  function setTitle(t) { document.title = (t ? t + " — " : "") + COURSE; }
  function focusMain() { app.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  function alertBox(msg, kind) { return '<div class="alert alert-' + (kind || "error") + '" role="alert">' + esc(msg) + "</div>"; }

  /* ---------- chrome ---------- */
  function renderNav() {
    if (!state.user) { nav.innerHTML = '<a href="verify.html">Verify</a>'; return; }
    var r = route()[0] || "dashboard";
    function link(to, label) { return '<a href="#/' + to + '"' + (r === to ? ' aria-current="page"' : "") + ">" + label + "</a>"; }
    nav.innerHTML = link("dashboard", "Dashboard") + link("lessons", "Lessons") + link("glossary", "Glossary") + link("test", "Test") +
      (state.cert ? link("certificate", "Certificate") : "") + '<a href="verify.html">Verify</a>' +
      '<button type="button" class="linklike" id="signout">Sign out</button>';
    document.getElementById("signout").onclick = async function () { await B.signOut(); state.user = null; state.cert = null; state.attempts = []; go("login"); };
  }
  function renderBanner() {
    var b = document.getElementById("mode-banner");
    if (B.initError) {
      b.hidden = false; b.className = "mode-banner error no-print";
      b.textContent = "Configuration error: " + B.initError.message + " The site cannot connect to Supabase.";
    } else if (B.mode === "demo") {
      b.hidden = false;
      b.innerHTML = "<strong>Local demo mode.</strong> Supabase is not configured, so accounts and certificates are stored only in this browser. See README to connect Supabase.";
    }
  }

  /* ---------- progress tracker ---------- */
  function tracker(current) {
    var p = getProgress(), done = completedCount(), total = LESSONS.length;
    var pct = Math.round(((done + (state.cert ? 1 : 0) + (state.cert ? 1 : 0)) / (total + 2)) * 100);
    var nodes = LESSONS.map(function (l, i) {
      var cls = p[l.id] ? "done" : (current === i ? "current" : "");
      return '<li class="tk-node ' + cls + '"><a href="#/lesson/' + (i + 1) + '" aria-label="Lesson ' + (i + 1) + ": " + esc(l.title) + (p[l.id] ? " (completed)" : "") + '"' + (current === i ? ' aria-current="step"' : "") + "><span>" + (p[l.id] ? "✓" : (i + 1)) + "</span></a></li>";
    }).join("");
    var testCls = state.cert ? "done" : (current === "test" ? "current" : (allLessonsDone() ? "ready" : "locked"));
    var certCls = state.cert ? "done" : "locked";
    return '<nav class="tracker glass" aria-label="Course progress"><div class="tk-head"><span class="tk-label">Course progress</span><span class="tk-pct">' + pct + '%</span></div>' +
      '<div class="tk-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Course progress"><span style="width:' + pct + '%"></span></div>' +
      '<ol class="tk-nodes">' + nodes +
      '<li class="tk-node tk-wide ' + testCls + '"><a href="#/test"' + (current === "test" ? ' aria-current="step"' : "") + '><span>' + (state.cert ? "✓" : "◆") + '</span><em>Test</em></a></li>' +
      '<li class="tk-node tk-wide ' + certCls + '"><a href="#/certificate"><span>' + (state.cert ? "✓" : "★") + '</span><em>Certificate</em></a></li>' +
      "</ol><p class=\"tk-sub\">" + done + " of " + total + " lessons complete" + (state.cert ? " · Certified" : "") + "</p></nav>";
  }

  /* ---------- views ---------- */
  function viewAuth(mode) {
    setTitle(mode === "register" ? "Create account" : "Sign in");
    var isReg = mode === "register";
    app.innerHTML =
      '<section class="auth-grid">' +
      '<div class="auth-intro"><p class="eyebrow"><span class="dot" aria-hidden="true"></span> Online course &amp; verifiable certificate</p><h1 class="hero-title">Peptide science, <span class="grad">decoded.</span></h1>' +
      "<p class=\"lead\">" + esc(COURSE) + " is a rigorous, education-only introduction to how peptides work, approved versus research peptides, quality and sourcing, safety, regulation and ethics.</p>" +
      '<ul class="hero-stats" aria-label="Course at a glance"><li><b>7</b><span>lessons</span></li><li><b>~75</b><span>minutes</span></li><li><b>25</b><span>questions</span></li><li><b>' + PASS + '%</b><span>to pass</span></li></ul>' +
      '<ul class="ticks"><li>Key takeaways and a knowledge check in every lesson</li><li>Progress tracker and searchable glossary</li><li>Printable certificate with a public verification ID</li></ul>' +
      '<p class="small muted">Education only — not medical advice. No dosing amounts or protocols are provided.</p></div>' +
      '<div class="card glass auth-card"><div class="tabs" role="tablist">' +
      '<a role="tab" href="#/login" aria-selected="' + !isReg + '">Sign in</a><a role="tab" href="#/register" aria-selected="' + isReg + '">Create account</a></div>' +
      '<form id="auth-form" novalidate>' +
      (isReg ? '<label>Full name <span class="muted small">(as it should appear on your certificate)</span><input name="name" autocomplete="name" required maxlength="120"></label>' : "") +
      '<label>Email<input name="email" type="email" autocomplete="email" required></label>' +
      '<label>Password<input name="password" type="password" autocomplete="' + (isReg ? "new-password" : "current-password") + '" required minlength="8"></label>' +
      (isReg ? '<label class="check"><input type="checkbox" name="ack" required> I understand this course is for education only and is not medical advice.</label>' : "") +
      '<div id="auth-msg"></div><button class="btn btn-primary btn-block" type="submit">' + (isReg ? "Create account" : "Sign in") + "</button>" +
      (!isReg && B.mode === "supabase" ? '<p class="small center"><button type="button" class="linklike" id="forgot">Forgot password?</button></p>' : "") +
      "</form></div></section>";

    var form = document.getElementById("auth-form"), msg = document.getElementById("auth-msg");
    form.onsubmit = async function (e) {
      e.preventDefault();
      var f = form.elements, btn = form.querySelector("button[type=submit]");
      var email = f.email.value.trim(), pw = f.password.value;
      msg.innerHTML = "";
      if (isReg && f.name.value.trim().length < 2) return (msg.innerHTML = alertBox("Please enter your full name."));
      if (!/^\S+@\S+\.\S+$/.test(email)) return (msg.innerHTML = alertBox("Please enter a valid email address."));
      if (pw.length < 8) return (msg.innerHTML = alertBox("Password must be at least 8 characters."));
      if (isReg && !f.ack.checked) return (msg.innerHTML = alertBox("Please confirm the education-only acknowledgement."));
      btn.disabled = true; btn.textContent = "Please wait…";
      try {
        var r = isReg ? await B.signUp(f.name.value.trim(), email, pw) : await B.signIn(email, pw);
        if (r.needsConfirmation) {
          msg.innerHTML = alertBox("Account created. Check your email to confirm your address, then sign in.", "ok");
          btn.disabled = false; btn.textContent = "Create account"; return;
        }
        state.user = r.user; await refresh(); go("dashboard");
      } catch (err) {
        msg.innerHTML = alertBox(err.message);
        btn.disabled = false; btn.textContent = isReg ? "Create account" : "Sign in";
      }
    };
    var forgot = document.getElementById("forgot");
    if (forgot) forgot.onclick = async function () {
      var email = form.elements.email.value.trim();
      if (!email) return (msg.innerHTML = alertBox("Enter your email above first."));
      try { await B.resetPassword(email); msg.innerHTML = alertBox("If that account exists, a reset link has been sent.", "ok"); }
      catch (err) { msg.innerHTML = alertBox(err.message); }
    };
  }

  function viewRecovery() {
    setTitle("Set a new password");
    app.innerHTML = '<section class="card narrow"><h1>Set a new password</h1><form id="pw-form"><label>New password<input name="password" type="password" minlength="8" required autocomplete="new-password"></label><div id="pw-msg"></div><button class="btn btn-primary" type="submit">Update password</button></form></section>';
    document.getElementById("pw-form").onsubmit = async function (e) {
      e.preventDefault();
      var pw = this.elements.password.value, m = document.getElementById("pw-msg");
      if (pw.length < 8) return (m.innerHTML = alertBox("Password must be at least 8 characters."));
      try { await B.updatePassword(pw); state.recovery = false; m.innerHTML = alertBox("Password updated.", "ok"); setTimeout(function () { go("dashboard"); }, 800); }
      catch (err) { m.innerHTML = alertBox(err.message); }
    };
  }

  function viewDashboard() {
    setTitle("Dashboard");
    var done = completedCount(), best = bestAttempt();
    var lessonsPct = Math.round(done / LESSONS.length * 100);
    var testStatus = state.cert ? '<span class="pill pill-ok">Passed</span>' :
      !allLessonsDone() ? '<span class="pill">Locked</span>' : best ? '<span class="pill pill-warn">Best ' + best.percent + "%</span>" : '<span class="pill pill-info">Ready</span>';
    var next = state.cert ? { to: "certificate", label: "View certificate" } :
      allLessonsDone() ? { to: "test", label: best ? "Retake the test" : "Start the test" } :
      { to: "lessons", label: done ? "Continue lessons" : "Start lesson 1" };

    app.innerHTML =
      '<section class="page-head"><p class="eyebrow">Welcome back</p><h1>' + esc(state.user.full_name) + '</h1><p class="muted">' + esc(state.user.email) + "</p>" +
      '<a class="btn btn-primary" href="#/' + next.to + '">' + next.label + " →</a></section>" + tracker(null) +
      '<section class="steps">' +
      '<a class="card glass step" href="#/lessons"><span class="step-no">1</span><h2>Lessons</h2><p>' + done + " of " + LESSONS.length + ' completed</p><div class="bar"><span style="width:' + lessonsPct + '%"></span></div></a>' +
      '<a class="card glass step" href="#/test"><span class="step-no">2</span><h2>Assessment ' + testStatus + "</h2><p>" + QUESTIONS.length + " questions · " + PASS + "% (" + NEED + " correct) to pass</p></a>" +
      '<a class="card glass step" href="#/certificate"><span class="step-no">3</span><h2>Certificate</h2><p>' + (state.cert ? "ID <code>" + esc(state.cert.certificate_id) + "</code>" : "Issued when you pass") + "</p></a>" +
      "</section>" +
      (state.attempts.length ? '<section class="card glass"><h2>Attempt history</h2><table class="table"><thead><tr><th>Date</th><th>Score</th><th>Result</th></tr></thead><tbody>' +
        state.attempts.map(function (a) { return "<tr><td>" + esc(fmtDate(a.created_at)) + "</td><td>" + a.score + "/" + a.total + " (" + a.percent + "%)</td><td>" + (a.passed ? '<span class="pill pill-ok">Pass</span>' : '<span class="pill pill-bad">Not passed</span>') + "</td></tr>"; }).join("") +
        "</tbody></table></section>" : "");
  }

  function viewLessons() {
    setTitle("Lessons");
    var p = getProgress();
    app.innerHTML = '<section class="page-head"><p class="eyebrow">Step 1</p><h1>Lessons</h1><p class="muted">Complete all ' + LESSONS.length + " lessons to unlock the assessment. Each ends with key takeaways and a short knowledge check.</p></section>" + tracker(null) +
      '<ol class="lesson-list">' + LESSONS.map(function (l, i) {
        return '<li><a class="card glass lesson-item" href="#/lesson/' + (i + 1) + '"><span class="lesson-no">' + String(i + 1).padStart(2, "0") + '</span><span class="lesson-title"><small class="kicker">' + esc(l.kicker || "") + "</small>" + esc(l.title) +
          '<small class="muted">' + l.minutes + " min read</small></span>" + (p[l.id] ? '<span class="pill pill-ok">Completed</span>' : '<span class="pill">Not started</span>') + "</a></li>";
      }).join("") + '<li><a class="card glass lesson-item lesson-gloss" href="#/glossary"><span class="lesson-no">Aa</span><span class="lesson-title"><small class="kicker">Reference</small>Glossary of key terms<small class="muted">' + (window.PC1_GLOSSARY || []).length + ' terms</small></span><span class="pill pill-info">Reference</span></a></li>' + "</ol>" +
      (allLessonsDone() ? '<p class="center"><a class="btn btn-primary" href="#/test">Go to the assessment</a></p>' : "");
  }

  function viewLesson(n) {
    var i = Math.max(1, Math.min(LESSONS.length, parseInt(n, 10) || 1)) - 1, l = LESSONS[i], p = getProgress();
    setTitle(l.title);
    var take = (l.takeaways || []).length ? '<aside class="takeaways" aria-labelledby="kt-h"><h2 id="kt-h"><span aria-hidden="true">◆</span> Key takeaways</h2><ul>' +
      l.takeaways.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></aside>" : "";
    var check = (l.check || []).length ? '<section class="kcheck glass" aria-labelledby="kc-h"><h2 id="kc-h">Knowledge check</h2><p class="small muted">Practice only — not scored and not sent anywhere.</p><form id="kc-form" novalidate>' +
      l.check.map(function (c, ci) {
        return '<fieldset class="kc-q" id="kc' + ci + '"><legend>' + (ci + 1) + ". " + esc(c.q) + "</legend>" +
          c.options.map(function (o, oi) { return '<label class="option"><input type="radio" name="kc' + ci + '" value="' + oi + '"><span>' + esc(o) + "</span></label>"; }).join("") +
          '<p class="kc-fb" id="kc-fb' + ci + '" aria-live="polite"></p></fieldset>';
      }).join("") + '<button class="btn" type="submit">Check my answers</button> <span id="kc-score" class="kc-score" aria-live="polite"></span></form></section>' : "";
    app.innerHTML = '<article class="lesson">' + tracker(i) +
      '<header class="lesson-head"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/lessons">Lessons</a> / Lesson ' + (i + 1) + " of " + LESSONS.length + "</nav>" +
      '<p class="eyebrow">' + esc(l.kicker || "Lesson") + "</p><h1>" + esc(l.title) + '</h1><p class="muted small"><span aria-hidden="true">◷</span> ' + l.minutes + " min read" + (p[l.id] ? ' · <span class="pill pill-ok">Completed</span>' : "") + "</p></header>" +
      '<div class="card glass prose-card"><div class="prose">' + l.html + "</div>" + take + "</div>" + check +
      '<div class="lesson-foot card glass">' +
      (l.requiresAck ? '<label class="check"><input type="checkbox" id="ack"' + (p[l.id] ? " checked" : "") + "> I have read and understand the disclaimer: this course is education only and is not medical advice.</label>" : "") +
      '<div class="row">' + (i > 0 ? '<a class="btn" href="#/lesson/' + i + '">← Previous</a>' : "<span></span>") +
      '<button class="btn btn-primary" id="complete">' + (p[l.id] ? "Completed ✓ — " : "Mark complete &amp; ") + (i < LESSONS.length - 1 ? "next lesson →" : "finish") + "</button></div>" +
      '<div id="lesson-msg"></div></div></article>';
    var kc = document.getElementById("kc-form");
    if (kc) kc.onsubmit = function (e) {
      e.preventDefault();
      var right = 0;
      l.check.forEach(function (c, ci) {
        var sel = kc.querySelector('input[name="kc' + ci + '"]:checked'), fb = document.getElementById("kc-fb" + ci);
        var fs = document.getElementById("kc" + ci);
        fs.classList.remove("ok", "bad");
        if (!sel) { fb.textContent = "Choose an answer."; return; }
        var ok = Number(sel.value) === c.answer; if (ok) right++;
        fs.classList.add(ok ? "ok" : "bad");
        fb.innerHTML = (ok ? "<strong>Correct.</strong> " : "<strong>Not quite.</strong> ") + esc(c.explain || "");
      });
      document.getElementById("kc-score").textContent = right + " of " + l.check.length + " correct";
    };
    document.getElementById("complete").onclick = function () {
      var ack = document.getElementById("ack");
      if (ack && !ack.checked) { document.getElementById("lesson-msg").innerHTML = alertBox("Please tick the acknowledgement to continue."); return; }
      var pr = getProgress(); pr[l.id] = new Date().toISOString(); setProgress(pr);
      go(i < LESSONS.length - 1 ? "lesson/" + (i + 2) : (allLessonsDone() ? "test" : "lessons"));
    };
  }

  function viewGlossary() {
    setTitle("Glossary");
    var G = window.PC1_GLOSSARY || [];
    app.innerHTML = '<section class="page-head"><p class="eyebrow">Reference</p><h1>Glossary</h1><p class="muted">' + G.length + ' key terms used in the course.</p>' +
      '<label class="search"><span class="sr-only">Filter terms</span><input id="gq" type="search" placeholder="Filter terms…" autocomplete="off"></label></section>' +
      '<dl class="glossary" id="gl">' + G.map(function (g) { return '<div class="card glass g-item"><dt>' + esc(g[0]) + "</dt><dd>" + esc(g[1]) + "</dd></div>"; }).join("") + "</dl>" +
      '<p id="g-none" class="muted" hidden>No matching terms.</p>';
    var q = document.getElementById("gq");
    q.oninput = function () {
      var v = q.value.trim().toLowerCase(), shown = 0;
      Array.prototype.forEach.call(document.querySelectorAll("#gl .g-item"), function (el) {
        var hit = !v || el.textContent.toLowerCase().indexOf(v) !== -1; el.hidden = !hit; if (hit) shown++;
      });
      document.getElementById("g-none").hidden = shown > 0;
    };
  }

  function viewTest() {
    setTitle("Assessment");
    if (!allLessonsDone()) {
      app.innerHTML = '<section class="card glass narrow center"><h1>Assessment locked</h1><p>Complete all ' + LESSONS.length + " lessons first (" + completedCount() + " of " + LESSONS.length + ' done).</p><a class="btn btn-primary" href="#/lessons">Go to lessons</a></section>';
      return;
    }
    var saved; try { saved = JSON.parse(sessionStorage.getItem(progressKey() + "_answers")) || []; } catch (e) { saved = []; }
    app.innerHTML = tracker("test") + '<section class="page-head"><p class="eyebrow">Step 2</p><h1>Level 1 Assessment</h1><p class="muted">' + QUESTIONS.length +
      " multiple-choice questions. You need " + NEED + " correct answers (" + PASS + "%) to pass. You may retake the test if needed.</p>" +
      (state.cert ? alertBox("You have already passed. Retaking will not change your certificate.", "ok") : "") + "</section>" +
      '<form id="quiz" novalidate>' + QUESTIONS.map(function (q, qi) {
        return '<fieldset class="card glass question" id="q' + (qi + 1) + '"><legend><span class="qno">Question ' + (qi + 1) + " of " + QUESTIONS.length + "</span>" + esc(q.q) + "</legend>" +
          q.options.map(function (o, oi) {
            return '<label class="option"><input type="radio" name="q' + qi + '" value="' + oi + '"' + (saved[qi] === oi ? " checked" : "") + "><span>" + esc(o) + "</span></label>";
          }).join("") + "</fieldset>";
      }).join("") +
      '<div class="quiz-bar card glass"><div><strong id="answered">0</strong> of ' + QUESTIONS.length + ' answered<div class="bar"><span id="answered-bar"></span></div></div>' +
      '<div id="quiz-msg"></div><button class="btn btn-primary" type="submit" id="submit-quiz">Submit answers</button></div></form>';

    var form = document.getElementById("quiz");
    function collect() { return QUESTIONS.map(function (_, i) { var c = form.querySelector('input[name="q' + i + '"]:checked'); return c ? Number(c.value) : null; }); }
    function update() {
      var a = collect(), n = a.filter(function (x) { return x !== null; }).length;
      document.getElementById("answered").textContent = n;
      document.getElementById("answered-bar").style.width = (n / QUESTIONS.length * 100) + "%";
      sessionStorage.setItem(progressKey() + "_answers", JSON.stringify(a));
    }
    form.addEventListener("change", update); update();
    form.onsubmit = async function (e) {
      e.preventDefault();
      var a = collect(), missing = a.indexOf(null), msg = document.getElementById("quiz-msg"), btn = document.getElementById("submit-quiz");
      if (missing !== -1) {
        msg.innerHTML = alertBox("Please answer question " + (missing + 1) + " (and any others left blank).");
        document.getElementById("q" + (missing + 1)).scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (!confirm("Submit your answers? You cannot change them after submitting.")) return;
      btn.disabled = true; btn.textContent = "Grading…"; msg.innerHTML = "";
      try {
        var r = await B.submitAttempt(a);
        state.lastResult = r;
        sessionStorage.removeItem(progressKey() + "_answers");
        await refresh();
        go("result");
      } catch (err) { msg.innerHTML = alertBox(err.message); btn.disabled = false; btn.textContent = "Submit answers"; }
    };
  }

  function viewResult() {
    var r = state.lastResult;
    if (!r) return go("dashboard");
    if (r.passed) {
      setTitle("Congratulations");
      var c = r.certificate || state.cert;
      app.innerHTML = '<section class="card glass congrats center">' +
        '<div class="seal" aria-hidden="true"><svg viewBox="0 0 24 24" width="44" height="44"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg></div>' +
        '<p class="eyebrow">Assessment passed</p><h1>Congratulations, ' + esc(state.user.full_name) + "!</h1>" +
        '<p class="lead">You scored <strong>' + r.score + " of " + r.total + "</strong> (" + r.percent + "%) and have completed " + esc(COURSE) + ".</p>" +
        (c ? '<p>Your certificate ID is <code class="cert-code">' + esc(c.certificate_id) + "</code></p>" : "") +
        '<div class="row center"><a class="btn btn-primary" href="#/certificate">View &amp; print certificate</a><a class="btn" href="#/dashboard">Back to dashboard</a></div></section>';
    } else {
      setTitle("Result");
      app.innerHTML = '<section class="card glass narrow center"><p class="eyebrow">Assessment result</p><h1>Not passed this time</h1>' +
        '<p class="lead">You scored <strong>' + r.score + " of " + r.total + "</strong> (" + r.percent + "%). A score of " + PASS + "% (" + NEED + " correct) is required.</p>" +
        "<p>Review the lessons — especially safety, regulations and informed consent — then try again.</p>" +
        '<div class="row center"><a class="btn" href="#/lessons">Review lessons</a><a class="btn btn-primary" href="#/test">Retake test</a></div></section>';
    }
  }

  function viewCertificate() {
    setTitle("Certificate");
    var c = state.cert;
    if (!c) {
      app.innerHTML = '<section class="card glass narrow center"><h1>No certificate yet</h1><p>Pass the Level 1 assessment with ' + PASS + '% or higher to receive your certificate.</p><a class="btn btn-primary" href="#/' + (allLessonsDone() ? "test" : "lessons") + '">Continue</a></section>';
      return;
    }
    var url = verifyUrl(c.certificate_id);
    app.innerHTML = '<div class="cert-actions no-print"><h1>Your certificate</h1><div class="row row-start">' +
      '<button class="btn btn-primary" id="print">Print / Save as PDF</button><button class="btn" id="copy">Copy verification link</button>' +
      '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Open verification page</a></div><p class="small muted">Tip: in the print dialog choose “Landscape” and enable “Background graphics”.</p><div id="copy-msg"></div></div>' +
      '<div class="cert-sheet"><div class="certificate" id="certificate" role="img" aria-label="' + esc("Certificate of Completion for " + c.full_name + ", " + COURSE + ", issued " + fmtDate(c.issued_at) + ", ID " + c.certificate_id) + '">' +
      '<svg class="cert-bg" viewBox="0 0 1000 772" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="hx" width="28" height="48.5" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)"><path d="M14 0 28 8.1v16.2L14 32.4 0 24.3V8.1z" fill="none" stroke="currentColor" stroke-width=".6"/></pattern></defs><rect width="1000" height="772" fill="url(#hx)"/></svg>' +
      '<div class="cert-border">' +
      '<div class="cert-top"><span class="cert-logo" aria-hidden="true"><svg viewBox="0 0 32 32" width="34" height="34"><circle cx="8" cy="22" r="4"/><circle cx="16" cy="10" r="4"/><circle cx="24" cy="22" r="4"/><path d="M8 22 16 10 24 22" fill="none" stroke-width="2"/></svg></span><p class="cert-issuer">' + esc(ISSUER) + "</p></div>" +
      '<h2 class="cert-title">Certificate of Completion</h2>' +
      '<p class="cert-sub">This certifies that</p>' +
      '<p class="cert-name">' + esc(c.full_name) + "</p>" +
      '<p class="cert-sub">has successfully completed the course and passed the assessment for</p>' +
      '<p class="cert-course">' + esc(String(c.course || COURSE).replace(/\s*Level\s*1\s*$/i, "")) + '</p><p class="cert-level">' + esc(c.level || "Level 1") + "</p>" +
      '<div class="cert-meta"><div><span>Date issued</span><strong>' + esc(fmtDate(c.issued_at)) + "</strong></div>" +
      '<div class="cert-seal" aria-hidden="true"><svg viewBox="0 0 100 100"><defs><path id="sealc" d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1-72 0"/></defs><circle cx="50" cy="50" r="47" class="s1"/><circle cx="50" cy="50" r="41" class="s2"/><text class="s3"><textPath href="#sealc" textLength="224" lengthAdjust="spacing">PEPTIDE CERTIFICATION · VERIFIED · </textPath></text><text x="50" y="47" text-anchor="middle" class="s4">LEVEL</text><text x="50" y="66" text-anchor="middle" class="s5">1</text></svg></div>' +
      '<div><span>Certificate ID</span><strong class="mono">' + esc(c.certificate_id) + "</strong></div></div>" +
      '<p class="cert-verify">Verify at ' + esc(url) + "</p>" +
      '<p class="cert-disclaimer">Educational certificate of course completion only. Not a license, and does not authorize the holder to prescribe, compound, dispense or administer any substance. Not medical advice.</p>' +
      "</div></div></div>";
    document.getElementById("print").onclick = function () { window.print(); };
    document.getElementById("copy").onclick = async function () {
      var m = document.getElementById("copy-msg");
      try { await navigator.clipboard.writeText(url); m.innerHTML = alertBox("Verification link copied.", "ok"); }
      catch (e) { m.innerHTML = alertBox("Copy this link: " + url, "ok"); }
    };
  }

  /* ---------- router ---------- */
  async function refresh() {
    if (!state.user) return;
    try {
      var res = await Promise.all([B.getMyCertificate(), B.listAttempts()]);
      state.cert = res[0]; state.attempts = res[1];
    } catch (e) { console.error(e); }
  }

  function render() {
    var r = route(), name = r[0] || "";
    renderNav();
    if (B.initError) {
      app.innerHTML = '<section class="card narrow"><h1>Site configuration error</h1><p>' + esc(B.initError.message) + "</p><p>Check <code>assets/config.js</code> and your internet connection, then reload.</p></section>";
      return;
    }
    if (state.recovery && state.user) { viewRecovery(); return focusMain(); }
    if (!state.user) {
      if (name !== "register") name = "login";
      viewAuth(name);
      return focusMain();
    }
    switch (name) {
      case "lessons": viewLessons(); break;
      case "lesson": viewLesson(r[1]); break;
      case "glossary": viewGlossary(); break;
      case "test": viewTest(); break;
      case "result": viewResult(); break;
      case "certificate": viewCertificate(); break;
      case "login": case "register": case "dashboard": default:
        if (name !== "dashboard") { history.replaceState(null, "", "#/dashboard"); }
        viewDashboard();
    }
    focusMain();
  }

  async function init() {
    document.getElementById("year").textContent = new Date().getFullYear();
    renderBanner();
    B.onAuthChange(async function (event) {
      if (event === "PASSWORD_RECOVERY") { state.recovery = true; }
      if (event === "SIGNED_OUT") { state.user = null; state.cert = null; state.attempts = []; render(); }
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && !state.user)) {
        state.user = await B.getUser(); await refresh(); render();
      }
    });
    try { state.user = await B.getUser(); } catch (e) { console.error(e); }
    await refresh();
    window.addEventListener("hashchange", render);
    render();
  }
  init();
})();
