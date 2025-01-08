# examples/basic_mixing.py

from src.spotify_mixer.core.mixer import Mixer
from src.core.mixer import Mixer

mixer = Mixer()
output = mixer.mix_tracks(
    "https://open.spotify.com/track/track_id_1",
    "https://open.spotify.com/track/track_id_2"
)
print(f"Mixed track saved to: {output}")