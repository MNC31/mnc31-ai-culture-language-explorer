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
    standard: "子華使於齊，冉子爲其母請粟。",
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
      referenceText: "子華使於齊，冉子爲其母請粟。",
      referenceTranslation:
        "Tsze-hwa being employed on a mission to Ch'i, the disciple Zan requested grain for his mother.",
      similarities:
        "Both readings identify Zi-hua as going to Qi, identify Ran Zi as the person requesting grain, and preserve the reason for the request: grain for his mother. The core event and relationships are the same.",
      differences:
        "The AI reading uses modern pinyin-style names and smoother contemporary English, while the Wikisource translation uses older Wade-Giles-style spellings such as “Tsze-hwa” and “Ch'i” and the older phrasing “being employed on a mission.” The traditional source text also makes forms such as 華, 齊, 爲, and 請 visible, which should be distinguished from their modern simplified forms 华, 齐, 为, and 请."
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
  stage.classList.toggle("reference-mode", isBaseline);
  demoLayout.classList.toggle("reference-layout", isBaseline);
  referenceHighlight.hidden = !isBaseline;
  photoHelp.hidden = isBaseline;
  photoHelp.textContent = "Click a highlighted text region · click the photograph outside it to reset";

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

  if (isBaseline) {
    showText(index, null);
  }
}

hotspots.forEach((spot) => {
  spot.addEventListener("click", (event) => {
    event.stopPropagation();
    showText(Number(spot.dataset.record), spot);
  });
});

stage.addEventListener("click", (event) => {
  if (activeImage === 3) {
    return;
  }

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
