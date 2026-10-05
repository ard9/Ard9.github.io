---
title: Simulating telephone audio for ASR training
description: Turn clean wideband speech into realistic 8 kHz phone audio with resampling, band-limiting, noise and mu-law companding.
date: 2026-03-10
type: tutorial
areas: [speech-audio]
series: Speech data pipelines
part: 1
tags: [ASR, Data augmentation, Python, Telephony]
level: Intermediate
files:
  - label: narrowband.py
    path: /files/narrowband.py
    note: Complete script from this tutorial
---

Most speech corpora are recorded at 16 kHz or higher. Phone calls are not: they arrive at
8 kHz, squeezed through a narrow passband and an 8-bit codec. A model trained only on clean
wideband audio loses a lot of accuracy on real calls. One fix is to make your training data
sound like a phone line.

## What a phone line does to audio

A classic G.711 channel does three things:

1. **Samples at 8 kHz.** Nothing above 4 kHz (the Nyquist frequency) survives.
2. **Band-limits to roughly 300–3400 Hz.** Low rumble and high fricative energy are cut.
3. **Compands to 8 bits** with μ-law (North America, Japan) or A-law (most other places).

μ-law compresses the signal logarithmically before quantising, which gives quiet sounds more
of the available codes:

$$
F(x) = \operatorname{sgn}(x)\,\frac{\ln(1 + \mu |x|)}{\ln(1 + \mu)}, \qquad \mu = 255
$$

## The pipeline

We'll chain four steps and randomise each one, so the model sees many slightly different
"phone lines" instead of one.

### 1. Resample to 8 kHz

Polyphase resampling applies an anti-aliasing filter for us:

```python
import numpy as np
from scipy.signal import resample_poly

def resample(x, sr_in, sr_out):
    g = np.gcd(sr_in, sr_out)
    return resample_poly(x, sr_out // g, sr_in // g)
```

### 2. Band-limit

A zero-phase Butterworth band-pass. Jittering the cut-offs imitates different handsets
and networks:

```python
from scipy.signal import butter, sosfiltfilt

def bandpass(x, sr, low, high, order=6):
    sos = butter(order, [low, high], btype="bandpass", fs=sr, output="sos")
    return sosfiltfilt(sos, x)
```

### 3. Add noise at a target SNR

The signal-to-noise ratio in decibels is

$$
\text{SNR}_{\text{dB}} = 10 \log_{10} \frac{P_{\text{signal}}}{P_{\text{noise}}}
$$

so for a chosen SNR the noise power is $P_{\text{noise}} = P_{\text{signal}} / 10^{\text{SNR}/10}$:

```python
def add_noise(x, snr_db, rng):
    p_signal = np.mean(x**2) + 1e-12
    p_noise = p_signal / (10 ** (snr_db / 10))
    return x + rng.standard_normal(len(x)) * np.sqrt(p_noise)
```

White noise is a start. For better results, mix in real recordings of offices, streets
and cars.

### 4. μ-law round trip

Compress, quantise to 256 levels, then expand back. The quantisation step is where the
codec's characteristic graininess comes from:

```python
MU = 255

def mulaw_roundtrip(x, mu=MU):
    x = np.clip(x, -1.0, 1.0)
    y = np.sign(x) * np.log1p(mu * np.abs(x)) / np.log1p(mu)
    codes = np.round((y + 1) / 2 * mu)      # integers 0..255
    y = 2 * codes / mu - 1
    return np.sign(y) * np.expm1(np.abs(y) * np.log1p(mu)) / mu
```

## Putting it together

```python
def to_narrowband(x, sr, rng, out_sr=16000):
    x = resample(x, sr, 8000)
    x = bandpass(x, 8000, low=rng.uniform(200, 400), high=rng.uniform(3000, 3600))
    x = add_noise(x, snr_db=rng.uniform(15, 35), rng=rng)
    x = x / (np.max(np.abs(x)) + 1e-9) * rng.uniform(0.3, 0.9)
    x = mulaw_roundtrip(x)
    return resample(x, 8000, out_sr).astype(np.float32)
```

The last line resamples back to 16 kHz because many ASR models expect that rate.
Upsampling does not bring the lost frequencies back; the audio still *sounds* like a phone
call, it just has the sample rate your model wants.

From the command line:

```bash
python narrowband.py clean.wav phone.wav --seed 7
```

## Tips from production

- **Mix, don't replace.** Train on both wideband and simulated narrowband audio so the model keeps working on clean input.
- **Validate on real calls.** Simulation narrows the gap but doesn't close it. Keep a test set of genuine phone recordings.
- **Go further when you need to.** Real codecs (AMR, Opus at low bitrates), packet loss and echo are the next layers of realism.
