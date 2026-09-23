"""Original Pyton Knight sound design. Standard library only; no samples.

All frequencies, note order and envelopes below were composed for V5.
Circular echoes and periodic drones make the ambient WAV sample-continuous.
"""
from array import array
from pathlib import Path
import math
import wave

RATE = 22050
OUT = Path(__file__).resolve().parents[2] / 'assets' / 'audio'


def save(name, samples, peak=0.65):
    scale = peak * 32767 / max(max(abs(x) for x in samples), 0.001)
    pcm = array('h', (round(x * scale) for x in samples))
    if __import__('sys').byteorder != 'little':
        pcm.byteswap()
    with wave.open(str(OUT / (name + '.wav')), 'wb') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        wav.writeframes(pcm.tobytes())


def tone(samples, start, duration, freq, gain, bell=False):
    for i in range(round(duration * RATE)):
        t = i / RATE
        envelope = math.sin(math.pi * t / duration) ** 2
        if bell:
            envelope *= math.exp(-3 * t / duration)
        value = math.sin(math.tau * freq * t) + .18 * math.sin(math.tau * freq * 2 * t)
        samples[(round(start * RATE) + i) % len(samples)] += gain * envelope * value


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    seconds = 32
    music = [0.0] * (RATE * seconds)
    # Slow, quiet D/A bed; exact whole cycles at the loop seam.
    for i in range(len(music)):
        t = i / RATE
        music[i] = sum(.10 * math.sin(math.tau * round(f * seconds) / seconds * t)
                       for f in (73.416, 110))
    chords = [(146.832, 174.614, 220), (130.813, 174.614, 220),
              (130.813, 164.814, 195.998), (146.832, 195.998, 220)]
    for bar in range(8):
        for f in chords[bar % 4]:
            tone(music, bar * 4, 6, f, .12)
    for beat, note in [(1, 440), (5, 523.251), (9, 349.228), (13, 391.995),
                       (17, 440), (21, 349.228), (25, 293.665), (29, 329.628)]:
        tone(music, beat, 2.8, note, .13, True)
    dry = music[:]
    for delay, gain in [(0.23, .15), (.47, .08)]:
        offset = round(delay * RATE)
        for i in range(len(music)):
            music[i] += gain * dry[(i - offset) % len(music)]
    save('ambient', music)
    cues = {
        'interact': [(0, .18, 330), (.07, .16, 440)],
        'collect': [(0, .22, 659.255), (.10, .30, 880)],
        'mechanism': [(0, .20, 146.832), (.10, .22, 220)],
        'portal': [(0, .36, 293.665), (.12, .40, 440), (.24, .40, 587.33)],
        'damage': [(0, .22, 164.814), (.09, .27, 110)],
        'complete': [(0, .45, 293.665), (.18, .45, 349.228), (.36, .65, 440)],
    }
    for name, notes in cues.items():
        data = [0.0] * round((max(t + d for t, d, _ in notes) + .03) * RATE)
        for t, d, f in notes:
            tone(data, t, d, f, .4, True)
        save(name, data, .48)


if __name__ == '__main__':
    main()
