import pytest
import numpy as np
import torch
from models.analyzers import KeyAnalyzer
from evaluation.metrics import KeyEvaluator

@pytest.fixture
def key_analyzer():
    return KeyAnalyzer()

@pytest.fixture
def evaluator():
    return KeyEvaluator()

@pytest.fixture
def sample_audio():
    # Generate synthetic audio in C major
    sr = 22050
    duration = 5  # seconds
    t = np.linspace(0, duration, int(sr * duration))
    
    # C major chord (C4, E4, G4)
    c4 = np.sin(2 * np.pi * 261.63 * t)
    e4 = np.sin(2 * np.pi * 329.63 * t)
    g4 = np.sin(2 * np.pi * 392.00 * t)
    
    audio = (c4 + e4 + g4) / 3
    return audio

async def test_key_detection(key_analyzer, evaluator, sample_audio):
    # Detect key
    key, scale = await key_analyzer.analyze(sample_audio)
    
    # Create predictions tensor
    predictions = torch.zeros(1, 14)
    predictions[0, 0] = 1  # C
    predictions[0, 12] = 1  # major
    
    # Create ground truth tensor
    ground_truth = torch.tensor([[0, 0]])  # C major
    
    # Evaluate detection
    metrics = evaluator.evaluate(predictions, ground_truth)
    
    assert metrics['key_accuracy'] == 1.0
    assert metrics['scale_accuracy'] == 1.0
    assert metrics['weighted_accuracy'] > 0.9

async def test_relative_key_accuracy(key_analyzer, evaluator):
    # Test relative key relationships
    predictions = torch.zeros(1, 14)
    predictions[0, 7] = 1  # G
    predictions[0, 12] = 1  # major
    
    ground_truth = torch.tensor([[0, 0]])  # C major
    
    metrics = evaluator.evaluate(predictions, ground_truth)
    assert metrics['relative_accuracy'] > 0.8  # G is close to C on circle of fifths

async def test_empty_audio(key_analyzer):
    with pytest.raises(ValueError):
        await key_analyzer.analyze(np.zeros(0)) 