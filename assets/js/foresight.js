(function () {
  const API_STORAGE_KEY = "foresight_gemini_api_key";
  const MODEL_NAME = "gemini-2.5-flash";

  const data = {
    disruptiveTechnologies: [
      "Generative AI agents",
      "Quantum computing",
      "Synthetic biology",
      "Autonomous robotics",
      "Brain-computer interfaces",
      "Digital twins",
      "Advanced semiconductors",
      "Spatial computing",
      "Fusion energy systems",
      "Blockchain infrastructure"
    ],
    socialTrends: [
      "Population aging",
      "Remote and hybrid work",
      "Urbanization pressure",
      "Rising mental health awareness",
      "Lifelong reskilling",
      "Digital trust concerns",
      "Identity-based consumption",
      "Experience-first lifestyles",
      "Creator economy expansion",
      "Climate-conscious consumers"
    ],
    politicalTrends: [
      "Industrial policy resurgence",
      "Technology export controls",
      "Geopolitical fragmentation",
      "Data sovereignty laws",
      "Green transition regulation",
      "Cybersecurity mandates",
      "Public AI governance",
      "Re-shoring incentives",
      "Strategic resource nationalism",
      "Digital taxation expansion"
    ],
    technologicalTrends: [
      "AI copilots at work",
      "Hyperautomation of workflows",
      "Platform ecosystem competition",
      "Cloud-to-edge migration",
      "Low-code enterprise systems",
      "Always-on connected devices",
      "Privacy-preserving analytics",
      "Industrial IoT expansion",
      "Cyber resilience by design",
      "Interoperable digital platforms"
    ],
    industries: [
      "Banking",
      "Insurance",
      "Healthcare",
      "Retail",
      "Manufacturing",
      "Energy",
      "Transportation",
      "Education",
      "Telecommunications",
      "Media and entertainment"
    ]
  };

  const state = {
    trends: [null, null, null],
    industry: null,
    dragging: null
  };

  const apiForm = document.getElementById("foresight-api-form");
  const apiKeyInput = document.getElementById("api-key-input");
  const apiKeyStatus = document.getElementById("api-key-status");
  const clearKeyButton = document.getElementById("clear-key-button");
  const generateButton = document.getElementById("generate-forecast-button");
  const resetCanvasButton = document.getElementById("reset-canvas-button");
  const statusEl = document.getElementById("foresight-status");
  const fiveYearResult = document.getElementById("five-year-result");
  const tenYearResult = document.getElementById("ten-year-result");

  if (!apiForm || !generateButton) {
    return;
  }

  function getSavedKey() {
    return window.localStorage.getItem(API_STORAGE_KEY) || "";
  }

  function setSavedKey(value) {
    if (value) {
      window.localStorage.setItem(API_STORAGE_KEY, value);
    } else {
      window.localStorage.removeItem(API_STORAGE_KEY);
    }
  }

  function updateApiKeyStatus() {
    const saved = getSavedKey();
    apiKeyStatus.textContent = saved
      ? "Gemini API key saved in this browser. Predictions are ready to generate."
      : "No Gemini API key saved yet.";
  }

  function createChip(label, type, group) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "foresight-chip" + (type === "industry" ? " is-industry" : "");
    button.draggable = true;
    button.textContent = label;
    button.dataset.type = type;
    button.dataset.group = group;
    button.dataset.label = label;

    button.addEventListener("dragstart", function (event) {
      state.dragging = { label: label, type: type, group: group };
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("text/plain", JSON.stringify(state.dragging));
    });

    button.addEventListener("click", function () {
      if (type === "industry") {
        state.industry = { label: label, group: group, type: type };
      } else {
        const emptyIndex = state.trends.findIndex(function (item) {
          return item === null;
        });

        if (emptyIndex === -1) {
          setStatus("You can only add 3 trends. Remove one from the canvas first.", true);
          return;
        }

        if (state.trends.some(function (item) { return item && item.label === label; })) {
          setStatus("Each trend can only be used once in the canvas.", true);
          return;
        }

        state.trends[emptyIndex] = { label: label, group: group, type: type };
      }

      renderCanvas();
    });

    return button;
  }

  function renderChipGroup(containerId, items, type, group) {
    const container = document.getElementById(containerId);

    if (!container) {
      return;
    }

    items.forEach(function (item) {
      container.appendChild(createChip(item, type, group));
    });
  }

  function createCanvasChip(item, removeHandler) {
    const wrapper = document.createElement("div");
    wrapper.className = "canvas-chip";

    const text = document.createElement("span");
    text.textContent = item.label;

    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", "Remove " + item.label);
    button.textContent = "x";
    button.addEventListener("click", removeHandler);

    wrapper.appendChild(text);
    wrapper.appendChild(button);

    return wrapper;
  }

  function renderCanvas() {
    for (let i = 0; i < 3; i += 1) {
      const slot = document.getElementById("trend-slot-" + i);
      slot.innerHTML = "";

      if (state.trends[i]) {
        slot.appendChild(
          createCanvasChip(state.trends[i], function () {
            state.trends[i] = null;
            renderCanvas();
          })
        );
      } else {
        const p = document.createElement("p");
        p.className = "foresight-placeholder";
        p.textContent = i === 0
          ? "Drop a trend here."
          : i === 1
            ? "Drop a different trend here."
            : "Drop a third trend here.";
        slot.appendChild(p);
      }
    }

    const industrySlot = document.getElementById("industry-slot");
    industrySlot.innerHTML = "";

    if (state.industry) {
      industrySlot.appendChild(
        createCanvasChip(state.industry, function () {
          state.industry = null;
          renderCanvas();
        })
      );
    } else {
      const p = document.createElement("p");
      p.className = "foresight-placeholder";
      p.textContent = "Drop one industry here.";
      industrySlot.appendChild(p);
    }

    const ready = state.trends.every(Boolean) && state.industry;
    generateButton.disabled = !ready;
    generateButton.setAttribute("aria-disabled", ready ? "false" : "true");

    if (!ready) {
      setStatus("Choose 3 trends and 1 industry to unlock predictions.", false);
    } else {
      setStatus("Canvas complete. Generate predictions when ready.", false);
    }
  }

  function setStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.classList.toggle("is-error", Boolean(isError));
  }

  function attachDropHandlers() {
    document.querySelectorAll(".foresight-slot").forEach(function (slot) {
      slot.addEventListener("dragover", function (event) {
        event.preventDefault();
        slot.classList.add("is-over");
        event.dataTransfer.dropEffect = "copy";
      });

      slot.addEventListener("dragleave", function () {
        slot.classList.remove("is-over");
      });

      slot.addEventListener("drop", function (event) {
        event.preventDefault();
        slot.classList.remove("is-over");

        let item = state.dragging;

        try {
          item = item || JSON.parse(event.dataTransfer.getData("text/plain"));
        } catch (error) {
          item = null;
        }

        if (!item) {
          return;
        }

        const slotType = slot.dataset.slotType;

        if (slotType === "industry") {
          if (item.type !== "industry") {
            setStatus("Only an industry can be dropped into the industry slot.", true);
            return;
          }

          state.industry = item;
          renderCanvas();
          return;
        }

        if (item.type !== "trend") {
          setStatus("Only trends can be dropped into a trend slot.", true);
          return;
        }

        if (state.trends.some(function (entry) { return entry && entry.label === item.label; })) {
          setStatus("That trend is already in the canvas.", true);
          return;
        }

        const index = Number(slot.dataset.slotIndex);
        state.trends[index] = item;
        renderCanvas();
      });
    });
  }

  function renderBulletList(container, items) {
    container.innerHTML = "";
    const list = document.createElement("ul");

    items.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    container.appendChild(list);
  }

  function parseJsonPayload(rawText) {
    const trimmed = rawText.trim();

    try {
      return JSON.parse(trimmed);
    } catch (error) {
      const fenced = trimmed
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "");

      return JSON.parse(fenced);
    }
  }

  async function generateForecast() {
    const apiKey = getSavedKey();

    if (!apiKey) {
      setStatus("Save your Gemini API key locally before generating predictions.", true);
      return;
    }

    const trends = state.trends.map(function (item) {
      return item.label;
    });

    const industry = state.industry.label;

    setStatus("Generating foresight brief...", false);
    fiveYearResult.innerHTML = "<p>Generating 5-year predictions...</p>";
    tenYearResult.innerHTML = "<p>Generating 10-year predictions...</p>";
    generateButton.disabled = true;

    const prompt = [
      "You are a strategic foresight analyst.",
      "Industry: " + industry,
      "Trend combination: " + trends.join(", "),
      "Return valid JSON only with this exact shape:",
      '{"five_year":["prediction 1","prediction 2","prediction 3"],"ten_year":["prediction 1","prediction 2","prediction 3"]}',
      "Each prediction should be a concise, plain-English sentence.",
      "Focus on how the combined trends reshape business models, customers, operations, regulation, or competitive structure.",
      "Avoid markdown, code fences, and extra commentary."
    ].join("\n");

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/" +
          MODEL_NAME +
          ":generateContent?key=" +
          encodeURIComponent(apiKey),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error && result.error.message ? result.error.message : "Prediction request failed.");
      }

      const rawText =
        (result.candidates &&
          result.candidates[0] &&
          result.candidates[0].content &&
          result.candidates[0].content.parts &&
          result.candidates[0].content.parts[0] &&
          result.candidates[0].content.parts[0].text) ||
        "";

      const parsed = parseJsonPayload(rawText);

      if (!Array.isArray(parsed.five_year) || !Array.isArray(parsed.ten_year)) {
        throw new Error("The model returned an unexpected prediction format.");
      }

      renderBulletList(fiveYearResult, parsed.five_year);
      renderBulletList(tenYearResult, parsed.ten_year);
      setStatus("Predictions generated successfully.", false);
    } catch (error) {
      fiveYearResult.innerHTML = "<p>Prediction generation failed.</p>";
      tenYearResult.innerHTML = "<p>Prediction generation failed.</p>";
      setStatus(error.message || "Prediction generation failed.", true);
    } finally {
      generateButton.disabled = !(state.trends.every(Boolean) && state.industry);
    }
  }

  apiForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = apiKeyInput.value.trim();

    if (!value) {
      setStatus("Paste a Gemini API key before saving.", true);
      return;
    }

    setSavedKey(value);
    apiKeyInput.value = "";
    updateApiKeyStatus();
    setStatus("Gemini API key saved locally in this browser.", false);
  });

  clearKeyButton.addEventListener("click", function () {
    setSavedKey("");
    updateApiKeyStatus();
    setStatus("Saved Gemini API key cleared from this browser.", false);
  });

  resetCanvasButton.addEventListener("click", function () {
    state.trends = [null, null, null];
    state.industry = null;
    renderCanvas();
    fiveYearResult.innerHTML = "<p>Generated predictions will appear here once the canvas is complete and the API key is saved.</p>";
    tenYearResult.innerHTML = "<p>Generated predictions will appear here once the canvas is complete and the API key is saved.</p>";
  });

  generateButton.addEventListener("click", function () {
    generateForecast();
  });

  renderChipGroup("disruptive-technologies-list", data.disruptiveTechnologies, "trend", "Disruptive technologies");
  renderChipGroup("social-trends-list", data.socialTrends, "trend", "Social trends");
  renderChipGroup("political-trends-list", data.politicalTrends, "trend", "Political trends");
  renderChipGroup("technological-trends-list", data.technologicalTrends, "trend", "Technological trends");
  renderChipGroup("industries-list", data.industries, "industry", "Industries");

  attachDropHandlers();
  updateApiKeyStatus();
  renderCanvas();
})();
