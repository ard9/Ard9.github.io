"""Turn wideband speech into telephone-quality (narrowband) audio.

Usage:
    python narrowband.py input.wav output.wav [--seed 0] [--out-sr 16000]

Steps: resample to 8 kHz, band-limit to the telephone passband, add noise,
apply a G.711-style mu-law round trip, then optionally resample back up.
Only needs numpy and scipy.
"""
import argparse

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, resample_poly, sosfiltfilt

MU = 255


def resample(x: np.ndarray, sr_in: int, sr_out: int) -> np.ndarray:
    if sr_in == sr_out:
        return x
    g = np.gcd(sr_in, sr_out)
    return resample_poly(x, sr_out // g, sr_in // g)


def bandpass(x: np.ndarray, sr: int, low: float, high: float, order: int = 6) -> np.ndarray:
    sos = butter(order, [low, high], btype="bandpass", fs=sr, output="sos")
    return sosfiltfilt(sos, x)


def add_noise(x: np.ndarray, snr_db: float, rng: np.random.Generator) -> np.ndarray:
    p_signal = np.mean(x**2) + 1e-12
    p_noise = p_signal / (10 ** (snr_db / 10))
    return x + rng.standard_normal(len(x)) * np.sqrt(p_noise)


def mulaw_roundtrip(x: np.ndarray, mu: int = MU) -> np.ndarray:
    """Compress, quantise to 8 bits, and expand again, like a G.711 codec."""
    x = np.clip(x, -1.0, 1.0)
    y = np.sign(x) * np.log1p(mu * np.abs(x)) / np.log1p(mu)
    codes = np.round((y + 1) / 2 * mu)  # integers 0..255
    y = 2 * codes / mu - 1
    return np.sign(y) * np.expm1(np.abs(y) * np.log1p(mu)) / mu


def to_narrowband(x: np.ndarray, sr: int, rng: np.random.Generator, out_sr: int = 16000) -> np.ndarray:
    x = resample(x, sr, 8000)
    x = bandpass(x, 8000, low=rng.uniform(200, 400), high=rng.uniform(3000, 3600))
    x = add_noise(x, snr_db=rng.uniform(15, 35), rng=rng)
    x = x / (np.max(np.abs(x)) + 1e-9) * rng.uniform(0.3, 0.9)  # random level
    x = mulaw_roundtrip(x)
    return resample(x, 8000, out_sr).astype(np.float32)


def read_wav(path: str):
    sr, x = wavfile.read(path)
    if x.dtype.kind == "i":
        x = x / float(np.iinfo(x.dtype).max)
    elif x.dtype.kind == "u":
        x = (x - 128) / 128.0
    if x.ndim > 1:
        x = x.mean(axis=1)
    return x.astype(np.float64), sr


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--seed", type=int, default=None)
    ap.add_argument("--out-sr", type=int, default=16000)
    args = ap.parse_args()

    audio, sr = read_wav(args.input)
    y = to_narrowband(audio, sr, np.random.default_rng(args.seed), out_sr=args.out_sr)
    wavfile.write(args.output, args.out_sr, y)
    print(f"Wrote {args.output} ({len(y) / args.out_sr:.2f} s at {args.out_sr} Hz)")
