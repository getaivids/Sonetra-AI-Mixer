import asyncio
from pathlib import Path
from core.genre_fusion_platform import GenreFusionPlatform
from utils.audio import AudioUtils
from config.settings import get_default_mix_settings

async def run_demo():
    # Initialize platform
    platform = GenreFusionPlatform()
    
    # Load audio files
    audio_dir = Path('demo_audio')
    tracks = []
    
    for audio_file in audio_dir.glob('*.wav'):
        audio, sr = AudioUtils.load_audio(str(audio_file))
        tracks.append(audio)
    
    print(f"Loaded {len(tracks)} tracks")
    
    # Get default settings
    mix_settings = get_default_mix_settings()
    
    # Process mix
    print("Processing mix...")
    mixed_audio = await platform.process_mix(tracks, mix_settings)
    
    # Save result
    output_path = 'demo_output/mixed_track.wav'
    AudioUtils.save_audio(mixed_audio, output_path)
    print(f"Mix saved to {output_path}")

if __name__ == "__main__":
    asyncio.run(run_demo()) 