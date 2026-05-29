---
title: 双塔模型
date: 2026-05-19
tags: [recsys, retrieval]
summary: 用户塔与物品塔分别编码，向量内积召回。
sample: true
---

# 双塔模型 (Two-Tower)

用户塔和物品塔各自把输入编码成向量，用内积/余弦相似度做大规模召回。

- 物品向量可离线建索引 (ANN)
- 编码器常借鉴 [[Transformer]] 的表示能力
- 是 [[协同过滤]] 在深度学习时代的延续
