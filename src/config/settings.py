from typing import Dict, Any

# Audio processing settings
AUDIO_SETTINGS = {
    'sample_rate': 22050,
    'hop_length': 512,
    'n_fft': 2048,
    'n_mels': 128
}

# Genre matching settings
GENRE_MATCH_SETTINGS = {
    'min_compatibility_score': 0.6,
    'genre_weight': 0.4,
    'harmony_weight': 0.3,
    'style_weight': 0.3
}

# Transition settings
TRANSITION_SETTINGS = {
    'min_transition_length': 2.0,  # seconds
    'max_transition_length': 8.0,  # seconds
    'crossfade_type': 'sigmoid',
    'beat_align': True
}

# Neural processing settings
NEURAL_SETTINGS = {
    'batch_size': 32,
    'device': 'cuda',
    'model_path': 'models/weights/'
}

def get_default_mix_settings() -> Dict[str, Any]:
    """Get default mixing settings"""
    return {
        'audio': AUDIO_SETTINGS,
        'genre_match': GENRE_MATCH_SETTINGS,
        'transition': TRANSITION_SETTINGS,
        'neural': NEURAL_SETTINGS
    } 