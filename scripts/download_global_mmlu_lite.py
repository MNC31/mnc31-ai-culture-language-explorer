import os
from pathlib import Path

os.environ["HF_HUB_ETAG_TIMEOUT"] = "60"
os.environ["HF_HUB_DOWNLOAD_TIMEOUT"] = "120"

from datasets import load_dataset

OUTPUT_FOLDER = Path("data/raw/global_mmlu_lite")
OUTPUT_FOLDER.mkdir(parents=True, exist_ok=True)

LANGUAGES = ["en", "zh"]

for language in LANGUAGES:
    print(f"\nDownloading Global-MMLU-Lite language: {language}")

    dataset = load_dataset(
        "CohereLabs/Global-MMLU-Lite",
        language
    )

    for split_name, split_data in dataset.items():
        output_file = OUTPUT_FOLDER / f"{language}_{split_name}.jsonl"

        split_data.to_json(
            str(output_file),
            force_ascii=False
        )

        print(f"Saved {len(split_data)} rows to: {output_file}")

print("\nFinished downloading English and Simplified Chinese data.")