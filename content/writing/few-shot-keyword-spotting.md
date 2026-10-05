---
title: Few-shot keyword spotting in any language
description: Train a custom keyword detector from just five recordings, using an embedding model trained on the Multilingual Spoken Words Corpus.
date: 2026-02-01
type: tutorial
areas: [speech-audio]
tags: [Wake word, Few-shot learning, TensorFlow, MSWC]
level: Beginner
notebook: /notebooks/multilingual_kws_intro_tutorial.ipynb
source:
  label: the Harvard Edge multilingual_kws tutorial
  url: https://github.com/harvard-edge/multilingual_kws
---

Keyword spotting is the problem behind every "Hey…" assistant: listen continuously and react
only to one word. Collecting thousands of recordings per keyword is expensive, especially in
languages with little public data. This notebook shows a shortcut.

## The idea

Train a large **embedding model** once, on many keywords across many languages. It learns to
map one second of speech to a vector where the same word lands close together. To add a new
keyword, you fine-tune on top of those embeddings with only **five examples**.

## Two papers behind it

- **Multilingual Spoken Words Corpus (MSWC)**, NeurIPS Datasets & Benchmarks 2021: a CC-BY
  dataset of one-second spoken words in 50 languages, built by forced alignment of
  crowd-sourced speech.
- **Few-Shot Keyword Spotting in Any Language**, Interspeech 2021: the transfer-learning
  method used in the notebook.

## What the notebook covers

1. Import the modules.
2. Download a pretrained embedding model and sample data.
3. Train a five-shot keyword model and test it on streaming audio.
4. Optionally, visualise the embedding space.

## Why it matters for wake words

The same recipe is a good baseline for custom trigger phrases on devices: a strong, shared
embedding plus a tiny per-user head. Open the notebook in Colab with the button above and
try a word in your own language.
