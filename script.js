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
    image: "https://raw.githubusercontent.com/dku-infosci301-Autumn2026/mnc31-ai-culture-language-explorer/main/public/images/chinese-text-4.jpg",
    alt: "Screenshot of the Wikisource page for the Analects, Book VI",
    title: "Wikisource baseline",
    sourceText: "論語／雍也第六",
    standard: "論語／雍也第六",
    pinyin: "Lún yǔ / Yōng yě dì liù",
    translation: "The Analects — Book VI (Yong Ye / 雍也第六)",
    culture:
      "This image is a reference baseline rather than another handwriting-reading target. The linked Wikisource page provides readable traditional Chinese text for Book VI of the Analects, along with an English translation. It lets visitors compare an AI-assisted reading of photographed text against a source that already presents the characters in a readable textual form.",
    sources: [
      {
        label: "Wikisource source: 論語/雍也第六",
        url: "https://zh.wikisource.org/wiki/%E8%AB%96%E8%AA%9E/%E9%9B%8D%E4%B9%9F%E7%AC%AC%E5%85%AD"
      },
      {
        label: "Wikisource English translation: The Chinese Classics / Confucian Analects VI",
        url: "https://en.wikisource.org/wiki/The_Chinese_Classics/Volume_1/Confucian_Analects/VI"
      }
    ],
    note:
      "Use this as a comparison baseline, not as proof that an AI reading of a historical photograph is correct. The screenshot is the project-provided reference image described in public/images/README.md."
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
  renderSources(record);

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
  photoHelp.textContent = isBaseline
    ? "Reference image · compare with the linked Wikisource source"
    : "Click a highlighted text region · click the photograph outside it to reset";

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
