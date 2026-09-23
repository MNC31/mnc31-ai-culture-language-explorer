# AI Culture & Language Explorer

> **Prototype status:** Dataset-exploration and evaluation-design prototype. This repository does not claim to comprehensively measure any AI model's cultural competence, determine what data trained a model, or represent Chinese culture as a single uniform perspective.

An interactive website for exploring how multilingual AI evaluation datasets represent culturally sensitive content in **English** and **Simplified Chinese**. The project presents matched benchmark questions, dataset annotations, and—where explicitly documented—precomputed model responses for comparison.

## Research questions

1. **Does AI understand culture equally across languages?**
   - How can English and Simplified Chinese versions of matched evaluation questions be explored side by side?
   - How are culturally sensitive (`CS`) and culturally agnostic (`CA`) questions represented in the selected datasets?

2. **When prompt language changes, does an AI response preserve cultural context?**
   - For a fixed, precomputed set of prompts, how do saved English and Chinese model responses compare with dataset-provided benchmark keys or reference material?

This prototype establishes a transparent foundation for later evaluation. It does not make general claims about all AI systems, all Chinese-speaking communities, or the contents of a model's private training corpus.

## Features

- Side-by-side exploration of English and Simplified Chinese Global-MMLU-Lite question pairs.
- Filters for subject, subject category, cultural-sensitivity label, and available culture/region/country annotations.
- Clear separation between:
  - source dataset metadata;
  - benchmark answer keys;
  - precomputed model outputs; and
  - project-authored descriptive comparison notes.
- A **precomputed response comparator**, rather than a live chatbot.
- A methodology page with provenance, limitations, sources, and licensing information.

## Data sources

| Source | Role in this project | Original source | Upstream license / status |
|---|---|---|---|
| **Global-MMLU-Lite** | Matched English–Simplified Chinese multiple-choice question pairs and cultural-sensitivity metadata | [CohereLabs/Global-MMLU-Lite on Hugging Face](https://huggingface.co/datasets/CohereForAI/Global-MMLU-Lite) | Apache License 2.0 |
| **CC-Eval** | Curated bilingual cultural-context/value-alignment examples, maintained separately from Global-MMLU-Lite records | [qiushi-dong/cc-eval on GitHub](https://github.com/qiushi-dong/cc-eval) | Follow the upstream repository's current license, notices, and citation instructions |

### Global-MMLU-Lite

Global-MMLU-Lite is a smaller member of the Global-MMLU dataset family. Its Hugging Face dataset card lists English (`en`) and Simplified Chinese (`zh`) configurations. The dataset contains multiple-choice fields including `sample_id`, `question`, `option_a` through `option_d`, and `answer`, plus cultural annotation fields including `required_knowledge`, `culture`, `region`, `country`, `cultural_sensitivity_label`, and `is_annotated`.

This project uses only the English and Simplified Chinese configurations. It matches equivalent records by shared `sample_id` values.

### CC-Eval

CC-Eval is a separate bilingual cultural-context source. It must not be merged with Global-MMLU-Lite as though both datasets have the same task format, labels, cultural definitions, or scoring rules.

Each CC-Eval-derived record exported for the website should preserve its original source file and record identifier when available. Before publishing a CC-Eval-derived subset, verify the upstream repository's current `LICENSE`, `README`, dataset-specific terms, and preferred citation.

## Repository structure

```text
ai-culture-language-explorer/
├── README.md
├── LICENSE
├── THIRD_PARTY_NOTICES.md
├── CITATION.cff
├── .gitignore
│
├── public/
│   └── data/
│       ├── global_mmlu_lite_en_zh.json
│       ├── cc_eval_subset.json
│       ├── comparator_examples.json
│       └── data_dictionary.json
│
├── scripts/
│   ├── requirements.txt
│   ├── download_global_mmlu_lite.py
│   ├── build_global_mmlu_pairs.py
│   ├── inspect_cc_eval.py
│   └── build_web_data.py
│
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
│
└── docs/
    ├── methodology.md
    ├── data-provenance.md
    └── limitations.md
```

## Data workflow

This repository stores small, website-ready, documented data exports—not an undocumented copy of every upstream dataset.

1. Download Global-MMLU-Lite locally through Hugging Face `datasets`.
2. Load only `en` and `zh`.
3. Match records using `sample_id`.
4. Preserve source metadata and cultural annotations in every derived pair.
5. Export a limited JSON subset for the static website.
6. Keep raw dataset downloads out of version control unless redistribution has been intentionally verified and is necessary.
7. Inspect CC-Eval locally; preserve its upstream record IDs and file paths when exporting a permitted subset.
8. Store precomputed model responses separately from source dataset records.

### Download Global-MMLU-Lite

Create and activate a Python virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install datasets pandas pyarrow
```

Load English and Simplified Chinese separately:

```python
from datasets import load_dataset

english = load_dataset("CohereLabs/Global-MMLU-Lite", "en")
chinese = load_dataset("CohereLabs/Global-MMLU-Lite", "zh")
```

Use `sample_id` to match equivalent English and Chinese records. Do not interpret the `CS` label as evidence that every question concerns Chinese culture: cultural-sensitivity labels reflect the dataset's annotation process and may reference many cultures, regions, or countries.

### Suggested paired-data structure

```json
{
  "pair_id": "world_religions/test/170",
  "source_dataset": "CohereLabs/Global-MMLU-Lite",
  "source_license": "Apache-2.0",
  "source_url": "https://huggingface.co/datasets/CohereForAI/Global-MMLU-Lite",
  "task_type": "multiple_choice",
  "english": {
    "language": "en",
    "question": "…",
    "options": {"A": "…", "B": "…", "C": "…", "D": "…"},
    "answer": "A"
  },
  "chinese": {
    "language": "zh",
    "question": "…",
    "options": {"A": "…", "B": "…", "C": "…", "D": "…"},
    "answer": "A"
  },
  "comparison_metadata": {
    "subject": "world_religions",
    "subject_category": "Humanities",
    "cultural_sensitivity_label": "CS",
    "culture": ["Western Culture"],
    "region": ["Europe"],
    "country": ["Italy"]
  }
}
```

## Precomputed response comparator

The comparator is **not** a live chatbot. A visitor selects a fixed dataset record and sees outputs saved from a documented model-evaluation run.

Each stored response should record:

- Exact model name and version/checkpoint.
- Model host or model-card URL, where applicable.
- Evaluation date.
- Prompt-template version.
- Decoding settings, especially temperature.
- Prompt language.
- Raw model output.
- Extracted answer, if the task is multiple choice.
- Dataset answer key or source-provided reference material, where applicable.
- A neutral, transparent comparison note.

For Global-MMLU-Lite, use terms such as **“matches the benchmark answer key”** and **“does not match the benchmark answer key.”** For open-ended CC-Eval examples, do not present output as universally right or wrong unless the source provides an applicable reference and the evaluation rubric is disclosed.

## Limitations

- This is an **evaluation-data prototype**, not evidence of the complete training data of any AI model.
- Differences between English and Chinese outputs may result from translation, prompt wording, tokenization, model design, subject difficulty, or benchmark construction—not only cultural representation in training data.
- Simplified Chinese is a language configuration, not a complete proxy for Chinese culture, nationality, identity, region, dialect, or lived experience.
- A cultural-sensitivity annotation is a dataset label, not an unquestionable cultural fact.
- The project measures only the selected model, version, prompts, settings, items, and evaluation date.
- A small prototype sample cannot support broad claims about AI systems generally.

## License

### Original project work: MIT

Unless a file states otherwise, the original code, visualizations, data-processing scripts, written documentation, and interface design created for this repository are released under the [MIT License](./LICENSE).

The MIT license applies to the repository author's original contributions. It does **not** relicense third-party datasets, copied dataset text, dataset-derived records, external code, trademarks, or model-provider output.

### Third-party materials

- **Global-MMLU-Lite:** Source and derived dataset material remain subject to the Apache License 2.0. Retain applicable copyright, attribution, license, and NOTICE requirements when redistributing source or adapted records.
- **CC-Eval:** Source and derived material remain subject to the upstream repository's current license, required notices, and preferred citation. The MIT license in this repository does not replace those terms.
- **Model outputs:** Stored outputs may be governed by the relevant model or provider terms. Each comparator record should identify the model, version, source, and evaluation conditions.

Read [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for source acknowledgments and license-related notices.

## Citation

### Global-MMLU / Global-MMLU-Lite

Please cite the associated Global-MMLU paper and the Hugging Face dataset page when using Global-MMLU-Lite-derived material:

```bibtex
@misc{singh2024globalmmluunderstandingaddressing,
  title={Global MMLU: Understanding and Addressing Cultural and Linguistic Biases in Multilingual Evaluation},
  author={Shivalika Singh and Angelika Romanou and Clémentine Fourrier and
          David I. Adelani and Jian Gang Ngui and Daniel Vila-Suero and
          Peerat Limkonchotiwat and Kelly Marchisio and Wei Qi Leong and
          Yosephine Susanto and Raymond Ng and Shayne Longpre and Wei-Yin Ko and
          Madeline Smith and Antoine Bosselut and Alice Oh and
          Andre F. T. Martins and Leshem Choshen and Daphne Ippolito and
          Enzo Ferrante and Marzieh Fadaee and Beyza Ermis and Sara Hooker},
  year={2024},
  eprint={2412.03304},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2412.03304}
}
```

Dataset access citation:

> Cohere Labs. *Global-MMLU-Lite*. Hugging Face Datasets. https://huggingface.co/datasets/CohereForAI/Global-MMLU-Lite. Accessed 2026-09-23. Licensed under Apache License 2.0.

### CC-Eval

Use the preferred citation provided in the current CC-Eval repository documentation. If the repository provides an accompanying paper, use that paper's citation exactly. If it does not supply a formal citation, cite the repository transparently and replace the author line with the exact authorship details stated upstream:

> qiushi-dong. *CC-Eval*. GitHub repository. https://github.com/qiushi-dong/cc-eval. Accessed 2026-09-23.

## Acknowledgments

This project builds on Global-MMLU / Global-MMLU-Lite from Cohere Labs and CC-Eval from its original authors and contributors. Dataset creators, annotators, translators, and maintainers retain credit for their original work. The website interface, visualizations, data transformations, and comparison presentation are a separate student prototype.
