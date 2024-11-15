from fastapi import FastAPI, HTTPException
from biz_logic import run_etl_process  # Import your ETL function
import uvicorn  # Import uvicorn to run the FastAPI app

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL, change as needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Simple test endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the FamilyNavigator Report Backend"}

# Endpoint to run the ETL process
@app.post("/run-etl/{organization_id}")
async def run_etl(organization_id: str):
    try:
        result = run_etl_process(organization_id)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/csv-upload")
async def upload_csv(file: UploadFile = File(...)):
    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")

    # Save the file temporarily
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    try:
        # Process the file using pandas
        df = pd.read_csv(file_path)

        # Perform any logic you need (e.g., validation, transformation)
        # Example: Return the first 5 rows as a preview
        result = df.head().to_dict(orient="records")
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)},
        )
    finally:
        # Clean up the temporary file
        os.remove(file_path)

    return {"success": True, "result": result}

# Entry point for running the application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
