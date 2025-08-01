#!/bin/bash

# Install basic Python dependencies
pip install fastapi uvicorn python-multipart python-dotenv

# Create a simple requirements file for the API server
cat > /app/simple_requirements.txt << EOF
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
python-dotenv==1.0.0
numpy==1.24.3
EOF

# Install the simple requirements
pip install -r /app/simple_requirements.txt

echo "Basic dependencies installed successfully!"