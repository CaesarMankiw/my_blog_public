---
title: RLHF
date: 2026-05-22
tags: [llm, alignment]
summary: 基于人类反馈的强化学习，用于对齐语言模型。
sample: true
---

# RLHF (Reinforcement Learning from Human Feedback)

RLHF 在预训练的 [[Transformer]] 之上，用奖励模型 + 策略优化让模型输出更符合人类偏好。

典型流程：监督微调 → 训练奖励模型 → PPO/DPO 优化策略。这一思路也常被 [[ReAct Agent]] 借鉴来优化决策。
