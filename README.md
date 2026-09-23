# AI Culture & Language Explorer

> **Prototype status:** Dataset-exploration and evaluation-design prototype.

An interactive class project exploring how multilingual AI evaluation can be examined across **English** and **Simplified Chinese**, with attention to cultural metadata and transparent comparison.

## Technology

This repository intentionally uses the basic web technologies used in class:

- **HTML** — page structure
- **CSS** — layout and visual design
- **JavaScript** — interaction and dynamic content
- **Python** — planned for dataset preparation and analysis scripts
- **Vercel** — deployment/hosting
- **GitHub** — source control

There is **no Vite, React, or other JavaScript build framework** in the website.

## Current prototype

The website currently contains a small hand-authored demo so the interaction can be developed before the real datasets are added.

The demo lets visitors:

- switch between English and Simplified Chinese;
- move through example records;
- filter by cultural-sensitivity label;
- inspect dataset metadata;
- compare precomputed example model outputs with benchmark answers.

The comparator is a **prototype, not a live chatbot**.

## Repository structure

```text
ai-culture-language-explorer/
├── index.html
├── style.css
├── script.js
├── public/
│   └── data/
│       └── demo.json
├── scripts/
│   └── README.md
└── docs/
    ├── methodology.md
    ├── data-provenance.md
    └── limitations.md
```

## Python workflow

Python can be used later for dataset cleaning, matching, analysis, and exporting website-ready JSON.

The intended workflow is:

1. Download the selected public datasets with Python.
2. Filter the records needed for the project.
3. Match English and Simplified Chinese records using the documented dataset identifier.
4. Preserve source metadata.
5. Export a small JSON file for the website.
6. Keep raw dataset downloads outside the website repository unless redistribution is appropriate.

A future `scripts/` folder will contain the Python files used for these steps.

## Vercel deployment

This is a static HTML/CSS/JavaScript site, so Vercel does not need a build framework.

Use the repository as the Vercel project and leave the build settings at their basic/default static-site configuration. The entry page is:

```text
index.html
```

For local development, you can open the HTML directly for the current prototype. If later JavaScript uses `fetch()` to load local JSON files, use a simple local web server instead.

## Data sources

The research plan currently includes Global-MMLU-Lite and CC-Eval. These should be added only after the exact records, fields, licenses, and comparison method have been verified.

The full research methodology, provenance, and limitations are documented separately in `docs/`.

## Important limitation

Differences between English and Chinese outputs cannot automatically be attributed to “culture.” They can also result from translation, wording, tokenization, model design, task difficulty, benchmark construction, or other factors. The website should keep these distinctions visible.
