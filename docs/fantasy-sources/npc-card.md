---
license: mit
task_categories:
- text-generation
language:
- en
tags:
- npc-dialogue
- rpg
- game-npcs
- roleplaying
- greg-ai
size_categories:
- n<1K
dataset_info:
  features:
  - name: system_message
    dtype: string
  - name: player_message
    dtype: string
  - name: ai_message
    dtype: string
  splits:
  - name: train
    num_bytes: 1586661
    num_examples: 3750
  download_size: 726902
  dataset_size: 1586661
configs:
- config_name: default
  data_files:
  - split: train
    path: data/train-*
---

# GregAI NPC Training Data v1

750 training examples for an AI-driven NPC dialogue system in a medieval fantasy RPG setting.

## Format

Each row contains three fields:

| Field | Contents |
|-------|----------|
| `system_message` | NPC identity (name, job, location, abilities) |
| `player_message` | Player name, reputation, and message |
| `ai_message` | NPC response, reputation change, and abilities used |

### System message structure

```
Name: <NPC name>
Job: <job role>
Current_location: <area> : <climate>
Abilities: "<[ability : description]>", "<[ability : description]>"
```

### Player message structure

```
Name: <player name>
Reputation: <Good|Neutral|Bad>
Message: <player dialogue>
```

### AI message structure

```
Message: <NPC response>
Reputation: <change: -3 to +3>
Abilities: <ability used, if any>
```

## Stats

| Metric | Value |
|--------|-------|
| **Total examples** | 750 |
| **File size** | 247 KB |
| **Unique NPCs** | 14 |
| **Jobs** | 15 |
| **Locations** | 6 (Plain, Forest, Jungle, Desert, Trosky, Kuttenbeg) |

### Reputation distribution

| Change | Count |
|--------|-------|
| Positive (+1 to +3) | 163 |
| Negative (-1 to -3) | 360 |
| Neutral (0) | 212 |

### Jobs represented

Shepherd, Messenger, Guard, Merchant, Farmer, Carpenter, Blacksmith, Tailor, Cook, Potter, Baker, Hunter, Miner, Stable Hand, Fisher

## Usage

### With Hugging Face Datasets

```python
from datasets import load_dataset

dataset = load_dataset("ItsHotdogFred/npc-training-data-v1", split="train")
```

### With pandas

```python
import pandas as pd
df = pd.read_csv("hf://datasets/ItsHotdogFred/npc-training-data-v1/training_data.csv")
```

### For fine-tuning

The data is formatted for conversational fine-tuning. Each row represents a single NPC interaction where the model must produce an in-character response consistent with the NPC's job, personality, and the player's reputation.

## Quality

Every row has been checked through an automated hallucination checker that validates:
- No NPC engages with forbidden lore they shouldn't know
- No truncated or malformed responses
- Reputation changes are consistent with player behavior
- Abilities are properly formatted
- No parser artifacts in responses
