---
title: ReAct Agent
date: 2026-05-24
tags: [agent]
summary: 交替进行推理 (Reason) 与行动 (Act) 的智能体范式。
sample: true
---

# ReAct Agent

ReAct 让模型交替输出「思考」与「行动」，行动可调用工具并把观察结果喂回。

- 底座是 [[Transformer]] 类语言模型
- 决策质量可用 [[RLHF]] 思路优化
- 长程任务依赖 [[Agent 记忆]]
