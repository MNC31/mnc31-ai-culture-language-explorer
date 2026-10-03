(() => {
  const section = document.getElementById("ai-response-comparison");
  const track = document.getElementById("ai-carousel-track");
  const count = document.getElementById("ai-response-count");
  const title = document.getElementById("ai-response-title");
  if (!section || !track) return;

  const imageNames = ["Gate inscription", "Signboard", "Stone inscription", "Wikisource baseline / Analects passage"];

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  let responses = [];

  function render(imageIndex) {
    const current = responses.filter((item) => Number(item.image) === Number(imageIndex));
    track.innerHTML = current.map((item) => `
      <article class="ai-carousel-card">
        <div class="ai-card-top">
          <div class="ai-name">${escapeHtml(item.ai)}</div>
          <div class="ai-source">${escapeHtml(item.dataset_file)}</div>
        </div>

        <div class="ai-field">
          <span class="ai-field-label">AI reading</span>
          <div class="ai-script" lang="zh">${escapeHtml(item.source_text)}</div>
        </div>

        <div class="ai-field">
          <span class="ai-field-label">Standardized / simplified</span>
          <div class="ai-script" lang="zh">${escapeHtml(item.standardized)}</div>
        </div>

        <div class="ai-field">
          <span class="ai-field-label">Pinyin</span>
          <div>${escapeHtml(item.pinyin || "Not supplied in this dataset record.")}</div>
        </div>

        <div class="ai-field">
          <span class="ai-field-label">English translation</span>
          <div class="ai-translation">${escapeHtml(item.translation)}</div>
        </div>

        <div class="ai-field">
          <span class="ai-field-label">Meaning / interpretation</span>
          <div class="ai-meaning">${escapeHtml(item.meaning)}</div>
        </div>

        <div class="ai-dataset-link">
          Stored response source: <code>${escapeHtml(item.dataset_file)}</code>
        </div>
      </article>
    `).join("");

    title.textContent = `${imageNames[imageIndex] || "Selected image"} · AI responses`;
    count.textContent = `${current.length} stored AI responses · scroll horizontally`;
    track.scrollTo({ left: 0, behavior: "smooth" });
  }

  fetch("public/data/ai_image_comparison.json")
    .then((response) => {
      if (!response.ok) throw new Error("Could not load AI comparison data.");
      return response.json();
    })
    .then((data) => {
      responses = data.responses || [];
      render(0);
      document.querySelectorAll(".image-tab").forEach((tab) => {
        tab.addEventListener("click", () => render(Number(tab.dataset.image)));
      });
    })
    .catch((error) => {
      count.textContent = "Comparison data could not be loaded";
      track.innerHTML = `<p>Unable to load the stored AI comparison dataset. ${escapeHtml(error.message)}</p>`;
    });
})();
