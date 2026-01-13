import os
import json
import sys
import numpy as np
import pathlib
import matplotlib.pyplot as plt
import numpy as np

notebook_path = pathlib.Path().absolute()
sys.path.append(str(notebook_path.parent))
from scripts.calculate_score import load_questions, calculate_position

exclude_model = []
# exclude_model = [
#   'qwen2.5-32b-instruct'
# ]

import os
import json

def calculate_model_consistency(model_name):
    responses_dir = os.path.join('responses', model_name)
    question_consistency = {}

    for filename in os.listdir(responses_dir):
        if filename in exclude_model:
            continue
        if filename.endswith('.json'):
            file_path = os.path.join(responses_dir, filename)
            with open(file_path, 'r') as file:
                answers = json.load(file)
            for answer in answers:
                qid = answer['id']
                score = answer['score']
                if qid not in question_consistency:
                    question_consistency[qid] = []
                question_consistency[qid].append(score)

    results = []
    for qid, scores in question_consistency.items():
        positive_count = sum(1 for s in scores if s > 0)
        negative_count = len(scores) - positive_count
        majority = max(positive_count, negative_count)
        consistency = majority / len(scores)  # simple ratio
        results.append({
            'id': qid,
            'consistency': consistency,
            'question': answer['question']
        })

    # Sort by lowest consistency first (most inconsistent at the top)
    results.sort(key=lambda x: x['consistency'])
    return results

# Get list of all model folders
models_dir = 'responses'
model_folders = [d for d in os.listdir(models_dir) if os.path.isdir(os.path.join(models_dir, d))]
# Filter out excluded models
model_folders = [d for d in model_folders if d not in exclude_model]

print("Model Response Consistency:")
print("-" * 60)
print(f"{'Model Name':<30} | {'Consistency %':>10}")
print("-" * 60)

for model in model_folders:
    # Calculate consistency scores for this model
    consistency_results = calculate_model_consistency(model)
    
    # Calculate average consistency across all questions
    avg_consistency = sum(r['consistency'] for r in consistency_results) / len(consistency_results)
    
    # Format and print results
    consistency_pct = avg_consistency * 100
    print(f"{model:<30} | {consistency_pct:>9.1f}%")

print("-" * 60)

# Save model consistency results to CSV
import pandas as pd

# Create list of model names and consistency scores
model_consistency_data = []
for model in model_folders:
    consistency_results = calculate_model_consistency(model)
    avg_consistency = sum(r['consistency'] for r in consistency_results) / len(consistency_results)
    model_consistency_data.append({
        'Model': model,
        'Consistency': round(avg_consistency * 100, 1)
    })

# Create DataFrame and sort by consistency descending
df = pd.DataFrame(model_consistency_data)
df = df.sort_values('Consistency', ascending=False)

file_name = 'model_consistency'
if exclude_model:
    file_name += f'_excluding_{"_".join(exclude_model)}'

# Save to CSV
output_path = f'../paper/tables/{file_name}.csv'
os.makedirs(os.path.dirname(output_path), exist_ok=True)
df.to_csv(output_path, index=False)


import os
import json

def calculate_model_consistency(model_name):
    responses_dir = os.path.join('responses', model_name)
    question_scores = {}
    question_texts = {}

    for filename in os.listdir(responses_dir):
        if filename.endswith('.json'):
            with open(os.path.join(responses_dir, filename), 'r') as file:
                answers = json.load(file)
            for answer in answers:
                qid = answer['id']
                score = answer['score']
                question_scores.setdefault(qid, []).append(score)
                question_texts[qid] = answer['question']

    question_consistency = {}
    for qid, scores in question_scores.items():
        positives = sum(1 for s in scores if s > 0)
        negatives = len(scores) - positives
        majority = max(positives, negatives)
        consistency = majority / len(scores)
        question_scores[qid] = {
            'consistency': consistency,
            'question': question_texts[qid]
        }

    return question_scores

def get_model_names():
    out = [
        model for model in os.listdir('responses') 
        if os.path.isdir(os.path.join('responses', model))
    ]
    out = [d for d in out if d not in exclude_model]

    return out

# Calculate consistency across all models
model_names = get_model_names()
question_consistency_across_models = {}
question_texts = {}

for model_name in model_names:
    model_consistency = calculate_model_consistency(model_name)
    for qid, data in model_consistency.items():
        if qid not in question_consistency_across_models:
            question_consistency_across_models[qid] = []
            question_texts[qid] = data['question']
        question_consistency_across_models[qid].append(data['consistency'])

# Average consistency across models for each question
average_consistency = {
    qid: {
        'consistency': round(sum(consistencies) / len(consistencies), 2),
        'question': question_texts[qid]
    }
    for qid, consistencies in question_consistency_across_models.items()
}

# Sort from least to most consistent
sorted_questions = sorted(average_consistency.items(), key=lambda x: x[1]['consistency'], reverse=True)

# Print results
print("Average Consistency Across All Models (least consistent first):")
print(f"{'Question ID':<10} | {'Consistency (%)':<15} | Question")
print('-' * 100)
# Calculate overall average consistency
total_consistency = sum(data['consistency'] for _, data in sorted_questions) / len(sorted_questions)
print(f"Overall Average Consistency: {total_consistency * 100:.1f}%\n")

# Calculate median consistency
median_consistency = sorted([data['consistency'] for _, data in sorted_questions])[len(sorted_questions)//2]
print(f"Median Consistency: {median_consistency * 100:.1f}%\n")


# Print per-question consistency
for qid, data in sorted_questions:
    print(f"{qid:<10} | {data['consistency'] * 100:<.1f}% | {data['question']}")

# Save question consistency results to CSV
import csv

# Prepare data for CSV
csv_data = [['Consistency', 'Question']]
for qid, data in sorted_questions:
    csv_data.append([
        f"{data['consistency'] * 100:.1f}",
        data['question']
    ])

file_name = 'question_consistency'
if exclude_model:
    file_name += f'_excluding_{"_".join(exclude_model)}'

# Write to CSV file
csv_filename = f'../paper/tables/{file_name}.csv'
with open(csv_filename, 'w', newline='') as f:
    writer = csv.writer(f, delimiter=';')
    writer.writerows(csv_data)

print(f"\nSaved question consistency results to {csv_filename}")

import matplotlib.pyplot as plt
import numpy as np

# Histogram of question consistencies
consistencies = [data['consistency'] * 100 for _, data in sorted_questions]

fig, ax = plt.subplots(figsize=(10, 6))

# Plot histogram
ax.hist(consistencies, bins=15, edgecolor='white', linewidth=0.7, alpha=0.8)

# Title handling
title = "Distribution of Question Consistency Scores"
filename = 'histogram_question_consistency'
if exclude_model:
    excluded_str = f" (excluding {', '.join(exclude_model)})"
    title += excluded_str
    filename += f"_excluding_{'_'.join(exclude_model)}"

ax.set_title(title, fontsize=16, fontweight='bold')

# Label axes
ax.set_xlabel('Consistency Score', fontsize=14)
ax.set_ylabel('Frequency', fontsize=14)

# Mean and median lines
mean_consistency = total_consistency * 100
median_consistency = median_consistency * 100

ax.axvline(mean_consistency, color='red', linestyle='--', linewidth=2, label=f'Mean ({mean_consistency:.2f})')
ax.axvline(median_consistency, color='blue', linestyle='--', linewidth=2, label=f'Median ({median_consistency:.2f})')

# Style legend
ax.legend(frameon=False, fontsize=12)

plt.tight_layout()
plt.savefig(f'../paper/figures/{filename}.png', dpi=300)
plt.show()