---
title: "发布 terminalboard — 纯终端 TensorBoard 查看器，内置 AI 助手"
date: 2026-06-16
locale: zh
link: https://github.com/dongfangyixi/terminalboard
---

刚发布了一个自己挺满意的小项目：**terminalboard**，一个完全活在终端里的TensorBoard 查看器 — 不需要浏览器、不需要 X11、不需要 `ssh -L` 端口转发。

痛点很简单：在远程机器上查看训练曲线，通常得折腾一遍`ssh -L 6006:localhost:6006` 再加一个浏览器标签页 — 要么干脆放弃，直接 `grep` 日志。terminalboard 直接读取 event 文件，用清晰的 Unicode/braille 文字绘制一切，一个普通 SSH 会话就够了。（本地用也一样舒服。）

![terminalboard live dashboard in a terminal](/images/news/terminalboard/demo.gif)

## 功能概览

- **所有 TensorBoard 类型，终端文字呈现** — 标量曲线、文本摘要、直方图（热力图*或*分布带）、PR 曲线、实验 × 超参数对照表。- **为对比而生** — 多实验叠加，稳定配色，平滑、对数Y轴、缩放，标签/实验过滤语法，以及带值游标的钻取视图。- **跟你的实验对话** — 按 `a` 键用自然语言提问。助手能同时*操控面板*（过滤、平滑、打开标签…）和*分析结果* — "哪个实验在过拟合？" 支持任意 LLM 提供商，不配置就不会启用。- **默认轻量** — 仅一个轻量依赖 (`plotext`) 加上自包含的纯 Python event 解析器；`tensorboard` 库和 LLM 扩展都是可选的。

## 为什么做这个

我的训练大多在远程机器上跑，浏览器式的工作流一直不太对劲 — 我想要像 `tail`日志那样扫一眼实时曲线。后来加上助手功能，就不用在六个面板间来回找，直接问"这个收敛了吗？"就行。

已发布到 [PyPI](https://pypi.org/project/terminalboard/) —`pip install terminalboard` — MIT 协议开源。源码在[GitHub](https://github.com/dongfangyixi/terminalboard)。