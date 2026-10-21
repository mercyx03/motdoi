---
annotations_creators:
- machine-generated
language:
- en
language_creators:
- machine-generated
license: apache-2.0
multilinguality:
- monolingual
pretty_name: Aurelia Runtime Corpus v2
size_categories:
- 10K<n<100K
source_datasets:
- original
task_categories:
- text-generation
- text-classification
tags:
- aurelia
- simulation
- synthetic-data
- preference-dataset
- dpo
- sft
- runtime-validation
- causal-reasoning
configs:
- config_name: default
  data_files:
  - split: train
    path: data/train.jsonl
  - split: validation
    path: data/val.jsonl
  - split: test
    path: data/test.jsonl
- config_name: mixed
  data_files:
  - split: train
    path: data/mixed.jsonl
- config_name: validator_sft
  data_files:
  - split: train
    path: data/validator_sft.jsonl
- config_name: validator_dpo
  data_files:
  - split: train
    path: data/validator_dpo.jsonl
---

# Aurelia Runtime Corpus v2

Aurelia Runtime Corpus v2 is a schema-gated validator corpus for the Aurelia causal world-simulation engine. It trains and evaluates a runtime-model coprocessor to distinguish verified mechanical/lore-grounded simulation records from subtly invalid candidates.

This release is the first full v2 local build: 25 fresh simulation seeds, 20 years per seed, all five Aurelia worlds, with grouped train/validation/test splits and balanced deterministic + AAA hard-negative preference rows.

No model inference, GPU training, external API calls, or paid compute were used to create this corpus. It is local deterministic simulation plus dataset construction.

## Contents

Primary data files:

- `data/validator_sft.jsonl` — 2,500 verified validator SFT positives
- `data/validator_dpo.jsonl` — 35,000 DPO preference rows
- `data/mixed.jsonl` — 37,500 total records
- `data/train.jsonl`, `data/val.jsonl`, `data/test.jsonl` — grouped split by source card

Provenance and reports:

- `source/lore_history_packs.jsonl` — 2,500 lore/history packs
- `source/source_report.json` — source-positive build report
- `metadata/corpus_report.json` — corpus totals and generator settings
- `metadata/coverage_report.json` — world/year/failure-mode coverage
- `metadata/quality_gates_report.json` — gate-by-gate validation
- `metadata/split_report.json` — grouped split report
- `metadata/batch_run_report.json` — local simulation batch summary
- `metadata/checksums.sha256`, `source/checksums.sha256` — SHA-256 checksums

## Dataset totals

- Seeds: 25 (`6101` through `6125`)
- Years per seed: 20
- Worlds: `arkos`, `mirithane`, `solara`, `valdris`, `verge`
- Validator SFT positives: 2,500
- Validator DPO preference rows: 35,000
- Mixed records: 37,500
- Lore/history packs: 2,500
- Split: grouped by source card; no SFT/DPO sibling leakage across train/validation/test

Split sizes:

- Train: 2,004 cards / 30,060 records
- Validation: 270 cards / 4,050 records
- Test: 226 cards / 3,390 records

## Failure modes

Each of the 14 failure modes has 2,500 preference rows.

V1 deterministic corruptors:

- `missing_state_delta`
- `invented_actor`
- `wrong_year`
- `missing_provenance`
- `missing_lore_cause`
- `canon_contradiction`
- `invalid_json`
- `missing_evidence_terms`

AAA hard-negative families:

- `near_miss_mechanical`
- `cross_world_leakage`
- `chronology_impossible`
- `lore_shadow`
- `repair_quality_bad`
- `adversarial_json_semantic`

## Quality gates

All v2 quality gates passed:

- schema validation
- no host-local path leakage
- no duplicate record IDs
- no content-hash collisions
- task/output shape consistency
- failure-mode balance
- world coverage
- seed coverage
- early/middle/late year-regime coverage
- lore-pack refs present
- grouped split overlap check

Direct path-leak scans of `validator_sft.jsonl` and `mixed.jsonl` found zero occurrences of `/Users/`, `/private/`, or `/tmp/`.

## Loading examples

Grouped train/validation/test split:

```python
from datasets import load_dataset

ds = load_dataset("OusiaResearch/aurelia-runtime-corpus-v2")
print(ds)
```

Full mixed corpus:

```python
from datasets import load_dataset

mixed = load_dataset("OusiaResearch/aurelia-runtime-corpus-v2", "mixed")
```

DPO-only rows:

```python
from datasets import load_dataset

dpo = load_dataset("OusiaResearch/aurelia-runtime-corpus-v2", "validator_dpo")
```

SFT-only positives:

```python
from datasets import load_dataset

sft = load_dataset("OusiaResearch/aurelia-runtime-corpus-v2", "validator_sft")
```

## Record shape

All records use:

```json
{
  "schema": "aurelia.runtime.dataset_record.v1",
  "record_id": "...",
  "task_type": "validator_sft | validator_dpo",
  "source_kind": "derived_from_run | synthetic_negative",
  "source": {
    "run_id": "...",
    "world_id": "...",
    "year": 1
  },
  "lore_history_pack_ref": "...",
  "input_payload": {},
  "output_payload": {},
  "provenance_status": "verified",
  "generation_method": "...",
  "content_hash": "sha256:..."
}
```

DPO rows include `output_payload.chosen` and `output_payload.rejected`, where `chosen` is the correct validator rejection and `rejected` is the bad acceptance.

## Provenance

- Built locally on 2026-06-13 from Aurelia engine commit `65297b8`
- Raw run root during build: `/tmp/aurelia-v2-runs`
- Durable local artifact root: `~/aurelia-artifacts/aurelia-runtime-corpus-v2-full-2026-06-13`
- Total local batch wall time: 894.7 seconds
- Per-seed runtime mean/min/max: 29.6 / 25.2 / 33.4 seconds

Raw SQLite run outputs are not included in this Hugging Face dataset release; the dataset release includes portable validator records, lore/history packs, coverage reports, quality gates, split reports, and checksums.

## Intended use

This corpus is intended for Aurelia runtime-validator research:

- supervised fine-tuning of schema-gated validator outputs
- preference training for hard-negative discrimination
- held-out eval development for causal/lore grounding
- regression tests for runtime model adapters

It is not a general-purpose instruction dataset.

## Limitations

This is a v2 corpus, not the final AAA/v3 candidate. Before treating a trained validator as production-grade, freeze a held-out adversarial eval set and prove improvement over deterministic baselines on hard-negative discrimination, valid-card acceptance, false-acceptance reduction, and grounded repair-hint quality.

## Citation

```bibtex
@dataset{ousiaresearch_aurelia_runtime_corpus_v2_2026,
  title = {Aurelia Runtime Corpus v2},
  author = {Ousia Research},
  year = {2026},
  publisher = {Hugging Face},
  howpublished = {https://huggingface.co/datasets/OusiaResearch/aurelia-runtime-corpus-v2}
}
```
