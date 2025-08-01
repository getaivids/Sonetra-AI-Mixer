from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import numpy as np
import torch
import librosa
from typing import Dict, Any, List
import json
from pathlib import Path
import tempfile
import asyncio

from models.detectors import BeatDetector
from models.analyzers import KeyAnalyzer, StyleAnalyzer
from core.transition_engine import TransitionEngine
from core.style_transfer import StyleTransferEngine
from utils.audio import load_audio, save_audio

app = FastAPI(
    title="Music AI Platform",
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

# Initialize models
beat_detector = BeatDetector()
key_analyzer = KeyAnalyzer()
style_analyzer = StyleAnalyzer()
transition_engine = TransitionEngine()
style_transfer = StyleTransferEngine()

@app.post("/api/analyze/track")
async def analyze_track(
    file: UploadFile = File(...)
) -> Dict[str, Any]:
    """
    Analyze a single audio track
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        
        # Load audio
        audio, sr = load_audio(tmp_path)
        
        # Run analysis
        beats = await beat_detector.detect_beats(audio)
        key, scale = await key_analyzer.analyze(audio)
        style_features = await style_analyzer._extract_style_features(audio)
        
        # Format response
        response = {
            'beats': beats.tolist(),
            'key': key,
            'scale': scale,
            'tempo': float(style_features['tempo']),
            'energy': float(style_features['rms_energy']),
            'spectral_centroid': float(style_features['spectral_centroid'])
        }
        
        return JSONResponse(content=response)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Cleanup
        Path(tmp_path).unlink()

@app.post("/transition/create")
async def create_transition(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
    style: str = "smooth",
    settings: Dict[str, Any] = None
) -> UploadFile:
    """
    Create transition between two tracks
    """
    try:
        # Save uploaded files temporarily
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp1:
            tmp1.write(await file1.read())
            path1 = tmp1.name
            
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp2:
            tmp2.write(await file2.read())
            path2 = tmp2.name
        
        # Load audio files
        audio1, sr = load_audio(path1)
        audio2, sr = load_audio(path2)
        
        # Create transition
        transition = await transition_engine.create_transition(
            audio1, audio2, style, settings)
        
        # Save transition
        output_path = tempfile.mktemp(suffix='.wav')
        save_audio(transition, sr, output_path)
        
        return FileResponse(
            output_path,
            media_type='audio/wav',
            filename='transition.wav'
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Cleanup
        Path(path1).unlink()
        Path(path2).unlink()
        Path(output_path).unlink()

@app.post("/style/transfer")
async def transfer_style(
    file: UploadFile = File(...),
    target_style: str = "electronic",
    settings: Dict[str, Any] = None
) -> UploadFile:
    """
    Apply style transfer to audio track
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        
        # Load audio
        audio, sr = load_audio(tmp_path)
        
        # Apply style transfer
        transferred = await style_transfer.transfer_style(
            audio, target_style, settings)
        
        # Save result
        output_path = tempfile.mktemp(suffix='.wav')
        save_audio(transferred, sr, output_path)
        
        return FileResponse(
            output_path,
            media_type='audio/wav',
            filename='styled.wav'
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Cleanup
        Path(tmp_path).unlink()
        Path(output_path).unlink() 