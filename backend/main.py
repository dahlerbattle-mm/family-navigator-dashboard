from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os
import json
from supabase import create_client, Client

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


@app.get("/api/generate-report/{organization_id}")
async def generate_report(organization_id: str):
    """
    Generate a PDF report for the given organization_id using data from Supabase.
    """
    try:
        # Step 1: Fetch company data from Supabase
        response = supabase.from("companies").select("*").eq("id", organization_id).execute()
        if response.status_code != 200 or not response.data:
            raise HTTPException(status_code=404, detail="Company data not found")
        company_data = response.data[0]  # Assuming company data is a single record

        # Step 2: Fetch payloads for the company
        category_payload = (
            supabase.from("dashboard_data")
            .select("cp_by_cat")
            .eq("organization_id", organization_id)
            .execute()
        )
        subcategory_payload = (
            supabase.from("dashboard_data")
            .select("cp_by_subcat")
            .eq("organization_id", organization_id)
            .execute()
        )
        questions_payload = (
            supabase.from("dashboard_data")
            .select("cp_by_q")
            .eq("organization_id", organization_id)
            .execute()
        )

        if category_payload.status_code != 200:
            category_payload = {"data": []}
        if subcategory_payload.status_code != 200:
            subcategory_payload = {"data": []}
        if questions_payload.status_code != 200:
            questions_payload = {"data": []}

        # Step 3: Generate the PDF
        pdf_path = os.path.join(TEMP_DIR, f"FamilyNavigator_Report_{organization_id}.pdf")
        generate_pdf(
            pdf_path,
            company_data,
            category_payload.data,
            subcategory_payload.data,
            questions_payload.data,
        )

        # Step 4: Return the PDF as a file response
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"FamilyNavigator_Report_{organization_id}.pdf",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def generate_pdf(pdf_path, company_data, category_payload, subcategory_payload, questions_payload):
    """
    Generate a PDF report using ReportLab.
    """
    c = canvas.Canvas(pdf_path, pagesize=letter)

    # Title
    c.setFont("Helvetica-Bold", 20)
    c.drawString(200, 750, "Family Navigator Report")

    # Company Information
    c.setFont("Helvetica", 12)
    c.drawString(50, 720, f"Company: {company_data['name']}")
    c.drawString(50, 700, f"Organization: {company_data['organization_name']}")

    # Executive Summary
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, 670, "Executive Summary")
    c.setFont("Helvetica", 12)
    c.drawString(
        50,
        650,
        "This report provides an analysis of Family Navigator results, including family dynamics, roles, and satisfaction.",
    )

    # Categories Section
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, 620, "Categories")
    y = 600
    for category in category_payload:
        data = json.loads(category["cp_by_cat"])
        for key, value in data.items():
            c.setFont("Helvetica-Bold", 12)
            c.drawString(50, y, f"Category: {key}")
            c.setFont("Helvetica", 10)
            c.drawString(50, y - 15, f"Total Count: {value['total']['count']}")
            c.drawString(50, y - 30, f"Total Average: {value['total']['average']}")
            y -= 60
            if y < 100:  # Add a new page if necessary
                c.showPage()
                y = 750

    # Subcategories Section
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Subcategories")
    y -= 20
    for subcategory in subcategory_payload:
        data = json.loads(subcategory["cp_by_subcat"])
        for key, value in data.items():
            c.setFont("Helvetica-Bold", 12)
            c.drawString(50, y, f"Subcategory: {key}")
            c.setFont("Helvetica", 10)
            c.drawString(50, y - 15, f"Total Count: {value['total']['count']}")
            c.drawString(50, y - 30, f"Total Average: {value['total']['average']}")
            y -= 60
            if y < 100:  # Add a new page if necessary
                c.showPage()
                y = 750

    # Questions Section
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Questions")
    y -= 20
    for question in questions_payload:
        data = json.loads(question["cp_by_q"])
        for q in data:
            c.setFont("Helvetica-Bold", 12)
            c.drawString(50, y, f"Question: {q['q#']} - {q['question']}")
            c.setFont("Helvetica", 10)
            c.drawString(50, y - 15, f"Category: {q['cat']}")
            c.drawString(50, y - 30, f"Total Average: {q['entities']['total']['average']}")
            y -= 60
            if y < 100:  # Add a new page if necessary
                c.showPage()
                y = 750

    # Finalize the PDF
    c.save()