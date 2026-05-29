---
title: Agent 记忆
date: 2026-05-25
tags: [agent, memory]
summary: 智能体的短期/长期记忆与检索。
sample: true
---

# Agent 记忆 (Memory)

记忆让 [[ReAct Agent]] 跨步骤、跨会话保持上下文。

常见做法：把历史写入向量库，按相关性检索——这和 [[双塔模型]] 的召回思想相通。
