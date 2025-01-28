import pytest
import numpy as np
import torch
from core.style_transfer import StyleTransferEngine
from models.analyzers import StyleAnalyzer

@pytest.fixture
def style_transfer():
    return StyleTransferEngine()

@pytest.fixture
def style_analyzer():
    return StyleAnalyzer()

@pytest.fixture
def sample_audio():
    # Generate sample audio
    sr = 22050
    duration = 5
    t = np.linspace(0, duration, int(sr * duration))
    
    # Create a simple melody
    melody = np.sin(2 * np.pi * 440 * t)  # A4
    return melody

async def test_style_transfer(style_transfer, style_analyzer, sample_audio):
    # Original style features
    original_features = await style_analyzer._extract_style_features(sample_audio)
    
    # Apply style transfer
    transferred = await style_transfer.transfer_style(
        sample_audio,
        target_style="electronic"
    )
    
    # Analyze transferred style
    transferred_features = await style_analyzer._extract_style_features(transferred)
    
    # Check if style has changed while preserving length
    assert len(transferred) == len(sample_audio)
    assert abs(transferred_features['tempo'] - original_features['tempo']) < 10
    assert transferred_features['spectral_centroid'] != original_features['spectral_centroid']

async def test_multiple_styles(style_transfer, sample_audio):
    styles = ["electronic", "rock", "jazz"]
    results = []
    
    for style in styles:
        transferred = await style_transfer.transfer_style(
            sample_audio,
            target_style=style
        )
        results.append(transferred)
    
    # Check that different styles produce different results
    for i in range(len(styles)):
        for j in range(i + 1, len(styles)):
            correlation = np.corrcoef(results[i], results[j])[0, 1]
            assert correlation < 0.95  # Results should be different

async def test_invalid_style(style_transfer, sample_audio):
    with pytest.raises(ValueError):
        await style_transfer.transfer_style(
            sample_audio,
            target_style="invalid_style"
        ) 