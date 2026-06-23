---
title: "Building terminalboard — TensorBoard in your terminal, with an AI assistant"
date: 2026-06-16
locale: en
link: https://github.com/dongfangyixi/terminalboard
---

Just shipped a small project I'm pretty happy with: **terminalboard**, a TensorBoard viewer that lives entirely in your terminal — no browser, no X11, no `ssh -L` port forwarding.

The itch: checking training curves on a remote box usually means the `ssh -L 6006:localhost:6006` dance plus a browser tab — or giving up and `grep`-ing the logs. terminalboard reads the event files directly and draws everything as crisp Unicode/braille text, so a plain SSH session is all you need. (And it's just as nice locally.)

![terminalboard live dashboard in a terminal](/images/news/terminalboard/demo.gif)

## What it does

- **Every TensorBoard type, as terminal text** — scalar curves, text summaries, histograms (a heatmap *or* distribution bands), PR curves, and a runs × hyperparameters table. - **Built for comparison** — overlay multiple experiments with stable colors, smoothing, log-Y, zoom, a tag/experiment filter grammar, and a drill-down view with a value cursor. - **Chat with your runs** — press `a` and ask in plain English. The assistant sees your live view and all the log data, and it both *drives the dashboard* (filter, smooth, open a tag…) and *analyzes* results — "which run is overfitting?" Works with any LLM provider, and it stays off until you set it up. - **Light by default** — one small dependency (`plotext`) plus a self-contained, pure-Python event parser; the `tensorboard` library and the LLM extra are optional.

## Why I built it

I do most of my training on remote machines over SSH, and the browser-based workflow never fit that — I wanted to glance at live curves the same way I `tail` a log. Then I added the assistant so I could just *ask* "is this converging?" instead of squinting across six panels.

It's on [PyPI](https://pypi.org/project/terminalboard/) — `pip install terminalboard` — and MIT-licensed. Source on [GitHub](https://github.com/dongfangyixi/terminalboard). 