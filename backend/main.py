from fastapi import FastAPI, HTTPException
from biz_logic import run_etl_process  # Import your ETL function
import uvicorn  # Import uvicorn to run the FastAPI app

# Initialize FastAPI app
app = FastAPI()

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

# Entry point for running the application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
