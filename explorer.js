const explorerConfig = {
  // These are the datasets downloaded into THIS repository.
  // Do not replace these with upstream/API copies: the site should analyze
  // the exact files committed under public/data/.
  global: {
    test: {
      en: "public/data/global_mmlu_lite/en_test.jsonl",
      zh: "public/data/global_mmlu_lite/zh_test.jsonl"
    },
    dev: {
      en: "public/data/global_mmlu_lite/en_dev.jsonl",
      zh: "public/data/global_mmlu_lite/zh_dev.jsonl"
    }
  },
  cc: {
    bilingual: "public/data/cc-eval/data/bilingual_paralle_value-alignment.csv",
    aesthetics: "public/data/cc-eval/data/Chinese-context_task/Chinese_aesthetics&philosophy.csv",
    classical: "public/data/cc-eval/data/Chinese-context_task/classical_Chinese.csv",
    folk: "public/data/cc-eval/data/Chinese-context_task/folk_culture.csv",
    slang: "public/data/cc-eval/data/Chinese-context_task/modern_Chinese_internet_slang.csv",
    pragmatic: "public/data/cc-eval/data/Chinese-context_task/pragmatic_intent_understanding.csv"
  },
  modelResponses: "public/data/model_responses.json"
};

const explorerState = {
  globalPairs: [],
  globalLoaded: false,
  ccCache: {},
  selectedGlobal: 0,
  selectedCc: 0
};

const explorerRoot = document.getElementById("dataset-explorer");
window.aiCultureExplorer = explorerState;

if (explorerRoot) {
  const datasetSelect = explorerRoot.querySelector("#dataset-select");
  const splitSelect = explorerRoot.querySelector("#global-split");
  const categorySelect = explorerRoot.querySelector("#global-category");
  const sensitivitySelect = explorerRoot.querySelector("#global-sensitivity");
  const searchInput = explorerRoot.querySelector("#global-search");
  const globalList = explorerRoot.querySelector("#global-question-list");
  const globalDetail = explorerRoot.querySelector("#global-detail");
  const ccTask = explorerRoot.querySelector("#cc-task");
  const ccSearch = explorerRoot.querySelector("#cc-search");
  const ccList = explorerRoot.querySelector("#cc-question-list");
  const ccDetail = explorerRoot.querySelector("#cc-detail");
  const status = explorerRoot.querySelector("#explorer-status");
  const labDataset = explorerRoot.querySelector("#lab-dataset");
  const labQuestion = explorerRoot.querySelector("#lab-question");
  const labConversation = explorerRoot.querySelector("#lab-conversation");
  const labReference = explorerRoot.querySelector("#lab-reference");
  const labResponseStatus = explorerRoot.querySelector("#lab-response-status");

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("explorer-error", isError);
  }

  async function loadText(path) {
    // Load the exact dataset files committed to this project. The first
    // candidates are the files served by the deployed site; if the static
    // host does not expose the /public/ directory, fall back to the raw file
    // from THIS GitHub repository. This is not an upstream dataset/API copy.
    const cleanPath = path.replace(/^\/+/, "");
    const repoRawPath = cleanPath.replace(/^public\//, "");
    const candidates = [
      "/" + cleanPath,
      "/" + repoRawPath,
      "./" + cleanPath,
      path,
      "https://raw.githubusercontent.com/MNC31/mnc31-ai-culture-language-explorer/main/" + cleanPath
    ].filter((candidate, index, list) => list.indexOf(candidate) === index);

    const failures = [];

    for (const candidate of candidates) {
      try {
        const response = await fetch(candidate, { cache: "no-store" });
        if (!response.ok) {
          failures.push(candidate + " → HTTP " + response.status);
          continue;
        }

        const text = await response.text();

        // A static host may return index.html with HTTP 200 for a missing
        // asset. Do not mistake that HTML fallback for the dataset file.
        if (!text.trim()) {
          failures.push(candidate + " returned an empty file");
          continue;
        }
        if (/^\s*<!doctype html|^\s*<html[\s>]/i.test(text)) {
          failures.push(candidate + " returned HTML instead of the dataset file");
          continue;
        }

        return text;
      } catch (error) {
        failures.push(candidate + " → " + error.message);
      }
    }

    throw new Error(
      "Could not load the repository dataset file " + path +
      ". Tried: " + failures.join("; ")
    );
  }

  function parseJsonl(text) {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"') {
        if (quoted && next === '"') {
          cell += '"';
          i += 1;
        } else {
          quoted = !quoted;
        }
      } else if (char === "," && !quoted) {
        row.push(cell);
        cell = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") i += 1;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }

    if (cell.length || row.length) {
      row.push(cell);
      rows.push(row);
    }

    if (!rows.length) return [];

    const headers = rows.shift();
    return rows
      .filter((values) => values.some((value) => value.trim() !== ""))
      .map((values) => Object.fromEntries(
        headers.map((header, index) => [header, values[index] ?? ""])
      ));
  }

  function cleanList(value) {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value.replace(/'/g, '"'));
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [value];
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizeGlobalPair(en, zh) {
    return {
      id: en.sample_id,
      subject: en.subject,
      category: en.subject_category,
      sensitivity: en.cultural_sensitivity_label,
      culture: cleanList(en.culture).join(", ") || "Not annotated",
      region: cleanList(en.region).join(", ") || "Not annotated",
      country: cleanList(en.country).join(", ") || "Not annotated",
      en,
      zh
    };
  }

  async function loadLocalJsonl(path) {
    setStatus("Loading " + path + " from this GitHub repository…");
    const text = await loadText(path);
    return parseJsonl(text);
  }

  async function loadGlobal(split = "test") {
    const paths = explorerConfig.global[split];

    try {
      const [enRows, zhRows] = await Promise.all([
        loadLocalJsonl(paths.en),
        loadLocalJsonl(paths.zh)
      ]);

      const zhById = new Map(zhRows.map((row) => [row.sample_id, row]));

      explorerState.globalPairs = enRows
        .map((en) => {
          const zh = zhById.get(en.sample_id);
          return zh ? normalizeGlobalPair(en, zh) : null;
        })
        .filter(Boolean);

      explorerState.globalLoaded = true;
      populateGlobalFilters();
      renderGlobal();

      setStatus(
        "Loaded " + explorerState.globalPairs.length +
        " matched English–Simplified Chinese pairs from the repository's local " +
        split + " dataset files."
      );
      document.dispatchEvent(new CustomEvent("explorer-data-ready"));
    } catch (error) {
      explorerState.globalLoaded = false;
      throw new Error(
        "The repository dataset files could not be loaded. Expected: " +
        paths.en + " and " + paths.zh + ". " + error.message
      );
    }
  }

  function populateGlobalFilters() {
    const categories = [...new Set(explorerState.globalPairs.map((item) => item.category))].sort();
    categorySelect.innerHTML =
      '<option value="all">All subject categories</option>' +
      categories.map((value) => '<option value="' + escapeHtml(value) + '">' + escapeHtml(value) + "</option>").join("");
  }

  function filteredGlobalPairs() {
    const search = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const sensitivity = sensitivitySelect.value;

    return explorerState.globalPairs.filter((item) => {
      const searchable = [
        item.id,
        item.subject,
        item.category,
        item.en.question,
        item.zh.question,
        item.culture,
        item.region,
        item.country
      ].join(" ").toLowerCase();

      return (
        (category === "all" || item.category === category) &&
        (sensitivity === "all" || item.sensitivity === sensitivity) &&
        (!search || searchable.includes(search))
      );
    });
  }

  function renderGlobal() {
    const items = filteredGlobalPairs();
    explorerState.selectedGlobal = Math.min(explorerState.selectedGlobal, Math.max(items.length - 1, 0));

    if (!items.length) {
      globalList.innerHTML = '<div class="explorer-empty">No Global-MMLU-Lite questions match these filters.</div>';
      globalDetail.innerHTML = '<div class="explorer-empty">Try a broader search or filter.</div>';
      return;
    }

    globalList.innerHTML = items.map((item, index) => {
      const active = index === explorerState.selectedGlobal;
      return '<button type="button" class="question-row' + (active ? " active" : "") +
        '" data-global-index="' + index + '">' +
        '<span class="question-row-id">' + escapeHtml(item.id) + "</span>" +
        '<strong>' + escapeHtml(item.en.question) + "</strong>" +
        '<small>' + escapeHtml(item.category) + " · " + escapeHtml(item.sensitivity) + "</small>" +
        "</button>";
    }).join("");

    globalList.querySelectorAll("[data-global-index]").forEach((button) => {
      button.addEventListener("click", () => {
        explorerState.selectedGlobal = Number(button.dataset.globalIndex);
        renderGlobal();
      });
    });

    renderGlobalDetail(items[explorerState.selectedGlobal]);
  }

  function optionMarkup(row) {
    return ["A", "B", "C", "D"].map((letter) => {
      const key = "option_" + letter.toLowerCase();
      const correct = row.answer === letter;
      return '<div class="answer-option' + (correct ? " reference-answer" : "") + '">' +
        '<span>' + letter + "</span><p>" + escapeHtml(row[key]) + "</p>" +
        (correct ? '<em>benchmark key</em>' : "") +
        "</div>";
    }).join("");
  }

  function renderGlobalDetail(item) {
    const keyRelation = item.en.answer === item.zh.answer
      ? "The English and Simplified Chinese records use the same benchmark answer letter."
      : "The English and Simplified Chinese records use different benchmark answer letters; inspect the translated options before interpreting this difference.";

    globalDetail.innerHTML =
      '<div class="detail-kicker">MATCHED RECORD · ' + escapeHtml(item.id) + "</div>" +
      '<h3>' + escapeHtml(item.subject) + "</h3>" +
      '<div class="question-pair">' +
        '<article><span>English question</span><p>' + escapeHtml(item.en.question) + "</p>" +
          '<div class="answer-grid">' + optionMarkup(item.en) + "</div></article>" +
        '<article><span>Simplified Chinese question</span><p>' + escapeHtml(item.zh.question) + "</p>" +
          '<div class="answer-grid">' + optionMarkup(item.zh) + "</div></article>" +
      "</div>" +
      '<div class="metadata-strip">' +
        '<div><span>Category</span><strong>' + escapeHtml(item.category) + "</strong></div>" +
        '<div><span>Cultural sensitivity</span><strong>' + escapeHtml(item.sensitivity) + "</strong></div>" +
        '<div><span>Culture</span><strong>' + escapeHtml(item.culture) + "</strong></div>" +
        '<div><span>Region / country</span><strong>' + escapeHtml(item.region + " · " + item.country) + "</strong></div>" +
      "</div>" +
      '<div class="comparison-callout"><strong>What can be compared here?</strong><p>' +
        escapeHtml(keyRelation) +
        " The more useful comparison is the wording, cultural references, required knowledge, and how a model's saved response changes across languages." +
      "</p></div>";
  }

  async function loadCcTask(task) {
    if (explorerState.ccCache[task]) return explorerState.ccCache[task];

    setStatus("Loading CC-Eval " + task + " from this GitHub repository…");
    const text = await loadText(explorerConfig.cc[task]);
    const rows = parseCsv(text);
    explorerState.ccCache[task] = rows;
    document.dispatchEvent(new CustomEvent("explorer-data-ready"));
    return rows;
  }


  function ccTitle(task) {
    const titles = {
      bilingual: "Bilingual parallel value alignment",
      aesthetics: "Chinese aesthetics & philosophy",
      classical: "Classical Chinese",
      folk: "Folk culture",
      slang: "Modern Chinese internet slang",
      pragmatic: "Pragmatic intent understanding"
    };
    return titles[task] || task;
  }

  function filteredCcRows(rows, task) {
    const search = ccSearch.value.trim().toLowerCase();
    if (!search) return rows;
    return rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(search));
  }

  function renderCcList(rows, task) {
    const items = filteredCcRows(rows, task);
    explorerState.selectedCc = Math.min(explorerState.selectedCc, Math.max(items.length - 1, 0));

    if (!items.length) {
      ccList.innerHTML = '<div class="explorer-empty">No CC-Eval records match this search.</div>';
      ccDetail.innerHTML = '<div class="explorer-empty">Try a broader search.</div>';
      return;
    }

    ccList.innerHTML = items.map((row, index) => {
      const label = task === "bilingual"
        ? row["中文提示词"]
        : task === "aesthetics"
          ? row["中式美学概念"]
          : task === "classical"
            ? row["文言文原文"]
            : task === "folk"
              ? row["民俗文化场景"]
              : task === "slang"
                ? row["梗"]
                : row["对话内容"];

      return '<button type="button" class="question-row' +
        (index === explorerState.selectedCc ? " active" : "") +
        '" data-cc-index="' + index + '">' +
        '<span class="question-row-id">' + escapeHtml(String(index + 1).padStart(3, "0")) + "</span>" +
        '<strong>' + escapeHtml(label) + "</strong>" +
        '<small>' + escapeHtml(ccTitle(task)) + "</small>" +
        "</button>";
    }).join("");

    ccList.querySelectorAll("[data-cc-index]").forEach((button) => {
      button.addEventListener("click", () => {
        explorerState.selectedCc = Number(button.dataset.ccIndex);
        renderCcList(rows, task);
      });
    });

    renderCcDetail(items[explorerState.selectedCc], task);
  }

  function renderCcDetail(row, task) {
    if (task === "bilingual") {
      ccDetail.innerHTML =
        '<div class="detail-kicker">OPEN-ENDED BILINGUAL COMPARISON</div>' +
        '<h3>Value-alignment prompt pair</h3>' +
        '<div class="question-pair">' +
          '<article><span>Chinese prompt</span><p class="script-large">' + escapeHtml(row["中文提示词"]) + "</p></article>" +
          '<article><span>English prompt</span><p>' + escapeHtml(row["英文提示词"]) + "</p></article>" +
        "</div>" +
        '<div class="comparison-callout"><strong>Possible use</strong><p>Run the same model under both prompts, save the two responses, and compare whether the model changes its reasoning or value framing when only the prompt language changes.</p></div>";
      return;
    }

    const definitions = {
      aesthetics: ["中式美学概念", "解读内容"],
      classical: ["文言文原文", "通俗白话文翻译、文化内涵/价值观解释（核心）", "原文出处、所属思想流派", "现代应用解读（如有）"],
      folk: ["民俗文化场景", "解读内容", "民俗文化类型", "民俗文化场景解释"],
      slang: ["梗", "梗解释"],
      pragmatic: ["对话内容", "真实意图"]
    };
    const fields = definitions[task];

    ccDetail.innerHTML =
      '<div class="detail-kicker">CHINESE-CONTEXT TASK · ' + escapeHtml(ccTitle(task)) + "</div>" +
      '<h3>' + escapeHtml(row[fields[0]]) + "</h3>" +
      fields.slice(1).map((field) =>
        '<div class="cc-field"><span>' + escapeHtml(field) + "</span><p>" + escapeHtml(row[field]) + "</p></div>"
      ).join("") +
      '<div class="comparison-callout"><strong>Possible use</strong><p>' +
      escapeHtml(
        task === "pragmatic"
          ? "Test whether a model identifies indirect meaning rather than only translating the literal sentence."
          : task === "slang"
            ? "Test whether a model understands contemporary Chinese internet language and the social context behind a phrase."
            : task === "classical"
              ? "Test interpretation of classical language, references, and culturally situated concepts."
              : task === "folk"
                ? "Test whether a model can explain a cultural practice without reducing the practice to a generic translation."
                : "Test whether a model can explain a culturally situated concept and distinguish it from a superficially similar English concept."
      ) +
      "</p></div>";
  }

  async function refreshCc() {
    try {
      const rows = await loadCcTask(ccTask.value);
      explorerState.selectedCc = 0;
      renderCcList(rows, ccTask.value);
      setStatus("Loaded " + rows.length + " CC-Eval records from " + ccTitle(ccTask.value) + ".");
    } catch (error) {
      setStatus(error.message, true);
    }
  }

  async function loadModelResponses() {
    try {
      const text = await loadText(explorerConfig.modelResponses);
      return JSON.parse(text).responses || [];
    } catch {
      return [];
    }
  }

  async function refreshLabQuestions() {
    const dataset = labDataset.value;
    labQuestion.innerHTML = '<option value="">Loading questions…</option>';
    labConversation.innerHTML = "";
    labReference.innerHTML = "";
    labResponseStatus.textContent = "";

    if (dataset === "global") {
      if (!explorerState.globalLoaded) {
        await loadGlobal("test");
      }
      labQuestion.innerHTML = explorerState.globalPairs.map((item, index) =>
        '<option value="' + index + '">' +
          escapeHtml(item.en.question) +
        "</option>"
      ).join("");
    } else {
      const task = "pragmatic";
      const rows = await loadCcTask(task);
      labQuestion.innerHTML = rows.map((row, index) =>
        '<option value="' + index + '">' + escapeHtml(row["对话内容"]) + "</option>"
      ).join("");
    }

    await renderLabQuestion();
  }

  async function renderLabQuestion() {
    const dataset = labDataset.value;
    const responses = await loadModelResponses();

    if (dataset === "global") {
      const item = explorerState.globalPairs[Number(labQuestion.value)];
      if (!item) return;

      labConversation.innerHTML =
        '<div class="chat-bubble user-bubble"><span>Selected benchmark question · English</span><p>' + escapeHtml(item.en.question) + "</p></div>" +
        '<div class="chat-bubble user-bubble chinese"><span>Selected benchmark question · Simplified Chinese</span><p>' + escapeHtml(item.zh.question) + "</p></div>";

      labReference.innerHTML =
        '<div class="reference-answer-box"><span>Dataset benchmark answer</span><strong>' + escapeHtml(item.en.answer) + "</strong>" +
        '<p>' + escapeHtml(item.en["option_" + item.en.answer.toLowerCase()]) + "</p></div>" +
        '<div class="reference-answer-box"><span>Chinese benchmark answer</span><strong>' + escapeHtml(item.zh.answer) + "</strong>" +
        '<p>' + escapeHtml(item.zh["option_" + item.zh.answer.toLowerCase()]) + "</p></div>";

      const response = responses.find((entry) => entry.dataset === "global_mmlu_lite" && entry.sample_id === item.id);
      labResponseStatus.textContent = response
        ? "Saved model response available · " + response.model
        : "No saved model response is attached to this record yet. This panel is ready for documented model outputs.";
      return;
    }

    const rows = await loadCcTask("pragmatic");
    const row = rows[Number(labQuestion.value)];
    if (!row) return;

    labConversation.innerHTML =
      '<div class="chat-bubble user-bubble"><span>Selected cultural-language prompt</span><p>' + escapeHtml(row["对话内容"]) + "</p></div>";

    labReference.innerHTML =
      '<div class="reference-answer-box"><span>Dataset reference / intended meaning</span><p>' +
      escapeHtml(row["真实意图"]) +
      "</p></div>";

    const response = responses.find((entry) => entry.dataset === "cc_eval_pragmatic" && entry.id === String(Number(labQuestion.value)));
    labResponseStatus.textContent = response
      ? "Saved model response available · " + response.model
      : "No saved model response is attached to this record yet. Add a documented response file before treating this as an AI comparison.";
  }

  splitSelect.addEventListener("change", () => {
    explorerState.globalLoaded = false;
    loadGlobal(splitSelect.value).catch((error) => setStatus(error.message, true));
  });

  [categorySelect, sensitivitySelect, searchInput].forEach((control) => {
    control.addEventListener("input", renderGlobal);
    control.addEventListener("change", renderGlobal);
  });

  ccTask.addEventListener("change", () => {
    explorerState.selectedCc = 0;
    refreshCc().catch((error) => {
    setStatus("CC-Eval loading failed: " + error.message, true);
  });
  });
  ccSearch.addEventListener("input", async () => {
    try {
      const rows = await loadCcTask(ccTask.value);
      renderCcList(rows, ccTask.value);
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  datasetSelect.addEventListener("change", () => {
    explorerRoot.querySelectorAll(".dataset-view").forEach((view) => {
      view.hidden = view.dataset.view !== datasetSelect.value;
    });
  });

  labDataset.addEventListener("change", refreshLabQuestions);
  labQuestion.addEventListener("change", renderLabQuestion);

  explorerRoot.querySelectorAll(".dataset-view").forEach((view) => {
    view.hidden = view.dataset.view !== datasetSelect.value;
  });

  loadGlobal("test").catch((error) => {
    setStatus("Dataset loading failed: " + error.message, true);
  });
  refreshCc();
  // The lab waits for the same Global-MMLU load instead of starting a
  // second competing request during page initialization.
  refreshLabQuestions().catch((error) => setStatus(error.message, true));
}
