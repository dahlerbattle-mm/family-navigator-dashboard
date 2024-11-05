# api/etl/main.py
import json
from supabase import create_client, Client
import csv
import io
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException

# Initialize FastAPI app
app = FastAPI()

# Load environment variables
load_dotenv()

# Supabase connection settings from environment variables
supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

@app.post("/run-etl/{organization_id}")
async def run_etl(organization_id: str):
    try:
        # Step 1: Retrieve FamNavAs.csv from Supabase for a specific organization
        csv_data = get_csv_from_supabase(organization_id)
        if not csv_data:
            raise HTTPException(status_code=404, detail="No data retrieved from Supabase for the specified organization")

        # Convert CSV string to JSON format
        csv_reader = csv.DictReader(io.StringIO(csv_data))
        answers_data = list(csv_reader)

        # Step 2: Load FamNavQs.json
        with open('FamNavQs.json', 'r', encoding='utf-8') as f:
            questions_data = json.load(f)

        # Step 3: Process questions data to create the qanda_data structure
        qanda_data = []
        for line in questions_data:
            question_number = line['q#']
            category = line['cat']
            subcategory = line['subcat']
            question_text = line['question']

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

            if family not in data_dictAs:
                data_dictAs[family] = {}

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

                question['entities']['total']['count'] += question['entities'][family]['count']
                question['entities']['total']['sum'] += question['entities'][family]['sum']

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

        # Step 8: Save final output to Supabase
        save_to_supabase(organization_id, df_by_cat, df_by_subcat, qanda_data)

        return {"status": "ETL completed and data saved"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions
def get_csv_from_supabase(organization_id):
    # Query the dashboard_data table to get the raw_payload for the given organization_id
    response = supabase.table("dashboard_data").select("raw_payload").eq("organization_id", organization_id).execute()
    
    if response.status_code == 200 and response.data:
        csv_data = response.data[0]['raw_payload']
        return csv_data
    else:
        print("Failed to retrieve data from Supabase for organization:", organization_id)
        return None

def save_to_supabase(organization_id, df_by_cat, df_by_subcat, qanda_data):
    response = supabase.table("dashboard_data").update({
        "cp_by_cat": json.dumps(df_by_cat),
        "cp_by_subcat": json.dumps(df_by_subcat),
        "cp_by_q": json.dumps(qanda_data)
    }).eq("organization_id", organization_id).execute()

    if response.status_code == 200:
        print("Data successfully saved to Supabase for organization:", organization_id)
    else:
        print("Failed to save data to Supabase for organization:", organization_id)
