---
title: 'The Action Bottleneck'
description: "Vision and language scaled on data civilization had already produced. Action didn't — and after red-teaming every explanation I could find, the reason isn't what I thought."
pubDate: 2026-08-16
tags: [embodied-ai, robotics, VLA, scaling, world-models]
locale: en
---

Vision got its scaling moment. Language got its scaling moment. Action — the A in VLA — did not, and the explanations for that have hardened into folklore: Moravec's paradox<sup><a href="#ref-1">[1]</a></sup>, "robots have no data," physics is hard.

I wanted a better answer than folklore, so I spent three days doing something slightly obsessive: I built the strongest case I could for why action is hard, then paid to have it torn apart. Research agents assembled the evidence; a red team attacked all of it, source by source; I ran numerical experiments where claims were checkable; then ten rounds of defender-versus-challenger, each round forced to fetch its citations and go one level deeper. Around a thousand source fetches. Every load-bearing quote checked verbatim.

My thesis died twice. What survived is more specific — and stranger — than what I started with.

## The folklore, first

Most of what gets repeated about why action is hard did not survive contact with the literature.

**"Action has no self-supervised objective."** It has one now: latent-action prediction on video. LAPA pretrained on unlabeled human video beat OpenVLA pretrained on real robot action labels<sup><a href="#ref-2">[2]</a></sup>. The objective exists; it's the grounding into a specific robot's motors that still costs money.

**"Continuous control breaks the token recipe."** π0-FAST runs the literal LLM recipe — discrete tokens, cross-entropy — on dexterous manipulation<sup><a href="#ref-3">[3]</a></sup>. The famous compounding-error lower bound is real<sup><a href="#ref-4">[4]</a></sup>, but tokenized stochastic policies sit outside its scope. And exponential decay with horizon isn't action-specific anyway: METR measures the same constant-hazard decay in pure-text agents<sup><a href="#ref-5">[5]</a>,<a href="#ref-6">[6]</a></sup>. What's special about robots is the price of each error, not the decay law.

**"Sim2real cracked locomotion but not manipulation."** Outdated since about 2022. DeXtreme<sup><a href="#ref-7">[7]</a></sup>, MIT's Visual Dexterity<sup><a href="#ref-8">[8]</a></sup>, DextrAH-G at 87% on dexterous grasping<sup><a href="#ref-9">[9]</a></sup> — all sim-trained, all real robots.

**"Touch is necessary for dexterity."** Surgeons performed millions of da Vinci procedures with zero haptic feedback. Force feedback first shipped in the da Vinci 5 — in 2024<sup><a href="#ref-10">[10]</a></sup>.

**"You can't pool data across embodiments."** π0.5's own ablation says pooling is load-bearing: unseen-home success drops from 94% to 49% without cross-embodiment data<sup><a href="#ref-11">[11]</a></sup>.

Each of these contains a real observation. None of them is the bottleneck.

## The answer I believed for a day

Strip the folklore away and one asymmetry is left standing: text and images were *exhaust*. Civilization produced them for its own reasons, digitized them, and left them lying around at near-zero marginal cost. Nobody's motor commands were ever recorded. So action data must be manufactured — teleoperation, demonstrations, corrections — at wall-clock physical cost, per task.

Manufactured versus found. I liked this answer. It's clean, it explains the order-of-magnitude gaps, and the red team mostly let it stand.

Then the deep loop attacked its best evidence, and found something better underneath.

## There is no found route

The strongest 2026 counter-evidence to the data story is a pair of scaling results that get cited as the "found data" route finally arriving. Dyna-2: a scaling law over one million hours of egocentric human video<sup><a href="#ref-12">[12]</a></sup>. GEN-1: a robot foundation model whose pretraining corpus "contains no robot data"<sup><a href="#ref-13">[13]</a></sup>. Human video as the internet of actions — extraction problem solved, asymmetry closed.

Read the fine print. GEN-1's corpus comes from "low-cost wearable devices on humans doing millions of activities"<sup><a href="#ref-13">[13]</a></sup> — devices someone bought, worn by people someone recruited. Dyna-2's million hours were "collected by our data partners as well as our own internal operation"<sup><a href="#ref-12">[12]</a></sup>.

Commissioned. Both of them. Paid for by the hour.

That's the finding that reorganized everything for me: **nothing in the 2026 record resembles what vision and language actually scaled on.** There is no web crawl for action — not even the flagship "found data" results are found. The real comparison was never found-versus-manufactured; it's commissioned-*human* data versus commissioned-*robot* data. And that comparison has numbers: human capture runs roughly 2–39x cheaper per hour, and carries a measured 2.87x capability discount on the robot channel — Dyna-2's own zero-shot gap at a million hours<sup><a href="#ref-12">[12]</a></sup>. Cost-adjusted, the two routes sit within an order of magnitude of each other<sup><a href="#ref-25">[25]</a></sup>.

Which is exactly why neither has won. If human video were truly free, it would have buried teleoperation by now. If it were useless, nobody would fund million-hour corpora. The stalemate in the field is the arithmetic.

## Where the hardness actually lives

Three measured facts survived all ten rounds of attack.

**The anchor.** Every demonstrated precision capability in the published record — including all of Dyna-2's own robot results — rests on ten hours or less of manufactured robot data *per task*<sup><a href="#ref-12">[12]</a></sup>. This anchor does not amortize across task families, and corpus scale does not substitute for it: the identical anchor at the 100K-hour rung leaves Dyna-2's lockbox task at 0%; at the million-hour rung, 90%<sup><a href="#ref-12">[12]</a></sup>. The substitution economics are brutal — eliminating every published anchor-hour in GEN-1's portfolio would repay about $7,000 of a corpus decade costing tens of millions<sup><a href="#ref-13">[13]</a>,<a href="#ref-14">[14]</a>,<a href="#ref-25">[25]</a></sup>.

**The embodiment gap.** The 2.87x human-to-robot discount is a genuine measurement<sup><a href="#ref-12">[12]</a></sup>. Its extrapolated closure is not: fit the published curve and the crossing point spans *ten orders of magnitude* at 90% confidence<sup><a href="#ref-25">[25]</a></sup>. Every "10 billion hours to close the gap" headline is numerology on four data points. Meanwhile ten manufactured hours close the same gap, per task, today<sup><a href="#ref-12">[12]</a></sup>.

**Evaluation splits along a physics line.** Cheap robot evaluation now exists — SIMPLER rank-orders real policies at r=0.924<sup><a href="#ref-15">[15]</a></sup>, and automated eval cells remove the human from the loop<sup><a href="#ref-16">[16]</a></sup>. But its builders scope it honestly: it works for "rigid-object manipulation tasks, as their physics are most straight-forward to simulate"<sup><a href="#ref-15">[15]</a></sup>. In the contact-rich and deformable stratum, the only validator is still manufactured closed-loop trials.

Look at where those three facts point. Data is scarcest exactly where contact matters — "large-scale" in a 2026 tactile paper means one hundred hours<sup><a href="#ref-17">[17]</a></sup>, against million-hour video corpora<sup><a href="#ref-12">[12]</a></sup> and billion-pair image datasets. Evaluation is expensive exactly where contact matters<sup><a href="#ref-15">[15]</a></sup>. The data wall and the eval wall are the same wall, and it has an address: **contact**.

## I ran the numbers where I could

Claims that were numerically checkable, I checked, in plain Python<sup><a href="#ref-26">[26]</a></sup>.

The evaluation-statistics claims are exactly right: at 10–20 rollouts per policy — the norm in published VLA papers<sup><a href="#ref-18">[18]</a></sup> — a true 5-point gap between two policies produces the *wrong ranking* almost half the time, and you need about 1,030 rollouts for ±2 points of confidence<sup><a href="#ref-19">[19]</a>,<a href="#ref-20">[20]</a></sup>. The field's selection signal really is that noisy. The FAST tokenization premise reproduces too: information per action token collapses as control frequency rises, and a DCT recovers 10.3x compaction on smooth trajectories<sup><a href="#ref-3">[3]</a></sup>. And contact chaos is real but regime-dependent<sup><a href="#ref-21">[21]</a></sup>: 1% friction noise produced 83x outcome dispersion near the stick-slip threshold, and almost none away from it.

Two experiments cut the other way, and I'm keeping them. Mode averaging — the textbook reason naive behavior cloning fails<sup><a href="#ref-22">[22]</a></sup> — *failed to fail*: with any symmetry-breaking noise, even a k-NN policy commits to a mode. And compounding error in my toy system grew at 1.8% per step, not catastrophically. Both pathologies are real; both are narrower than the folklore says.

## The one-sentence answer

Action is hard to scale because both its training signal and its validation signal must be commissioned — per task family, at the robot's own embodiment, at positive marginal cost — while vision and language scaled on civilization's free exhaust. And the place where all the costs concentrate is the place where the physics gets hard: contact.

No wall in that sentence. No impossibility. A stack of prices.

## What would change my mind

A thesis that can't be wrong isn't worth publishing, so here's what would break this one.

1. **An anchor-free precision result.** One published capability at millimeter tolerance with zero robot-embodied post-training. Ten rounds of searching found none.
2. **The 10⁷-hour discriminator.** The competing fits for the embodiment gap separate measurably at ~10⁷ commissioned-human hours<sup><a href="#ref-25">[25]</a></sup>. Current collection rates get there in two or three years<sup><a href="#ref-14">[14]</a></sup>.
3. **Sim eval crossing the physics line.** SIMPLER-grade rank correlation on a *deformable* task family would move the boundary<sup><a href="#ref-15">[15]</a></sup>.
4. **A cost collapse.** Human capture below ~$0.10 per usable hour — two orders of magnitude under any current disclosure<sup><a href="#ref-14">[14]</a></sup> — flips the cost-adjusted parity.

One honest caveat on all of it: the load-bearing 2026 sources — Dyna-2<sup><a href="#ref-12">[12]</a></sup>, GEN-0/GEN-1<sup><a href="#ref-13">[13]</a>,<a href="#ref-14">[14]</a></sup>, π0.7<sup><a href="#ref-23">[23]</a></sup>, Gemini Robotics 2<sup><a href="#ref-24">[24]</a></sup> — are self-reported by the labs that built them. The verification in my process checked that the citations are real and say what's claimed. It cannot check that the results replicate. Nobody can, yet. That, too, is the evaluation bottleneck — and it's the part of this story I expect to age fastest.

<details>
<summary><strong>References</strong> (click to expand)</summary>
<ol>
<li id="ref-1">Hans Moravec, <em>Mind Children</em> (1988); overview: <a href="https://en.wikipedia.org/wiki/Moravec%27s_paradox">Moravec's paradox — Wikipedia</a>.</li>
<li id="ref-2">Ye et al., "Latent Action Pretraining from Videos" (LAPA), ICLR 2025. <a href="https://arxiv.org/abs/2410.11758">arXiv:2410.11758</a> · <a href="https://latentactionpretraining.github.io/">project page</a>.</li>
<li id="ref-3">Pertsch et al., "FAST: Efficient Action Tokenization for Vision-Language-Action Models," Physical Intelligence, 2025. <a href="https://arxiv.org/abs/2501.09747">arXiv:2501.09747</a> · <a href="https://www.pi.website/research/fast">π blog</a>.</li>
<li id="ref-4">Simchowitz, Pfrommer &amp; Jadbabaie, "The Pitfalls of Imitation Learning when Actions are Continuous," COLT 2025. <a href="https://arxiv.org/abs/2503.09722">arXiv:2503.09722</a>.</li>
<li id="ref-5">Kwa et al. (METR), "Measuring AI Ability to Complete Long Tasks," 2025. <a href="https://arxiv.org/abs/2503.14499">arXiv:2503.14499</a>.</li>
<li id="ref-6">Toby Ord, "The Half-Life of AI Agents," 2025. <a href="https://www.tobyord.com/writing/half-life">tobyord.com</a>.</li>
<li id="ref-7">Handa et al., "DeXtreme: Transfer of Agile In-Hand Manipulation from Simulation to Reality," NVIDIA, 2022. <a href="https://arxiv.org/abs/2210.13702">arXiv:2210.13702</a>.</li>
<li id="ref-8">Chen et al., "Visual Dexterity: In-Hand Reorientation of Novel and Complex Object Shapes," <em>Science Robotics</em>, 2023. <a href="https://arxiv.org/abs/2211.11744">arXiv:2211.11744</a>.</li>
<li id="ref-9">Lum et al., "DextrAH-G: Pixels-to-Action Dexterous Arm-Hand Grasping with Geometric Fabrics," 2024. <a href="https://arxiv.org/abs/2407.02274">arXiv:2407.02274</a>.</li>
<li id="ref-10">Intuitive Surgical, "Intuitive Announces FDA Clearance of da Vinci 5," March 2024 (first da Vinci generation with force feedback). <a href="https://isrg.intuitive.com/news-releases/news-release-details/intuitive-announces-fda-clearance-da-vinci-5">press release</a>.</li>
<li id="ref-11">Physical Intelligence, "π0.5: a Vision-Language-Action Model with Open-World Generalization," 2025 (cross-embodiment ablation). <a href="https://arxiv.org/abs/2504.16054">arXiv:2504.16054</a> · <a href="https://www.pi.website/blog/pi05">π blog</a>.</li>
<li id="ref-12">Dyna Robotics, "Dyna-2: A 1-Million-Hour Scaling Law for Robot Manipulation," August 2026. <a href="https://www.dyna.co/research/dyna-2">dyna.co/research/dyna-2</a>. Quotes, the 2.87x zero-shot human→robot gap, the ≤10h per-task post-training anchor, and the Lockbox 0%→90% ladder are from this report.</li>
<li id="ref-13">Generalist AI, "GEN-1," 2026 ("The pretraining dataset contains no robot data"; wearable-device corpus). <a href="https://generalistai.com/blog/gen-1">generalistai.com/blog/gen-1</a>.</li>
<li id="ref-14">Generalist AI, "GEN-0," November 2025 (270K+ hours of manipulation data, +10K hours/week, scaling curves; basis for collection-cost and collection-rate figures). <a href="https://generalistai.com/blog/nov-04-2025-GEN-0">generalistai.com/blog/nov-04-2025-GEN-0</a>.</li>
<li id="ref-15">Li et al., "Evaluating Real-World Robot Manipulation Policies in Simulation" (SIMPLER), CoRL 2024. <a href="https://arxiv.org/abs/2405.05941">arXiv:2405.05941</a> · <a href="https://simpler-env.github.io/">simpler-env.github.io</a>. The rigid-object scope statement and the r=0.924 rank correlation are from the project's published materials.</li>
<li id="ref-16">Zhou et al., "AutoEval: Autonomous Evaluation of Generalist Robot Manipulation Policies in the Real World," 2025. <a href="https://arxiv.org/abs/2503.24278">arXiv:2503.24278</a>.</li>
<li id="ref-17">"T-Rex" tactile manipulation, 2026 (its ~100-hour corpus is described as large-scale for the tactile channel). <a href="https://arxiv.org/abs/2606.17055">arXiv:2606.17055</a>.</li>
<li id="ref-18">PhAIL survey of real-robot VLA evaluation practice (modal N=10–20 per condition, no confidence intervals), 2026. <a href="https://arxiv.org/abs/2605.29710">arXiv:2605.29710</a>.</li>
<li id="ref-19">NVIDIA Technical Blog, "How to Evaluate General-Purpose Robot Policies for Real-World Deployment" (Clopper-Pearson rollout arithmetic). <a href="https://developer.nvidia.com/blog/how-to-evaluate-general-purpose-robot-policies-for-real-world-deployment/">developer.nvidia.com</a>.</li>
<li id="ref-20">Toyota Research Institute, "A Careful Examination of Large Behavior Models" (LBM; blind randomized A/B evaluation at scale). <a href="https://toyotaresearchinstitute.github.io/lbm1/">toyotaresearchinstitute.github.io/lbm1</a>.</li>
<li id="ref-21">Bauza &amp; Rodriguez, "A Probabilistic Data-Driven Model for Planar Pushing" (measured outcome dispersion under repeated identical pushes), 2017. <a href="https://arxiv.org/abs/1705.10664">arXiv:1705.10664</a>.</li>
<li id="ref-22">Chi et al., "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion," RSS 2023 (canonical statement of mode averaging in behavior cloning). <a href="https://arxiv.org/abs/2303.04137">arXiv:2303.04137</a>.</li>
<li id="ref-23">Physical Intelligence, "π0.7," April 2026. <a href="https://www.pi.website/blog/pi07">π blog</a> · <a href="https://arxiv.org/abs/2604.15483">arXiv:2604.15483</a>.</li>
<li id="ref-24">Google DeepMind, Gemini Robotics model family, 2025–2026. <a href="https://deepmind.google/models/gemini-robotics/">deepmind.google/models/gemini-robotics</a>.</li>
<li id="ref-25">The 2–39x price ratio, the cost-adjusted parity, the ~$7,000 anchor-substitution ceiling, the ten-order-of-magnitude confidence interval on the gap-closure extrapolation, and the 10⁷-hour discriminator are my own calculations from the disclosures in [12], [13], and [14] (curve refits with floor terms, bootstrap confidence intervals, and break-even accounting). Methods are documented in my research notes.</li>
<li id="ref-26">The numerical experiments (evaluation statistics, action-token information/DCT, stick-slip dispersion, mode averaging, compounding error) are my own pure-Python simulations; the claims they test are from [3], [18], [19], [21], and [22].</li>
</ol>
</details>
