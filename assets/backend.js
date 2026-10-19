/*
 * Data layer. Uses Supabase when assets/config.js is filled in,
 * otherwise a local demo backend stored in localStorage.
 * Both expose the same async API (see bottom of file).
 */
(function () {
  "use strict";
  var cfg = window.PC1_CONFIG || {};
  var PASS = Number(cfg.PASS_PERCENT || 80);

  function isPlaceholder(v) {
    return !v || /YOUR-|YOUR_|<|placeholder/i.test(String(v));
  }
  var configured = !isPlaceholder(cfg.SUPABASE_URL) && !isPlaceholder(cfg.SUPABASE_ANON_KEY);

  /* ---------- shared helpers ---------- */
  function newCertificateId() {
    // Format: PC1-XXXX-XXXX-XXXX (uppercase hex) — same format as the SQL function.
    var bytes = new Uint8Array(6);
    (window.crypto || window.msCrypto).getRandomValues(bytes);
    var hex = Array.prototype.map.call(bytes, function (b) { return ("0" + b.toString(16)).slice(-2); }).join("").toUpperCase();
    return "PC1-" + hex.slice(0, 4) + "-" + hex.slice(4, 8) + "-" + hex.slice(8, 12);
  }
  function normalizeCertId(id) {
    return String(id || "").trim().toUpperCase().replace(/\s+/g, "");
  }
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src; s.onload = resolve; s.onerror = function () { reject(new Error("Failed to load " + src)); };
      document.head.appendChild(s);
    });
  }
  function scriptBase() {
    var el = document.querySelector('script[src*="backend.js"]');
    return el ? el.src.replace(/backend\.js.*$/, "") : "assets/";
  }

  /* =========================================================
   * Supabase backend
   * ========================================================= */
  function SupabaseBackend() {
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error("Supabase library failed to load (check your internet connection / CDN).");
    }
    var sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    function fail(error) { if (error) throw new Error(error.message || String(error)); }

    async function profileFor(user) {
      if (!user) return null;
      var res = await sb.from("profiles").select("full_name,email").eq("id", user.id).maybeSingle();
      var name = (res.data && res.data.full_name) || (user.user_metadata && user.user_metadata.full_name) || user.email;
      return { id: user.id, email: user.email, full_name: name };
    }

    return {
      mode: "supabase",
      client: sb,
      onAuthChange: function (cb) {
        sb.auth.onAuthStateChange(function (event) { setTimeout(function () { cb(event); }, 0); });
      },
      getUser: async function () {
        var r = await sb.auth.getSession();
        return profileFor(r.data && r.data.session && r.data.session.user);
      },
      signUp: async function (fullName, email, password) {
        var r = await sb.auth.signUp({
          email: email, password: password,
          options: { data: { full_name: fullName }, emailRedirectTo: location.origin + location.pathname }
        });
        fail(r.error);
        if (!r.data.session) return { needsConfirmation: true };
        return { user: await profileFor(r.data.user) };
      },
      signIn: async function (email, password) {
        var r = await sb.auth.signInWithPassword({ email: email, password: password });
        fail(r.error);
        return { user: await profileFor(r.data.user) };
      },
      signOut: async function () { await sb.auth.signOut(); },
      resetPassword: async function (email) {
        var r = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
        fail(r.error);
      },
      updatePassword: async function (password) {
        var r = await sb.auth.updateUser({ password: password });
        fail(r.error);
      },
      updateName: async function (fullName) {
        var u = (await sb.auth.getUser()).data.user;
        var r = await sb.from("profiles").update({ full_name: fullName }).eq("id", u.id);
        fail(r.error);
      },
      submitAttempt: async function (answers) {
        var r = await sb.rpc("submit_attempt", { p_answers: answers });
        fail(r.error);
        return r.data; // {attempt_id, score, total, percent, passed, certificate}
      },
      listAttempts: async function () {
        var r = await sb.from("attempts").select("id,score,total,percent,passed,created_at").order("created_at", { ascending: false });
        fail(r.error);
        return r.data || [];
      },
      getMyCertificate: async function () {
        var r = await sb.from("certificates").select("certificate_id,full_name,level,course,score_percent,issued_at,revoked").maybeSingle();
        fail(r.error);
        return r.data || null;
      },
      verify: async function (certId) {
        var r = await sb.rpc("verify_certificate", { p_certificate_id: normalizeCertId(certId) });
        fail(r.error);
        var row = Array.isArray(r.data) ? r.data[0] : r.data;
        return row || null;
      }
    };
  }

  /* =========================================================
   * Local demo backend (localStorage only — NOT secure)
   * ========================================================= */
  function DemoBackend() {
    var K = { users: "pc1_demo_users", session: "pc1_demo_session", attempts: "pc1_demo_attempts", certs: "pc1_demo_certificates" };
    var listeners = [];
    function read(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
    function write(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
    function emit(ev) { listeners.forEach(function (cb) { setTimeout(function () { cb(ev); }, 0); }); }
    function uid() {
      var b = new Uint8Array(16); crypto.getRandomValues(b);
      return Array.prototype.map.call(b, function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
    }
    async function hash(pw, salt) {
      var data = new TextEncoder().encode(salt + ":" + pw);
      if (window.crypto && crypto.subtle) {
        var buf = await crypto.subtle.digest("SHA-256", data);
        return Array.prototype.map.call(new Uint8Array(buf), function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
      }
      var h = 0; for (var i = 0; i < data.length; i++) { h = (h * 31 + data[i]) | 0; } return "w" + h;
    }
    function publicUser(u) { return u ? { id: u.id, email: u.email, full_name: u.full_name } : null; }
    function currentRaw() {
      var id = localStorage.getItem(K.session); if (!id) return null;
      var users = read(K.users, {});
      for (var e in users) if (users[e].id === id) return users[e];
      return null;
    }

    return {
      mode: "demo",
      onAuthChange: function (cb) { listeners.push(cb); },
      getUser: async function () { return publicUser(currentRaw()); },
      signUp: async function (fullName, email, password) {
        email = String(email).trim().toLowerCase();
        var users = read(K.users, {});
        if (users[email]) throw new Error("An account with this email already exists. Please sign in.");
        var salt = uid();
        users[email] = { id: uid(), email: email, full_name: fullName, salt: salt, pw: await hash(password, salt), created_at: new Date().toISOString() };
        write(K.users, users);
        localStorage.setItem(K.session, users[email].id);
        emit("SIGNED_IN");
        return { user: publicUser(users[email]) };
      },
      signIn: async function (email, password) {
        email = String(email).trim().toLowerCase();
        var u = read(K.users, {})[email];
        if (!u || u.pw !== await hash(password, u.salt)) throw new Error("Invalid login credentials.");
        localStorage.setItem(K.session, u.id);
        emit("SIGNED_IN");
        return { user: publicUser(u) };
      },
      signOut: async function () { localStorage.removeItem(K.session); emit("SIGNED_OUT"); },
      resetPassword: async function () { throw new Error("Password reset is not available in local demo mode."); },
      updatePassword: async function () { throw new Error("Not available in local demo mode."); },
      updateName: async function (fullName) {
        var u = currentRaw(); if (!u) throw new Error("Not signed in.");
        var users = read(K.users, {}); users[u.email].full_name = fullName; write(K.users, users);
      },
      submitAttempt: async function (answers) {
        var u = currentRaw(); if (!u) throw new Error("Not signed in.");
        if (!window.PC1_ANSWER_KEY) await loadScript(scriptBase() + "answer-key.js");
        var key = window.PC1_ANSWER_KEY;
        if (!Array.isArray(answers) || answers.length !== key.length) throw new Error("Please answer all " + key.length + " questions.");
        var score = 0;
        key.forEach(function (k, i) { if (answers[i] === k) score++; });
        var total = key.length, percent = Math.round((score / total) * 10000) / 100;
        var passed = score * 100 >= PASS * total;
        var attempt = { id: uid(), user_id: u.id, score: score, total: total, percent: percent, passed: passed, created_at: new Date().toISOString() };
        var attempts = read(K.attempts, []); attempts.push(attempt); write(K.attempts, attempts);
        var cert = null;
        if (passed) {
          var certs = read(K.certs, []);
          cert = certs.filter(function (c) { return c.user_id === u.id; })[0] || null;
          if (!cert) {
            cert = { certificate_id: newCertificateId(), user_id: u.id, attempt_id: attempt.id, full_name: u.full_name,
                     level: "Level 1", course: cfg.COURSE_NAME || "Peptide Certification Level 1",
                     score_percent: percent, issued_at: new Date().toISOString(), revoked: false };
            certs.push(cert); write(K.certs, certs);
          }
        }
        return { attempt_id: attempt.id, score: score, total: total, percent: percent, passed: passed, certificate: cert };
      },
      listAttempts: async function () {
        var u = currentRaw(); if (!u) return [];
        return read(K.attempts, []).filter(function (a) { return a.user_id === u.id; }).reverse();
      },
      getMyCertificate: async function () {
        var u = currentRaw(); if (!u) return null;
        return read(K.certs, []).filter(function (c) { return c.user_id === u.id; })[0] || null;
      },
      verify: async function (certId) {
        var id = normalizeCertId(certId);
        var c = read(K.certs, []).filter(function (x) { return x.certificate_id === id; })[0];
        return c ? { certificate_id: c.certificate_id, full_name: c.full_name, level: c.level, course: c.course, issued_at: c.issued_at, revoked: c.revoked } : null;
      }
    };
  }

  var backend, initError = null;
  if (configured) {
    try { backend = SupabaseBackend(); }
    catch (e) { initError = e; backend = DemoBackend(); backend.mode = "demo-fallback"; }
  } else {
    backend = DemoBackend();
  }
  backend.configured = configured;
  backend.initError = initError;
  backend.passPercent = PASS;
  backend.normalizeCertId = normalizeCertId;
  window.PC1Backend = backend;
})();
