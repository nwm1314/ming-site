---
title: "Agent 工作流也需要小循环"
description: "把一次很大的自动化拆成可观察、可回滚、可复用的几个小步骤。"
publishDate: 2026-09-01
draft: false
category: "AI"
tags: ["ai", "workflow", "notes"]
featured: false
toc: true
---

一个好用的 Agent 工作流不应该只追求“一句话完成所有事”。

## 让中间结果可见

先收集，再判断，最后执行。每一步都有清楚的输入和输出，出错时才知道从哪里接着来。
