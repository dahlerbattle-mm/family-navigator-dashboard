import csv
import json

# Step 1: Convert FamNavAs.csv to FamNavAs.json
csv_file_path = 'FamNavAs.csv'
json_file_path = 'FamNavAs.json'

def csv_to_json(csv_file_path, json_file_path):
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        rows = list(csv_reader)

    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(rows, json_file, indent=4)

# Convert the CSV file to JSON format
csv_to_json(csv_file_path, json_file_path)

# Step 2: Load FamNavQs.json and FamNavAs.json
with open('FamNavQs.json', 'r', encoding='utf-8') as f:
    questions_data = json.load(f)

with open('FamNavAs.json', 'r', encoding='utf-8') as f:
    answers_data = json.load(f)

# Step 3: Process questions data to create the qanda_data structure
qanda_data = []
for line in questions_data:
    question_number = line['Question']
    category = line['Category/Pathway']
    subcategory = line['Subcategory/Competence']
    question_text = line['Question']

    new_line = {
        'q#': question_number,
        'question': question_text,
        'cat': category,
        'subcat': subcategory,
        'entities': {
            'total': {'count': 0.0, 'sum': 0.0, 'average': 0.0, 'rank': 0.0}
        }
    }
    qanda_data.append(new_line)

# Step 4: Process answers data to aggregate by family and question
data_dictAs = {}

for line in answers_data:
    family = line['Date of Last Access']

    # Initialize family entry if not present
    if family not in data_dictAs:
        data_dictAs[family] = {}

    # Loop through questions (Q1, Q2, etc.) in the line
    for key, answer_str in line.items():
        if key.startswith("Q") and answer_str.isdigit():
            if key not in data_dictAs[family]:
                data_dictAs[family][key] = {'count': 0.0, 'sum': 0.0, 'average': 0.0}

            answer = int(answer_str)
            data_dictAs[family][key]['count'] += 1
            data_dictAs[family][key]['sum'] += answer

# Calculate averages for each family and question
for family, questions in data_dictAs.items():
    for question, stats in questions.items():
        if stats['count'] > 0:
            stats['average'] = stats['sum'] / stats['count']

# Step 5: Integrate answers into qanda_data
for question in qanda_data:
    q_num = question['q#']
    for family, answers in data_dictAs.items():
        if family not in question['entities']:
            question['entities'][family] = answers.get(q_num, {'count': 0.0, 'sum': 0.0, 'average': 0.0})

        # Accumulate totals for count and sum
        question['entities']['total']['count'] += question['entities'][family]['count']
        question['entities']['total']['sum'] += question['entities'][family]['sum']

    # Calculate the total average
    if question['entities']['total']['count'] > 0:
        question['entities']['total']['average'] = question['entities']['total']['sum'] / question['entities']['total']['count']

# Step 6: Aggregate data by category (df_by_cat) and subcategory (df_by_subcat)
df_by_cat = {}
df_by_subcat = {}

for question in qanda_data:
    category = question['cat']
    subcategory = question['subcat']

    # Initialize category data
    if category not in df_by_cat:
        df_by_cat[category] = {}
    if subcategory not in df_by_subcat:
        df_by_subcat[subcategory] = {'cat': category}

    # Aggregate by entity within each category and subcategory
    for entity, stats in question['entities'].items():
        if entity != 'total':
            # Add to df_by_cat
            if entity not in df_by_cat[category]:
                df_by_cat[category][entity] = {'count': 0.0, 'sum': 0.0, 'average': 0.0}
            df_by_cat[category][entity]['count'] += stats['count']
            df_by_cat[category][entity]['sum'] += stats['sum']

            # Add to df_by_subcat
            if entity not in df_by_subcat[subcategory]:
                df_by_subcat[subcategory][entity] = {'count': 0.0, 'sum': 0.0, 'average': 0.0}
            df_by_subcat[subcategory][entity]['count'] += stats['count']
            df_by_subcat[subcategory][entity]['sum'] += stats['sum']

# Recalculate averages in df_by_cat and df_by_subcat
for category, entities in df_by_cat.items():
    for entity, stats in entities.items():
        if stats['count'] > 0:
            stats['average'] = stats['sum'] / stats['count']

for subcategory, entities in df_by_subcat.items():
    for entity, stats in entities.items():
        if entity != 'cat' and stats['count'] > 0:
            stats['average'] = stats['sum'] / stats['count']

# Step 7: Rank families/entities in each subcategory
family_scores = {}

for subcategory, entities in df_by_subcat.items():
    for entity, stats in entities.items():
        if entity != 'cat':
            if entity not in family_scores:
                family_scores[entity] = []
            family_scores[entity].append((subcategory, stats['average']))

for family, scores in family_scores.items():
    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
    rank = 1
    for subcategory, score in sorted_scores:
        df_by_subcat[subcategory][family]['rank'] = rank
        rank += 1

# Step 8: Create the final output dictionary
output_data = {
    "category_data": df_by_cat,
    "subcategory_data": df_by_subcat,
    "qanda_data": qanda_data
}

# Print or save the output data as JSON
with open("final_output.json", "w", encoding="utf-8") as json_file:
    json.dump(output_data, json_file, indent=4, ensure_ascii=False)

print("Data successfully saved to final_output.json")
