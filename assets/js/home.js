(function () {
  const tabs = Array.from(document.querySelectorAll(".interactive-tab"));

  if (!tabs.length) {
    return;
  }

  const label = document.getElementById("interactive-label");
  const title = document.getElementById("interactive-title");
  const kicker = document.getElementById("interactive-kicker");
  const summary = document.getElementById("interactive-summary");
  const points = document.getElementById("interactive-points");

  const content = {
    technology: {
      label: "Technology Lens",
      title: "Track what changes before the market names it.",
      kicker: "Signals first",
      summary:
        "Weak signals, experimental uses, and changes in user behavior often appear before established actors agree that a field is changing. Disruptive Foresight treats those early moves as inputs for structured interpretation rather than as isolated curiosities.",
      points: [
        ["Early signals", "Emerging tools, infrastructures, and practices become visible before strategy catches up."],
        ["Analytical task", "Students learn to ask what second-order consequences those signals might trigger."],
        ["Classroom value", "Discussion moves from trend naming toward mechanism, implication, and response."],
        ["Connected course", "Digital Transformation is the main entry point for this lens."]
      ]
    },
    markets: {
      label: "Market Lens",
      title: "Study how digital systems reorder competition and value.",
      kicker: "Markets in motion",
      summary:
        "Digital disruption is not only about new tools. It changes how firms capture value, how ecosystems are coordinated, and what counts as defensible advantage. This lens helps students connect technology to market structure.",
      points: [
        ["Competitive logic", "Attention shifts from products alone to platforms, interfaces, data, and network effects."],
        ["Strategic question", "Students examine when incumbents adapt, when they hesitate, and when entrants redefine the field."],
        ["Teaching use", "Good for comparing industries that digitize at different speeds but face similar structural pressure."],
        ["Connected course", "Digital Transformation provides the strongest cases for this perspective."]
      ]
    },
    institutions: {
      label: "Institutional Lens",
      title: "Read disruption through legitimacy, rules, and organizational response.",
      kicker: "Rules & response",
      summary:
        "Technological shifts only become durable when organizations, regulators, and institutions react to them. This lens helps students interpret how rules, norms, and governance shape what disruption can actually become.",
      points: [
        ["Institutional pressure", "New capabilities create friction with established regulation, routines, and expectations."],
        ["Analytical move", "Students assess how organizations respond when their existing logic no longer fits the environment."],
        ["Discussion value", "Useful for understanding why adoption is uneven and why strategic timing matters."],
        ["Connected course", "Both course books rely on this lens to explain uneven change."]
      ]
    },
    finance: {
      label: "Finance Lens",
      title: "Follow how trust, money, and intermediation are being redesigned.",
      kicker: "Value & trust",
      summary:
        "Digital finance provides one of the clearest examples of disruption reshaping an entire system. Payments, open banking, tokenization, and platform infrastructures show how digital change transforms value exchange itself.",
      points: [
        ["System view", "Students examine financial innovation as a shift in intermediation rather than a catalogue of tools."],
        ["Strategic focus", "The lens highlights trust architecture, market access, compliance, and platform control."],
        ["Teaching use", "It helps connect fintech developments to broader questions of institutional design and legitimacy."],
        ["Connected course", "Digital Finance is the natural home for this perspective."]
      ]
    }
  };

  function renderPoints(items) {
    points.innerHTML = items
      .map(function (item) {
        return (
          '<div class="interactive-point">' +
          "<strong>" + item[0] + "</strong>" +
          "<span>" + item[1] + "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  function setActive(key) {
    const entry = content[key];

    if (!entry) {
      return;
    }

    label.textContent = entry.label;
    title.textContent = entry.title;
    kicker.textContent = entry.kicker;
    summary.textContent = entry.summary;
    renderPoints(entry.points);

    tabs.forEach(function (tab) {
      const active = tab.getAttribute("data-lens") === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setActive(tab.getAttribute("data-lens"));
    });
  });

  setActive("technology");
})();
