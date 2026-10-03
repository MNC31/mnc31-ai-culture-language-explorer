(() => {
  const track = document.getElementById("ai-carousel-track");
  const count = document.getElementById("ai-response-count");
  const title = document.getElementById("ai-response-title");
  const overlay = document.getElementById("ai-recognition-overlay");
  const overlayAi = document.getElementById("ai-recognition-ai");
  const overlayText = document.getElementById("ai-recognition-text");
  const resetButton = document.getElementById("reset-ai-button");
  const imageTabs = document.querySelectorAll(".image-tab");
  if (!track) return;

  const imageNames = ["Gate inscription", "Signboard", "Stone inscription", "Wikisource baseline"];
  const imagePositions = [
    { left: "18%", top: "27%", width: "67%", height: "25%" },
    { left: "18%", top: "27%", width: "80%", height: "30%" },
    { left: "39%", top: "4%", width: "31%", height: "47%" },
    { left: "4%", top: "24%", width: "68%", height: "22%" }
  ];

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  let responses = [];

  function positionRecognition(index) {
    const p = imagePositions[index] || imagePositions[0];
    overlay.style.left = p.left;
    overlay.style.top = p.top;
    overlay.style.width = p.width;
    overlay.style.height = p.height;
  }

  function selectResponse(item, imageIndex) {
    positionRecognition(imageIndex);
    overlay.classList.add("is-active");
    overlayAi.textContent = item.ai;
    overlayText.textContent = item.source_text || "No source reading supplied.";
  }

  function showPrompt(imageIndex) {
    positionRecognition(imageIndex);
    overlay.classList.add("is-active");
    overlayAi.textContent = "Ready to compare";
    overlayText.textContent = "Click the box to see how different AI systems read these characters.";
  }

  function render(imageIndex) {
    const current = responses.filter((item) => Number(item.image) === Number(imageIndex));

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
    track.scrollTo({ left: 0, behavior: "smooth" });

    track.querySelectorAll(".ai-carousel-card").forEach((card, index) => {
      card.addEventListener("click", () => {
        track.querySelectorAll(".ai-carousel-card").forEach((other) => other.classList.remove("is-selected"));
        card.classList.add("is-selected");
        selectResponse(current[index], imageIndex);
      });
    });

    // Do not activate a response automatically. The image first shows one
    // instruction box; the visitor must click it before an AI reading appears.
    showPrompt(imageIndex);
  }

  overlay?.addEventListener("click", (event) => {
    event.stopPropagation();
    const selected = track.querySelector(".ai-carousel-card.is-selected");
    if (selected) {
      const current = responses.filter((item) => Number(item.image) === Number(window.__activeAiImage || 0));
      const item = current[Number(selected.dataset.responseIndex)];
      if (item) selectResponse(item, Number(window.__activeAiImage || 0));
    } else {
      const current = responses.filter((item) => Number(item.image) === Number(window.__activeAiImage || 0));
      if (current[0]) selectResponse(current[0], Number(window.__activeAiImage || 0));
    }
  });

  resetButton?.addEventListener("click", () => {
    overlay.classList.remove("is-active");
    overlayAi.textContent = "Select an AI response";
    overlayText.textContent = "The selected AI's recognized characters will appear here.";
    track.querySelectorAll(".ai-carousel-card").forEach((card) => card.classList.remove("is-selected"));
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
      showPrompt(0);
    })
    .catch((error) => {
      count.textContent = "Comparison data could not be loaded";
      track.innerHTML = '<p>Unable to load the stored AI comparison dataset. ' + escapeHtml(error.message) + '</p>';
    });
})();