---
license: mit
language:
- ru
- en
size_categories:
- 1K<n<10K
tags:
- fantasy
- worldbuilding
- rpg
- game-design
- nlp
- russian
- english
- multilingual
---

# 🐉 Fantasy Creature Bestiary Dataset

<details>
<summary><i>🇷🇺 Русская версия / Russian version...</i></summary>

Добро пожаловать в Бестиарий фантастических существ — многоязычный набор данных, содержащий подробные описания уникальных магических существ, созданных искусственным интеллектом. Этот датасет идеально подходит для разработчиков игр, писателей, создателей контента и энтузиастов NLP, работающих в жанре фэнтези.

Каждое существо тщательно описано на русском и английском языках, с детализированной историей, внешним видом, способностями и поведением. Это живой, развивающийся сборник, который служит мостом между языками и творческим воображением.

---
</details>

Welcome to the Fantasy Creature Bestiary—a multilingual dataset containing detailed entries for unique, AI-generated magical creatures. This dataset is perfect for game developers, writers, content creators, and NLP enthusiasts working in the fantasy genre.

Each creature is meticulously described in both Russian and English, with rich lore, appearance, abilities, and behavior. It's a living, evolving compendium that bridges languages and creative imagination.

### Uses

<details>
<summary><i>🇷🇺 Русская версия / Russian version...</i></summary>

### Возможности Применения

*   **Обучение Моделей Машинного Перевода:** Идеальный корпус для обучения или тонкой настройки моделей для перевода специализированной фэнтези-лексики между русским и английским.
*   **Генерация Контента для Игр и Книг:** Используйте датасет как источник вдохновения или напрямую для генерации квестов, описаний монстров, лора и диалогов для NPC.
*   **Обучение Моделей для Создания Миров:** Обучайте ИИ создавать последовательных и детализированных фэнтези-существ на основе структурированных атрибутов.
*   **Исследования в Области Многоязычного NLP:** Изучайте кросс-лингвистические закономерности в творческом письме.
*   **Инструмент для Писателей и Мастеров:** Используйте для мозгового штурма и преодоления творческого кризиса.

---
</details>

*   **Machine Translation Training:** A perfect corpus for training or fine-tuning models to translate specialized fantasy vocabulary between Russian and English.
*   **Game & Book Content Generation:** Use the dataset as inspiration or directly for generating quests, monster descriptions, lore, and NPC dialogues.
*   **Worldbuilding Model Training:** Train AI to generate coherent and detailed fantasy creatures based on structured attributes.
*   **Multilingual NLP Research:** Study cross-linguistic patterns in creative writing.
*   **Tool for Writers & Game Masters:** Use for brainstorming and overcoming writer's block.

### Dataset Structure

<details>
<summary><i>🇷🇺 Русская версия / Russian version...</i></summary>

### Структура Датесета

Данные представлены в формате JSON Lines (`.jsonl`), где каждая строка является самостоятельным JSON-объектом, описывающим одно существо.

---
</details>

The data is in JSON Lines (`.jsonl`) format, where each line is a self-contained JSON object representing a single creature.

**Пример записи / Example Entry:**

```json
{
  "name_ru": "Хронотварь Застойных Болот",
  "name_en": "Chronobeast of Stagnant Fens",
  "description_ru": "Древний роющий хищник...",
  "description_en": "An ancient burrowing predator...",
  "appearance_ru": "Чешуйчатое тело цвета ржавчины...",
  "appearance_en": "Scaly body colored like rust...",
  "lore_ru": "Легенды говорят...",
  "lore_en": "Legends claim...",
  "traits_ru": ["хронорезные когти", "кристаллизованная временная броня"],
  "traits_en": ["chrono-cutting claws", "crystallized temporal armor"],
  "habitat_ru": "заболоченные временные разломы...",
  "habitat_en": "swampy temporal rifts...",
  "abilities_ru": ["создание временных ловушек", "проход сквозь застывшие моменты"],
  "abilities_en": ["creating temporal traps", "moving through frozen moments"],
  "behavior_ru": "Методичный охотник-одиночка...",
  "behavior_en": "A methodical solitary hunter...",
  "diet": "energy",
  "social_structure": "solitary",
  "size": "large",
  "difficulty": "legendary",
  "origin": "divine",
  "intelligence": "superintelligent",
  "magic_type": "hydromancy",
  "language": "ru_en"
}
```

### Data Fields

<details>
<summary><i>🇷🇺 Русская версия / Russian version...</i></summary>

#### Поля Данных

Все поля, оканчивающиеся на `_ru` и `_en`, содержат параллельные тексты на русском и английском языках.

| Поле | Тип | Описание |
| :--- | :--- | :--- |
| `name_ru`, `name_en` | `string` | Название существа. |
| `description_ru`, `description_en` | `string` | Краткое описание. |
| `appearance_ru`, `appearance_en` | `string` | Детальное описание внешнего вида. |
| `lore_ru`, `lore_en` | `string` | Мифология, легенды, происхождение. |
| `traits_ru`, `traits_en` | `list[string]` | Список ключевых характеристик. |
| `habitat_ru`, `habitat_en` | `string` | Место обитания. |
| `abilities_ru`, `abilities_en` | `list[string]` | Список особых способностей. |
| `behavior_ru`, `behavior_en` | `string` | Описание поведения и тактики. |
| `diet` | `string` | Тип питания (e.g., `energy`, `photosynthesis`). |
| `social_structure` | `string` | Социальная организация (e.g., `solitary`, `pack`). |
| `size` | `string` | Размерная категория (e.g., `small`, `large`). |
| `difficulty` | `string` | Уровень угрозы (e.g., `medium`, `legendary`). |
| `origin` | `string` | Происхождение (e.g., `natural`, `magical`). |
| `intelligence` | `string` | Уровень интеллекта (e.g., `animal`, `superintelligent`). |
| `magic_type` | `string` | Тип магии (e.g., `hydromancy`, `biomancy`). |
| `language` | `string` | Метка языка исходного промпта (`ru_en`). |

---
</details>

All fields ending with `_ru` and `_en` contain parallel text in Russian and English.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name_ru`, `name_en` | `string` | The creature's name. |
| `description_ru`, `description_en` | `string` | A brief description. |
| `appearance_ru`, `appearance_en` | `string` | Detailed physical description. |
| `lore_ru`, `lore_en` | `string` | Mythology, legends, origin story. |
| `traits_ru`, `traits_en` | `list[string]` | List of key characteristics. |
| `habitat_ru`, `habitat_en` | `string` | Natural habitat. |
| `abilities_ru`, `abilities_en` | `list[string]` | List of special abilities. |
| `behavior_ru`, `behavior_en` | `string` | Description of behavior and tactics. |
| `diet` | `string` | Diet type (e.g., `energy`, `photosynthesis`). |
| `social_structure` | `string` | Social organization (e.g., `solitary`, `pack`). |
| `size` | `string` | Size category (e.g., `small`, `large`). |
| `difficulty` | `string` | Threat level (e.g., `medium`, `legendary`). |
| `origin` | `string` | Origin (e.g., `natural`, `magical`). |
| `intelligence` | `string` | Intelligence level (e.g., `animal`, `superintelligent`). |
| `magic_type` | `string` | Magic type (e.g., `hydromancy`, `biomancy`). |
| `language` | `string` | Source prompt language tag (`ru_en`). |

### How to Use

<details>
<summary><i>🇷🇺 Русская версия / Russian version...</i></summary>

### Как Использовать

**С помощью `datasets` библиотеки:**

```python
from datasets import load_dataset

dataset = load_dataset("limloop/fantasy_creature_bestiary")

# Загрузить все данные
dataset = load_dataset("limloop/fantasy_creature_bestiary", split="train")

# Просмотреть первую запись
print(dataset[0])
```

**Прямая загрузка:** Файлы данных также можно загрузить напрямую со [страницы датасета](https://huggingface.co/datasets/limloop/fantasy_creature_bestiary).

---
</details>

**With the `datasets` library:**

```python
from datasets import load_dataset

dataset = load_dataset("limloop/fantasy_creature_bestiary")

# Load the entire dataset
dataset = load_dataset("limloop/fantasy_creature_bestiary", split="train")

# Print the first entry
print(dataset[0])
```

**Direct Download:** Data files can also be downloaded directly from the [dataset page](https://huggingface.co/datasets/limloop/fantasy_creature_bestiary).

### 🚀 Generation Process

<details>
<summary><i>🇷🇺 Русская версия / Russian version...</i></summary>

Этот датасет был синтетически создан с помощью моего собственного проекта **[Universal Dialog Generator](https://github.com/limloop/universal_dialog_generator)**. Модель была настроена на генерацию последовательных, творческих и детализированных описаний существ на основе набора структурированных атрибутов, с параллельным выводом на русском и английском языках.

---
</details>

This dataset was synthetically generated using my own **[Universal Dialog Generator](https://github.com/limloop/universal_dialog_generator)** project. The model was prompted to generate coherent, creative, and detailed creature descriptions based on a set of structured attributes, with parallel output in Russian and English.