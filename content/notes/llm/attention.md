---
title: 注意力机制
date: 2026-05-21
tags: [llm, core]
summary: 通过 query/key/value 计算加权聚合。
sample: true
---

# 注意力机制 (Attention)

注意力把一个查询 (query) 与一组键 (keys) 比较，得到权重，再对值 (values) 加权求和。

它是 [[Transformer]] 的核心算子。自注意力即 query/key/value 都来自同一序列。
