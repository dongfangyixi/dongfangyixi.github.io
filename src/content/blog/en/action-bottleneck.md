---
title: 'The Action Bottleneck'
description: "Why the action head memorizes where the vision head generalizes, why more data of the same shape cannot fix it, and why the metrics that scale are the ones that can lie. Five tested claims about missing information and memory."
pubDate: 2026-08-16
tags: [embodied-ai, robotics, VLA, scaling, world-models]
locale: en
---

## Background: the models and the symptom

A language model can pass the bar exam. An image model can paint anything you describe. The robot arm that was supposed to be loading your dishwasher still fails often enough that you cannot buy one.

The strange part: the machinery is shared now. Robot AI's most visible family is the VLA — vision-language-action model: camera frames and a text instruction go in, motor commands come out, one network end to end. It has siblings: world-action models (WAMs), which learn to predict future observations and actions together<sup><a href="#ref-1">[1]</a></sup>; systems where a language model writes code that calls motion primitives<sup><a href="#ref-2">[2]</a></sup>; diffusion- and flow-based policies that generate whole motion trajectories<sup><a href="#ref-3">[3]</a></sup>. Almost all of them learn the action part the same way, by behavior cloning: record a human doing the task (usually by *teleoperation* — a person puppets the robot while everything is logged), then train the network to reproduce the recorded actions from the recorded observations.

The architectures differ; the symptom doesn't. In every family, **the vision and language components generalize well, and the action component is where generalization stops**<sup><a href="#ref-4">[4]</a>,<a href="#ref-5">[5]</a>,<a href="#ref-6">[6]</a></sup>. And **where generalization stops, scaling stops**: a scaling curve tracks error on data the model has never seen<sup><a href="#ref-7">[7]</a></sup>, so more data improves a model only through what it generalizes from that data — improvement without generalization is memorization, and buys nothing<sup><a href="#ref-8">[8]</a></sup>. The component that cannot generalize is the component that cannot scale. The classic hand-wave for this is Moravec's paradox — "hard things are easy, easy things are hard"<sup><a href="#ref-9">[9]</a></sup> — which names the pattern and explains nothing. This essay tries to do better, starting with what "scaled" actually meant for vision and language.

## Background: what a "scaling moment" is

When people say language and vision "scaled," they mean something specific: a predictable curve. In 2020, Kaplan and colleagues measured that a language model's test error falls along a smooth power law as data and compute grow<sup><a href="#ref-7">[7]</a></sup>:

<p style="text-align:center;"><em>L(D) ≈ k · D<sup>−α</sup> + L<sub>∞</sub></em></p>

where: *L(D)* is the error after training on *D* units of data; *L<sub>∞</sub>* is the floor — the error you never get below no matter how much data you add; the exponent *α* says how fast the error above that floor shrinks as data grows (every doubling of *D* cuts it by the same fixed fraction); and *k* scales that shrinking part — it is the error above the floor at *D* = 1, and doubling it doubles the error above the floor at every *D*, while *α* alone decides how fast it falls. On a log-log plot this is a straight line, and for language it stayed straight across seven orders of magnitude of compute. Later work pinned the exponents down precisely enough that labs now budget nine-figure training runs off the curve<sup><a href="#ref-10">[10]</a></sup>. GPT-3 was the proof that the plan pays: abilities like few-shot learning showed up as a function of scale, not of any new architecture<sup><a href="#ref-11">[11]</a></sup>. Vision ran the same play: from AlexNet learning on 1.2 million labeled photos<sup><a href="#ref-12">[12]</a></sup> to CLIP learning from 400 million image-text pairs scraped off the web<sup><a href="#ref-13">[13]</a></sup> to LAION's 5.85 billion<sup><a href="#ref-14">[14]</a></sup>.

Robot data splits into two streams, and they scaled very differently. Nobody logs motor commands as a byproduct of living, so recorded robot actions total about 11,000 hours across the major open datasets<sup><a href="#ref-15">[15]</a>,<a href="#ref-16">[16]</a></sup> — while the corpora that reached a million hours in 2026<sup><a href="#ref-4">[4]</a></sup> (still far below web-text scale<sup><a href="#ref-17">[17]</a></sup>) got there by taking the robot out of the loop: humans wearing cameras or holding grippers, no robot actions in the corpus at all<sup><a href="#ref-18">[18]</a>,<a href="#ref-19">[19]</a>,<a href="#ref-20">[20]</a></sup>.

![Log-scale scatter of data collection 2019–2026 with dashed least-squares trend lines: robot-action datasets rise from RoboTurk's 111 hours through DROID's 350 and AgiBot World's 2,976 to 11,000 hours combined, roughly 1.9x per year; corpora collected from humans without a robot — Ego4D 3,670 hours, Ego-Exo4D 1,286, EgoDex 829, then Xiaomi 100,000, GEN-0 270,000, GEN-1 500,000, Dyna-2 1,000,000 — grow roughly 3.4x per year, with a brace noting the ~90x gap contains no robot actions](/images/blog/action-bottleneck/fig-datacurve.svg)

*The collection race, log scale, trends fitted by least squares. Orange: recorded robot actions<sup><a href="#ref-21">[21]</a>,<a href="#ref-22">[22]</a>,<a href="#ref-23">[23]</a>,<a href="#ref-16">[16]</a></sup>. Blue: collected from humans, no robot in the loop<sup><a href="#ref-24">[24]</a>,<a href="#ref-25">[25]</a>,<a href="#ref-26">[26]</a>,<a href="#ref-20">[20]</a>,<a href="#ref-18">[18]</a>,<a href="#ref-19">[19]</a>,<a href="#ref-4">[4]</a></sup>. Only corpora with published hour counts are shown. The ~90x gap holds observations, not robot actions.*

Scarcity, then, is the setting, not the explanation. A demonstration carries observations and actions in the same file — both targets get the same data — yet the model learns the video half and fails on the action half. Even the collection race repeats the pattern: when the field wanted a million hours, what it could scale was the observation stream, not the action stream.

That failure to learn the action half — not the size of any archive — is this essay's subject. Robotics has curves too, but along an unexpected axis, measured on proxies that can lie; we'll get there. The learning failure comes first, and it needs stating precisely.

## The problem, stated precisely

The puzzle, informally first. Take one fixed robot dataset — say Open X-Embodiment, the field's flagship shared collection<sup><a href="#ref-15">[15]</a></sup> — and train two prediction heads on the same trajectories. One head predicts the upcoming video frames. The other predicts the recorded actions. The visual head behaves: training and validation losses fall together. The action head misbehaves: training error keeps falling while validation error falls, bottoms out, and then *climbs* — the textbook overfitting curve. Dyna Robotics reports exactly this at million-hour scale: models trained on actions alone "plateau and overfit"<sup><a href="#ref-4">[4]</a></sup>.

Posing the puzzle this way — one fixed dataset, no shift at all — is deliberate. Under purely *visual* shifts (a moved camera, new lighting), a good share of what looks like action failure actually traces to the vision component, and is repairable without touching the action side<sup><a href="#ref-27">[27]</a></sup>. On identical, in-distribution data, that confound is gone: whatever makes the action head misbehave here is not a camera artifact.

Now formally. A demonstration dataset is a set of trajectories

<p style="text-align:center;"><em>τ = (o<sub>1</sub>, a<sub>1</sub>, o<sub>2</sub>, a<sub>2</sub>, …, o<sub>T</sub>)</em></p>

where *o<sub>t</sub>* is the observation at step *t* (camera frames, positions) and *a<sub>t</sub>* is the recorded action (the motor command). Two processes generated this data. The demonstrator chose the actions:

<p style="text-align:center;"><em>a<sub>t</sub> = π(o<sub>t</sub>, z) + ε<sub>t</sub></em></p>

— read: the action is some policy *π* of what the demonstrator sees (*o<sub>t</sub>*) *and* of private state *z* that never appears in the recording (their intent, their habits), plus execution noise *ε<sub>t</sub>* (tremor, jitter). And the world produced the next observation:

<p style="text-align:center;"><em>o<sub>t+1</sub> = f(o<sub>t</sub>, a<sub>t</sub>)</em></p>

— read: physics *f* takes the current state and the executed action and returns the next state, essentially deterministically.

Both heads get the identical input <em>x<sub>t</sub> = (o<sub>t−1</sub>, o<sub>t</sub>)</em>. The **vision head** learns to predict *o<sub>t+1</sub>* — approximating *f*, with the executed action largely readable off the visible motion (how largely, Claim 3 quantifies); the **action head** learns to predict *a<sub>t</sub>* — approximating *π*, with *z* missing outright. We score both with normalized mean squared error,

<p style="text-align:center;"><em>NMSE = E‖ŷ − y‖² / Var(y)</em></p>

— read: average squared miss, divided by the target's natural spread (its variance, summed over the target's dimensions), so 0 means perfect and 1 means "no better than always guessing the average." One more definition does most of the work in this essay. Call

<p style="text-align:center;"><em>B = E[Var(y | x)] / Var(y)</em></p>

the **floor**: the share of the target that remains undetermined *even with the best possible use of the input*. No predictor, however large or well-trained, can average below *B* on fresh data. (We'll write *B<sub>A</sub>* and *B<sub>V</sub>* for the action and vision heads' floors.)

The problem this essay answers, in one line: **why is the generalization gap — validation NMSE minus training NMSE — near zero for the vision head and large and *growing* for the action head, on the same data, the same inputs, and the same network?** Equivalently: why is *B* tiny for *f* and huge for *π*, and why does training behave so pathologically when *B* is large?

To answer it, I built the smallest rig that reproduces the phenomenon<sup><a href="#ref-28">[28]</a></sup>. A simulated 2D robot crosses a table to a goal, detouring around an obstacle. Each demonstration carries hidden state — the *z* and *ε* above — that the observations never show: which side the demonstrator chose (a coin flip), their turn-early-or-late style, and jitter on their command signal. The "arm" has inertia, so observed positions are a smoothed version of the raw commands — a camera sees the filtered arm; the teleop log stores the raw signal. The vision head predicts the next position; the action head predicts the raw command.

![Experiment setup: left, simulated demonstrations forking left or right around an obstacle, colored by the hidden coin; right, one episode's two records of the same motion — the jagged raw command versus the smooth inertia-filtered trace](/images/blog/action-bottleneck/fig-setup.svg)

*The rig. Left: demonstrations fork on a hidden coin, with turn-early/turn-late style spread. Right: the two records of one and the same motion — the action label is the jagged orange command; the observation is the smooth blue response. Both heads see identical inputs.*

<details>
<summary>The core of the simulation (full scripts ~100 lines each)</summary>

```python
# One demonstration step. Hidden per episode: side (coin), turn_dist (style).
if x < OBS_X and (OBS_X - x) < turn_dist and abs(y) < 1.0:
    target = (x + 0.5, side * 1.2)        # detour waypoint
else:
    target = GOAL
d = unit_vector(target - pos)
cmd = SPEED * d + gauss(0, 0.05)          # ACTION label: intent + jitter
exec_v = 0.6 * exec_v + 0.4 * cmd         # arm inertia (low-pass filter)
pos = pos + exec_v                        # OBSERVATION: filtered response

# Two heads, identical input (last two positions):
#   vision head predicts pos_next   -> approximates physics f
#   action head predicts cmd        -> approximates the policy pi(o, z)
# Model 1: nearest neighbor (pure memorizer), 200 train / 200 val episodes
# Model 2: MLP 4 -> 240 tanh -> 2, gradient descent, 8 train / 150 val episodes
```

</details>

The answer to that question has three parts: a statistical problem inside the action target itself, a check that the diagnosis survives at real scale, and a measurement problem that keeps the whole thing hard to see. The rest of this essay walks them in order.

## Why the action head overfits: five claims

The statistical problem — the first of the three — resolves into five claims: each a property of the action target, each tested — four on this rig, the fifth against real-robot data at scale.

Two ground rules for the rig first. Its hidden variables are put in by hand — that is what a rig is — but each one has been verified on real robots: demonstrator style is a measured training hazard at industrial scale<sup><a href="#ref-29">[29]</a></sup>, and the overfitting itself is documented at a million hours<sup><a href="#ref-4">[4]</a></sup>; the rig exists to isolate the mechanism, not to prove the phenomenon. And its knobs set its multipliers — export the shape of each result, not the constants.

### Claim 1: the action label records decisions; the observation records their consequences

The core asymmetry: **the two targets sit on opposite sides of the demonstrator's decisions.** Every timestep follows the same causal chain: the demonstrator decides → the hand executes → the world shows the result.

Predicting the next frame is a *downstream* question: given the motion so far, what happens next? By the time you ask, the decision is made and its consequences are visible — the velocity between two frames is the executed record of the recent commands.

Predicting the action is an *upstream* question: what will this person decide, right now? At a genuine decision point, the observation does not contain the answer. Two demonstrators in the same position go opposite ways around an obstacle. The same demonstrator turns early on Monday and late on Tuesday, with hand tremor on top. In the notation above: the target depends on *z* and *ε*, and the input *x* contains neither. (Conditioning on more doesn't dissolve *z*. A language instruction names the task, not the grasp point or the detour side — the rig's goal is fixed and known, and the coin is hidden anyway. And history doesn't help at a genuine fork: until the turn begins, the choice appears in no frame.) Information theory gives this a name — the conditional entropy *H(a|o)*, the uncertainty about the action that remains after the observation is fully used — and a decomposition:

<p style="text-align:center;"><em>H(a|o) = H(a) − I(a; o)</em></p>

— read: total action uncertainty, minus whatever the observation reveals. For the action head this remainder is large, and its squared-error analogue is the floor defined above: everything the demonstrator's hidden state contributes lands in *B<sub>A</sub>*. For the vision head, physics *f* is a function — once an action has been executed, the next frame is essentially decided, and the input already shows the executed motion — so *B<sub>V</sub>* is nearly zero, up to one small leak that Claim 3 makes precise.

![The causal chain of one timestep: hidden state z and tremor ε produce the action — the raw command — which the arm's inertia filter smooths into the next observation; the action head's target sits before the filter with measured floor 0.29, the vision head's target after it with floor 0.0025](/images/blog/action-bottleneck/fig-chain.svg)

*Where each head taps the chain. The action head's target sits upstream of the arm's filter: z and ε land in it at full strength, and three-tenths of its variance (B<sub>A</sub> ≈ 0.29, measured in Claim 2) is undetermined by the input. The vision head's target sits downstream: the same unknowns arrive scaled by the filter and buried under momentum, an undetermined share of a quarter of one percent (B<sub>V</sub> ≈ 0.0025, measured in Claim 3). Neither head can see z or ε — the chain decides how much that ignorance costs each of them.*

**Test.** Fit a pure memorizer (nearest-neighbor) to 200 demonstrations and evaluate on 200 fresh ones. Training error: zero on both heads — a memorizer memorizes everything equally. Validation error: vision 0.003, action 0.631 — about **190 times worse**, from the same inputs, same data, same model. Then switch the hidden variables off one at a time, which decomposes that validation error into its *ε* and *z* parts:

| Variant | Action head | Vision head |
|---|---|---|
| Everything hidden (coin + style + jitter) | 0.62 | 0.003 |
| Jitter only (*ε* alone) — pure noise | 0.36 | 0.002 |
| Decisions only (*z* alone) — zero noise anywhere | 0.28 | 0.001 |
| Everything hidden, but predict the *executed* velocity | 0.22 | 0.003 |

(Two footnotes on the table. Row one re-runs the everything-hidden condition inside the decomposition script; seed-to-seed wobble, not a typo, separates its 0.62 from the 0.631 above. And a memorizer's validation error overshoots the floor itself by about a factor of two — its miss stacks the fresh episode's hidden draw on top of the stored neighbor's — so read the rows as like-for-like comparisons across variants; the floor itself gets measured directly in Claim 2.)

Two rows matter most. Row three: remove every source of randomness — a fully deterministic world — and the action head is *still* ~240x worse, because unobserved decisions hurt exactly like noise, and unlike noise they can't be cleaned away: they are the signal. Row four: predict the same motion one step downstream — the executed, filtered velocity instead of the raw command — and the error drops threefold, with what remains still seventy-odd times the vision head's. The difficulty isn't "action" as a category. It's distance upstream: the closer the target sits to the hidden decision, the more of *z* and *ε* it contains, and the higher its floor — the gradient the field's target engineering already climbs, with chunked trajectories, end-effector waypoints, and smoothed targets in place of raw per-tick commands.

**The demonstrator's intent is only the first entry on the missing-information list.** State the principle once, generally: the floor is made of every cause the action depends on that the input does not carry — whatever its type. Intent is one. The others are physical and sensory: the forces and pressure at the fingertips, the object's weight, friction, and compliance, temperature, the sound of a part seating home, everything occluded from the camera, even depth itself. And one is linguistic: the instruction says "pick up the mug," never where to grip it or how hard — language conditions the task, and still underdetermines the action. Each unobserved cause adds its share to *B<sub>A</sub>*. Contact-rich manipulation is not a separate problem; it is the setting where the most entries on this list go missing at once.

**Cameras can't see forces.** Watch a video of a hand holding a paper cup: is the grip secure, or one newton from crushing it? The pixels are identical. Grip force, friction, incipient slip — the variables that decide fine manipulation are invisible to the camera, the sensor nearly all robot training data comes from. The channel that carries them — touch — was never digitized at scale: a 2026 tactile paper calls its 100-hour dataset "large-scale," and within that field, it is<sup><a href="#ref-30">[30]</a></sup>. One hundred hours, next to a million hours of video. (Touch isn't strictly required — surgeons completed millions of da Vinci procedures with zero force feedback before it shipped in 2024<sup><a href="#ref-31">[31]</a></sup> — but wherever precision meets uncertainty, it buys a lot.) And this is not hypothetical bookkeeping: when VLAs fail on contact-rich tasks, *force* failures form their own category, distinct from anything vision or precision explains<sup><a href="#ref-32">[32]</a></sup>.

**Contact physics amplifies tiny differences.** Also checkable at home<sup><a href="#ref-28">[28]</a></sup>:

**Setup.** Simulate pushing a heavy block: force ramps up, the block sticks, then breaks free and slides — the stick-slip jerk you feel pushing furniture. Run 400 trials with friction varied by ±1% (a slightly damp table gives you that for free), against a control system with smooth damping and the same ±1%.

**Result.** The smooth system's outcomes vary by about 1% — noise in, noise out. The stick-slip system near its threshold spreads **83x wider**; some trials never break free at all, others slide several times as far as the typical one. Far from the threshold, the effect nearly vanishes.

**Conclusion.** Near contact transitions, visually identical situations produce wildly different outcomes — and real-hardware measurements show the same: repeated identical pushes of one object yield a whole distribution of results<sup><a href="#ref-33">[33]</a></sup>. That's why contact tasks need many demonstrations (each lands differently), why simulators disagree with reality precisely here (a 1% modeling error explodes), and why evaluation needs many trials (single runs mean nothing). One phenomenon, three bills. And it is the hidden-decision problem from Claim 1 wearing different clothes: at contact, the world adds its own coin flips on top of the demonstrator's, pushing *H(a|o)* and the floor *B<sub>A</sub>* higher still.

The same amplification answers the obvious counterexample — "just train in simulation, the way locomotion did." Locomotion's sim-to-real success is real, and it maps the boundary rather than crossing it: a robot balancing its own well-modeled body is the simulable case; manipulation stakes success on the state of arbitrary objects — every geometry, mass, friction, softness — at exactly the transitions where a 1% error becomes an 83x spread.

### Claim 2: what the model cannot predict, it memorizes

This claim answers the objection you should be raising: *if the action is genuinely unpredictable — if the floor B<sub>A</sub> is high — shouldn't training error also be stuck at the floor?*

It would be — if the network had to *predict* the unpredictable part. On the training set, it can *remember* it instead. The coin flip in episode 137 is no longer a random variable; it is a recorded fact, and a network with spare capacity will store it, indexed by whatever incidental features identify that episode. So training error sinks *below the floor* — storing, not learning. On fresh validation episodes the coins are re-rolled, there is nothing to look up — and a function bent through stored noise is warped everywhere in between. Schematically, over training time *t*:

<p style="text-align:center;"><em>NMSE<sub>train</sub>(t) → below B &nbsp;&nbsp;&nbsp;&nbsp; NMSE<sub>val</sub>(t) → B + damage(t)</em></p>

— read: the training curve dives under the floor (anything below *B* is memorization by definition), while the validation curve bottoms out — at the floor when data is plentiful, above it when data is scarce — and then accumulates damage as memorization warps the function. This is the documented behavior of networks trained on noisy labels — learn the true pattern first, then memorize the noise, with validation error turning upward at the moment memorization begins<sup><a href="#ref-8">[8]</a></sup>,<sup><a href="#ref-34">[34]</a></sup>.

If this mechanism sounds familiar from language models, it should. Hallucination runs on the same arithmetic: when the input cannot determine the answer, even a well-calibrated model must sometimes produce confident content it has no basis for — provably so for facts that appear only once in training<sup><a href="#ref-35">[35]</a></sup> — and training that rewards answering over abstaining teaches models to guess<sup><a href="#ref-36">[36]</a></sup>. An action head faces that situation at every decision point: asked for an output its input does not determine, it answers anyway, from memory. Overfitting here and hallucination there are one disease — memory posing as reasoning wherever information is missing.

**Test.** Replace the memorizer with a small network trained by gradient descent, and — to mirror per-task robot reality — give it only *eight* demonstrations. The vision head barely notices the poverty: training and validation error fall together to 0.0014 and 0.0019 and stay overlapped for four thousand epochs. Eight episodes are enough, because the target is the shared physics. The action head draws the curve every practitioner has seen: validation error bottoms out almost immediately (0.53, epoch 45), then trends upward for the rest of training — never regaining that minimum — while training error keeps falling: 0.31 versus 0.60 by the end.

Read those numbers against the floor, which can be measured directly on the rig: estimate Var(*y*|*x*) by the spread of action labels at matched inputs — a quarter-million fresh samples, shrinking the match radius until the estimate stops moving — and *B<sub>A</sub>* ≈ 0.29. That also retro-checks Claim 1, whose memorizer landed at 0.63, a shade over twice the floor, right where nearest-neighbor theory puts it. So the best validation error, 0.53, is the floor plus what eight episodes cannot yet teach. Training error, at 0.31, is within a whisker of the floor — almost everything it sheds from here on is memorization. And validation error ends at 0.60, double the floor: the climb from 0.53 is the damage.

![Training curves: the vision head's train and validation errors overlap near zero for 4,000 epochs; in the action head's panel a dotted horizontal line marks the measured floor at 0.29 — validation error bottoms out at 0.53 at epoch 45 and drifts up, while training error falls to a whisker above the floor and keeps falling](/images/blog/action-bottleneck/fig-curves.svg)

*Same data, same network, same training — only the target differs. Left: the vision head's two curves overlap at its floor, near zero. Right: the dotted line is the action head's measured floor, B<sub>A</sub> ≈ 0.29. Validation (orange) bottoms out at 0.53 — floor plus what eight episodes can't teach — then drifts up; training (blue, dashed) ends a whisker above the floor and is still falling — anything it sheds below that line is memorization, not learning.*

A word on heads, because the field changed them for exactly this reason. Swap regression for a head that models distributions — diffusion, flow, action tokens<sup><a href="#ref-3">[3]</a></sup> — and behavior *at* the floor changes: the model can learn to sample one mode cleanly instead of straddling two. What no head can do is lower the floor; that belongs to the data channel, and both the million-hour overfitting<sup><a href="#ref-4">[4]</a></sup> and the null result on cleverer action representations below<sup><a href="#ref-5">[5]</a></sup> were measured on modern heads, not MSE strawmen. Nor is the floor itself what dooms a policy — at a fork either branch works, and a calibrated sampler scoring exactly *B* can act perfectly. The damage is what chasing sub-floor training error puts *into* the network: memorized episodes, and the shortcuts of Claim 4 — and those do ride along into deployment.

### Claim 3: the visual loss hides the same ignorance under an average

If physics is deterministic, why isn't the vision head's floor *exactly* zero? Because the next frame does contain one non-physics ingredient: the *newest* action, which carries this step's fresh slice of *z* and *ε*. The vision head is just as unable to predict that slice as the action head. The reason its metric doesn't show it is arithmetic. Write the vision target as

<p style="text-align:center;"><em>o<sub>t+1</sub> = m(x<sub>t</sub>) + c · u<sub>t</sub></em></p>

— read: a momentum part *m(x)* that the input fully determines (the arm keeps moving as it was moving), plus the *innovation* *u* — the genuinely new, decision-bearing content — scaled down by the arm's inertia filter *c* (0.4 in the rig). Because NMSE divides by the target's total variance, the innovation's contribution gets diluted:

<p style="text-align:center;"><em>NMSE<sub>full</sub> ≈ NMSE<sub>innov</sub> × [c²·Var(u) / Var(o<sub>t+1</sub>)]</em></p>

— read: the visible score equals the score on the hard part, multiplied by the hard part's tiny share of the target's variance. Same misses; bigger denominator. A frame in a real dataset is hundreds of thousands of numbers, most of which — background, table, lighting — belong to *m(x)*. An action is 7–24 numbers — roughly one per motor — with no comparable padding. On this rig the decision-bearing share of the action target's variance is the floor itself, *B<sub>A</sub>* ≈ 0.29: three-tenths of the action target, against a quarter of one percent of the visual one. Action misses land on what matters at a hundred-odd times the density; almost every pixel "hit" is momentum.

**Test.** Take the very same vision predictions that scored 0.003 above — retrain nothing — and re-grade them on the innovation alone: subtract the momentum part from both prediction and truth, and score what remains. The score collapses from **0.003 to 1.187** — worse than guessing the innovation's average — while the action head's 0.618 suddenly looks respectable. The arithmetic closes: 0.003 / 1.187 ≈ 0.0025 — the quarter-of-one-percent share claimed above. That dilution is the whole cushion. The vision head knows essentially nothing about the decision either; its famous stability is the momentum term doing the talking. (The real-model analogue would be masking the visual loss down to the gripper-and-object pixels — the decision-bearing region; the dilution identity predicts part of the train/val gap shows up there. The cushion pads the average; it doesn't solve manipulation.)

### Claim 4: the action head can cheat, and cheats do not survive the loop

Memorization is not the only way to score well without understanding; the action target also invites shortcuts. Actions are smooth in time, so the single best predictor of the current action in the training set is the *previous* action. A model with history input can score well by copying its own inertia and learn nothing about why the motion happens. That failure mode is documented as the "copycat problem"<sup><a href="#ref-37">[37]</a></sup>, and it has a broader family: any incidental feature that identifies *which episode this is* — background details, lighting — unlocks a memorized sequence, a pathology named "causal confusion"<sup><a href="#ref-38">[38]</a></sup>.

Real systems fail exactly this way: VLAs above 90% on the LIBERO benchmark drop to 0% when objects are shuffled, diagnosed as memorized action sequences<sup><a href="#ref-6">[6]</a></sup>, and pooled corpora make it worse — policies trained on fragmented multi-lab datasets learn to recognize *which sub-dataset they're in* from backgrounds and embodiment cues, then replay that fragment's habits<sup><a href="#ref-39">[39]</a></sup>. The vision head has its own copy trick — repeat the previous frame — but that is just the momentum term of Claim 3, openly priced and honestly most of the answer.

The insidious part is *where* the cheat gets caught. Robotics names the two settings: **open-loop** evaluation grades predictions against a recording, frame by frame — and there, copying inertia looks accurate; **closed-loop** evaluation lets the policy act, its outputs feeding back into what it sees — the difference between grading a driver against a dashcam recording and handing them the wheel. Only the second catches the cheat. Formally: open-loop metrics average the loss over the *expert's* (the demonstrator's) state distribution *d<sub>expert</sub>*, but deployed performance is determined by the distribution *d<sub>π̂</sub>* that the learned policy *π̂* generates by acting. Nothing ties the two together — a model can improve on the first while standing still, or collapsing, on the second.

**Test.** Two identical networks trained on the same hundred demonstrations; one also receives the previous raw command as an input — the copycat's favorite feature, made genuinely predictive by recoloring the rig's operator jitter into realistic low-frequency drift (white jitter would leave the previous command uninformative; real operator noise is autocorrelated — exactly what makes the copycat threat live<sup><a href="#ref-37">[37]</a></sup>). On paper, the cheat pays: open-loop validation error drops from 0.414 to 0.287, a 31% improvement any benchmark table would celebrate. Then let both policies actually drive the arm, feeding their own outputs back: 70% success for the honest network, 73% for the cheat — statistically indistinguishable across 200 rollouts (error bars the measurement section will price: wide enough to hide several points either way). The entire open-loop gain was metric inflation; none of it was capability.

A first version of the experiment made the point even more rudely: with symmetric starts, *both* networks posted respectable open-loop numbers while succeeding on 1% of rollouts — the deterministic nets averaged the two detour modes at the decision boundary and drove straight into the obstacle, and nothing in the open-loop score hinted at it. (The literature documents the stronger form, where history features actively destroy closed-loop behavior<sup><a href="#ref-37">[37]</a></sup>; the rig shows the milder, more common disease.)

### Claim 5: action data holds fewer real samples than it appears

The last claim moves from the quality of each sample to the count of them. Every frame of every episode samples the same shared physics — that function is common across episodes, tasks, even datasets. Actions carry new information only at decision points: when to turn, where to grasp, how hard to squeeze. Everything between decisions is autocorrelated filler, mostly predictable from the previous step. As a rule of thumb,

<p style="text-align:center;"><em>N<sub>eff</sub> ≈ (episodes) × (decisions per episode) ≪ (frames)</em></p>

— read: the effective sample count for the action head is the number of independent *choices* in the dataset, not the number of recorded timesteps. A 200-step trajectory might contain five genuinely independent choices — a fortyfold shrinkage already, and real trajectories logged at 30–50 Hz stretch the ratio into the hundreds — which means the action head sits much further left on any scaling curve than the raw dataset size suggests.

**Test.** This is the one claim our one-room rig cannot test: its content is about diversity across *conditions*, and a single-obstacle toy has a single condition. But the test at real scale exists — the cleanest real-robot data-scaling study on record, 40,000+ demonstrations, 15,000+ evaluation rollouts: demonstrations *per environment* saturate at around fifty, while generalization follows a power law in the number of environments and objects<sup><a href="#ref-40">[40]</a></sup>. Counted the way that matters, a dataset's size is its number of conditions, not its number of frames.

The five claims at a glance:

| # | Claim | Mechanism | Test | Key number |
|---|---|---|---|---|
| 1 | The action label records decisions; the observation records consequences | Target depends on hidden *z* and *ε*; the input holds neither, so *B<sub>A</sub>* is high | Nearest-neighbor memorizer; hidden variables switched off one at a time | Validation NMSE: action 0.631 vs vision 0.003 (~190x) |
| 2 | What the model cannot predict, it memorizes | Spare capacity stores each episode's noise; stored noise warps the function everywhere else | Small MLP on eight demonstrations, 4,000 epochs | Action validation bottoms at 0.53 (epoch 45), ends at 0.60 while training falls to 0.31 |
| 3 | The visual loss hides the same ignorance under an average | The decision-bearing innovation is diluted by the momentum term's share of variance | Re-grade the same vision predictions on the innovation alone | 0.003 → 1.187; innovation is ~0.25% of target variance |
| 4 | The action head can cheat, and cheats do not survive the loop | Copying inertia or episode cues beats the open-loop metric without adding capability | Give one network the previous command; then let both drive | Open-loop error −31%; closed-loop 70% vs 73% |
| 5 | Action data holds fewer real samples than it appears | Only decision points carry new information; the rest is autocorrelated filler | Real-robot data-scaling study, 40,000+ demonstrations<sup><a href="#ref-40">[40]</a></sup> | Demos per environment saturate at ~50; generalization is a power law in environments |

### What the labs already do about it

The flagship systems no longer train the action head alone; the field's own habits concede the diagnosis. Dyna-2 stabilizes its action learning with video co-training<sup><a href="#ref-4">[4]</a></sup>; Physical Intelligence goes further and *blocks the action head's gradients* from touching the language backbone, co-training the backbone on web data instead, because raw action gradients measurably degrade it<sup><a href="#ref-41">[41]</a></sup>. The vision and language objectives act as ballast for a target too thin and too noisy to sail on its own.

The controlled evidence arrived in 2026. Toyota Research Institute ran the most rigorous co-training study to date — 89 policies, 58,000 simulated and 2,835 real-robot trials — and found exactly this pattern: co-training on *vision-language* data consistently improves a robot policy's generalization, while robot-only training measurably erodes the backbone's abilities<sup><a href="#ref-5">[5]</a></sup>. The same study carried a result that should sting anyone betting on cleverer action representations: discrete action tokens and latent actions extracted from video produced no statistically significant gains, and one action-token scheme actively *decreased* generalization<sup><a href="#ref-5">[5]</a></sup>.

And the rig's hidden-style variable is the one AgiBot measured: *operator diversity* — different teleoperators' personal styles in otherwise identical situations — can actively hurt training, and debiasing operators' velocity profiles helps<sup><a href="#ref-29">[29]</a></sup>. In our terms: they lowered *H(a|o)* and got a better policy for it.

That is the statistical problem: each action sample teaches less and misleads more. Everything so far, though, is a rig and a claims list. The natural question is whether the field's own record at scale agrees — it does, and the next section walks through it; the one after asks what our instruments can even see.

## Beyond the rig: what more data actually buys

"Then collect more." The field has — the past three years saw the biggest data-collection push in robotics history — and the record of what happened is the claims replayed at scale. Walk through it and the location of the bottleneck is unambiguous: the learning, not the logistics.

### More of the same data does not help

In the cleanest real-robot data-scaling study on record, demonstrations *per environment* saturate at around fifty<sup><a href="#ref-40">[40]</a></sup>. And at the far end of volume, Dyna-2 reports that models trained on actions alone "plateau and overfit" at a *million* hours<sup><a href="#ref-4">[4]</a></sup> — Claim 2's memorization dynamic, observed in production. If raw volume were the missing ingredient, these are not the curves it would draw.

### Diversity helps, for the reason the claims predict

That same study finds generalization follows a power law in the number of training *environments and objects*<sup><a href="#ref-40">[40]</a></sup>, with a striking practical translation: four data collectors, one afternoon, thirty-two environment-object pairs — roughly 90% success in entirely new environments with unseen objects<sup><a href="#ref-40">[40]</a></sup>. AgiBot's million-trajectory study agrees — task diversity beats per-task quantity<sup><a href="#ref-29">[29]</a></sup> — and a controlled follow-up finds the diversity dimensions that matter most are unglamorous ones: camera poses and spatial arrangements<sup><a href="#ref-42">[42]</a></sup>. This is the overfitting story seen from the data side: another demonstration of the *same* condition mostly re-samples the same hidden coins — more memorizable noise — while a *new* environment adds structure the shared, learnable layers can actually absorb. Scale works where the sharing works, and nowhere else.

### The biggest corpus swap hits the embodiment gap

The obvious escape from small robot corpora is human video: humans move all day, and Dyna-2's million-hour egocentric corpus does yield a genuine scaling law — more human hours, measurably better robot<sup><a href="#ref-4">[4]</a></sup>. But what it buys the *robot* is capped by a transfer penalty: the same model's zero-shot predictions of robot actions come out about 3x worse than its predictions of human actions (2.87x, in Dyna-2's own measurement)<sup><a href="#ref-4">[4]</a></sup>. (An open-loop number, note — by the standards of the measurement section below, it grades the pretraining objective, not deployment.) This is the **embodiment gap**: watching a thousand hours of chopstick use teaches a lot about food and grip strategy, and still doesn't hand a two-fingered rubber gripper the motor program. Bodies don't share muscle memory. Notice that this is Claim 1 operating across bodies: within one body, the demonstrator's motor channel is already hidden from the camera; between a human body and a robot's, still more of it is. For the action head, human video is mostly more *vision* data.

### Every skill still needs an anchor

Whatever the pretraining diet, one ingredient appears in every published system: a small dose of data collected *on the actual robot, doing the actual task*. Call it the **anchor**. In Dyna-2's case it is ten hours or less per task<sup><a href="#ref-4">[4]</a></sup>; in the published record, no demonstrated precision skill — millimeter insertion, latch opening, careful placement — appears without one.

The anchor has two awkward properties. **It doesn't transfer**: ten hours of lockbox data buys lockbox opening, not shirt folding — a pianist who must practice ten hours for every new song, on every piano separately. **Scale doesn't replace it, but scale works through it**: Dyna-2's lockbox task, with its anchor held fixed, scores 0% when the video corpus is 100,000 hours and 90% at a million<sup><a href="#ref-4">[4]</a></sup>. (Ten-trial evaluations, note — 0/10 and 9/10 — but this jump is large enough to survive even the measurement section's strictures: Fisher's exact test puts it at p ≈ 10⁻⁴.)

The anchor, then, is not a nuisance to optimize away; it is a structural residue — the slice of the skill that only the robot's own body, in the actual task, can supply. Which suggests the right engineering question: not how to delete the anchor, but how to make it *dynamic* — collected, refreshed, and grown by the deployed system's own operation instead of gathered once per task and frozen. That is the direction experience-based recipes already point: RECAP-style training on a policy's own rollouts and corrections is, in effect, an anchor that maintains itself<sup><a href="#ref-43">[43]</a></sup>.

And is the embodiment gap at least *closing* with scale? Unknown. The published curve rests on four corpus sizes; fit it, ask where human-video pretraining matches robot-native performance, and the statistically consistent answers run from ten million hours to roughly 10¹⁷ — the latter on the order of all hours humanity has ever lived<sup><a href="#ref-44">[44]</a></sup>. That is not a forecast; it is a shrug with error bars. Treat any "N billion hours to human-level" headline accordingly.

(The one visible exit from purpose-built collection is exhaust — robots minting data as a byproduct of paid work, a flywheel that already exists in miniature<sup><a href="#ref-43">[43]</a></sup> — but exhaust begins only once a robot is worth deploying, which is exactly the bootstrap this section describes.)

## The measurement problem: proxies lie and trials cost

The statistical problem says the signal is bad; the record at scale says more of the same signal does not fix it. The third problem is quieter: in robotics, even *knowing whether you improved* costs money — and the cheap substitutes mislead.

### Clean curves on the wrong metric

The curves that look LLM-clean live on proxy metrics. Xiaomi's robot foundation model, pretrained on 100K+ hours of handheld-gripper data, reports validation action error falling steadily as data and model grow — a genuinely Chinchilla-shaped curve<sup><a href="#ref-20">[20]</a></sup>. But validation error is an *open-loop* number — in Claim 4's notation, an average over *d<sub>expert</sub>*, while the thing you care about lives on *d<sub>π̂</sub>*.

Whether the proxy predicts a working robot is exactly the question — and the sharpest answer on record comes from autonomous driving, where a 30,000-hour study fit a near-perfect open-loop power law (correlation −0.963) and then reported plainly that the relationship does not hold in closed-loop evaluation, where the model actually drives<sup><a href="#ref-45">[45]</a></sup>. The curve was real; the capability it implied was not. (Claim 4's test showed the same divergence in miniature: a 31% open-loop improvement, zero closed-loop gain.)

### Testing is the hidden tax

Beneath the proxy problem sits a brute-force one. Measuring a language model is nearly free: an evaluation is a script — thousands of questions, minutes, pennies, repeatable. A robot evaluation is a physical event: stage the scene, run the policy, watch it succeed or drop the cup, reset, repeat, with a human standing there throughout.

And closed-loop is the only evaluation that counts, because a policy — unlike a chatbot benchmark — generates its own test distribution. Each small error moves the robot into a state slightly outside the demonstrations, where it errs a bit more, producing a stranger state still. Imitation theory prices this compounding:

<p style="text-align:center;"><em>J<sub>expert</sub> − J(π̂) = O(δ · T²)</em></p>

— read: if the learned policy errs with probability *δ* per step on the expert's states, its shortfall over a task of *T* steps grows not like *δT* (errors adding up) but like *δT²* — because one error at step *t* can poison all remaining *T − t* steps, and there are ~*T* opportunities to make it<sup><a href="#ref-46">[46]</a></sup>. (This is the imitation literature's classic *O(εH²)* compounding bound, with *H* the horizon — restated in *δ* and *T*, the trajectory length from the problem statement, because this essay has already spent *ε* on the demonstrator's tremor and *H*(·) on entropy.) That quadratic is provably a worst-case lower bound for any offline method, not an artifact of weak algorithms — the missing information is *recovery behavior*, which demonstration datasets don't contain<sup><a href="#ref-47">[47]</a></sup>.

The known escape routes map onto the field's current agenda. Losses that learn calibrated distributions instead of point estimates can cancel the penalty in forgiving environments<sup><a href="#ref-48">[48]</a></sup>. That is part of why language models degrade gracefully where regression-trained policies snap: they train with log-loss, on a medium full of written self-correction. And training on the policy's *own* rollouts plus corrections closes the distribution gap directly — Physical Intelligence's RECAP recipe, which reports roughly halved failure rates on its hardest tasks<sup><a href="#ref-43">[43]</a></sup>.

How many closed-loop trials does a trustworthy verdict need? The statistics are unforgiving. The uncertainty of a measured success rate shrinks only with the square root of the trial count:

<p style="text-align:center;"><em>N ≈ p(1−p) · (1.96 / w)²</em></p>

— read: to pin a true success rate *p* inside a margin of ±*w* with 95% confidence, you need roughly that many trials; at *p* = 0.9 and *w* = 0.02 the estimate is ~860, and the exact binomial (Clopper-Pearson) interval pushes it to ~1,030<sup><a href="#ref-49">[49]</a>,<a href="#ref-50">[50]</a></sup>. I checked what this means at the field's actual sample sizes<sup><a href="#ref-28">[28]</a></sup>:

**Setup.** Two simulated policies with true success rates 80% and 75%. "Evaluate" each with N trials, declare the higher scorer better, repeat the comparison 40,000 times, count wrong verdicts.

**Result.** At N=10 per policy — the norm in published papers<sup><a href="#ref-51">[51]</a></sup> — the verdict is wrong or tied about half the time. At N=20, 42%. At N=100, still 22%.

**Conclusion.** At the field's typical sample sizes, a claimed 5-point improvement is close to a coin flip. Doing it properly costs a day of robot time *per comparison*, versus seconds for an LLM benchmark. Scaling ran on fast iteration; robotics pays a toll at every lap.

Simulation partially works: the SIMPLER benchmark reproduces real policy *rankings* at correlation r=0.924<sup><a href="#ref-52">[52]</a></sup>, and automated cells now run real-robot evaluations without a human<sup><a href="#ref-53">[53]</a></sup>. But SIMPLER's own scope statement limits it to "rigid-object manipulation tasks, as their physics are most straight-forward to simulate"<sup><a href="#ref-52">[52]</a></sup>. Rigid objects are the tasks where the least information is missing. Where the inputs are most incomplete — manipulation of arbitrary, unsensed objects — the simulator escape closes too.

## So why is action the exception?

Because three problems stack, and each would be survivable alone.

**The signal is worse.** Action prediction is an upstream question: it must guess decisions at the moment they are made, before their consequences appear in any observation. Its floor *B<sub>A</sub>* is high — hidden intent, style, tremor — and on training data, that undetermined share invites shortcuts and gets memorized. That is why, on identical data, the action head overfits and the visual head — downstream of every decision, behind its thick momentum cushion — doesn't.

**More data, by itself, does not fix it.** The field's own record matches the rig: same-condition volume saturates or overfits; gains follow condition diversity, because only shared structure can be absorbed; human video arrives with a ~3x embodiment discount; and a per-task anchor survives every corpus size yet published.

**The measurement is blind or expensive.** The metrics that scale cleanly are open-loop proxies averaging over the wrong distribution; the evaluation that counts is physical, slow, and statistically hungry — and the compounding-error arithmetic (*δT²*) means small per-step differences matter enormously, precisely where measurements are noisiest.

And the three are at their worst together where the most information is missing — manipulation of arbitrary objects, where forces, materials, and intent are all off-camera at once. Notice what's absent: no impossibility, no paradox, no missing genius. Just a signal-quality problem, a price list, and a measurement gap. That is the optimistic reading. Paradoxes don't yield to engineering; problems do — noise can be modeled, shortcuts regularized away, prices fall on published curves, and better evaluators are an engineering project already underway.

## If you train these models

The diagnosis converts to practice directly; each habit below is a result from above, turned around to face your own training run.

- **Measure your floor before you scale.** Estimate the local spread of action labels at matched inputs — the direct measurement that put the rig's floor at *B<sub>A</sub>* ≈ 0.29<sup><a href="#ref-28">[28]</a></sup>. Training error below the floor is memorization by definition; progress is validation error closing on the floor, not training error sinking under it.
- **Lower *H(a|o)* at the source.** Debias operator styles<sup><a href="#ref-29">[29]</a></sup>, and where the pipeline allows it, predict a target one step downstream of the decision — on the rig, executed velocity instead of raw command cut validation error threefold, 0.62 to 0.22.
- **Never train the action head alone.** Co-train the backbone on video or vision-language data<sup><a href="#ref-4">[4]</a>,<a href="#ref-5">[5]</a></sup> and insulate it from raw action gradients<sup><a href="#ref-41">[41]</a></sup> — robot-only training measurably erodes it<sup><a href="#ref-5">[5]</a></sup>.
- **Spend collection budget on conditions, not repetitions.** Demonstrations per environment saturate around fifty while generalization follows a power law in environments and objects<sup><a href="#ref-40">[40]</a></sup> — and the diversity that pays most is unglamorous: camera poses and spatial arrangements<sup><a href="#ref-42">[42]</a></sup>.
- **Budget the anchor in, not out.** The published record shows no precision skill demonstrated without per-task on-robot data, and scale works through the anchor, not around it<sup><a href="#ref-4">[4]</a></sup> — so plan for the anchor as an input, or better, design it to refresh itself through deployment.
- **Read validation action error as a debugging tool, never a capability claim.** It averages over *d<sub>expert</sub>*, not *d<sub>π̂</sub>*: the rig's 31% open-loop improvement bought zero closed-loop gain, and driving's near-perfect open-loop power law (r = −0.963) did not survive handing the model the wheel<sup><a href="#ref-45">[45]</a></sup>.
- **Buy verdicts at their real price.** Pinning a 90% success rate inside ±2 points takes ~1,030 trials<sup><a href="#ref-49">[49]</a>,<a href="#ref-50">[50]</a></sup>; at the customary N=10<sup><a href="#ref-51">[51]</a></sup>, a 5-point improvement is close to a coin flip. Claim only what your trial count supports.

None of this solves the bottleneck; it is what respecting it looks like.

## What to watch

Signals that would mean this picture is breaking:

1. **An action-only model that scales cleanly** — no video co-training ballast, no gradient insulation — would mean the statistical problem has been solved at the objective level, not patched.
2. **An anchor-free precision demo**: millimeter-tolerance work with zero task-specific robot data. No published system has done it; the day one does, the per-task line item starts dying.
3. **Human-video corpora reaching ~10 million hours**, where the competing theories of the embodiment gap separate measurably<sup><a href="#ref-44">[44]</a></sup>. Dyna already calls its million hours "only the beginning" of that axis<sup><a href="#ref-4">[4]</a></sup>.
4. **A simulator that ranks policies correctly on cloth or deformables** — the result SIMPLER's authors scope away from today<sup><a href="#ref-52">[52]</a></sup>.
5. **An anchor that maintains itself** — a deployed system whose per-task on-robot data is collected and refreshed by its own operation rather than gathered once and frozen. The moment the anchor becomes a byproduct of use, the last per-task requirement starts to dissolve.

One caveat to carry: the load-bearing 2026 numbers here — Dyna-2's, GEN-1's — are self-reported by the labs that produced them, and nobody can independently replicate a million-hour training run. I've verified what the sources say; whether it reproduces is a different question. That uncertainty is, fittingly, the measurement problem again — and it's the part of this essay I expect to age fastest.

<details>
<summary><strong>References</strong> (click to expand)</summary>
<ol>
<li id="ref-1">Wang et al., "World Action Models: The Next Frontier in Embodied AI" (survey), 2026. <a href="https://arxiv.org/abs/2605.12090">arXiv:2605.12090</a>.</li>
<li id="ref-2">Liang et al., "Code as Policies: Language Model Programs for Embodied Control," 2022. <a href="https://arxiv.org/abs/2209.07753">arXiv:2209.07753</a>.</li>
<li id="ref-3">Chi et al., "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion," RSS 2023. <a href="https://arxiv.org/abs/2303.04137">arXiv:2303.04137</a>.</li>
<li id="ref-4">Dyna Robotics, "Dyna-2: A 1-Million-Hour Scaling Law for Robot Manipulation," August 2026. <a href="https://www.dyna.co/dyna-2">dyna.co/dyna-2</a>. The action-only overfitting observation, corpus-provenance quote, 2.87x zero-shot human→robot gap, ≤10-hour per-task anchor, and lockbox 0%→90% ladder are from this report.</li>
<li id="ref-5">Lin et al. (Toyota Research Institute), "A Systematic Study of Data Modalities and Strategies for Co-training Large Behavior Models for Robot Manipulation," 2026 (89 policies, 58K sim + 2,835 real trials). <a href="https://arxiv.org/abs/2602.01067">arXiv:2602.01067</a>.</li>
<li id="ref-6">Zhou et al., "LIBERO-PRO: Towards Robust and Fair Evaluation of Vision-Language-Action Models Beyond Memorization," 2025 (models &gt;90% on LIBERO collapse to ~0% under object/layout perturbation; diagnosed as rote memorization of action sequences). <a href="https://arxiv.org/abs/2510.03827">arXiv:2510.03827</a>.</li>
<li id="ref-7">Kaplan et al., "Scaling Laws for Neural Language Models," 2020. <a href="https://arxiv.org/abs/2001.08361">arXiv:2001.08361</a>.</li>
<li id="ref-8">Zhang et al., "Understanding Deep Learning Requires Rethinking Generalization," ICLR 2017. <a href="https://arxiv.org/abs/1611.03530">arXiv:1611.03530</a>.</li>
<li id="ref-9">Hans Moravec, <em>Mind Children</em>, 1988; overview: <a href="https://en.wikipedia.org/wiki/Moravec%27s_paradox">Moravec's paradox — Wikipedia</a>.</li>
<li id="ref-10">Hoffmann et al., "Training Compute-Optimal Large Language Models" (Chinchilla), NeurIPS 2022. <a href="https://arxiv.org/abs/2203.15556">arXiv:2203.15556</a>.</li>
<li id="ref-11">Brown et al., "Language Models are Few-Shot Learners" (GPT-3), NeurIPS 2020. <a href="https://arxiv.org/abs/2005.14165">arXiv:2005.14165</a>.</li>
<li id="ref-12">Krizhevsky, Sutskever &amp; Hinton, "ImageNet Classification with Deep Convolutional Neural Networks" (AlexNet), NeurIPS 2012. <a href="https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html">proceedings.neurips.cc</a>.</li>
<li id="ref-13">Radford et al., "Learning Transferable Visual Models From Natural Language Supervision" (CLIP), ICML 2021. <a href="https://arxiv.org/abs/2103.00020">arXiv:2103.00020</a>.</li>
<li id="ref-14">Schuhmann et al., "LAION-5B: An Open Large-Scale Dataset for Training Next Generation Image-Text Models," NeurIPS 2022 (5.85B pairs filtered from Common Crawl). <a href="https://arxiv.org/abs/2210.08402">arXiv:2210.08402</a>.</li>
<li id="ref-15">Open X-Embodiment Collaboration, "Open X-Embodiment: Robotic Learning Datasets and RT-X Models," 2023 (~1M trajectories, 22 robot types, 34 labs). <a href="https://arxiv.org/abs/2310.08864">arXiv:2310.08864</a>.</li>
<li id="ref-16">Yuan et al., "Qwen-RobotManip Technical Report: Alignment Unlocks Scale for Robotic Manipulation Foundation Models," 2026 (nine major open robot datasets total ~11,000 hours). <a href="https://arxiv.org/abs/2606.17846">arXiv:2606.17846</a>.</li>
<li id="ref-17">Grattafiori et al., "The Llama 3 Herd of Models," 2024 (~15T training tokens). <a href="https://arxiv.org/abs/2407.21783">arXiv:2407.21783</a>.</li>
<li id="ref-18">Generalist AI, "GEN-0," November 2025 (270K+ hours of manipulation data, growing ~10K hours/week). <a href="https://generalistai.com/blog/gen-0">generalistai.com/blog/gen-0</a>.</li>
<li id="ref-19">Generalist AI, "GEN-1," 2026 ("The pretraining dataset contains no robot data"; wearable-device corpus). <a href="https://generalistai.com/blog/gen-1">generalistai.com/blog/gen-1</a>.</li>
<li id="ref-20">Xiaomi Robotics Team, "Xiaomi-Robotics-1: Scaling Vision-Language-Action Models with over 100K Hours of Real-World Trajectories," 2026. <a href="https://arxiv.org/abs/2607.15330">arXiv:2607.15330</a>.</li>
<li id="ref-21">Mandlekar et al., "Scaling Robot Supervision to Hundreds of Hours with RoboTurk: Robotic Manipulation Dataset through Human Reasoning and Dexterity," IROS 2019 (111+ hours of teleoperated manipulation). <a href="https://arxiv.org/abs/1911.04052">arXiv:1911.04052</a>.</li>
<li id="ref-22">Khazatsky et al., "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset," RSS 2024 (76k trajectories, ~350 hours). <a href="https://arxiv.org/abs/2403.12945">arXiv:2403.12945</a>.</li>
<li id="ref-23">Bu et al. (AgiBot), "AgiBot World Colosseo: A Large-scale Manipulation Platform for Scalable and Intelligent Embodied Systems," 2025 (1M+ trajectories, ~2,976 hours). <a href="https://arxiv.org/abs/2503.06669">arXiv:2503.06669</a>.</li>
<li id="ref-24">Grauman et al., "Ego4D: Around the World in 3,000 Hours of Egocentric Video," CVPR 2022 (3,670 hours). <a href="https://arxiv.org/abs/2110.07058">arXiv:2110.07058</a>.</li>
<li id="ref-25">Grauman et al., "Ego-Exo4D: Understanding Skilled Human Activity from First- and Third-Person Perspectives," CVPR 2024 (1,286 video hours). <a href="https://arxiv.org/abs/2311.18259">arXiv:2311.18259</a>.</li>
<li id="ref-26">Hoque et al. (Apple), "EgoDex: Learning Dexterous Manipulation from Large-Scale Egocentric Video," 2025 (829 hours, 338k episodes). <a href="https://arxiv.org/abs/2505.11709">arXiv:2505.11709</a>.</li>
<li id="ref-27">Li, Zhang et al., "VLA Models Are More Generalizable Than You Think: Revisiting Physical and Spatial Modeling," 2025 (viewpoint-shift failures localize to visual tokens and are repairable with a small adapter while the policy stays frozen). <a href="https://arxiv.org/abs/2512.02902">arXiv:2512.02902</a>.</li>
<li id="ref-28">My own experiments, 2026. The simulations in this essay — hidden-variable decomposition; the direct floor estimate by local label variance; training curves; cushion re-grading; the closed-loop cheat; evaluation statistics; stick-slip dispersion — are pure-Python, ~100 lines each, with setups as described in the text.</li>
<li id="ref-29">Shi, Chen et al. (AgiBot), "Is Diversity All You Need for Scalable Robotic Manipulation?" 2025 (task diversity beats per-task quantity; operator-diversity debiasing helps). <a href="https://arxiv.org/abs/2507.06219">arXiv:2507.06219</a>.</li>
<li id="ref-30">Niu et al., "T-Rex: Tactile-Reactive Dexterous Manipulation," 2026 (its ~100-hour corpus is described as large-scale for the tactile channel). <a href="https://arxiv.org/abs/2606.17055">arXiv:2606.17055</a>.</li>
<li id="ref-31">Intuitive Surgical, "Intuitive Announces FDA Clearance of da Vinci 5," March 2024 (first da Vinci generation with force feedback). <a href="https://isrg.intuitive.com/news-releases/news-release-details/intuitive-announces-fda-clearance-da-vinci-5">isrg.intuitive.com</a>.</li>
<li id="ref-32">"FACT: Demystifying When and Why VLAs Fail in Contact-Rich Tasks and How to Fix Them," 2026 (force failures form their own failure category, distinct from vision or precision errors). <a href="https://arxiv.org/abs/2608.01402">arXiv:2608.01402</a>.</li>
<li id="ref-33">Bauza &amp; Rodriguez, "A Probabilistic Data-Driven Model for Planar Pushing," 2017 (repeated identical pushes on real hardware yield a distribution of outcomes). <a href="https://arxiv.org/abs/1704.03033">arXiv:1704.03033</a>.</li>
<li id="ref-34">Arpit et al., "A Closer Look at Memorization in Deep Networks," ICML 2017 (networks learn patterns first, then memorize noise). <a href="https://arxiv.org/abs/1706.05394">arXiv:1706.05394</a>.</li>
<li id="ref-35">Kalai &amp; Vempala, "Calibrated Language Models Must Hallucinate," 2023 (hallucination is statistically forced for facts appearing only once in training). <a href="https://arxiv.org/abs/2311.14648">arXiv:2311.14648</a>.</li>
<li id="ref-36">Kalai et al. (OpenAI), "Why Language Models Hallucinate," 2025 (training and evaluation reward guessing over abstaining). <a href="https://arxiv.org/abs/2509.04664">arXiv:2509.04664</a>.</li>
<li id="ref-37">Wen et al., "Fighting Copycat Agents in Behavioral Cloning from Observation Histories," NeurIPS 2020. <a href="https://arxiv.org/abs/2010.14876">arXiv:2010.14876</a>.</li>
<li id="ref-38">de Haan, Jayaraman &amp; Levine, "Causal Confusion in Imitation Learning," NeurIPS 2019. <a href="https://arxiv.org/abs/1905.11979">arXiv:1905.11979</a>.</li>
<li id="ref-39">Xing et al., "Shortcut Learning in Generalist Robot Policies: The Role of Dataset Diversity and Fragmentation," CoRL 2025. <a href="https://arxiv.org/abs/2508.06426">arXiv:2508.06426</a>.</li>
<li id="ref-40">Lin, Hu et al., "Data Scaling Laws in Imitation Learning for Robotic Manipulation," ICLR 2025 oral (generalization is a power law in environment/object diversity; demos-per-condition saturate ~50). <a href="https://arxiv.org/abs/2410.18647">arXiv:2410.18647</a>.</li>
<li id="ref-41">Driess et al. (Physical Intelligence), "Knowledge Insulating Vision-Language-Action Models: Train Fast, Run Fast, Generalize Better," 2025 (action gradients degrade the VLM backbone; fix: gradient insulation + web co-training). <a href="https://arxiv.org/abs/2505.23705">arXiv:2505.23705</a>.</li>
<li id="ref-42">Saxena, Bronars et al., "What Matters in Learning from Large-Scale Datasets for Robot Manipulation" (MimicLabs), ICLR 2025. <a href="https://arxiv.org/abs/2506.13536">arXiv:2506.13536</a>.</li>
<li id="ref-43">Physical Intelligence, "π*0.6: a VLA That Learns From Experience" (RECAP), 2025. <a href="https://arxiv.org/abs/2511.14759">arXiv:2511.14759</a> · <a href="https://www.pi.website/blog/pistar06">pi.website/blog/pistar06</a>.</li>
<li id="ref-44">My own calculations, 2026, from the scaling disclosures in [14] (curve refits with floor terms, bootstrap confidence intervals): the gap-closure extrapolation interval (~10⁷–10¹⁷ hours) and the 10⁷-hour discriminator.</li>
<li id="ref-45">Zheng et al., "Data Scaling Laws for Imitation Learning-Based End-to-End Autonomous Driving," 2024 (open-loop power law, r = −0.963, that fails to transfer to closed-loop). <a href="https://arxiv.org/abs/2412.02689">arXiv:2412.02689</a>.</li>
<li id="ref-46">Ross, Gordon &amp; Bagnell, "A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning" (DAgger; the compounding-error analysis), AISTATS 2011. <a href="https://arxiv.org/abs/1011.0686">arXiv:1011.0686</a>.</li>
<li id="ref-47">Rajaraman et al., "Toward the Fundamental Limits of Imitation Learning," NeurIPS 2020 (the horizon-squared lower bound for offline imitation). <a href="https://arxiv.org/abs/2009.05990">arXiv:2009.05990</a>.</li>
<li id="ref-48">Foster, Block &amp; Misra, "Is Behavior Cloning All You Need? Understanding Horizon in Imitation Learning," 2024 (log-loss BC can be horizon-independent under recoverability). <a href="https://arxiv.org/abs/2407.15007">arXiv:2407.15007</a>.</li>
<li id="ref-49">NVIDIA Technical Blog, "How to Evaluate General-Purpose Robot Policies for Real-World Deployment," 2026 (Clopper-Pearson trial-count arithmetic). <a href="https://developer.nvidia.com/blog/how-to-evaluate-general-purpose-robot-policies-for-real-world-deployment/">developer.nvidia.com</a>.</li>
<li id="ref-50">Toyota Research Institute, "A Careful Examination of Large Behavior Models for Multitask Dexterous Manipulation," 2025 (blind randomized A/B evaluation at scale). <a href="https://toyotaresearchinstitute.github.io/lbm1/">toyotaresearchinstitute.github.io/lbm1</a>.</li>
<li id="ref-51">Sergey Arkhangelskiy, "PhAIL: A Real-Robot VLA Benchmark and Distributional Methodology," 2026 (survey of real-robot VLA evaluation practice: modal N=10–20 per condition, typically without confidence intervals). <a href="https://arxiv.org/abs/2605.29710">arXiv:2605.29710</a>.</li>
<li id="ref-52">Li et al., "Evaluating Real-World Robot Manipulation Policies in Simulation" (SIMPLER), CoRL 2024. <a href="https://arxiv.org/abs/2405.05941">arXiv:2405.05941</a> · <a href="https://simpler-env.github.io/">simpler-env.github.io</a>.</li>
<li id="ref-53">Zhou et al., "AutoEval: Autonomous Evaluation of Generalist Robot Manipulation Policies in the Real World," 2025. <a href="https://arxiv.org/abs/2503.24278">arXiv:2503.24278</a>.</li>
</ol>
</details>
