from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import uvicorn
import os
from typing import Dict, Any
import tempfile
import random

app = FastAPI(
    title="SONETRA - AI Music Platform",
    description="Advanced music analysis and processing API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "SONETRA - AI Powered Music Platform API", "status": "running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "SONETRA API is running"}

@app.post("/api/analyze/track")
async def analyze_track(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Analyze a single audio track
    """
    try:
        # Mock analysis data for demonstration
        response = {
            'beats': [1.2, 2.4, 3.6, 4.8, 6.0, 7.2, 8.4, 9.6],
            'key': 'C',
            'scale': 'Major',
            'tempo': 128.5,
            'energy': 0.78,
            'spectral_centroid': 2150.5,
            'danceability': 0.82,
            'valence': 0.65,
            'loudness': -8.5,
            'acousticness': 0.15,
            'instrumentalness': 0.05,
            'liveness': 0.12,
            'speechiness': 0.08
        }
        
        return JSONResponse(content=response)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/transition/create")
async def create_transition(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
    style: str = "smooth"
):
    """
    Create transition between two tracks
    """
    try:
        # Create a mock audio response for demonstration
        # In a real implementation, this would process the audio files
        mock_audio_path = tempfile.mktemp(suffix='.wav')
        
        # Create a small mock audio file
        with open(mock_audio_path, 'wb') as f:
            f.write(b'mock audio data for transition')
        
        return FileResponse(
            mock_audio_path,
            media_type='audio/wav',
            filename='transition.wav'
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/style/transfer")
async def transfer_style(
    file: UploadFile = File(...),
    target_style: str = "electronic"
):
    """
    Apply style transfer to audio track
    """
    try:
        # Create a mock audio response for demonstration
        mock_audio_path = tempfile.mktemp(suffix='.wav')
        
        # Create a small mock audio file
        with open(mock_audio_path, 'wb') as f:
            f.write(b'mock audio data for style transfer')
        
        return FileResponse(
            mock_audio_path,
            media_type='audio/wav',
            filename='styled.wav'
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)