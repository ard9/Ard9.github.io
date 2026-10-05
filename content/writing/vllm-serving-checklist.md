---
title: Serving an LLM with vLLM, a short checklist
description: The settings I check first when putting a model behind vLLM's OpenAI-compatible server on one or more GPUs.
date: 2026-04-05
type: note
areas: [ops, llm-agents]
tags: [vLLM, LLMOps, GPU, Inference]
level: Intermediate
---

vLLM gets a model serving quickly, but the defaults are not always what production needs.
These are the settings I look at first.

## Start the server

vLLM ships an OpenAI-compatible HTTP server, so existing clients work unchanged:

```bash
vllm serve meta-llama/Llama-3.1-8B-Instruct \
  --tensor-parallel-size 2 \
  --gpu-memory-utilization 0.90 \
  --max-model-len 8192
```

## The checklist

1. **Tensor parallelism.** `--tensor-parallel-size` splits the model across GPUs. Use it when
   the model doesn't fit on one card, or when you need lower latency per request.
2. **GPU memory budget.** `--gpu-memory-utilization` is the fraction of each GPU vLLM may use for
   weights and KV cache. Leave headroom if anything else runs on the same GPU.
3. **Context length.** `--max-model-len` caps the sequence length. A shorter limit leaves more
   room in the KV cache for concurrent requests.
4. **Concurrency.** `--max-num-seqs` limits how many sequences are batched together. Raise it
   for throughput, lower it to protect latency.
5. **Prefix caching.** Reusing the KV cache for shared prompt prefixes helps a lot with long
   system prompts and RAG templates. Recent vLLM versions turn it on by default; on older ones,
   pass `--enable-prefix-caching`.

## Before calling it production

- Put a reverse proxy in front (Nginx in my setup) for TLS, routing and rate limits.
- Track latency percentiles and tokens per second in a dashboard, not just averages.
- Load-test with realistic prompt and output lengths; short synthetic prompts flatter every server.
