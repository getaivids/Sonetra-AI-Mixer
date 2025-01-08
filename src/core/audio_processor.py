# src/spotify_mixer/core/audio_processor.py

import numpy as np
import librosa
from typing import Tuple, Dict, Any

class AudioProcessor:
    """Handles audio analysis and processing"""
    
    def __init__(self):
        self.sr = 44100  # Sample rate
        
    def analyze_audio(self, audio_path: str) -> Dict[str, Any]:
        """Analyze audio file and extract features"""
        # Load audio file
        y, sr = librosa.load(audio_path, sr=self.sr)
        
        # Extract features
        tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
        harmonic, percussive = librosa.effects.hpss(y)
        
        return {
            'tempo': tempo,
            'beats': beats,
            'harmonic': harmonic,
            'percussive': percussive,
            'duration': len(y) / sr
        }
    
    def adjust_tempo(self, audio: np.ndarray, current_tempo: float, 
                    target_tempo: float) -> np.ndarray:
        """Adjust audio tempo"""
        if current_tempo == target_tempo:
            return audio
            
        rate = target_tempo / current_tempo
        return librosa.effects.time_stretch(audio, rate)
