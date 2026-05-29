---
title: Transformer
date: 2026-05-21
tags: [llm, architecture]
summary: 序列建模的主流架构，核心是自注意力。
sample: true
---

# Transformer

Transformer 用[[注意力机制]]替代了循环结构，使序列内的依赖可以并行计算。

## 关键组件

- 多头自注意力 (Multi-head Self-Attention)
- 前馈网络 (FFN)
- 残差连接与 LayerNorm

```python
def scaled_dot_product_attention(q, k, v):
    scores = q @ k.transpose(-2, -1) / (q.shape[-1] ** 0.5)
    weights = scores.softmax(dim=-1)
    return weights @ v
```

下游的对齐方法见 [[RLHF]]；它的表示能力也被[[双塔模型]]用于推荐召回。

## 结构示意

![[transformer-block.svg|Transformer 编码块]]

也支持标准 Markdown 图片：`![alt](/assets/your-image.png)`（图片放 `public/assets/` 即可）。
