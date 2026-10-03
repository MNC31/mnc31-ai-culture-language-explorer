(() => {
  const track = document.getElementById("ai-carousel-track");
  const count = document.getElementById("ai-response-count");
  const title = document.getElementById("ai-response-title");
  const panel = document.getElementById("translation-panel");
  const overlay = document.getElementById("ai-recognition-overlay");
  const resetButton = document.getElementById("reset-ai-button");
  const imageTabs = document.querySelectorAll(".image-tab");
  if (!track) return;

  const imageNames = ["Gate inscription", "Signboard", "Stone inscription", "Wikisource baseline"];

  // These are the approximate bounds of ALL visible characters for each image.
  // Individual AI readings can then shrink the box to the amount of text that
  // particular response claims to have read.
  const imagePositions = [
    // Image 1: all four green characters across the stone panel.
    { left: "17%", top: "29%", width: "50%", height: "17%", direction: "horizontal", maxChars: 4 },
    // Image 2: the gold characters form one short horizontal line on the signboard.
    { left: "23%", top: "32%", width: "43%", height: "15%", direction: "horizontal", maxChars: 10 },
    // Image 3: the inscription is a long vertical column running almost the full height.
    { left: "49%", top: "7%", width: "17%", height: "90%", direction: "vertical", maxChars: 12 },
    // Image 4: the full long Wikisource passage.
    { left: "2%", top: "8%", width: "96%", height: "84%", direction: "horizontal", maxChars: 40 }
  ];

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  let responses = [];
  let hasSelection = false;

  function basePosition(index) {
    return imagePositions[index] || imagePositions[0];
  }

  function characterCount(text) {
    // Count visible Chinese/Japanese/Korean characters plus letters/numbers,
    // ignoring punctuation and whitespace.
    return Array.from(String(text || "")).filter((char) => /[\p{L}\p{N}]/u.test(char)).length;
  }

  function positionRecognition(index, item = null) {
    const p = basePosition(index);
    const highlight = item?.highlight || {};
    const ratio = item
      ? (highlight.ratio
        ? Math.max(0.12, Math.min(1, Number(highlight.ratio)))
        : Math.max(0.12, Math.min(1, characterCount(item.source_text) / p.maxChars)))
      : 1;

    overlay.style.left = highlight.left || p.left;
    overlay.style.top = highlight.top || p.top;

    if (highlight.width) {
      overlay.style.width = highlight.width;
    } else if (p.direction === "vertical") {
      overlay.style.width = p.width;
    } else {
      overlay.style.width = `${parseFloat(p.width) * ratio}%`;
    }

    if (highlight.height) {
      overlay.style.height = highlight.height;
    } else if (p.direction === "vertical") {
      overlay.style.height = `${parseFloat(p.height) * ratio}%`;
    } else {
      overlay.style.height = p.height;
    }
  }

  function selectResponse(item, imageIndex) {
    hasSelection = true;
    panel?.classList.remove("is-awaiting-selection");
    positionRecognition(imageIndex, item);
    overlay.classList.add("is-active", "has-reading");
  }

  function showPrompt(imageIndex) {
    hasSelection = false;
    panel?.classList.add("is-awaiting-selection");
    positionRecognition(imageIndex);
    overlay.classList.add("is-active");
    overlay.classList.remove("has-reading");
    track.innerHTML = "";
    title.textContent = "Select the highlighted characters";
    count.textContent = "Nothing selected";
  }

  function render(imageIndex) {
    const current = responses.filter((item) => Number(item.image) === Number(imageIndex));

    // Before the user clicks the box, deliberately show no AI translations.
    showPrompt(imageIndex);

    track.innerHTML = "";

    // The response cards are prepared only after the user activates the box.
    overlay.onclick = (event) => {
      event.stopPropagation();

      if (!hasSelection) {
        track.innerHTML = current.map((item, index) =>
          '<button class="ai-carousel-card" type="button" data-response-index="' + index + '" aria-label="Show ' + escapeHtml(item.ai) + ' reading">' +
            '<div class="ai-card-top"><div><span class="ai-card-number">0' + (index + 1) + '</span><div class="ai-name">' + escapeHtml(item.ai) + '</div></div><span class="ai-card-action">View on image →</span></div>' +
            '<div class="ai-field ai-field-reading"><span class="ai-field-label">Recognized characters</span><div class="ai-script" lang="zh">' + escapeHtml(item.source_text) + '</div></div>' +
            '<div class="ai-field"><span class="ai-field-label">Standardized / simplified</span><div class="ai-script ai-script-small" lang="zh">' + escapeHtml(item.standardized) + '</div></div>' +
            '<div class="ai-field"><span class="ai-field-label">Pinyin</span><div>' + escapeHtml(item.pinyin || "Not supplied.") + '</div></div>' +
            '<div class="ai-field"><span class="ai-field-label">English translation</span><div class="ai-translation">' + escapeHtml(item.translation) + '</div></div>' +
            '<div class="ai-field"><span class="ai-field-label">Meaning / interpretation</span><div class="ai-meaning">' + escapeHtml(item.meaning) + '</div></div>' +
          '</button>'
        ).join("");

        title.textContent = (imageNames[imageIndex] || "Selected image") + " · AI responses";
        count.textContent = current.length + " AI responses · scroll";
        track.querySelectorAll(".ai-carousel-card").forEach((card, index) => {
          card.addEventListener("click", () => {
            track.querySelectorAll(".ai-carousel-card").forEach((other) => other.classList.remove("is-selected"));
            card.classList.add("is-selected");
            selectResponse(current[index], imageIndex);
          });
        });

        // Keep the large all-character highlight until the visitor chooses an AI card.
        return;
      }

      const selected = track.querySelector(".ai-carousel-card.is-selected");
      if (selected) {
        const item = current[Number(selected.dataset.responseIndex)];
        if (item) selectResponse(item, imageIndex);
      }
    };
  }

  resetButton?.addEventListener("click", () => {
    track.querySelectorAll(".ai-carousel-card").forEach((card) => card.classList.remove("is-selected"));
    showPrompt(Number(window.__activeAiImage || 0));
  });

  document.getElementById("photo-stage")?.addEventListener("click", (event) => {
    if (event.target.closest("#ai-recognition-overlay")) return;
    showPrompt(Number(window.__activeAiImage || 0));
  });

  fetch("public/data/ai_image_comparison.json")
    .then((response) => {
      if (!response.ok) throw new Error("Could not load AI comparison data.");
      return response.json();
    })
    .then((data) => {
      responses = data.responses || [];
      window.__activeAiImage = 0;
      render(0);

      imageTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          window.__activeAiImage = Number(tab.dataset.image);
          render(window.__activeAiImage);
        });
      });

    })
    .catch((error) => {
      count.textContent = "Comparison data could not be loaded";
      track.innerHTML = '<p>Unable to load the stored AI comparison dataset. ' + escapeHtml(error.message) + '</p>';
    });
})();