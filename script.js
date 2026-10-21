/* =========================================================
   Sketchbook — one script for every page.
   Each section only runs on the page that needs it, by
   checking <body data-page="...">.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- tiny helpers -------------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  // localStorage with a safety net (private mode can throw)
  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) { /* ignore */ }
  }

  var scoreKey = "sketchbook.scores";
  var paletteKey = "sketchbook.palettes";

  /* ---------- mobile menu (every page) -------------------- */
  (function () {
    var btn = $("#menu-btn");
    var nav = $("#nav");
    if (!btn || !nav) return;

    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  })();

  var page = document.body.getAttribute("data-page");

  /* =========================================================
     PRACTICE PAGE
     ========================================================= */
  if (page === "practice") {
    var prompts = [
      { cat: "hands", title: "One hand, shadow first", copy: "Draw your non-drawing hand. Ignore the outline — block in the shadow shapes, then find the knuckles." },
      { cat: "hands", title: "Ten seconds, then two minutes", copy: "Draw the same hand twice: once in ten seconds, once in two minutes. Which one reads better?" },
      { cat: "hands", title: "Fist, flat, pointing", copy: "Three poses, forty seconds each. Keep the pen moving; no erasing." },
      { cat: "gestures", title: "The chair you are sitting in", copy: "One continuous line. Do not lift the pen. The pose matters more than the detail." },
      { cat: "gestures", title: "Walking, in three strokes", copy: "Catch the weight shift with as few lines as possible. Draw the movement, not the person." },
      { cat: "gestures", title: "Someone mid-yawn", copy: "Ask someone, or use a mirror. Catch the stretch at its widest point, not the face." },
      { cat: "faces", title: "Three-quarter profile", copy: "Mark the brow line, eye line and nose line before any feature. Then place the features." },
      { cat: "faces", title: "Same face, three moods", copy: "Three small heads. Change only the eyebrows and the mouth — nothing else." },
      { cat: "faces", title: "Eyes only, six pairs", copy: "One minute per pair. Vary the shape, not the size." },
      { cat: "still life", title: "A cup and its shadow", copy: "Put a mug near a lamp. Draw the cast shadow as a shape, not as an outline." },
      { cat: "still life", title: "Negative space", copy: "Draw the space around an object instead of the object. Let the mug appear by itself." },
      { cat: "still life", title: "Fold a page, draw the crease", copy: "One fold, one tone change. Find the lightest and darkest parts of the paper." }
    ];

    var els = {
      meta: $("#drill-meta"),
      title: $("#drill-title"),
      copy: $("#drill-copy"),
      cat: $("#drill-cat"),
      time: $("#time"),
      label: $("#time-label"),
      start: $("#start"),
      shuffle: $("#shuffle"),
      chips: $$(".chips .chip"),
      pad: $("#pad"),
      clear: $("#clear"),
      savePng: $("#save-png")
    };

    var current = -1;
    var duration = 120;     // chosen drill length in seconds
    var remaining = 120;    // seconds left
    var endAt = null;       // timestamp when the drill ends
    var tickId = null;
    var running = false;

    /* --- prompts --- */
    function showPrompt(index) {
      var item = prompts[index];
      current = index;
      els.meta.textContent = "Drill " + pad(index + 1) + " · warm-up";
      els.title.textContent = item.title;
      els.copy.textContent = item.copy;
      els.cat.textContent = item.cat;
    }

    function shuffle() {
      var next = current;
      while (next === current) {
        next = Math.floor(Math.random() * prompts.length);
      }
      showPrompt(next);
    }

    /* --- timer --- */
    function format(seconds) {
      return pad(Math.floor(seconds / 60)) + ":" + pad(seconds % 60);
    }

    function paintTimer() {
      els.time.textContent = duration === 0 ? "∞" : format(remaining);
      if (duration === 0) {
        els.label.textContent = "no limit";
      } else if (remaining === 0) {
        els.label.textContent = "time's up";
      } else {
        els.label.textContent = running ? "drawing" : "remaining";
      }
    }

    function stopTimer() {
      running = false;
      if (tickId) { clearInterval(tickId); tickId = null; }
      els.start.textContent = "Start";
    }

    function beep() {
      try {
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        var ctx = new AudioCtx();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        osc.onended = function () { ctx.close(); };
      } catch (err) { /* audio is a bonus, never required */ }
    }

    function startTimer() {
      if (duration === 0) {
        els.label.textContent = "no limit";
        return;
      }
      if (remaining <= 0) remaining = duration;
      endAt = Date.now() + remaining * 1000;
      running = true;
      els.start.textContent = "Pause";
      paintTimer();

      tickId = setInterval(function () {
        remaining = Math.max(0, Math.round((endAt - Date.now()) / 1000));
        paintTimer();
        if (remaining === 0) {
          stopTimer();
          beep();
        }
      }, 200);
    }

    if (els.start) {
      els.start.addEventListener("click", function () {
        if (running) { stopTimer(); paintTimer(); } else { startTimer(); }
      });

      els.shuffle.addEventListener("click", shuffle);

      els.chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          els.chips.forEach(function (c) { c.classList.remove("on"); });
          chip.classList.add("on");
          stopTimer();
          duration = Number(chip.getAttribute("data-sec"));
          remaining = duration;
          paintTimer();
        });
      });

      showPrompt(Math.floor(Math.random() * prompts.length));
      paintTimer();
    }

    /* --- sketch pad --- */
    if (els.pad) {
      var canvas = els.pad;
      var ctx = canvas.getContext("2d");
      var cssWidth = 0;
      var cssHeight = 0;

      function sizeCanvas() {
        var ratio = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect();
        cssWidth = rect.width;
        cssHeight = rect.height;
        canvas.width = Math.round(rect.width * ratio);
        canvas.height = Math.round(rect.height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#1f3b2e";
      }

      function point(event) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
      }

      var drawing = false;
      var last = null;

      canvas.addEventListener("pointerdown", function (event) {
        drawing = true;
        canvas.setPointerCapture(event.pointerId);
        last = point(event);
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(last.x + 0.1, last.y + 0.1);
        ctx.stroke();
      });

      canvas.addEventListener("pointermove", function (event) {
        if (!drawing) return;
        var now = point(event);
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(now.x, now.y);
        ctx.stroke();
        last = now;
      });

      function endStroke() { drawing = false; last = null; }
      canvas.addEventListener("pointerup", endStroke);
      canvas.addEventListener("pointercancel", endStroke);
      canvas.addEventListener("pointerleave", endStroke);

      els.clear.addEventListener("click", function () {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      });

      els.savePng.addEventListener("click", function () {
        var link = document.createElement("a");
        link.download = "sketchbook-drill.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });

      var resizeId = null;
      window.addEventListener("resize", function () {
        clearTimeout(resizeId);
        resizeId = setTimeout(function () {
          if (cssWidth !== canvas.getBoundingClientRect().width) sizeCanvas();
        }, 150);
      });

      sizeCanvas();
    }
  }

  /* =========================================================
     PALETTES PAGE
     ========================================================= */
  if (page === "palettes") {
    var genEls = {
      strip: $("#gen-strip"),
      generate: $("#generate"),
      save: $("#save"),
      copy: $("#copy"),
      copyNote: $("#copy-note"),
      harmony: $("#harmony"),
      harmonyTag: $("#gen-harmony"),
      saved: $("#saved-list"),
      savedCount: $("#saved-count")
    };

    var currentColors = [];

    function hslToHex(h, s, l) {
      h = ((h % 360) + 360) % 360;
      s = Math.min(100, Math.max(0, s)) / 100;
      l = Math.min(100, Math.max(0, l)) / 100;

      var c = (1 - Math.abs(2 * l - 1)) * s;
      var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      var m = l - c / 2;
      var r = 0, g = 0, b = 0;

      if (h < 60)       { r = c; g = x; b = 0; }
      else if (h < 120) { r = x; g = c; b = 0; }
      else if (h < 180) { r = 0; g = c; b = x; }
      else if (h < 240) { r = 0; g = x; b = c; }
      else if (h < 300) { r = x; g = 0; b = c; }
      else              { r = c; g = 0; b = x; }

      function part(v) {
        var n = Math.round((v + m) * 255);
        return pad(n.toString(16)).slice(-2).toUpperCase();
      }
      return "#" + part(r) + part(g) + part(b);
    }

    function textOn(hex) {
      var r = parseInt(hex.slice(1, 3), 16);
      var g = parseInt(hex.slice(3, 5), 16);
      var b = parseInt(hex.slice(5, 7), 16);
      // rough perceived brightness
      var brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 140 ? "#1f3b2e" : "#f1ebd9";
    }

    function buildPalette(harmony) {
      var h = Math.floor(Math.random() * 360);
      var s = 38 + Math.floor(Math.random() * 22);
      var list;

      if (harmony === "complementary") {
        list = [
          [h, s, 34], [h, s, 48], [h, s, 68],
          [h + 180, s, 44], [h + 180, Math.round(s * 0.5), 76]
        ];
      } else if (harmony === "triadic") {
        list = [
          [h, s, 42], [h + 120, s, 46], [h + 240, s, 40],
          [h, Math.round(s * 0.4), 82], [h, s, 24]
        ];
      } else if (harmony === "monochromatic") {
        list = [
          [h, s, 26], [h, s, 40], [h, s, 54], [h, Math.round(s * 0.7), 70], [h, Math.round(s * 0.4), 84]
        ];
      } else {
        list = [
          [h - 32, s, 38], [h - 16, s, 50], [h, s, 60],
          [h + 16, Math.round(s * 0.85), 70], [h + 32, Math.round(s * 0.6), 82]
        ];
      }

      return list.map(function (c) { return hslToHex(c[0], c[1], c[2]); });
    }

    function renderStrip(colors) {
      genEls.strip.innerHTML = "";
      colors.forEach(function (hex) {
        var cell = document.createElement("div");
        cell.className = "sw";
        cell.style.background = hex;
        cell.style.color = textOn(hex);
        cell.textContent = hex;
        genEls.strip.appendChild(cell);
      });
    }

    function generate() {
      currentColors = buildPalette(genEls.harmony.value);
      genEls.harmonyTag.textContent = genEls.harmony.value;
      renderStrip(currentColors);
      genEls.copyNote.textContent = "";
    }

    function savePalette() {
      if (!currentColors.length) return;
      var saved = read(paletteKey, []);
      saved.unshift({
        id: "p" + Date.now(),
        harmony: genEls.harmony.value,
        colors: currentColors.slice()
      });
      saved = saved.slice(0, 12);
      write(paletteKey, saved);
      renderSaved();
      genEls.copyNote.textContent = "Saved ✓";
    }

    function renderSaved() {
      var saved = read(paletteKey, []);
      genEls.saved.innerHTML = "";
      genEls.savedCount.textContent = saved.length + " saved";

      if (!saved.length) {
        var empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "Nothing saved yet. Generate a palette and hit Save.";
        genEls.saved.appendChild(empty);
        return;
      }

      saved.forEach(function (item) {
        var row = document.createElement("div");
        row.className = "saved-row";

        var strip = document.createElement("div");
        strip.className = "mini-strip";
        item.colors.forEach(function (hex) {
          var cell = document.createElement("i");
          cell.style.background = hex;
          strip.appendChild(cell);
        });

        var label = document.createElement("span");
        label.className = "small";
        label.textContent = item.harmony;

        var remove = document.createElement("button");
        remove.className = "btn ghost sm";
        remove.textContent = "Delete";
        remove.addEventListener("click", function () {
          var left = read(paletteKey, []).filter(function (p) { return p.id !== item.id; });
          write(paletteKey, left);
          renderSaved();
        });

        row.appendChild(strip);
        row.appendChild(label);
        row.appendChild(remove);
        genEls.saved.appendChild(row);
      });
    }

    genEls.generate.addEventListener("click", generate);
    genEls.save.addEventListener("click", savePalette);
    genEls.harmony.addEventListener("change", generate);

    genEls.copy.addEventListener("click", function () {
      var text = currentColors.join(", ");
      function done() { genEls.copyNote.textContent = "Copied ✓"; }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          genEls.copyNote.textContent = "Copy failed — select the codes manually";
        });
      } else {
        var box = document.createElement("textarea");
        box.value = text;
        document.body.appendChild(box);
        box.select();
        try { document.execCommand("copy"); done(); } catch (err) { /* ignore */ }
        document.body.removeChild(box);
      }
    });

    generate();
    renderSaved();
  }

  /* =========================================================
     QUIZ PAGE
     ========================================================= */
  if (page === "quiz") {
    var questions = [
      {
        q: "Which harmony uses colours sitting opposite each other on the wheel?",
        options: ["Analogous", "Complementary", "Monochromatic", "Triadic"],
        answer: 1,
        why: "Complementary pairs sit opposite each other. Use one as the main colour and the other in small doses."
      },
      {
        q: "Colours next to each other on the colour wheel are called…",
        options: ["Complementary", "Triadic", "Analogous", "Neutral"],
        answer: 2,
        why: "Analogous colours are neighbours. They feel calm because they share a base hue."
      },
      {
        q: "A tint is made by adding which colour?",
        options: ["Black", "Grey", "White", "Another hue"],
        answer: 2,
        why: "Tint = hue + white. Shade = hue + black. Tone = hue + grey."
      },
      {
        q: "A shade is made by adding which colour?",
        options: ["White", "Black", "Grey", "Its complement"],
        answer: 1,
        why: "Adding black darkens the hue. Adding white lightens it (a tint)."
      },
      {
        q: "Which pair is made of warm colours?",
        options: ["Blue and green", "Green and violet", "Orange and red", "Blue and violet"],
        answer: 2,
        why: "Warm colours sit around red, orange and yellow; cool colours around blue and green."
      },
      {
        q: "Monochromatic means…",
        options: [
          "One hue in different values",
          "Two complementary hues",
          "Three hues 120° apart",
          "Only black and white"
        ],
        answer: 0,
        why: "One hue, varied with tints, shades and tones. It is the easiest harmony to keep tidy."
      },
      {
        q: "Triadic colours are spaced how far apart on the wheel?",
        options: ["30°", "90°", "120°", "180°"],
        answer: 2,
        why: "Three colours 120° apart — for example red, yellow and blue at full strength."
      },
      {
        q: "Why does low contrast between text and background matter?",
        options: [
          "It makes the file larger",
          "It is hard to read, especially for some people",
          "It changes the hue",
          "It only affects printing"
        ],
        answer: 1,
        why: "Contrast is an accessibility issue. Aim for 4.5:1 for body text."
      },
      {
        q: "Which of these is a neutral colour?",
        options: ["Red", "Leaf green", "Grey", "Violet"],
        answer: 2,
        why: "Greys, blacks, whites and browns sit outside the hue circle — they work with everything."
      },
      {
        q: "Saturation describes…",
        options: [
          "How light or dark a colour is",
          "How pure or intense a colour is",
          "Where it sits on the wheel",
          "Whether it is warm or cool"
        ],
        answer: 1,
        why: "Saturation is intensity. Lightness is how light or dark it is — they are different axes."
      }
    ];

    var quizEls = {
      card: $("#quiz-card"),
      result: $("#quiz-result"),
      count: $("#q-count"),
      bar: $("#q-bar"),
      score: $("#q-score"),
      text: $("#q-text"),
      options: $("#q-options"),
      why: $("#q-why"),
      hint: $("#q-hint"),
      next: $("#q-next"),
      rScore: $("#r-score"),
      rLine: $("#r-line"),
      rName: $("#r-name"),
      rSave: $("#r-save"),
      rNote: $("#r-note"),
      rAgain: $("#r-again")
    };

    var index = 0;
    var score = 0;
    var answered = false;
    var keys = ["A", "B", "C", "D"];

    function renderQuestion() {
      var item = questions[index];
      answered = false;

      quizEls.count.textContent = "Question " + (index + 1) + " / " + questions.length;
      quizEls.bar.style.width = Math.round((index / questions.length) * 100) + "%";
      quizEls.score.textContent = score + " correct";
      quizEls.text.textContent = item.q;
      quizEls.hint.textContent = "Pick an answer";
      quizEls.next.textContent = index === questions.length - 1 ? "See result" : "Next";
      quizEls.next.disabled = true;
      quizEls.why.hidden = true;
      quizEls.why.textContent = "";
      quizEls.options.innerHTML = "";

      item.options.forEach(function (label, i) {
        var button = document.createElement("button");
        button.className = "option";
        button.type = "button";

        var key = document.createElement("span");
        key.className = "key";
        key.textContent = keys[i];

        var text = document.createElement("span");
        text.textContent = label;

        button.appendChild(key);
        button.appendChild(text);
        button.addEventListener("click", function () { choose(i); });
        quizEls.options.appendChild(button);
      });
    }

    function choose(picked) {
      if (answered) return;
      answered = true;

      var item = questions[index];
      var buttons = $$(".option", quizEls.options);

      buttons.forEach(function (button, i) {
        button.disabled = true;
        if (i === item.answer) button.classList.add("correct");
        if (i === picked && picked !== item.answer) button.classList.add("wrong");
      });

      if (picked === item.answer) {
        score += 1;
        quizEls.hint.textContent = "Correct";
      } else {
        quizEls.hint.textContent = "Not quite";
      }

      quizEls.score.textContent = score + " correct";
      quizEls.why.textContent = item.why;
      quizEls.why.hidden = false;
      quizEls.next.disabled = false;
    }

    function showResult() {
      quizEls.card.hidden = true;
      quizEls.result.hidden = false;
      quizEls.rScore.textContent = score + " / " + questions.length;

      var line;
      if (score === questions.length) line = "Flawless. Go teach someone else.";
      else if (score >= 8) line = "Strong. You know your hues.";
      else if (score >= 5) line = "Decent — the harmony names are where people slip.";
      else line = "Worth another run. The explanations stay on screen for a reason.";
      quizEls.rLine.textContent = line;

      quizEls.rNote.textContent = "Saves on this device only — no accounts.";
      quizEls.rSave.disabled = false;
      quizEls.rName.value = "";
    }

    function saveScore() {
      var name = quizEls.rName.value.trim() || "Anonymous";
      var all = read(scoreKey, []);
      all.push({
        id: "s" + Date.now(),
        name: name.slice(0, 14),
        score: score,
        total: questions.length,
        ts: Date.now()
      });
      write(scoreKey, all);
      quizEls.rSave.disabled = true;
      quizEls.rNote.textContent = "Saved ✓ — open the board to see where you landed.";
    }

    quizEls.next.addEventListener("click", function () {
      if (!answered) return;
      index += 1;
      if (index >= questions.length) {
        showResult();
      } else {
        renderQuestion();
      }
    });

    quizEls.rSave.addEventListener("click", saveScore);

    quizEls.rAgain.addEventListener("click", function () {
      index = 0;
      score = 0;
      quizEls.result.hidden = true;
      quizEls.card.hidden = false;
      renderQuestion();
    });

    renderQuestion();
  }

  /* =========================================================
     BOARD PAGE
     ========================================================= */
  if (page === "board") {
    var boardBody = $("#board-body");
    var clearMine = $("#clear-mine");

    var seeds = [
      { name: "Amira", score: 10, total: 10, ts: Date.now() - 2 * 60 * 60 * 1000 },
      { name: "Kai", score: 10, total: 10, ts: Date.now() - 26 * 60 * 60 * 1000 },
      { name: "Jun", score: 9, total: 10, ts: Date.now() - 30 * 60 * 60 * 1000 },
      { name: "Priya", score: 8, total: 10, ts: Date.now() - 3 * 24 * 60 * 60 * 1000 },
      { name: "Dan", score: 7, total: 10, ts: Date.now() - 4 * 24 * 60 * 60 * 1000 },
      { name: "Mei", score: 6, total: 10, ts: Date.now() - 5 * 24 * 60 * 60 * 1000 }
    ];

    function timeAgo(ts) {
      var mins = Math.round((Date.now() - ts) / 60000);
      if (mins < 1) return "just now";
      if (mins < 60) return mins + " min ago";
      var hours = Math.round(mins / 60);
      if (hours < 24) return hours + "h ago";
      var days = Math.round(hours / 24);
      return days + "d ago";
    }

    function render() {
      var mine = read(scoreKey, []);
      var rows = seeds.concat(mine.map(function (s) {
        return { name: s.name, score: s.score, total: s.total, ts: s.ts, you: true };
      }));

      rows.sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score; // higher score first
        return a.ts - b.ts;                               // then the earlier run
      });

      var top = rows.slice(0, 10);
      boardBody.innerHTML = "";

      top.forEach(function (row, i) {
        var tr = document.createElement("tr");
        if (row.you) tr.className = "you";

        var rank = document.createElement("td");
        rank.className = "rank";
        rank.textContent = i + 1;

        var name = document.createElement("td");
        name.textContent = row.name;

        var scoreCell = document.createElement("td");
        scoreCell.textContent = row.score + " / " + row.total;

        var when = document.createElement("td");
        when.className = "when";
        when.textContent = timeAgo(row.ts);

        tr.appendChild(rank);
        tr.appendChild(name);
        tr.appendChild(scoreCell);
        tr.appendChild(when);
        boardBody.appendChild(tr);
      });

      if (!top.length) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.colSpan = 4;
        td.textContent = "No scores yet — take the quiz.";
        tr.appendChild(td);
        boardBody.appendChild(tr);
      }
    }

    clearMine.addEventListener("click", function () {
      write(scoreKey, []);
      render();
    });

    render();
  }

})();
