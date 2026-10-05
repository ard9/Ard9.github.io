---
title: Multi-agent SQL generation with a judge
description: An LLM system where generator and judge agents cooperate to produce more accurate SQL, served with vLLM on H100s.
date: 2025-12-01
areas: [llm-agents, ops]
tags: [Multi-agent, Text-to-SQL, LoRA / QLoRA, LLaMA, vLLM]
featured: true
---

## Overview

- Architected a multi-agent "judge" system to improve the accuracy and reliability of text-to-SQL.
- Fine-tuned LLaMA-family models with LoRA/QLoRA for the domain.
- Deployed inference with vLLM and NVIDIA Triton on dual H100 GPUs.
- Related: [RAG for enterprise documents](/projects/enterprise-rag).
