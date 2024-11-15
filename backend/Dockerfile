# Use a lightweight Python image
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files
COPY requirements.txt /app/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend folder into the container
COPY . /app

# Expose the port (if required, e.g., FastAPI default port)
EXPOSE 8000

# Command to run your application
CMD ["python", "main.py"]
