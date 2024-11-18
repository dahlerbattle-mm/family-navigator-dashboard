import pandas as pd
from datetime import datetime
from supabase import create_client

def process_data(FamNavQs_path, answers_df, supabase_url, supabase_key, organization):
    """
    Processes the uploaded answers DataFrame and links it with FamNavQs JSON,
    then upserts the processed data into the Supabase `dashboard_data` table.

    Parameters:
    - FamNavQs_path (str): Path to the FamNavQs.json file.
    - answers_df (pd.DataFrame): Uploaded answers DataFrame.
    - supabase_url (str): Supabase project URL.
    - supabase_key (str): Supabase project API key.
    - organization (str): The organization name provided by the user.
    """
    # Load JSON file into a DataFrame
    questions_df = pd.read_json(FamNavQs_path)

    # Rename columns in answers_df to match expected variables
    answers_df = answers_df.rename(columns={
        "Participant": "participant",
        "Constituency": "constituency_id",
        "Date of Last Access": "constituency_name"
    })

    # Reshape answers DataFrame to long format
    answers_long_df = answers_df.melt(
        id_vars=["participant", "constituency_id", "constituency_name"],  # Columns to keep
        var_name="q#",  # Name for the melted column
        value_name="answer"  # Name for the values column
    )

    # Merge answers with question details
    merged_df = answers_long_df.merge(questions_df, on="q#", how="left")

    # Add organization column
    merged_df["organization"] = organization

    # Add a timestamp for `updated_at`
    merged_df["updated_at"] = datetime.now().isoformat()

    # Rename columns to match the `dashboard_data` table structure
    final_df = merged_df.rename(columns={
        "constituency_id": "constituency_id",
        "constituency_name": "constituency_name",
        "q#": "q#",
        "question": "question",
        "cat": "category",
        "subcat": "subcategory",
        "answer": "answer"
    })

    # Initialize Supabase client
    supabase = create_client(supabase_url, supabase_key)

    # Convert DataFrame to a list of dictionaries
    data_records = final_df.to_dict(orient="records")

    # Iterate through the records and upsert data
    for record in data_records:
        # Check if a record exists with the same `participant` and `q#`
        existing = supabase.table("dashboard_data").select("*").eq("participant", record["participant"]).eq("q#", record["q#"]).execute()

        if existing.data:
            # If record exists, update it
            response = supabase.table("dashboard_data").update({
                "answer": record["answer"],
                "organization": record["organization"],  # Include organization in update
                "updated_at": record["updated_at"]
            }).eq("participant", record["participant"]).eq("q#", record["q#"]).execute()
        else:
            # If no record exists, insert it
            response = supabase.table("dashboard_data").insert(record).execute()

    return {"message": "Data processed and uploaded successfully"}
