"""Một Đời — đọc file parquet của Nemotron-Personas-Vietnam (NVIDIA & FPT, CC BY 4.0) đã tải về .cache/,
chỉ giữ các trường game cần, ghi ra .cache/personas/rows-<tên>.jsonl để tools/build-personas.js tổng hợp.
Cần pyarrow (cài trong môi trường riêng: python -m venv .cache/venv && .cache/venv/Scripts/python -m pip install pyarrow).
Chạy: .cache/venv/Scripts/python tools/personas-from-parquet.py .cache/shard-00000.parquet [.cache/shard-00006.parquet ...]"""
import json, os, sys
import pyarrow.parquet as pq

COLS = ['occupation', 'region', 'zone', 'age', 'sex', 'education_level', 'marital_status', 'hobbies_and_interests_list', 'skills_and_expertise_list',
        'culinary_persona', 'cultural_background', 'arts_persona', 'sports_persona', 'travel_persona', 'hobbies_and_interests', 'career_goals_and_ambitions']
root = os.path.join(os.path.dirname(__file__), '..', '.cache', 'personas')
os.makedirs(root, exist_ok=True)
for f in sys.argv[1:]:
    t = pq.read_table(f, columns=COLS)
    out = os.path.join(root, 'rows-' + os.path.splitext(os.path.basename(f))[0] + '.jsonl')
    n = 0
    with open(out, 'w', encoding='utf-8') as w:
        for batch in t.to_batches(max_chunksize=5000):
            for row in batch.to_pylist():
                w.write(json.dumps(row, ensure_ascii=False) + '\n'); n += 1
    print(f'{f}: {n} dòng -> {out}')
