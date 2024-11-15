from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import pandas as pd
from biz_logic import run_etl_process
import uvicorn

# Initialize FastAPI app
app = FastAPI()

# Directory to temporarily store uploaded files
UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL, change as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/csv-upload")
async def upload_csv(file: UploadFile = File(...), organization_id: str = None):
    """
    Handles CSV upload and triggers ETL process with the uploaded data.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")

    if not organization_id:
        raise HTTPException(status_code=400, detail="Organization ID is required.")

    # Save the uploaded CSV file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    try:
        # Read the CSV file
        with open(file_path, "r", encoding="utf-8") as csv_file:
            csv_data = csv_file.read()

        # Save the raw payload to Supabase
        save_raw_payload_to_supabase(organization_id, csv_data)

        # Trigger the ETL process
        etl_result = run_etl_process(organization_id)

        # Clean up the temporary file
        os.remove(file_path)

        return {"success": True, "message": "ETL completed successfully", "etl_result": etl_result}
    except Exception as e:
        # Clean up the temporary file on error
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/get-category-payload/{organization_id}")
async def get_category_payload(organization_id: str):
    """
    Retrieve the category payload (cp_by_cat) from Supabase for a specific organization.
    """
    try:
        # Query Supabase for cp_by_cat
        response = supabase.table("dashboard_data").select("cp_by_cat").eq("organization_id", organization_id).execute()

        # Check response status and data
        if response.status_code == 200 and response.data:
            cp_by_cat = response.data[0].get("cp_by_cat")
            if cp_by_cat:
                return {
                    "organization_id": organization_id,
                    "metadata": {
                        "payload_type": "category",
                        "description": "Aggregated data by category",
                        "source": "Supabase"
                    },
                    "category_payload": json.loads(cp_by_cat)
                }
            else:
                raise HTTPException(status_code=404, detail="Category payload not found for the specified organization")
        else:
            raise HTTPException(status_code=404, detail=f"No data found for organization ID: {organization_id}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/get-subcategory-payload/{organization_id}")
async def get_subcategory_payload(organization_id: str):
    """
    Retrieve the subcategory payload (cp_by_subcat) from Supabase for a specific organization.
    """
    try:
        # Query Supabase for cp_by_subcat
        response = supabase.table("dashboard_data").select("cp_by_subcat").eq("organization_id", organization_id).execute()

        # Check response status and data
        if response.status_code == 200 and response.data:
            cp_by_subcat = response.data[0].get("cp_by_subcat")
            if cp_by_subcat:
                return {
                    "organization_id": organization_id,
                    "metadata": {
                        "payload_type": "subcategory",
                        "description": "Aggregated data by subcategory",
                        "source": "Supabase"
                    },
                    "subcategory_payload": json.loads(cp_by_subcat)
                }
            else:
                raise HTTPException(status_code=404, detail="Subcategory payload not found for the specified organization")
        else:
            raise HTTPException(status_code=404, detail=f"No data found for organization ID: {organization_id}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/get-questions-payload/{organization_id}")
async def get_questions_payload(organization_id: str):
    """
    Retrieve the questions payload (cp_by_q) from Supabase for a specific organization.
    """
    try:
        # Query Supabase for cp_by_q
        response = supabase.table("dashboard_data").select("cp_by_q").eq("organization_id", organization_id).execute()

        # Check response status and data
        if response.status_code == 200 and response.data:
            cp_by_q = response.data[0].get("cp_by_q")
            if cp_by_q:
                return {
                    "organization_id": organization_id,
                    "metadata": {
                        "payload_type": "questions",
                        "description": "Processed data by questions",
                        "source": "Supabase"
                    },
                    "questions_payload": json.loads(cp_by_q)
                }
            else:
                raise HTTPException(status_code=404, detail="Questions payload not found for the specified organization")
        else:
            raise HTTPException(status_code=404, detail=f"No data found for organization ID: {organization_id}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def save_raw_payload_to_supabase(organization_id: str, csv_data: str):
    """
    Save the raw CSV data to the Supabase `dashboard_data` table.
    """
    from supabase import create_client

    # Supabase credentials
    SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    response = supabase.table("dashboard_data").update({
        "raw_payload": csv_data
    }).eq("organization_id", organization_id).execute()

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to save raw payload to Supabase")
