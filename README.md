Family Navigator Dashboard: README
This guide explains how to spin up the Family Navigator Dashboard project using Docker containers for both the backend (FastAPI) and the frontend (Next.js). The Docker images are prebuilt and available on Docker Hub, so you don't need to build them locally.

Prerequisites
Install Docker and Docker Compose:

Install Docker
Install Docker Compose
Clone the Repository: Clone the project repository to your local machine:

bash
Copy code
git clone https://github.com/dahlerbattle-mm/family-navigator-dashboard.git
cd family-navigator-dashboard
Configure Environment Files:

Backend: Ensure the backend/.env file contains all the required environment variables (e.g., database connection strings, API keys).
Frontend: Ensure the frontend/.env file contains any necessary configuration for the frontend.
Project Structure
bash
Copy code
family-navigator-dashboard/
├── backend/
│   ├── .env                # Environment variables for backend
├── frontend/
│   ├── .env                # Environment variables for frontend
├── docker-compose.yml      # Docker Compose configuration
Steps to Spin Up the Project
1. Pull Prebuilt Images from Docker Hub
Ensure you have the latest images for the backend and frontend by pulling them:

bash
Copy code
docker pull metricmatters/famnav-backend:latest
docker pull metricmatters/famnav-frontend:latest
2. Start the Docker Containers
Run the following command to spin up the backend and frontend containers:

bash
Copy code
docker-compose up
Frontend will be accessible at http://localhost:3000.
Backend will be accessible at http://localhost:8000.
3. Verify Backend is Running
Test the backend using curl:

bash
Copy code
curl http://localhost:8000/
You should see a response like:

json
Copy code
{"message": "Welcome to the Family Navigator backend!"}
Common Commands
Start the Project
bash
Copy code
docker-compose up
Stop the Project
bash
Copy code
docker-compose down
View Logs for a Specific Container
Backend Logs:
bash
Copy code
docker logs backend-container
Frontend Logs:
bash
Copy code
docker logs frontend-container
Backend API Overview
Default Endpoints
Swagger UI: http://localhost:8000/docs
ReDoc Documentation: http://localhost:8000/redoc
Frontend Overview
The frontend is built with Next.js and is accessible at http://localhost:3000.

Troubleshooting
1. Backend Exits Immediately
Check the backend container logs:
bash
Copy code
docker logs backend-container
2. Frontend Doesn’t Load
Check the frontend container logs:
bash
Copy code
docker logs frontend-container