import pytest
import numpy as np
import torch
from models.detectors import BeatDetector
from evaluation.metrics import BeatEvaluator

@pytest.fixture
def beat_detector():
    return BeatDetector()

@pytest.fixture
def evaluator():
    return BeatEvaluator()

@pytest.fixture
def sample_audio():
    # Generate synthetic audio with known beat positions
    sr = 22050
    duration = 10  # seconds
    t = np.linspace(0, duration, int(sr * duration))
    
    # Create periodic beats at 120 BPM
    bpm = 120
    beat_period = 60 / bpm
    beats = np.arange(0, duration, beat_period)
    
    # Generate click track
    audio = np.zeros_like(t)
    for beat in beats:
        idx = int(beat * sr)
        if idx < len(audio):
            audio[idx:idx+100] = np.sin(2 * np.pi * 1000 * t[:100])
    
    return audio, beats

async def test_beat_detection(beat_detector, evaluator, sample_audio):
    audio, ground_truth = sample_audio
    
    # Detect beats
    detected_beats = await beat_detector.detect_beats(audio)
    
    # Evaluate detection
    scores = evaluator.evaluate(detected_beats, ground_truth * 22050)
    
    # Check metrics
    assert scores['f_measure'] > 0.8
    assert scores['tempo_accuracy'] > 0.9
    assert scores['phase_alignment'] > 0.8

async def test_empty_audio(beat_detector):
    audio = np.zeros(22050)
    beats = await beat_detector.detect_beats(audio)
    assert len(beats) == 0

async def test_short_audio(beat_detector):
    # Test with audio shorter than one beat period
    audio = np.random.randn(11025)  # 0.5 seconds
    beats = await beat_detector.detect_beats(audio)
    assert len(beats) <= 1 