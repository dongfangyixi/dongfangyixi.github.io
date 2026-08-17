---
title: 'The Action Bottleneck'
description: "Why the robot part of robot AI still doesn't scale: the missing free data, the per-task anchor, the testing tax — and why all three meet at contact. Explained from the ground up."
pubDate: 2026-08-16
tags: [embodied-ai, robotics, VLA, scaling, world-models]
locale: en
---

A language model can pass the bar exam. An image model can paint anything you describe. The robot arm that is supposed to load your dishwasher still fails often enough that nobody will ship one.

The strange part is that all three now live inside the same kind of model. The current standard for robot AI is the **VLA — vision-language-action model**: camera images and a text instruction go in, motor commands come out, one neural network end to end. The vision half and the language half are pretrained on the internet, and they work beautifully — a modern robot genuinely understands "pick up the red mug behind the kettle." The action half — the stream of motor commands, twenty to fifty per second — is where generalization stops.

Why is action the exception? The classic hand-wave is Moravec's paradox — "hard things are easy, easy things are hard"<sup><a href="#ref-1">[1]</a></sup> — which names the pattern without explaining anything. The explanation that actually holds up is economic, and it's worth walking through slowly, because it predicts where robotics will get better and where it won't.

## What a "scaling moment" is made of

When people say language and vision "scaled," they mean two specific things happened at once.

**First, progress became predictable.** In 2020, researchers measured that a language model's error falls along a smooth power law as you add data and compute — a straight line on a log-log plot, holding across seven orders of magnitude<sup><a href="#ref-2">[2]</a></sup>. Later work pinned the exponents down precisely enough that labs now budget nine-figure training runs off the curve<sup><a href="#ref-3">[3]</a></sup>. You could *plan* capability. GPT-3 was the proof that the plan pays: abilities like few-shot learning showed up as a function of scale, not of any new architecture<sup><a href="#ref-4">[4]</a></sup>. Vision ran the same play: from AlexNet learning on 1.2 million labeled photos<sup><a href="#ref-5">[5]</a></sup> to CLIP learning from 400 million image-text pairs scraped off the web<sup><a href="#ref-6">[6]</a></sup> to LAION's 5.85 billion<sup><a href="#ref-7">[7]</a></sup>.

**Second — and this is the part people forget — the fuel was free.** The web already existed. Every forum argument, every product review, every captioned photo was produced by people for their own reasons, and was already digitized. Researchers call this *found data*: data that exists as a byproduct of normal life. GPT-3's training set was mostly Common Crawl, a nonprofit's free archive of the web<sup><a href="#ref-4">[4]</a>,<a href="#ref-8">[8]</a></sup>; LAION was sieved out of the same archive<sup><a href="#ref-7">[7]</a></sup>. The trillionth token cost roughly as much as the first: nothing. Nobody was paid to write the internet.

A scaling moment, then, is a predictable curve plus free fuel. Keep both halves in mind. Action is missing both, in a more interesting way than it first appears.

## Robots joined the internet economy without an internet

Think about what happened the last time you cooked dinner. Your hands made thousands of tiny corrections — regripping the knife, easing off pressure as the tomato skin gave way. How much of that was recorded? Nothing. Not one bit. Humanity generates motor data constantly and has never logged any of it.

So robot data cannot be found. It has to be **manufactured**. The standard method is *teleoperation*: a person wearing VR controllers or holding a leader arm puppets the robot through a task while every joint angle and camera frame is recorded. One hour of skilled human labor produces one hour of data — minus the failed takes and scene resets. Vendor pricing for this runs from tens of dollars to around $200 per fully-loaded hour<sup><a href="#ref-9">[9]</a></sup>.

The result is a data gap that is hard to overstate. Meta's Llama 3 trained on about 15 trillion words of found text<sup><a href="#ref-10">[10]</a></sup> — one estimate puts LLM-scale corpora at the equivalent of 100,000 years of human reading<sup><a href="#ref-11">[11]</a></sup>. Robotics' flagship shared dataset, Open X-Embodiment, pools the output of 34 labs into roughly a million short demonstrations<sup><a href="#ref-12">[12]</a></sup>; add up all the major open robot datasets and you get about 11,000 hours<sup><a href="#ref-13">[13]</a></sup>. Eleven thousand hours is fifteen months of round-the-clock experience. That is the entire shared inheritance of the field — versus a species' worth of text.

This is the answer most people stop at: *robots have no internet, so robot AI is data-starved.* True as far as it goes. But in 2026 it stopped being the interesting answer, because the field found what looked like a way around it — and the way around has fine print that changes the whole picture.

## The "free" data that wasn't

Here is the obvious workaround. Humans move all day. Strap a camera to a person's head, maybe sensors to their hands, and record *them* — no robot, no teleoperation rig, just people doing chores. Millions of hours suddenly look reachable. Learn "how manipulation works" from human video at scale, then translate to the robot at the end.

Two flagship results made this concrete. **Dyna-2** trained on one million hours of egocentric (head-camera) human video and showed a genuine scaling law: more human hours, measurably better robot performance<sup><a href="#ref-14">[14]</a></sup>. **GEN-1** went further and pretrained entirely without robot data — its corpus, in the company's own words, "contains no robot data"<sup><a href="#ref-15">[15]</a></sup>. Headlines read these as the internet-of-actions finally arriving.

Now the fine print. GEN-1's corpus comes from "low-cost wearable devices on humans doing millions of activities"<sup><a href="#ref-15">[15]</a></sup> — devices someone purchased, worn by people someone recruited. Dyna-2's million hours were "collected by our data partners as well as our own internal operation"<sup><a href="#ref-14">[14]</a></sup>.

In other words: **commissioned**. Every hour was paid for. This is worth its own term, because it is the crux of the whole story. *Commissioned data* is data that exists only because someone funded its creation — the opposite of found data, whatever the marketing says. And once you see it, you see there is no found route anywhere in robotics: not teleoperation, not "human video at scale," nothing. The web crawl that powered language and vision simply has no analogue here.

So the real question was never "can robots find free data?" (no) but "**which data is cheaper to buy per unit of robot skill** — human hours or robot hours?" And that question has numbers:

- A commissioned *human* hour (wearables, head cameras) runs roughly 2–39x cheaper than a commissioned *robot* hour (teleoperation)<sup><a href="#ref-16">[16]</a></sup>.
- But human data carries a transfer penalty. Train on a million human hours and the model predicts *human* actions well — its zero-shot predictions of *robot* actions come out about 3x worse (2.87x, in Dyna-2's own measurement)<sup><a href="#ref-14">[14]</a></sup>. This is the **embodiment gap**: watching a thousand hours of chopstick use teaches you a great deal about food, grip strategy, and physics — and still doesn't hand a two-fingered rubber gripper the motor program. Bodies don't share muscle memory.

Put the discount against the price advantage and the two routes land within an order of magnitude of each other<sup><a href="#ref-16">[16]</a></sup>. That single piece of arithmetic explains the current state of the industry better than any technical argument: it is why half the field is buying teleoperation and the other half is buying wearables, and why neither side is running away with it. There is no free route — only two priced ones, and the prices are close.

## Fact one: every skill still needs an anchor

Whatever the pretraining diet, one ingredient appears in every published system: a small dose of data collected *on the actual robot, doing the actual task*. Call it the **anchor**. In Dyna-2's case it is ten hours or less per task<sup><a href="#ref-14">[14]</a></sup>; across the record I could find, no demonstrated precision skill — millimeter-tolerance insertion, latch opening, careful placement — exists without one.

The anchor has two awkward properties.

**It doesn't transfer.** Ten hours of lockbox-opening data buys lockbox opening. It does not buy shirt folding. Imagine a pianist who must practice ten hours for every new song regardless of how many songs they already know — that is today's robot learning, and the practice must happen on each robot model separately.

**Scale doesn't replace it — but scale does work through it.** Dyna-2's lockbox task, with the identical ten-hour anchor, scores 0% when the human-video corpus is 100,000 hours and 90% when it is a million<sup><a href="#ref-14">[14]</a></sup>. Read that carefully, because both halves matter: the video pretraining genuinely unlocked the skill (0 to 90 is not noise), *and* the anchor stayed mandatory the whole way. Pretraining amplifies the anchor; nothing yet substitutes for it.

Here is why this shapes the economics of the entire field. An anchor costs a few hundred to a couple thousand dollars of robot time per task. A tenfold expansion of a video corpus costs tens of millions. If the point of the giant corpus were to eliminate anchors, the math collapses instantly: erasing every anchor-hour in GEN-1's published portfolio would save about $7,000<sup><a href="#ref-15">[15]</a>,<a href="#ref-16">[16]</a></sup>. Corpus scale has to justify itself some other way — broader generalization, robustness — because as an anchor-remover it is thousands of times too expensive. The per-task, per-robot line item that scaling was supposed to delete is still sitting in every pipeline.

## Fact two: nobody knows whether more video closes the gap

The optimistic story says the embodiment gap is temporary: keep scaling human video and the 3x penalty shrinks to nothing. Maybe. But the honest version of that extrapolation is humbling. The published curve rests on four corpus sizes. Fit it and ask "at what corpus size does the human-video route match robot-native performance?" and the statistically consistent answers range from about ten million hours to roughly 10¹⁷ — the second number being on the order of all hours every human has ever lived<sup><a href="#ref-16">[16]</a></sup>. That is not a forecast. It is a shrug with error bars.

So when a lab announces "N billion hours to human-level manipulation," treat it the way you would treat a stock-price target derived from four quarterly reports. The gap is real and measured; the schedule for closing it is unidentified — and it may close sideways, through better model architectures rather than more hours, which the same arithmetic says would take only a handful of generation-sized improvements<sup><a href="#ref-16">[16]</a></sup>.

## Fact three: testing is the hidden tax

There is a quieter reason language models improved so fast: *measuring* them is free. An evaluation is a script — thousands of questions, minutes, zero dollars, perfectly repeatable. Now measure a robot. Every single test is a physical event: stage the scene, run the policy, watch it succeed or drop the cup, reset everything, repeat. A human stands there the whole time.

How many repeats do you need? This is checkable with a hundred lines of Python, so I checked<sup><a href="#ref-17">[17]</a></sup>.

**Setup.** Simulate two robot policies with true success rates of 80% and 75%. "Evaluate" each by running N trials (coin flips at the true rate), then declare the higher-scoring one better. Repeat the whole comparison 40,000 times and count how often the evaluation gets the ranking wrong or tied.

**Result.** At N=10 trials per policy, the wrong-or-tied verdict occurs about half the time. At N=20, 42%. Even at N=100 trials — a full day of robot time — 22%. Separately: to pin down one policy's success rate within ±2 percentage points, you need roughly 1,030 trials, matching the published statistical guidance<sup><a href="#ref-18">[18]</a>,<a href="#ref-19">[19]</a></sup>.

**Conclusion.** Published robotics papers typically report 10–20 trials per task<sup><a href="#ref-20">[20]</a></sup>. At that sample size, a claimed 5-point improvement is close to a coin flip. The field's progress signal is drowning in evaluation noise — and doing it properly costs a day of robot time *per comparison*, against seconds for an LLM benchmark. Scaling ran on fast iteration; robotics pays a toll at every lap.

Simulation is the obvious fix, and it partially works: the SIMPLER benchmark reproduces the *ranking* of real policies with correlation r=0.924<sup><a href="#ref-21">[21]</a></sup>, and automated evaluation cells now run real-robot tests without a human in the loop<sup><a href="#ref-22">[22]</a></sup>. But read SIMPLER's own scope statement: it covers "rigid-object manipulation tasks, as their physics are most straight-forward to simulate"<sup><a href="#ref-21">[21]</a></sup>. Rigid objects. Which brings us to the place all of this has been pointing.

## The wall has an address: contact

Rigid-body tasks — move the block, pick the bottle — are where robot data is most plentiful, simulators most faithful, and evaluation cheapest. **Contact-rich** tasks — inserting a snug connector, folding cloth, handling anything soft or slippery — are where all three break at once. This is not a coincidence. Three properties of contact cause it.

**Cameras can't see forces.** Look at a video of a hand holding a paper cup. Is the grip firm or one newton away from crushing it? The pixels are identical. Grip force, friction, the onset of slip — the variables that decide success in fine manipulation are invisible to the sensor that provides 99% of robot training data. The channel that *does* carry them — touch — was never digitized at scale: a 2026 tactile-sensing paper describes its 100-hour dataset as "large-scale," and it is, for that field<sup><a href="#ref-23">[23]</a></sup>. One hundred hours, next to a million hours of video. (Touch isn't strictly *required* — surgeons completed millions of da Vinci procedures with zero force feedback before it finally shipped in 2024<sup><a href="#ref-24">[24]</a></sup> — but where precision meets uncertainty, it buys a lot.)

**Contact physics amplifies tiny differences.** This one is also checkable at home<sup><a href="#ref-17">[17]</a></sup>.

**Setup.** Simulate pushing a heavy block: force ramps up, the block sticks until static friction breaks, then slides — the everyday stick-slip jerk you feel pushing furniture. Run 400 trials with the friction coefficient varied by just ±1%, the kind of variation a slightly damp table gives you for free. As a control, run the same ±1% variation through a smooth system (viscous damping, no stick-slip threshold).

**Result.** In the smooth system, outcomes vary by about 1% — noise in, noise out. In the stick-slip system near its threshold, the spread of final positions is 83 times larger; some trials barely move while others shoot past. Far from the threshold the effect nearly vanishes.

**Conclusion.** Near contact transitions, physically identical-looking situations produce wildly different outcomes. Real measurements on robot hardware show the same thing — repeated identical pushes of one object produce a whole distribution of results<sup><a href="#ref-25">[25]</a></sup>. This is why contact tasks need many demonstrations (each one lands differently), why simulators disagree with reality precisely here (a 1% modeling error explodes), and why evaluation needs many trials (single runs mean nothing). One physical phenomenon, three separate bills.

Now stack the three facts. Touch data is scarcest where contact matters. Simulation is weakest where contact matters. Evaluation is most expensive where contact matters. The data wall, the sim wall, and the testing wall are one wall, and it stands exactly where a robot's fingers meet the world.

## So why is action the exception?

Because both its training signal and its testing signal have a price per unit, and vision and language got theirs for free.

Every hour of robot competence is bought: either commissioned human video at a measured ~3x transfer discount, or commissioned robot time at full price — plus a mandatory per-task anchor that no amount of scale has yet removed, plus real-hardware evaluation wherever contact is involved, which is exactly where the interesting tasks live.

Notice what's *not* in that sentence: no impossibility, no missing breakthrough, no paradox. Line items. That is, oddly, the optimistic reading — paradoxes don't yield to budgets, but prices do, and several of these prices are falling on published curves.

## What to watch

If this picture is right, it makes predictions. Here are the signals that would tell you it's breaking — each one worth more than any demo reel:

1. **An anchor-free precision demo.** A robot hitting millimeter-tolerance tasks with *zero* task-specific robot data. As of now, no published system has done it. The day one does, the per-task line item starts dying.
2. **Human-video corpora reaching ~10 million hours.** Around that scale, the competing theories of the embodiment gap separate measurably<sup><a href="#ref-16">[16]</a></sup>. Current collection rates get there in two to three years<sup><a href="#ref-15">[15]</a>,<a href="#ref-26">[26]</a></sup>.
3. **A simulator that ranks policies correctly on cloth or deformables.** That would move the evaluation wall off the contact boundary — and it's the result the SIMPLER authors themselves scope away from today<sup><a href="#ref-21">[21]</a></sup>.
4. **Wearable capture below ~$0.10 per usable hour** — two orders of magnitude under current disclosures. At that price the cost-parity between human and robot data flips decisively.

One caveat to carry with you: the load-bearing 2026 numbers here — Dyna-2's, GEN-1's — are self-reported by the labs that produced them, and nobody in robotics can independently replicate a million-hour training run. I've verified what the sources say; whether it reproduces is a different question. That uncertainty, fittingly, is the evaluation bottleneck again — and it's the part of this essay I expect to age fastest.

<details>
<summary><strong>References</strong> (click to expand)</summary>
<ol>
<li id="ref-1">Hans Moravec, <em>Mind Children</em> (1988); overview: <a href="https://en.wikipedia.org/wiki/Moravec%27s_paradox">Moravec's paradox — Wikipedia</a>.</li>
<li id="ref-2">Kaplan et al., "Scaling Laws for Neural Language Models," 2020. <a href="https://arxiv.org/abs/2001.08361">arXiv:2001.08361</a>.</li>
<li id="ref-3">Hoffmann et al., "Training Compute-Optimal Large Language Models" (Chinchilla), NeurIPS 2022. <a href="https://arxiv.org/abs/2203.15556">arXiv:2203.15556</a>.</li>
<li id="ref-4">Brown et al., "Language Models are Few-Shot Learners" (GPT-3), NeurIPS 2020 (few-shot ability as a function of scale; corpus predominantly Common Crawl). <a href="https://arxiv.org/abs/2005.14165">arXiv:2005.14165</a>.</li>
<li id="ref-5">Krizhevsky, Sutskever &amp; Hinton, "ImageNet Classification with Deep Convolutional Neural Networks" (AlexNet), NeurIPS 2012. <a href="https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html">paper</a>.</li>
<li id="ref-6">Radford et al., "Learning Transferable Visual Models From Natural Language Supervision" (CLIP), ICML 2021. <a href="https://arxiv.org/abs/2103.00020">arXiv:2103.00020</a>.</li>
<li id="ref-7">Schuhmann et al., "LAION-5B: An Open Large-Scale Dataset for Training Next Generation Image-Text Models," NeurIPS 2022 (5.85B pairs filtered from Common Crawl). <a href="https://arxiv.org/abs/2210.08402">arXiv:2210.08402</a>.</li>
<li id="ref-8">Common Crawl — nonprofit web archive, free to use. <a href="https://commoncrawl.org/">commoncrawl.org</a>.</li>
<li id="ref-9">Silicon Valley Robotics Center, robot training-data collection cost guide (fully-loaded teleoperation rates; vendor quotes span roughly $15–200/hour across providers). <a href="https://www.roboticscenter.ai/learn/collect-robot-training-data">roboticscenter.ai</a>.</li>
<li id="ref-10">Grattafiori et al., "The Llama 3 Herd of Models," 2024 (~15T training tokens). <a href="https://arxiv.org/abs/2407.21783">arXiv:2407.21783</a>.</li>
<li id="ref-11">Ken Goldberg, "Good old-fashioned engineering can close the 100,000-year data gap in robotics," <em>Science Robotics</em>, 2025. <a href="https://www.science.org/doi/10.1126/scirobotics.aea7390">doi:10.1126/scirobotics.aea7390</a>.</li>
<li id="ref-12">Open X-Embodiment Collaboration, "Open X-Embodiment: Robotic Learning Datasets and RT-X Models," 2023 (~1M trajectories, 22 robot types, 34 labs). <a href="https://arxiv.org/abs/2310.08864">arXiv:2310.08864</a>.</li>
<li id="ref-13">Qwen-RobotManip technical report, 2026 (aggregation of nine major open robot datasets: ~11,000 hours total). <a href="https://arxiv.org/abs/2606.17846">arXiv:2606.17846</a>.</li>
<li id="ref-14">Dyna Robotics, "Dyna-2: A 1-Million-Hour Scaling Law for Robot Manipulation," August 2026. <a href="https://www.dyna.co/research/dyna-2">dyna.co/research/dyna-2</a>. The corpus-provenance quote, the 2.87x zero-shot human→robot gap, the ≤10-hour per-task anchor, and the lockbox 0%→90% ladder are from this report.</li>
<li id="ref-15">Generalist AI, "GEN-1," 2026 ("The pretraining dataset contains no robot data"; wearable-device corpus). <a href="https://generalistai.com/blog/gen-1">generalistai.com/blog/gen-1</a>.</li>
<li id="ref-16">The 2–39x price ratio, the cost-adjusted parity, the ~$7,000 anchor-substitution ceiling, the extrapolation interval on gap closure (~10⁷ to ~10¹⁷ hours), the architecture-route arithmetic, and the 10⁷-hour discriminator are my own calculations from the disclosures in [9], [14], [15], and [26] (curve refits with floor terms, bootstrap confidence intervals, break-even accounting).</li>
<li id="ref-17">The two experiments in this essay (evaluation statistics; stick-slip dispersion) are my own pure-Python simulations, ~100 lines each; setups as described in the text.</li>
<li id="ref-18">NVIDIA Technical Blog, "How to Evaluate General-Purpose Robot Policies for Real-World Deployment" (Clopper-Pearson trial-count arithmetic). <a href="https://developer.nvidia.com/blog/how-to-evaluate-general-purpose-robot-policies-for-real-world-deployment/">developer.nvidia.com</a>.</li>
<li id="ref-19">Toyota Research Institute, "A Careful Examination of Large Behavior Models" (LBM; blind randomized A/B evaluation at scale). <a href="https://toyotaresearchinstitute.github.io/lbm1/">toyotaresearchinstitute.github.io/lbm1</a>.</li>
<li id="ref-20">PhAIL survey of real-robot VLA evaluation practice (modal N=10–20 per condition, typically without confidence intervals), 2026. <a href="https://arxiv.org/abs/2605.29710">arXiv:2605.29710</a>.</li>
<li id="ref-21">Li et al., "Evaluating Real-World Robot Manipulation Policies in Simulation" (SIMPLER), CoRL 2024. <a href="https://arxiv.org/abs/2405.05941">arXiv:2405.05941</a> · <a href="https://simpler-env.github.io/">simpler-env.github.io</a>. The rigid-object scope statement and the r=0.924 rank correlation are from the project's published materials.</li>
<li id="ref-22">Zhou et al., "AutoEval: Autonomous Evaluation of Generalist Robot Manipulation Policies in the Real World," 2025. <a href="https://arxiv.org/abs/2503.24278">arXiv:2503.24278</a>.</li>
<li id="ref-23">"T-Rex" tactile manipulation, 2026 (its ~100-hour corpus is described as large-scale for the tactile channel). <a href="https://arxiv.org/abs/2606.17055">arXiv:2606.17055</a>.</li>
<li id="ref-24">Intuitive Surgical, "Intuitive Announces FDA Clearance of da Vinci 5," March 2024 (first da Vinci generation with force feedback). <a href="https://isrg.intuitive.com/news-releases/news-release-details/intuitive-announces-fda-clearance-da-vinci-5">press release</a>.</li>
<li id="ref-25">Bauza &amp; Rodriguez, "A Probabilistic Data-Driven Model for Planar Pushing," 2017 (repeated identical pushes on real hardware yield a distribution of outcomes). <a href="https://arxiv.org/abs/1705.10664">arXiv:1705.10664</a>.</li>
<li id="ref-26">Generalist AI, "GEN-0," November 2025 (270K+ hours of manipulation data, growing ~10K hours/week; basis for collection-rate figures). <a href="https://generalistai.com/blog/nov-04-2025-GEN-0">generalistai.com/blog/nov-04-2025-GEN-0</a>.</li>
</ol>
</details>
