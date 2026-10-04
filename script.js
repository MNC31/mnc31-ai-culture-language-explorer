const imageRecords = [
  {
    image: "public/images/chinese-text-1.jpg",
    alt: "Stone gate with a four-character Chinese inscription",
    title: "Gate inscription",
    sourceText: "景龍迎天",
    standard: "景龙迎天",
    pinyin: "Jǐng lóng yíng tiān",
    translation: "“Jinglong welcomes Heaven” (literal reading)",
    culture:
      "This appears to be a decorative inscription rather than a widely recognized fixed idiom. “景龙” may function as a name or title, so the surrounding location and historical context would be needed before giving it a more specific cultural interpretation.",
    sources: [
      {
        label: "Reference: 景龙 as a Tang dynasty reign title",
        url: "https://zh.wikipedia.org/wiki/%E6%99%AF%E9%BE%99"
      }
    ],
    note:
      "Working transcription from the photograph. The final system should verify stylized characters with OCR plus human review before presenting this as authoritative."
  },
  {
    image: "public/images/chinese-text-2.jpg",
    alt: "Traditional Chinese signboard above a doorway",
    title: "Signboard",
    sourceText: "馬若特江禪坊",
    standard: "马若特江禅坊",
    pinyin: "Mǎ ruò tè jiāng chán fāng",
    translation: "“Ma Ruote Jiang Chan Fang” — treated as a proper name",
    culture:
      "The wording appears to function as a place or organization name, so a transliteration is safer than inventing a literal English meaning. “禅” (chán) can refer to Chan Buddhist practice, while “坊” (fāng) can refer to a lane, neighborhood, shop, workshop, or other named place depending on context.",
    sources: [
      {
        label: "Chinese Text Project dictionary: 坊",
        url: "https://ctext.org/dictionary.pl?char=%E5%9D%8A&if=en"
      },
      {
        label: "Reference: Chan Buddhism / 禅",
        url: "https://en.wikipedia.org/wiki/Chan_Buddhism"
      }
    ],
    note:
      "The sign is visually stylized and some characters are difficult to verify from the photograph. No authoritative source for the full photographed name has been identified, so the reading and interpretation remain provisional."
  },
  {
    image: "public/images/chinese-text-3.jpg",
    alt: "Stone pillar with a vertical Chinese inscription",
    title: "Stone inscription",
    sourceText: "尊師重道",
    standard: "尊师重道",
    pinyin: "Zūn shī zhòng dào",
    translation: "To respect teachers and value their teachings / the Way.",
    culture:
      "尊师重道 is a well-established Chinese expression associated with respecting teachers and valuing the teachings or principles they transmit. The phrase has historical textual sources, but its presence at a particular site does not by itself establish the site's history or religious meaning.",
    sources: [
      {
        label: "Chinese Thought and Culture Terms: 尊师重道",
        url: "https://www.chinesethought.cn/shuyu_show.aspx?shuyu_id=4357"
      },
      {
        label: "Ministry of Education: 尊师重道",
        url: "https://www.moe.gov.cn/jyb_xwfb/moe_2082/2025/2025_zl02/202509/t20250911_1412966.html"
      }
    ],
    note:
      "The selected region focuses on the upper four characters of the vertical inscription. The complete inscription should be transcribed separately when the project moves beyond this prototype."
  },
  {
    image: "public/images/chinese-text-4.jpg",
    alt: "Wikisource screenshot showing traditional Chinese text from Analects Book VI, section 3",
    title: "Wikisource baseline · Book VI, section 3",
    sourceText: "六之三",
    standard: "子华使于齐，冉子为其母请粟。",
    pinyin: "Zǐhuá shǐ yú Qí, Rǎn zǐ wéi qí mǔ qǐng sù.",
    translation:
      "Zi-hua was sent on a mission to Qi, and Ran Zi requested grain for his mother.",
    culture:
      "This excerpt comes from Book VI, section 3 of the Analects. It introduces a discussion about providing grain to the family of a disciple and then expands into a distinction between helping people in need and adding to the wealth of someone already well supplied. The corrected screenshot shows the full Book VI, section 3 passage in traditional Chinese. The visible text includes traditional forms such as 華、齊、爲、請、與、裘、鄉、黨, which makes it useful for comparing a readable source transcription with an AI-assisted reading.",
    sources: [
      {
        label: "Wikisource source: 論語/雍也第六 · 六之三",
        url: "https://zh.wikisource.org/wiki/%E8%AB%96%E8%AA%9E/%E9%9B%8D%E4%B9%9F%E7%AC%AC%E5%85%AD"
      },
      {
        label: "Wikisource English translation: The Chinese Classics / Confucian Analects VI",
        url: "https://en.wikisource.org/wiki/The_Chinese_Classics/Volume_1/Confucian_Analects/VI"
      }
    ],
    note:
      "The highlighted phrase is a fixed comparison target. The AI reading is a prototype interpretation of the traditional characters, not a live model result or proof of general AI accuracy. The Wikisource wording is used as the reference translation for this example.",
    analysis: {
      aiReading:
        "Zi-hua was sent to Qi, and Ran Zi asked for grain for his mother.",
      referenceText: "子华使于齐，冉子为其母请粟。",
      referenceTranslation:
        "Tsze-hwa being employed on a mission to Ch'i, the disciple Zan requested grain for his mother.",
      similarities:
        "Both readings identify Zi-hua as going to Qi, identify Ran Zi as the person requesting grain, and preserve the reason for the request: grain for his mother. The core event and relationships are the same.",
      differences:
        "The standardized text shown by the website uses the Simplified Chinese form from the Simplified Chinese Wikisource page. The photograph itself preserves the traditional forms, so the display distinguishes the photographed source form from the standardized Simplified Chinese form. In particular, 華、齊、爲、請 correspond to the simplified forms 华、齐、为、请. The English reference also uses older Wade-Giles spellings such as “Tsze-hwa” and “Ch'i,” so differences in romanization and translation style should not be mistaken for differences in the underlying Chinese passage."
    }
  }
];

let activeImage = 0;
let selectedRecord = null;

const image = document.getElementById("demo-image");
const stage = document.getElementById("photo-stage");
const emptyResult = document.getElementById("result-empty");
const resultContent = document.getElementById("result-content");
const status = document.getElementById("selection-status");
const standard = document.getElementById("standard-text");
const pinyin = document.getElementById("pinyin");
const translation = document.getElementById("translation");
const culture = document.getElementById("culture");
const sources = document.getElementById("sources");
const readingNote = document.getElementById("reading-note");
const resetButton = document.getElementById("reset-button");
const photoHelp = document.getElementById("photo-help");
const referenceHighlight = document.getElementById("reference-highlight");
const demoLayout = document.querySelector(".demo-layout");
const sourceNoteLabel = document.getElementById("source-note-label");
const baselineAnalysis = document.getElementById("baseline-analysis");
const aiReading = document.getElementById("ai-reading");
const referenceText = document.getElementById("reference-text");
const referenceTranslation = document.getElementById("reference-translation");
const comparisonSimilarities = document.getElementById("comparison-similarities");
const comparisonDifferences = document.getElementById("comparison-differences");
const imageTabs = document.querySelectorAll(".image-tab");
const hotspots = document.querySelectorAll(".hotspot");
const aiRecognitionOverlay = document.getElementById("ai-recognition-overlay");

function renderSources(record) {
  sources.innerHTML = "";

  record.sources.forEach((source) => {
    const link = document.createElement("a");
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = source.label;
    sources.appendChild(link);
  });
}

function resetText() {
  selectedRecord = null;
  emptyResult.hidden = false;
  resultContent.hidden = true;
  status.textContent = "Nothing selected";
  hotspots.forEach((spot) => spot.classList.remove("selected"));
  if (aiRecognitionOverlay) {
    aiRecognitionOverlay.classList.remove("is-active");
  }
}

function showText(index, hotspot) {
  const record = imageRecords[index];
  selectedRecord = index;

  standard.textContent = record.standard;
  pinyin.textContent = record.pinyin;
  translation.textContent = record.translation;
  culture.textContent = record.culture;
  readingNote.textContent = record.note;
  sourceNoteLabel.textContent = record.analysis
    ? "Wikisource reference"
    : "Context / reference used";
  renderSources(record);

  if (record.analysis) {
    baselineAnalysis.hidden = false;
    aiReading.textContent = record.analysis.aiReading;
    referenceText.textContent = record.analysis.referenceText;
    referenceTranslation.textContent = record.analysis.referenceTranslation;
    comparisonSimilarities.textContent = record.analysis.similarities;
    comparisonDifferences.textContent = record.analysis.differences;
  } else {
    baselineAnalysis.hidden = true;
  }

  emptyResult.hidden = true;
  resultContent.hidden = false;
  status.textContent = `Selected: ${record.title}`;

  hotspots.forEach((spot) => spot.classList.remove("selected"));
  if (hotspot) {
    hotspot.classList.add("selected");
  }
}

function showImage(index) {
  activeImage = index;
  image.src = imageRecords[index].image;
  image.alt = imageRecords[index].alt;

  const isBaseline = index === 3;
  if (aiRecognitionOverlay) {
    aiRecognitionOverlay.classList.remove("is-active");
  }
  stage.classList.toggle("reference-mode", isBaseline);
  demoLayout.classList.toggle("reference-layout", isBaseline);
  if (referenceHighlight) {
    referenceHighlight.hidden = !isBaseline;
  }
  photoHelp.hidden = false;
  photoHelp.textContent = "Click the highlighted box to see how different AI systems read these characters · click outside to reset";

  hotspots.forEach((spot, hotspotIndex) => {
    spot.hidden = hotspotIndex !== index;
    spot.classList.remove("selected");
  });

  imageTabs.forEach((tab, tabIndex) => {
    const isActive = tabIndex === index;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  resetText();

}

hotspots.forEach((spot) => {
  spot.addEventListener("click", (event) => {
    event.stopPropagation();
    showText(Number(spot.dataset.record), spot);
  });
});

stage.addEventListener("click", (event) => {
  if (!event.target.closest(".hotspot")) {
    resetText();
  }
});

resetButton.addEventListener("click", resetText);

imageTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    showImage(Number(tab.dataset.image));
  });
});

showImage(0);


/* Dataset explorer is embedded here so the deployed static page cannot fail silently if explorer.js is not served. */
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
  modelResponses: "public/data/model_responses.json",
  imageComparison: "public/data/ai_image_comparison.json"
};

const explorerState = {
  globalPairs: [],
  globalLoaded: false,
  ccCache: {},
  selectedGlobal: 0,
  selectedCc: 0,
  imageComparisons: []
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
        "<div class=\"detail-kicker\">OPEN-ENDED BILINGUAL COMPARISON</div>" +
        "<h3>Value-alignment prompt pair</h3>" +
        "<div class=\"question-pair\">" +
          "<article><span>Chinese prompt</span><p class=\"script-large\">" + escapeHtml(row["中文提示词"]) + "</p></article>" +
          "<article><span>English prompt</span><p>" + escapeHtml(row["英文提示词"]) + "</p></article>" +
        "</div>" +
        "<div class=\"comparison-callout\"><strong>Possible use</strong><p>Run the same model under both prompts, save the two responses, and compare whether the model changes its reasoning or value framing when only the prompt language changes.</p></div>";
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
    if (!fields || !row) {
      ccDetail.innerHTML = "<div class=\"explorer-empty\">No CC-Eval detail is available for this task.</div>";
      return;
    }

    let useText = "Test whether a model can explain a culturally situated concept and distinguish it from a superficially similar English concept.";
    if (task === "pragmatic") {
      useText = "Test whether a model identifies indirect meaning rather than only translating the literal sentence.";
    } else if (task === "slang") {
      useText = "Test whether a model understands contemporary Chinese internet language and the social context behind a phrase.";
    } else if (task === "classical") {
      useText = "Test interpretation of classical language, references, and culturally situated concepts.";
    } else if (task === "folk") {
      useText = "Test whether a model can explain a cultural practice without reducing the practice to a generic translation.";
    }

    ccDetail.innerHTML =
      "<div class=\"detail-kicker\">CHINESE-CONTEXT TASK · " + escapeHtml(ccTitle(task)) + "</div>" +
      "<h3>" + escapeHtml(row[fields[0]]) + "</h3>" +
      fields.slice(1).map((field) =>
        "<div class=\"cc-field\"><span>" + escapeHtml(field) + "</span><p>" + escapeHtml(row[field]) + "</p></div>"
      ).join("") +
      "<div class=\"comparison-callout\"><strong>Possible use</strong><p>" +
      escapeHtml(useText) +
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

  async function loadImageComparison() {
    try {
      const text = await loadText(explorerConfig.imageComparison);
      explorerState.imageComparisons = JSON.parse(text).responses || [];
      document.dispatchEvent(new CustomEvent("explorer-image-comparison-ready"));
    } catch (error) {
      explorerState.imageComparisons = [];
      console.warn("Image comparison data could not be loaded:", error);
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
  // Preload every CC-Eval task family so the Cultural Context Map can show
  // the complete network immediately, while keeping the selector interactive.
  Promise.all(Object.keys(explorerConfig.cc).map((task) => loadCcTask(task)))
    .then(() => refreshCc())
    .catch((error) => setStatus("CC-Eval loading failed: " + error.message, true));
  // The lab waits for the same Global-MMLU load instead of starting a
  // second competing request during page initialization.
  refreshLabQuestions().catch((error) => setStatus(error.message, true));
  loadImageComparison();
}
