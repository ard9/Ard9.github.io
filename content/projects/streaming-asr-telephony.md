---
title: Streaming Persian ASR for telephony
description: Sub-second streaming speech recognition trained on 40,000+ hours of Persian, made robust to narrowband phone audio.
date: 2025-07-01
tags: [Speech, ASR, Streaming, PyTorch]
featured: true
status: In production
files:
  - label: Narrowband simulation script
    path: /files/narrowband.py
    note: Python, numpy + scipy
---

## Overview

Phone calls are hard for ASR: 8 kHz audio, codec artefacts, background noise. This project
covers the full pipeline, from data to a streaming API.

- Fine-tuned ASR models on 40,000+ hours of Persian speech with PyTorch and Hugging Face.
- Built a telephony simulation pipeline that converted 30,000+ hours of wideband audio to narrowband.
  A simplified version of the idea is in the [narrowband tutorial](/tutorials/telephony-narrowband-simulation).
- Transcribed 10,000+ hours of real phone calls to close the gap between simulated and real data.
- Served it as a real-time WebSocket API with FastAPI, with sub-second latency.
