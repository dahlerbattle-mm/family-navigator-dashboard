# Family Navigator Dashboard: README

This guide explains how to spin up the **Family Navigator Dashboard** project using Docker containers for both the backend (FastAPI) and the frontend (Next.js). The Docker images are prebuilt and available on Docker Hub, so you don't need to build them locally.

## Prerequisites

### Install Docker and Docker Compose
Ensure Docker and Docker Compose are installed on your system.

### Clone the Repository
Clone the project repository to your local machine:

```bash
git clone https://github.com/dahlerbattle-mm/family-navigator-dashboard.git
cd family-navigator-dashboard
```

### Configure Environment Files
Backend: Ensure the backend/.env file contains all the required environment variables (e.g., database connection strings, API keys).

Frontend: Ensure the frontend/.env file contains any necessary configuration for the frontend.

### Project Structure: 

```bash
family-navigator-dashboard/
├── backend/
│   ├── .env              # Environment variables for backend
├── frontend/
│   ├── .env              # Environment variables for frontend
├── docker-compose.yml    # Docker Compose configuration
```

## Steps to Spin Up the Project
### 1. Pull Prebuilt Images from Docker Hub
Ensure you have the latest images for the backend and frontend:

```bash
docker pull metricmatters/famnav-backend:latest
docker pull metricmatters/famnav-frontend:latest
```

### 2. Start the Docker Containers
Run the following command to spin up the backend and frontend containers:

```bash
docker-compose up
```

- Frontend: Accessible at http://localhost:3000
- Backend: Accessible at http://localhost:8000

### 3. Verify Backend is Running
Test the backend using curl:

```bash
curl http://localhost:8000/
```

You should see a response like the one below: 
```bash
{
  "message": "Welcome to the Family Navigator backend!"
}
```

