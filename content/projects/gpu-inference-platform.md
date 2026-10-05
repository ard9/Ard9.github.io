---
title: GPU inference platform for speech and LLMs
description: The infrastructure behind the ASR, TTS and LLM services, from KVM virtual machines with GPU passthrough to monitoring dashboards.
date: 2026-02-01
areas: [ops]
tags: [TensorRT, NVIDIA Triton, vLLM, KVM, Docker, Nginx, MLflow, Grafana, Kibana]
featured: true
highlights:
  - value: 40%
    label: lower system-wide latency
  - value: 2 × H100
    label: multi-GPU inference
---

## What it does

One platform serves every model in production: speech recognition, text-to-speech and
large language models.

## Building blocks

- **Compute:** KVM virtualisation with GPU passthrough, with isolated VMs for ASR, TTS and training workloads, built from scratch.
- **Model serving:** TensorRT compilation (a 40% system-wide latency reduction), NVIDIA Triton, and vLLM on dual H100 GPUs.
- **Traffic:** Nginx as a reverse proxy routing requests to the right service; real-time WebSocket streaming with FastAPI.
- **Batch work:** an asynchronous worker-queue architecture (RabbitMQ, Redis, Celery) for bulk audio processing.
- **Tracking:** MLflow for experiments, metrics and the model registry.
- **Observability:** Grafana dashboards for live service health and Kibana (ELK) for centralised logs.
- **Delivery:** Git-based CI/CD and automated deployments.
