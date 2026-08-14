---
title: "terminalboard — TensorBoard in your terminal, with an AI assistant"
date: 2026-08-13
locale: en
link: https://github.com/dongfangyixi/terminalboard
---

**terminalboard** is a TensorBoard viewer that lives entirely in your terminal. `pip install terminalboard`, point it at a logdir, and your live training curves draw themselves as Unicode/braille text in any SSH session. No browser, no X11, no port forwarding.

![terminalboard live dashboard in a terminal](/images/news/terminalboard/demo.gif)

The itch is familiar to anyone who trains on remote boxes: you want to know whether val loss is still going down, and the official answer is `ssh -L 6006:localhost:6006`, a browser tab, and a web UI loading a dashboard you'll look at for nine seconds. Most days I gave up and grep-ed the event logs instead.

Checking a curve should feel like `tail -f`. That's the whole design brief.

So terminalboard reads the event files directly — a self-contained pure-Python TFRecord parser; the `tensorboard` package itself is an optional extra — and renders every TensorBoard type as text: scalar curves, histograms as heatmaps or percentile bands, text summaries, PR curves, and a runs × hyperparameters table. Multi-experiment overlays keep stable colors, and you get smoothing, log-Y, zoom, a drill-down cursor, and a small filter grammar (`train/*loss* !aux` does what you'd hope).

The part I like most: press `a` and chat with your runs.

The assistant sees your live view plus the log data, and it answers *and* drives the dashboard in the same turn — "show only validation losses, smoothed" actually applies the filter; "which run is overfitting?" gets you a train-vs-val comparison. Any provider works via LiteLLM, and a cheap small model is genuinely enough here. It stays off until you configure it, and its actions are a typed whitelist — no shell, no files. One honest caveat: queries send your tag names and metric summaries to the provider, and tag names can leak architecture details. If that matters, point it at a local Ollama model and nothing leaves the machine.

The default install is one small dependency (`plotext`). MIT-licensed, on [PyPI](https://pypi.org/project/terminalboard/) — or `uvx terminalboard <logdir>` if you don't even want to install it. Source on [GitHub](https://github.com/dongfangyixi/terminalboard).

Next up: an agent loop so the assistant can pull data on demand, and a non-interactive `--analyze` report.
