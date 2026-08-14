---
title: "terminalboard —— 纯终端的 TensorBoard，内置 AI 助手"
date: 2026-08-13
locale: zh
link: https://github.com/dongfangyixi/terminalboard
---

**terminalboard** 是一个完全活在终端里的 TensorBoard 查看器。`pip install terminalboard`，指向 logdir，训练曲线就以 Unicode/braille 文字实时画在任何 SSH 会话里。不需要浏览器，不需要 X11，不需要端口转发。

![terminalboard live dashboard in a terminal](/images/news/terminalboard/demo.gif)

在远程机器上训练的人都熟悉这个痛点：只想看一眼 val loss 还在不在降，而官方做法是 `ssh -L 6006:localhost:6006`，开浏览器标签页，等 web UI 加载出一个你只会盯九秒钟的仪表盘。很多时候我干脆放弃，直接去 grep 日志。

看一条曲线，本该像 `tail -f` 一样顺手。整个项目的设计目标就是这一句话。

所以 terminalboard 直接读 event 文件——自带一个纯 Python 的 TFRecord 解析器，`tensorboard` 包反而成了可选扩展——把所有 TensorBoard 类型都画成文字：标量曲线、直方图（热力图或分位数带）、文本摘要、PR 曲线，还有一张实验 × 超参数对照表。多实验叠加时每条曲线的配色保持稳定，平滑、对数 Y 轴、缩放、带值游标的钻取视图都有，外加一套小巧的过滤语法（`train/*loss* !aux` 的行为和你猜的一样）。

我最喜欢的部分：按 `a`，跟你的实验聊天。

助手能看到你当前的视图和全部日志数据，回答问题的**同时**直接操作面板——说"只看验证集 loss，加平滑"，过滤真的会被应用；问"哪个实验在过拟合？"，会得到一段训练/验证对比。通过 LiteLLM 可以接任意提供商，而且便宜的小模型在这个场景下完全够用。不配置就不会启用，动作走类型化白名单——碰不到 shell，碰不到文件。有一点要老实说清：请求会把标签名和指标摘要发给提供商，而标签名可能暴露架构细节。介意的话接本地 Ollama 模型，数据不出机器。

默认安装只有一个轻量依赖（`plotext`）。MIT 协议，已发布到 [PyPI](https://pypi.org/project/terminalboard/)；不想安装的话 `uvx terminalboard <logdir>` 就能直接跑。源码在 [GitHub](https://github.com/dongfangyixi/terminalboard)。

接下来的计划：让助手按需拉取日志数据的 agent 循环，以及一个非交互式的 `--analyze` 报告。
