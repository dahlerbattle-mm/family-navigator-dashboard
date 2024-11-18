from fastapi import FastAPI, HTTPException, Form, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from biz_logic import process_uploaded_data
import os
import json
from supabase import create_client, Client
import pandas as pd
import requests
import io
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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

@app.get("/")
def read_root():
    return {"message": "Welcome to the Family Navigator backend!"}

@app.post("/api/csv-upload")
async def upload_file(
    file: UploadFile = File(...),
    organization: str = Form(...)
):
    """
    Endpoint to upload a CSV file along with the organization name.

    Parameters:
    - file (UploadFile): The CSV file uploaded by the user.
    - organization (str): The organization name provided by the user.

    Returns:
    - dict: A success message and result of the processing.
    """
    # Read the uploaded file into a pandas DataFrame
    content = await file.read()
    answers_df = pd.read_csv(io.StringIO(content.decode("utf-8")))

    # Path to FamNavQs JSON (adjust based on your backend structure)
    FamNavQs_path = "backend/FamNavQs.json"

    # Supabase credentials (replace with your actual credentials)
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    # Call the process_data function
    result = process_data(FamNavQs_path, answers_df, SUPABASE_URL, SUPABASE_KEY, organization)

    return {"message": "File processed", "result": result}

@app.get("/api/get-category-payload/{organization_id}")
def get_category_payload(organization_id: str):
    """
    Retrieves data from Supabase and formats it into the desired JSON structure.
    """
    # Fetch Supabase credentials from the environment
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key:
        raise HTTPException(status_code=500, detail="Supabase credentials are not properly configured.")

    # Initialize Supabase client
    supabase = create_client(supabase_url, supabase_key)

    # Fetch data from the `dashboard_data` table
    response = supabase.table("dashboard_data").select("*").eq("organization", organization_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="No data found for the given organization.")

    # Load data into a pandas DataFrame
    df = pd.DataFrame(response.data)

    # Ensure required columns exist in the DataFrame
    required_columns = ["organization", "constituency_id", "constituency_name", "category", "answer"]
    if not all(col in df.columns for col in required_columns):
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {set(required_columns) - set(df.columns)}"
        )

    # Group and aggregate data by category and constituency
    grouped = df.groupby(["category", "constituency_id", "constituency_name"]).agg(
        count=("answer", "count"),
        sum=("answer", "sum"),
        average=("answer", "mean")
    ).reset_index()

    # Calculate totals for each category
    category_totals = grouped.groupby(["category"]).agg(
        total_count=("count", "sum"),
        total_sum=("sum", "sum"),
        total_average=("sum", "mean")
    ).reset_index()

    # Merge totals back with grouped data
    merged = pd.merge(
        grouped,
        category_totals,
        on=["category"],
        how="left",
        suffixes=("", "_total")
    )

    # Format the data into the desired nested JSON structure
    result = {
        "organization_id": organization_id,
        "metadata": {
            "payload_type": "category",
            "description": "Aggregated data by category",
            "source": "Supabase"
        },
        "category_payload": {}
    }
    for category in merged["category"].unique():
        cat_data = merged[merged["category"] == category]
        category_dict = {}
        for _, row in cat_data.iterrows():
            constituency = row["constituency_id"]
            constituency_dict = {
                "constituency_name": row["constituency_name"],
                "count": row["count"],
                "sum": row["sum"],
                "average": row["average"]
            }
            category_dict[constituency] = constituency_dict
        category_dict["total"] = {
            "count": cat_data["total_count"].iloc[0],
            "sum": cat_data["total_sum"].iloc[0],
            "average": cat_data["total_average"].iloc[0]
        }
        result["category_payload"][category] = category_dict

    # Return the formatted JSON
    return JSONResponse(content=result, status_code=200)


@app.get("/api/get-subcategory-payload/{organization_id}")
def get_subcategory_payload(organization_id: str):
    """
    Retrieves data from Supabase and formats it into the desired JSON structure based on subcategories.
    """
    # Fetch Supabase credentials from the environment
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key:
        raise HTTPException(status_code=500, detail="Supabase credentials are not properly configured.")

    # Initialize Supabase client
    supabase = create_client(supabase_url, supabase_key)

    # Fetch data from the `dashboard_data` table
    response = supabase.table("dashboard_data").select("*").eq("organization", organization_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="No data found for the given organization.")

    # Load data into a pandas DataFrame
    df = pd.DataFrame(response.data)

    # Ensure required columns exist in the DataFrame
    required_columns = ["organization", "constituency_id", "constituency_name", "subcategory", "answer"]
    if not all(col in df.columns for col in required_columns):
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {set(required_columns) - set(df.columns)}"
        )

    # Group and aggregate data by subcategory and constituency
    grouped = df.groupby(["subcategory", "constituency_id", "constituency_name"]).agg(
        count=("answer", "count"),
        sum=("answer", "sum"),
        average=("answer", "mean")
    ).reset_index()

    # Calculate totals for each subcategory
    subcategory_totals = grouped.groupby(["subcategory"]).agg(
        total_count=("count", "sum"),
        total_sum=("sum", "sum"),
        total_average=("sum", "mean")
    ).reset_index()

    # Merge totals back with grouped data
    merged = pd.merge(
        grouped,
        subcategory_totals,
        on=["subcategory"],
        how="left",
        suffixes=("", "_total")
    )

    # Format the data into the desired nested JSON structure
    result = {
        "organization_id": organization_id,
        "metadata": {
            "payload_type": "subcategory",
            "description": "Aggregated data by subcategory",
            "source": "Supabase"
        },
        "subcategory_payload": {}
    }
    for subcategory in merged["subcategory"].unique():
        subcat_data = merged[merged["subcategory"] == subcategory]
        subcategory_dict = {}
        for _, row in subcat_data.iterrows():
            constituency = row["constituency_id"]
            constituency_dict = {
                "constituency_name": row["constituency_name"],
                "count": row["count"],
                "sum": row["sum"],
                "average": row["average"]
            }
            subcategory_dict[constituency] = constituency_dict
        subcategory_dict["total"] = {
            "count": subcat_data["total_count"].iloc[0],
            "sum": subcat_data["total_sum"].iloc[0],
            "average": subcat_data["total_average"].iloc[0]
        }
        result["subcategory_payload"][subcategory] = subcategory_dict

    # Return the formatted JSON
    return JSONResponse(content=result, status_code=200)


@app.get("/api/get-question-payload/{organization_id}")
def get_question_payload(organization_id: str):
    """
    Retrieves data from Supabase and formats it into the desired JSON structure by question.
    """
    # Fetch Supabase credentials from the environment
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key:
        raise HTTPException(status_code=500, detail="Supabase credentials are not properly configured.")

    # Initialize Supabase client
    supabase = create_client(supabase_url, supabase_key)

    # Fetch data from the `dashboard_data` table
    response = supabase.table("dashboard_data").select("*").eq("organization", organization_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="No data found for the given organization.")

    # Load data into a pandas DataFrame
    df = pd.DataFrame(response.data)

    # Ensure required columns exist in the DataFrame
    required_columns = ["q#", "question", "category", "subcategory", "constituency_id", "constituency_name", "answer"]
    if not all(col in df.columns for col in required_columns):
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {set(required_columns) - set(df.columns)}"
        )

    # Group by question, constituency, and calculate averages
    grouped = df.groupby(["q#", "question", "category", "subcategory", "constituency_id", "constituency_name"]).agg(
        average=("answer", "mean")
    ).reset_index()

    # Format the data into the desired nested JSON structure
    question_payload = []
    for question_id in grouped["q#"].unique():
        question_data = grouped[grouped["q#"] == question_id]
        for _, row in question_data.iterrows():
            # Create an entry for each question, category, and subcategory
            entry = {
                "q#": row["q#"],
                "question": row["question"],
                "category": row["category"],
                "subcategory": row["subcategory"],
                "constituency_averages": {}
            }

            # Populate constituency averages
            constituencies = question_data[["constituency_id", "constituency_name", "average"]].drop_duplicates()
            for _, constituency_row in constituencies.iterrows():
                entry["constituency_averages"][constituency_row["constituency_name"]] = constituency_row["average"]

            # Add the entry to the question_payload
            question_payload.append(entry)


TEMP_DIR = "/tmp"  # Update the path as needed
os.makedirs(TEMP_DIR, exist_ok=True)

@app.get("/api/generate-report/{organization_id}")
async def generate_report(organization_id: str):
    """
    Generate a PDF report for the given organization_id using data from the payload APIs.
    """
    try:
        # Base URL for the API
        base_url = "http://127.0.0.1:8000"

        # Step 1: Fetch payloads from APIs
        category_payload = requests.get(f"{base_url}/api/get-category-payload/{organization_id}").json()
        subcategory_payload = requests.get(f"{base_url}/api/get-subcategory-payload/{organization_id}").json()
        questions_payload = requests.get(f"{base_url}/api/get-question-payload/{organization_id}").json()

        # Step 2: Generate the PDF
        pdf_path = os.path.join(TEMP_DIR, f"FamilyNavigator_Report_{organization_id}.pdf")
        generate_pdf(
            pdf_path,
            organization_id,
            category_payload,
            subcategory_payload,
            questions_payload,
        )

        # Step 3: Return the PDF as a file response
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"FamilyNavigator_Report_{organization_id}.pdf",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def generate_pdf(pdf_path, organization_id, category_payload, subcategory_payload, questions_payload):
    """
    Generate a PDF report using ReportLab.
    """
    c = canvas.Canvas(pdf_path, pagesize=letter)

    # Title
    c.setFont("Helvetica-Bold", 20)
    c.drawString(200, 750, "Family Navigator Report")

    # Organization Information
    c.setFont("Helvetica", 12)
    c.drawString(50, 720, f"Organization ID: {organization_id}")

    # Executive Summary
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, 700, "Executive Summary")
    c.setFont("Helvetica", 12)
    c.drawString(
        50,
        680,
        "This report provides an analysis of Family Navigator results, including family dynamics, roles, and satisfaction.",
    )

    # Categories Section
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, 660, "Categories")
    y = 640
    for category, data in category_payload.get("category_payload", {}).items():
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, f"Category: {category}")
        c.setFont("Helvetica", 10)
        c.drawString(50, y - 15, f"Total Count: {data['total']['count']}")
        c.drawString(50, y - 30, f"Total Average: {data['total']['average']}")
        y -= 60
        if y < 100:  # Add a new page if necessary
            c.showPage()
            y = 750

    # Subcategories Section
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Subcategories")
    y -= 20
    for subcategory, data in subcategory_payload.get("subcategory_payload", {}).items():
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, f"Subcategory: {subcategory}")
        c.setFont("Helvetica", 10)
        c.drawString(50, y - 15, f"Total Count: {data['total']['count']}")
        c.drawString(50, y - 30, f"Total Average: {data['total']['average']}")
        y -= 60
        if y < 100:  # Add a new page if necessary
            c.showPage()
            y = 750

    # Questions Section
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Questions")
    y -= 20
    for question in questions_payload.get("question_payload", []):
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, f"Question: {question['q#']} - {question['question']}")
        c.setFont("Helvetica", 10)
        c.drawString(50, y - 15, f"Category: {question['category']}")
        c.drawString(50, y - 30, f"Subcategory: {question['subcategory']}")
        averages = ", ".join(
            f"{key}: {value:.2f}" for key, value in question["constituency_averages"].items()
        )
        c.drawString(50, y - 45, f"Constituency Averages: {averages}")
        y -= 80
        if y < 100:  # Add a new page if necessary
            c.showPage()
            y = 750

    # Finalize the PDF
    c.save()