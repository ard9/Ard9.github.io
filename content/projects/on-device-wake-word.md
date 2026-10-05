---
title: On-device wake-word detection
description: A low-latency neural wake-word engine with few-shot custom phrases, shipped to Android in the Zigap app.
date: 2025-10-01
areas: [speech-audio]
tags: [Wake word, Few-shot learning, TFLite, ONNX, Android]
highlights:
  - value: 5M+
    label: training samples
  - value: 4,300+
    label: natural speakers
  - value: Few-shot
    label: custom trigger phrases
featured: true
status: Shipped
---

## The problem

A wake word has to run all the time, on a phone, without draining the battery, and it has to
fire for thousands of different voices while ignoring everything else.

## What I built

- A custom low-latency neural network designed for always-on detection.
- A training set of more than 5 million balanced samples from over 4,300 natural speakers.
- A few-shot learning engine so users can define their own trigger phrase.
- Export to TFLite and ONNX and integration into the Zigap Android app, with high accuracy at minimal power draw.

## Notes

_Add architecture diagrams, metrics and lessons learned here._
