---
title: Sound classification with YAMNet transfer learning
description: Reuse a pretrained audio-event model to build a cat-versus-dog sound classifier, then export a model that reads WAV files directly.
date: 2026-01-12
topic: Audio classification
tags: [TensorFlow, Transfer learning, YAMNet, ESC-50]
level: Beginner
notebook: /notebooks/transfer_learning_audio.ipynb
source:
  label: the TensorFlow audio tutorials
  url: https://www.tensorflow.org/tutorials/audio/transfer_learning_audio
---

**YAMNet** is a pretrained network that recognises 521 everyday sound events, from laughter to
sirens. Its internal embeddings are a great starting point for your own audio classifier,
even with a small dataset.

## What you'll do

1. Load YAMNet from TensorFlow Hub and run inference on a clip.
2. Take a subset of the ESC-50 environmental sound dataset (cats and dogs).
3. Extract a YAMNet embedding for each audio frame.
4. Train a small classifier on top of those embeddings.
5. Export a single model that takes a raw WAV file and returns a label.

## How YAMNet sees audio

YAMNet uses a MobileNetV1 backbone. It splits the waveform into frames of about one second,
computes a log-mel spectrogram, and produces an embedding plus class scores for each frame.
Transfer learning means freezing all of that and only training the last layer for your classes.

Open the notebook with the button above to run every step in Colab, free GPU included.
