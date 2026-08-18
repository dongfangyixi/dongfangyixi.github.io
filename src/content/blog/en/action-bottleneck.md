---
title: 'The Action Bottleneck'
description: "Why the action head overfits where the vision head doesn't, why there is no free data for movement, and why every cost in robot learning converges on contact. Explained from the ground up."
pubDate: 2026-08-16
tags: [embodied-ai, robotics, VLA, scaling, world-models]
locale: en
---

A language model can pass the bar exam. An image model can paint anything you describe. The robot arm that is supposed to load your dishwasher still fails often enough that nobody will ship one.

The strange part is that the machinery is shared now. Robot AI's most visible family is the **VLA — vision-language-action model**: camera frames and a text instruction go in, motor commands come out, one network end to end. It has siblings: **world-action models (WAMs)**, which learn to predict future observations and actions together<sup><a href="#ref-1">[1]</a></sup>; systems where a language model writes code that calls motion primitives<sup><a href="#ref-2">[2]</a></sup>; diffusion- and flow-based policies that generate whole motion trajectories<sup><a href="#ref-3">[3]</a></sup>. The architectures differ; the symptom doesn't. In every family, the vision and language components — pretrained on the internet — generalize well, and the action component is where generalization stops.

Why is action the exception? The classic hand-wave is Moravec's paradox — "hard things are easy, easy things are hard"<sup><a href="#ref-4">[4]</a></sup> — which names the pattern without explaining anything. The explanation that actually holds up has two halves, and neither is mysterious. One is **statistical**: even on identical data, action is a worse-behaved learning target than pixels — it overfits where vision doesn't, for reasons you can demonstrate in a hundred lines of Python. The other is about **prices**: vision and language trained on signal the world had already produced for free, while every hour of action signal has to be bought. Statistics first, prices second — and at the end, the one place where both problems pile up.

## What a "scaling moment" is made of

When people say language and vision "scaled," they mean two specific things happened at once.

**First, progress became predictable.** In 2020, researchers measured that a language model's error falls along a smooth power law as you add data and compute — a straight line on a log-log plot, holding across seven orders of magnitude<sup><a href="#ref-5">[5]</a></sup>. Later work pinned the exponents down precisely enough that labs now budget nine-figure training runs off the curve<sup><a href="#ref-6">[6]</a></sup>. GPT-3 was the proof that the plan pays: abilities like few-shot learning showed up as a function of scale, not of any new architecture<sup><a href="#ref-7">[7]</a></sup>. Vision ran the same play: from AlexNet learning on 1.2 million labeled photos<sup><a href="#ref-8">[8]</a></sup> to CLIP learning from 400 million image-text pairs scraped off the web<sup><a href="#ref-9">[9]</a></sup> to LAION's 5.85 billion<sup><a href="#ref-10">[10]</a></sup>.

**Second — the half people forget — the fuel was free.** The web already existed. Every forum argument, every product review, every captioned photo was produced by people for their own reasons, and was already digitized. Researchers call this *found data*: data that exists as a byproduct of normal life. GPT-3's training set was mostly Common Crawl, a nonprofit's free archive of the web<sup><a href="#ref-7">[7]</a>,<a href="#ref-11">[11]</a></sup>; LAION was sieved out of the same archive<sup><a href="#ref-10">[10]</a></sup>. The trillionth token cost roughly as much as the first: nothing.

A scaling moment, then, is a predictable curve plus free fuel. Action is missing both — with an asterisk on the curves that we'll come to: robotics does have curves, but they run along an unexpected axis and are measured on proxies that can lie. Before any of that, though, there is a deeper problem — one that no amount of fuel would fix.

## Same data, two different targets

Here is a puzzle that dataset size cannot explain, and anyone who has trained one of these models has run into it. Take one fixed robot dataset — say Open X-Embodiment, the field's flagship shared collection<sup><a href="#ref-12">[12]</a></sup> — and train a model on the very same trajectories with two prediction heads. One head predicts the upcoming video frames. The other predicts the recorded actions. The visual head behaves: training and validation losses fall together. The action head misbehaves: training accuracy keeps climbing while validation accuracy rises, peaks, and then *sinks* — the textbook overfitting curve. Dyna Robotics reports exactly this at million-hour scale: models trained on actions alone "plateau and overfit," and co-training on video prediction is what stabilizes them<sup><a href="#ref-13">[13]</a></sup>.

Same trajectories. Same network. One target generalizes, the other memorizes. Why?

The answer is one idea: **the two targets sit on opposite sides of the demonstrator's decisions.**

Every timestep of a demonstration follows the same causal chain: the demonstrator decides → the hand executes → the world shows the result.

Predicting the next frame is a *downstream* question: given the motion so far, what happens next? By the time you ask it, the decision has already been made — and its consequences are already visible, because the velocity between two frames is the executed record of the recent commands. The hard part is over before the question is posed.

Predicting the action is an *upstream* question: what will this person decide, right now? At a genuine decision point, the observation does not contain the answer. Two demonstrators in the same position go opposite ways around an obstacle. The same demonstrator turns early on Monday and late on Tuesday, with hand tremor on top. None of that is in the pixels — it is still inside the person. (Researchers write this irreducible share as the conditional action entropy, H(a|o): how much of the action remains uncertain after you've seen everything the observation has to offer.)

One more step turns "hard to predict" into "overfits" — and it answers an objection you should be raising: *if the action is genuinely unpredictable, shouldn't it be equally unpredictable on the training set?*

It would be — if the network had to predict it there. It doesn't. On the training set, the unpredictable part can be *remembered* instead. The coin flip in episode 137 is no longer a random variable; it is a recorded fact, and a network with spare capacity will store it, indexed by whatever incidental features identify that episode. So training error sinks *below the floor of what is predictable* — not by learning more, but by storing more. On fresh validation episodes the coins are re-rolled, there is nothing to look up, and error cannot go below the floor. In fact it climbs above it: a function bent to pass through stored noise is warped everywhere in between, so every memorized coin makes predictions on new episodes slightly worse. This is the documented behavior of networks trained on noisy labels — learn the true pattern first, then memorize the noise, with validation turning down at the moment memorization begins<sup><a href="#ref-14">[14]</a>,<a href="#ref-15">[15]</a></sup>. The whole up-then-down curve compresses into one line: **training error below the floor measures memorization; validation error above the floor measures the damage memorization does.**

Three smaller effects pile on:

- **The visual loss has a cushion.** A frame is hundreds of thousands of numbers, most of which — background, table, lighting — continue predictably. The visual loss is an average dominated by easy, transferable structure. An action is 7–24 numbers, all decision; every miss lands on what matters. (Caveat: mask the visual loss to just the gripper-and-object pixels and part of the gap comes back. The cushion pads the average; it doesn't solve manipulation.)
- **The action head can cheat.** Actions are smooth, so copying the previous action scores well while learning nothing — the "copycat problem"<sup><a href="#ref-16">[16]</a></sup>. Background details can identify *which episode this is*, unlocking a memorized sequence — "causal confusion"<sup><a href="#ref-17">[17]</a></sup>. Real systems fail exactly this way: VLAs above 90% on the LIBERO benchmark drop to 0% when objects are shuffled, diagnosed as memorized action sequences<sup><a href="#ref-18">[18]</a></sup>, and pooled corpora make it worse — policies trained on fragmented multi-lab datasets learn to recognize *which sub-dataset they're in* from backgrounds and embodiment cues, then replay that fragment's habits<sup><a href="#ref-19">[19]</a></sup>. Pixels offer no such shortcut — you can't predict a million numbers by copying a label.
- **Fewer real samples than it looks.** Every frame samples the same shared physics. Actions carry new information only at decision points — a 200-step trajectory might contain five independent choices, with autocorrelated filler between. Counted in decisions, the same dataset is thousands of times smaller for the action head.

All of this is checkable in miniature. I built the smallest version I could<sup><a href="#ref-20">[20]</a></sup>:

**Setup.** A simulated 2D robot crosses a table to a goal, detouring around an obstacle. Each demonstration carries hidden state the observations never show: which side the demonstrator chose (a coin flip), their turn-early-or-late style, and jitter on their command signal. The "arm" has inertia, so observed positions are a smoothed version of the raw commands — a camera sees the filtered arm; the teleop log stores the raw signal. Both heads get the identical input (the last two positions). The vision head predicts the next position; the action head predicts the raw command.

![Experiment setup: left, simulated demonstrations forking left or right around an obstacle, colored by the hidden coin; right, one episode's two records of the same motion — the jagged raw command versus the smooth inertia-filtered trace](/images/blog/action-bottleneck/fig-setup.svg)

*The setup. Left: demonstrations fork on a hidden coin, with turn-early/turn-late style spread. Right: the two records of one and the same motion — the action label is the jagged orange command; the observation is the smooth blue response. Both heads see identical inputs.*

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
#   vision head predicts pos_next   -> the world's filtered response
#   action head predicts cmd        -> the human's raw signal
# Model 1: nearest neighbor (pure memorizer), 200 train / 200 val episodes
# Model 2: MLP 4 -> 240 tanh -> 2, gradient descent, 8 train / 150 val episodes
```

</details>

**Result.** The memorizer first. Training error: zero on both heads — a memorizer memorizes everything equally. Validation error, normalized so 1.0 means "no better than guessing the average": vision 0.003, action 0.631 — about **190 times worse**, from the same inputs, same data, same model. Near the decision zone the action error climbs to 0.75.

The same asymmetry has a time axis. Replace the memorizer with a small neural network trained by gradient descent, and — to mirror the reality of per-task robot data — give it only *eight* demonstrations. The vision head barely notices the poverty: training and validation error fall together to 0.0014 and 0.0019 and stay overlapped for four thousand epochs. Eight episodes are enough, because the target is the shared physics. The action head draws the curve every practitioner has seen: validation error bottoms out almost immediately (0.53, epoch 45), then climbs for the rest of training while training error keeps falling — 0.31 versus 0.60 by the end. Read those numbers against the floor: the best validation error, 0.53, approximates this target's unpredictability floor. Training error at 0.31 sits well below the floor — that distance is pure memorization. Validation error at 0.60 sits above it — that distance is the damage.

![Training curves: the vision head's train and validation errors overlap near zero for 4,000 epochs; the action head's validation error bottoms out at epoch 45 and rises while its training error keeps falling](/images/blog/action-bottleneck/fig-curves.svg)

*Same data, same network, same training — only the target differs. The vision head's two curves overlap at the floor. The action head's validation error turns upward after epoch 45: from there on, everything "learned" is noise.*

**Which hidden variable does the damage?** Turn them off one at a time (memorizer version; validation error, 1.0 = guessing the mean):

| Variant | Action head | Vision head |
|---|---|---|
| Everything hidden (coin + style + jitter) | 0.62 | 0.003 |
| Jitter only — pure noise | 0.36 | 0.002 |
| Decisions only — zero noise anywhere | 0.28 | 0.001 |
| Everything hidden, but predict the *executed* velocity | 0.22 | 0.003 |

Two rows matter most. Row three: remove every source of randomness — a fully deterministic world — and the action head is *still* ~200x worse, because unobserved decisions hurt exactly like noise, and unlike noise they can't be cleaned away: they are the signal. Row four: predict the same motion one step downstream — the executed, filtered velocity instead of the raw command — and the error drops threefold. The difficulty isn't "action" as a category. It's distance upstream: the closer the target sits to the hidden decision, the less of it any observation can explain.

**Conclusion.** Overfitting isn't a bug in your training run. It is the action channel telling you how much of itself was never learnable from observation alone.

You can see the field quietly agreeing with this diagnosis in its own habits: nobody trains an action head alone anymore. Dyna-2 stabilizes its action learning with video co-training<sup><a href="#ref-13">[13]</a></sup>; Physical Intelligence goes further and *blocks the action head's gradients* from touching the language backbone, co-training the backbone on web data instead, because raw action gradients measurably degrade it<sup><a href="#ref-21">[21]</a></sup>. The vision and language objectives act as ballast for a target too thin and too noisy to sail on its own.

The controlled evidence arrived in 2026. Toyota Research Institute ran the cleanest co-training study to date — 89 policies, 58,000 simulated and 2,835 real-robot trials — and found exactly this pattern: the data that most improves a robot policy is *vision-language* data for the backbone, while robot-only training measurably erodes the backbone's abilities<sup><a href="#ref-22">[22]</a></sup>. The same study carried a result that should sting anyone betting on cleverer action representations: discrete action tokens and latent actions extracted from video produced no statistically significant gains, and one action-token scheme actively *decreased* generalization<sup><a href="#ref-22">[22]</a></sup>. Meanwhile the hidden-style variable from our toy has been measured at industrial scale: AgiBot found that *operator diversity* — different teleoperators' personal styles in otherwise identical situations — can actively hurt training, and that debiasing operators' velocity profiles helps<sup><a href="#ref-23">[23]</a></sup>. In our terms: they lowered H(a|o), the unpredictable share of the action channel, and got a better policy for it.

So each action sample teaches less and misleads more. That is the first half of the explanation. The second half is that each action sample also *costs* more — and here the story leaves the GPU and enters the accounting department.

## Robots joined the internet economy without an internet

Think about the last time you cooked dinner. Your hands made thousands of tiny corrections — regripping the knife, easing off as the tomato skin gave way. How much of that was recorded? Nothing. Humanity generates motor data constantly and has never logged any of it.

So robot data cannot be found; it has to be **manufactured**. The standard method is *teleoperation*: a person wearing VR controllers or holding a leader arm puppets the robot through a task while every joint angle and camera frame is recorded. One hour of skilled labor produces one hour of data — minus failed takes and scene resets. Vendor pricing runs from tens of dollars to around $200 per fully-loaded hour<sup><a href="#ref-24">[24]</a></sup>.

The resulting gap is hard to overstate. Llama 3 trained on ~15 trillion words of found text<sup><a href="#ref-25">[25]</a></sup> — one estimate puts LLM-scale corpora at the equivalent of 100,000 years of human reading<sup><a href="#ref-26">[26]</a></sup>. All the major open robot datasets combined total about 11,000 hours<sup><a href="#ref-12">[12]</a>,<a href="#ref-27">[27]</a></sup>. Eleven thousand hours is *fifteen months* of round-the-clock experience. That is the field's entire shared inheritance, versus a species' worth of text.

## The "free" data that wasn't

The obvious workaround: humans move all day, so record *them*. Strap on head cameras and wearable sensors, skip the robot entirely, and millions of hours look reachable. Two flagship 2026 results made it concrete. **Dyna-2** trained on one million hours of egocentric human video and found a genuine scaling law — more human hours, measurably better robot<sup><a href="#ref-13">[13]</a></sup>. **GEN-1** pretrained with a corpus that, in the company's own words, "contains no robot data"<sup><a href="#ref-28">[28]</a></sup>.

Now the fine print. GEN-1's corpus comes from "low-cost wearable devices on humans doing millions of activities"<sup><a href="#ref-28">[28]</a></sup> — devices someone bought, worn by people someone recruited. Dyna-2's million hours were "collected by our data partners as well as our own internal operation"<sup><a href="#ref-13">[13]</a></sup>.

**Commissioned.** Both of them. Paid for by the hour. *Commissioned data* — data that exists only because someone funded its creation — is the opposite of found data, whatever the marketing says. And once you see it, you see there is no found route anywhere in robotics. The web crawl that powered language and vision has no analogue here.

So the real question became: which data is cheaper to buy *per unit of robot skill*? That has numbers. A commissioned human hour runs roughly 2–39x cheaper than a commissioned robot hour<sup><a href="#ref-29">[29]</a></sup>. But human data carries a transfer penalty: train on a million human hours, and the model's zero-shot predictions of *robot* actions come out about 3x worse than its predictions of human actions (2.87x, in Dyna-2's own measurement)<sup><a href="#ref-13">[13]</a></sup>. This is the **embodiment gap**: watching a thousand hours of chopstick use teaches a lot about food and grip strategy, and still doesn't hand a two-fingered rubber gripper the motor program. Bodies don't share muscle memory. Put the discount against the price advantage and the two routes land within an order of magnitude of each other<sup><a href="#ref-29">[29]</a></sup> — which is why half the industry buys teleoperation, the other half buys wearables, and neither is running away with it.

## Every skill still needs an anchor

Whatever the pretraining diet, one ingredient appears in every published system: a small dose of data collected *on the actual robot, doing the actual task*. Call it the **anchor**. In Dyna-2's case it is ten hours or less per task<sup><a href="#ref-13">[13]</a></sup>; across the record, no demonstrated precision skill — millimeter insertion, latch opening, careful placement — exists without one.

The anchor has two awkward properties. **It doesn't transfer**: ten hours of lockbox data buys lockbox opening, not shirt folding — a pianist who must practice ten hours for every new song, on every piano separately. **Scale doesn't replace it, but scale works through it**: Dyna-2's lockbox task, with the identical ten-hour anchor, scores 0% when the video corpus is 100,000 hours and 90% at a million<sup><a href="#ref-13">[13]</a></sup>. Read both halves: video pretraining genuinely unlocked the skill, *and* the anchor stayed mandatory the whole way.

The economics follow directly. An anchor costs a few hundred to a couple thousand dollars of robot time; a tenfold corpus expansion costs tens of millions. If giant corpora were justified as anchor-removers, the math would collapse instantly — erasing every anchor-hour in GEN-1's published portfolio would save about $7,000<sup><a href="#ref-28">[28]</a>,<a href="#ref-29">[29]</a></sup>. The per-task, per-robot line item that scaling was supposed to delete is still sitting in every pipeline.

And is the embodiment gap at least *closing* with scale? Honestly: unknown. The published curve rests on four corpus sizes; fit it, ask where human-video pretraining matches robot-native performance, and the statistically consistent answers run from ten million hours to roughly 10¹⁷ — the latter on the order of all hours humanity has ever lived<sup><a href="#ref-29">[29]</a></sup>. That is not a forecast; it is a shrug with error bars. Treat any "N billion hours to human-level" headline accordingly.

## What scaling actually buys

None of this means scale does nothing. It means scale pays out along an unexpected axis.

The cleanest real-robot data-scaling study to date — 40,000+ demonstrations, 15,000+ evaluation rollouts — found that a policy's generalization follows a power law in the number of training *environments and objects*, while demonstrations *per* environment saturate fast, at around fifty<sup><a href="#ref-30">[30]</a></sup>. The practical translation is startling: four data collectors, one afternoon, thirty-two environment-object pairs — roughly 90% success in entirely new environments with unseen objects<sup><a href="#ref-30">[30]</a></sup>. AgiBot's million-trajectory study agrees from the industrial side — task diversity beats per-task quantity<sup><a href="#ref-23">[23]</a></sup> — and a controlled follow-up found that the diversity dimensions that matter most are unglamorous ones: camera poses and spatial arrangements<sup><a href="#ref-31">[31]</a></sup>.

Notice how neatly this matches the overfitting story. Another demonstration of the *same* condition mostly re-samples the same hidden coins — more memorizable noise. A *new* environment adds structure that the shared, learnable layers can actually absorb. Scale works where the sharing works. And notice what it does to the LLM analogy: the axis that scales is exactly the one you cannot scrape. More hours in the same kitchen are cheap; more *kitchens* is a logistics operation.

The curves that do look LLM-clean live on proxy metrics. Xiaomi's robot foundation model, pretrained on 100K+ hours of handheld-gripper data, reports validation action error falling steadily as data and model grow — a genuinely Chinchilla-shaped curve<sup><a href="#ref-32">[32]</a></sup>. But validation error is an *open-loop* number: it grades predictions against recorded data, frame by frame, without ever executing them. Whether it predicts a working robot is exactly the question — and the sharpest answer on record comes from autonomous driving, where a 30,000-hour study fit a near-perfect open-loop power law (correlation −0.963) and then reported plainly that the relationship does not hold in closed-loop evaluation, where the model actually drives<sup><a href="#ref-33">[33]</a></sup>. The curve was real; the capability it implied was not. (Every number in our toy experiment above is open-loop too — the divergence documented here says closed-loop reality is harsher still.)

## Testing is the hidden tax

A quieter reason language models improved fast: *measuring* them is free. An evaluation is a script — thousands of questions, minutes, zero dollars, perfectly repeatable. A robot evaluation is a physical event: stage the scene, run the policy, watch it succeed or drop the cup, reset, repeat, with a human standing there throughout.

And closed-loop is the only evaluation that counts, because a policy — unlike a chatbot benchmark — generates its own test distribution. Each small error moves the robot into a state slightly outside the demonstrations, where it errs a bit more, producing a stranger state still. Imitation theory prices this compounding at horizon-squared: per-step error ε becomes order εH² over a task of length H<sup><a href="#ref-34">[34]</a></sup>, and that quadratic is provably a floor for any offline method, not an artifact of weak algorithms — the missing information is *recovery behavior*, which demonstration datasets simply don't contain<sup><a href="#ref-35">[35]</a></sup>. The known escape routes map onto the field's current agenda: losses that learn calibrated distributions instead of point estimates can cancel the penalty in forgiving environments<sup><a href="#ref-36">[36]</a></sup> — part of why language models, trained with log-loss on a medium full of written self-correction, degrade gracefully where regression-trained policies snap — and training on the policy's *own* rollouts plus corrections closes the distribution gap directly, which is what Physical Intelligence's RECAP recipe does, reporting roughly halved failure rates on its hardest tasks<sup><a href="#ref-37">[37]</a></sup>.

How many repeats do you need? Checkable in a hundred lines of Python<sup><a href="#ref-20">[20]</a></sup>:

**Setup.** Two simulated policies with true success rates 80% and 75%. "Evaluate" each with N trials, declare the higher scorer better, repeat the comparison 40,000 times, count wrong verdicts.

**Result.** At N=10 per policy — the norm in published papers<sup><a href="#ref-38">[38]</a></sup> — the verdict is wrong or tied about half the time. At N=20, 42%. At N=100, still 22%. And pinning a single policy's success rate within ±2 points takes ~1,030 trials, matching published statistical guidance<sup><a href="#ref-39">[39]</a>,<a href="#ref-40">[40]</a></sup>.

**Conclusion.** At the field's typical sample sizes, a claimed 5-point improvement is close to a coin flip. Doing it properly costs a day of robot time *per comparison*, versus seconds for an LLM benchmark. Scaling ran on fast iteration; robotics pays a toll at every lap.

Simulation partially works: the SIMPLER benchmark reproduces real policy *rankings* at correlation r=0.924<sup><a href="#ref-41">[41]</a></sup>, and automated cells now run real-robot evaluations without a human<sup><a href="#ref-42">[42]</a></sup>. But SIMPLER's own scope statement limits it to "rigid-object manipulation tasks, as their physics are most straight-forward to simulate"<sup><a href="#ref-41">[41]</a></sup>. Rigid objects. Which brings everything to a single address.

## The wall has an address: contact

Rigid-body tasks — move the block, pick the bottle — are where robot data is most plentiful, simulators most faithful, evaluation cheapest. **Contact-rich** tasks — snug insertion, cloth, anything soft or slippery — are where all three break at once. Three properties of contact cause it.

**Cameras can't see forces.** Watch a video of a hand holding a paper cup: is the grip secure, or one newton from crushing it? The pixels are identical. Grip force, friction, incipient slip — the variables that decide fine manipulation are invisible to the sensor that supplies 99% of robot training data. The channel that carries them — touch — was never digitized at scale: a 2026 tactile paper calls its 100-hour dataset "large-scale," and within that field, it is<sup><a href="#ref-43">[43]</a></sup>. One hundred hours, next to a million hours of video. (Touch isn't strictly required — surgeons completed millions of da Vinci procedures with zero force feedback before it shipped in 2024<sup><a href="#ref-44">[44]</a></sup> — but wherever precision meets uncertainty, it buys a lot.)

**Contact physics amplifies tiny differences.** Also checkable at home<sup><a href="#ref-20">[20]</a></sup>:

**Setup.** Simulate pushing a heavy block: force ramps up, the block sticks, then breaks free and slides — the stick-slip jerk you feel pushing furniture. Run 400 trials with friction varied by ±1% (a slightly damp table gives you that for free), against a control system with smooth damping and the same ±1%.

**Result.** The smooth system's outcomes vary by about 1% — noise in, noise out. The stick-slip system near its threshold spreads **83x wider**; some trials barely move, others shoot past. Far from the threshold, the effect nearly vanishes.

**Conclusion.** Near contact transitions, visually identical situations produce wildly different outcomes — and real-hardware measurements show the same: repeated identical pushes of one object yield a whole distribution of results<sup><a href="#ref-45">[45]</a></sup>. That's why contact tasks need many demonstrations (each lands differently), why simulators disagree with reality precisely here (a 1% modeling error explodes), and why evaluation needs many trials (single runs mean nothing). One phenomenon, three bills. Note this is the hidden-decision problem from the overfitting section wearing different clothes: contact is where the world itself injects the coin flips into the action channel.

Stack it up: touch data is scarcest where contact matters, simulation weakest where contact matters, evaluation dearest where contact matters — and the action channel's inherent noisiness peaks where contact matters. The walls are one wall, standing exactly where a robot's fingers meet the world.

## So why is action the exception?

Because action is both the worse student and the more expensive tuition.

**Statistically**, action prediction is an upstream question: it must guess decisions at the moment they are made, before their consequences appear in any observation. Whatever the observation doesn't determine behaves as noise, invites shortcuts, and gets memorized. That is why the action head overfits while the visual head — predicting downstream of every decision — doesn't, on identical data.

**Economically**, what the signal can't give you for free, you must buy: commissioned human video at a ~3x embodiment discount, or commissioned robot hours at full price, plus a mandatory per-task anchor, plus real-hardware evaluation wherever contact is involved — which is exactly where the valuable tasks live.

Notice what's absent: no impossibility, no paradox, no missing genius. A signal-quality problem and a price list. That is the optimistic reading — paradoxes don't yield to engineering, but noise can be modeled, shortcuts can be regularized away, and prices fall on published curves.

## What to watch

Signals that would mean this picture is breaking:

1. **An action-only model that scales cleanly** — no video co-training ballast, no gradient insulation — would mean the statistical half has been solved at the objective level, not patched.
2. **An anchor-free precision demo**: millimeter-tolerance work with zero task-specific robot data. No published system has done it; the day one does, the per-task line item starts dying.
3. **Human-video corpora reaching ~10 million hours**, where the competing theories of the embodiment gap separate measurably<sup><a href="#ref-29">[29]</a></sup>. Current collection rates arrive in two to three years<sup><a href="#ref-28">[28]</a>,<a href="#ref-46">[46]</a></sup>.
4. **A simulator that ranks policies correctly on cloth or deformables** — the result SIMPLER's authors scope away from today<sup><a href="#ref-41">[41]</a></sup>.
5. **Wearable capture under ~$0.10 per usable hour**, two orders of magnitude below current disclosures — the cost parity between human and robot data flips.

One caveat to carry: the load-bearing 2026 numbers here — Dyna-2's, GEN-1's — are self-reported by the labs that produced them, and nobody can independently replicate a million-hour training run. I've verified what the sources say; whether it reproduces is a different question. That uncertainty is, fittingly, the evaluation bottleneck again — and it's the part of this essay I expect to age fastest.

<details>
<summary><strong>References</strong> (click to expand)</summary>
<ol>
<li id="ref-1">Wang et al., "World Action Models" survey, 2026. <a href="https://arxiv.org/abs/2605.12090">arXiv:2605.12090</a>.</li>
<li id="ref-2">Liang et al., "Code as Policies: Language Model Programs for Embodied Control," 2022. <a href="https://arxiv.org/abs/2209.07753">arXiv:2209.07753</a>.</li>
<li id="ref-3">Chi et al., "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion," RSS 2023. <a href="https://arxiv.org/abs/2303.04137">arXiv:2303.04137</a>.</li>
<li id="ref-4">Hans Moravec, <em>Mind Children</em> (1988); overview: <a href="https://en.wikipedia.org/wiki/Moravec%27s_paradox">Moravec's paradox — Wikipedia</a>.</li>
<li id="ref-5">Kaplan et al., "Scaling Laws for Neural Language Models," 2020. <a href="https://arxiv.org/abs/2001.08361">arXiv:2001.08361</a>.</li>
<li id="ref-6">Hoffmann et al., "Training Compute-Optimal Large Language Models" (Chinchilla), NeurIPS 2022. <a href="https://arxiv.org/abs/2203.15556">arXiv:2203.15556</a>.</li>
<li id="ref-7">Brown et al., "Language Models are Few-Shot Learners" (GPT-3), NeurIPS 2020. <a href="https://arxiv.org/abs/2005.14165">arXiv:2005.14165</a>.</li>
<li id="ref-8">Krizhevsky, Sutskever &amp; Hinton, "ImageNet Classification with Deep Convolutional Neural Networks" (AlexNet), NeurIPS 2012. <a href="https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html">paper</a>.</li>
<li id="ref-9">Radford et al., "Learning Transferable Visual Models From Natural Language Supervision" (CLIP), ICML 2021. <a href="https://arxiv.org/abs/2103.00020">arXiv:2103.00020</a>.</li>
<li id="ref-10">Schuhmann et al., "LAION-5B," NeurIPS 2022 (5.85B pairs filtered from Common Crawl). <a href="https://arxiv.org/abs/2210.08402">arXiv:2210.08402</a>.</li>
<li id="ref-11">Common Crawl — nonprofit web archive, free to use. <a href="https://commoncrawl.org/">commoncrawl.org</a>.</li>
<li id="ref-12">Open X-Embodiment Collaboration, "Open X-Embodiment: Robotic Learning Datasets and RT-X Models," 2023 (~1M trajectories, 22 robot types, 34 labs). <a href="https://arxiv.org/abs/2310.08864">arXiv:2310.08864</a>.</li>
<li id="ref-13">Dyna Robotics, "Dyna-2: A 1-Million-Hour Scaling Law for Robot Manipulation," August 2026. <a href="https://www.dyna.co/research/dyna-2">dyna.co/research/dyna-2</a>. The action-only overfitting observation, corpus-provenance quote, 2.87x zero-shot human→robot gap, ≤10-hour per-task anchor, and lockbox 0%→90% ladder are from this report.</li>
<li id="ref-14">Zhang et al., "Understanding Deep Learning Requires Rethinking Generalization," ICLR 2017. <a href="https://arxiv.org/abs/1611.03530">arXiv:1611.03530</a>.</li>
<li id="ref-15">Arpit et al., "A Closer Look at Memorization in Deep Networks," ICML 2017 (networks learn patterns first, then memorize noise). <a href="https://arxiv.org/abs/1706.05394">arXiv:1706.05394</a>.</li>
<li id="ref-16">Wen et al., "Fighting Copycat Agents in Behavioral Cloning from Observation Histories," NeurIPS 2020. <a href="https://arxiv.org/abs/2010.14876">arXiv:2010.14876</a>.</li>
<li id="ref-17">de Haan, Jayaraman &amp; Levine, "Causal Confusion in Imitation Learning," NeurIPS 2019. <a href="https://arxiv.org/abs/1905.11979">arXiv:1905.11979</a>.</li>
<li id="ref-18">LIBERO-PRO, 2025 (models &gt;90% on LIBERO collapse to ~0% under object/layout perturbation; diagnosed as rote memorization of action sequences). <a href="https://arxiv.org/abs/2510.03827">arXiv:2510.03827</a>.</li>
<li id="ref-19">Xing et al., "Shortcut Learning in Generalist Robot Policies: The Role of Dataset Diversity and Fragmentation," CoRL 2025. <a href="https://arxiv.org/abs/2508.06426">arXiv:2508.06426</a>.</li>
<li id="ref-20">The three experiments in this essay (differential overfitting; evaluation statistics; stick-slip dispersion) are my own pure-Python simulations, ~100 lines each, setups as described in the text.</li>
<li id="ref-21">Driess et al., "Knowledge Insulating Vision-Language-Action Models," Physical Intelligence, 2025 (action gradients degrade the VLM backbone; fix: gradient insulation + web co-training). <a href="https://arxiv.org/abs/2505.23705">arXiv:2505.23705</a>.</li>
<li id="ref-22">Lin et al. (Toyota Research Institute), "A Systematic Study of Data Modalities and Strategies for Co-training Large Behavior Models," 2026 (89 policies, 58K sim + 2,835 real trials). <a href="https://arxiv.org/abs/2602.01067">arXiv:2602.01067</a>.</li>
<li id="ref-23">Shi, Chen et al. (AgiBot), "Is Diversity All You Need for Scalable Robotic Manipulation?," 2025 (task diversity beats per-task quantity; operator-diversity debiasing helps). <a href="https://arxiv.org/abs/2507.06219">arXiv:2507.06219</a>.</li>
<li id="ref-24">Silicon Valley Robotics Center, robot training-data collection cost guide (fully-loaded teleoperation quotes span roughly $15–200/hour across vendors). <a href="https://www.roboticscenter.ai/learn/collect-robot-training-data">roboticscenter.ai</a>.</li>
<li id="ref-25">Grattafiori et al., "The Llama 3 Herd of Models," 2024 (~15T training tokens). <a href="https://arxiv.org/abs/2407.21783">arXiv:2407.21783</a>.</li>
<li id="ref-26">Ken Goldberg, "Good old-fashioned engineering can close the 100,000-year data gap in robotics," <em>Science Robotics</em>, 2025. <a href="https://www.science.org/doi/10.1126/scirobotics.aea7390">doi:10.1126/scirobotics.aea7390</a>.</li>
<li id="ref-27">Qwen-RobotManip technical report, 2026 (nine major open robot datasets total ~11,000 hours). <a href="https://arxiv.org/abs/2606.17846">arXiv:2606.17846</a>.</li>
<li id="ref-28">Generalist AI, "GEN-1," 2026 ("The pretraining dataset contains no robot data"; wearable-device corpus). <a href="https://generalistai.com/blog/gen-1">generalistai.com/blog/gen-1</a>.</li>
<li id="ref-29">The 2–39x price ratio, cost-adjusted parity, ~$7,000 anchor-substitution ceiling, gap-closure extrapolation interval (~10⁷–10¹⁷ hours), and the 10⁷-hour discriminator are my own calculations from the disclosures in [13], [24], [28], and [46] (curve refits with floor terms, bootstrap confidence intervals, break-even accounting).</li>
<li id="ref-30">Lin, Hu et al., "Data Scaling Laws in Imitation Learning for Robotic Manipulation," ICLR 2025 oral (generalization is a power law in environment/object diversity; demos-per-condition saturate ~50). <a href="https://arxiv.org/abs/2410.18647">arXiv:2410.18647</a>.</li>
<li id="ref-31">Saxena, Bronars et al., "What Matters in Learning from Large-Scale Datasets for Robot Manipulation" (MimicLabs), ICLR 2025. <a href="https://arxiv.org/abs/2506.13536">arXiv:2506.13536</a>.</li>
<li id="ref-32">Xiaomi Robotics, "Xiaomi-Robotics-1: Scaling Vision-Language-Action Models with over 100K Hours of Real Data," 2026. <a href="https://arxiv.org/abs/2607.15330">arXiv:2607.15330</a>.</li>
<li id="ref-33">Zheng et al., "Data Scaling Laws for Imitation Learning-Based End-to-End Autonomous Driving," 2024 (open-loop power law, r = −0.963, that fails to transfer to closed-loop). <a href="https://arxiv.org/abs/2412.02689">arXiv:2412.02689</a>.</li>
<li id="ref-34">Ross, Gordon &amp; Bagnell, "A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning" (DAgger; the compounding-error analysis), AISTATS 2011. <a href="https://arxiv.org/abs/1011.0686">arXiv:1011.0686</a>.</li>
<li id="ref-35">Rajaraman et al., "Toward the Fundamental Limits of Imitation Learning," NeurIPS 2020 (the horizon-squared lower bound for offline imitation). <a href="https://arxiv.org/abs/2009.05990">arXiv:2009.05990</a>.</li>
<li id="ref-36">Foster, Block &amp; Misra, "Is Behavior Cloning All You Need? Understanding Horizon in Imitation Learning," 2024 (log-loss BC can be horizon-independent under recoverability). <a href="https://arxiv.org/abs/2407.15007">arXiv:2407.15007</a>.</li>
<li id="ref-37">Physical Intelligence, "π*0.6: a VLA That Learns From Experience" (RECAP), 2025. <a href="https://arxiv.org/abs/2511.14759">arXiv:2511.14759</a> · <a href="https://www.pi.website/blog/pistar06">π blog</a>.</li>
<li id="ref-38">PhAIL survey of real-robot VLA evaluation practice (modal N=10–20 per condition, typically without confidence intervals), 2026. <a href="https://arxiv.org/abs/2605.29710">arXiv:2605.29710</a>.</li>
<li id="ref-39">NVIDIA Technical Blog, "How to Evaluate General-Purpose Robot Policies for Real-World Deployment" (Clopper-Pearson trial-count arithmetic). <a href="https://developer.nvidia.com/blog/how-to-evaluate-general-purpose-robot-policies-for-real-world-deployment/">developer.nvidia.com</a>.</li>
<li id="ref-40">Toyota Research Institute, "A Careful Examination of Large Behavior Models" (blind randomized A/B evaluation at scale). <a href="https://toyotaresearchinstitute.github.io/lbm1/">toyotaresearchinstitute.github.io/lbm1</a>.</li>
<li id="ref-41">Li et al., "Evaluating Real-World Robot Manipulation Policies in Simulation" (SIMPLER), CoRL 2024. <a href="https://arxiv.org/abs/2405.05941">arXiv:2405.05941</a> · <a href="https://simpler-env.github.io/">simpler-env.github.io</a>.</li>
<li id="ref-42">Zhou et al., "AutoEval: Autonomous Evaluation of Generalist Robot Manipulation Policies in the Real World," 2025. <a href="https://arxiv.org/abs/2503.24278">arXiv:2503.24278</a>.</li>
<li id="ref-43">"T-Rex" tactile manipulation, 2026 (its ~100-hour corpus is described as large-scale for the tactile channel). <a href="https://arxiv.org/abs/2606.17055">arXiv:2606.17055</a>.</li>
<li id="ref-44">Intuitive Surgical, "Intuitive Announces FDA Clearance of da Vinci 5," March 2024 (first da Vinci generation with force feedback). <a href="https://isrg.intuitive.com/news-releases/news-release-details/intuitive-announces-fda-clearance-da-vinci-5">press release</a>.</li>
<li id="ref-45">Bauza &amp; Rodriguez, "A Probabilistic Data-Driven Model for Planar Pushing," 2017 (repeated identical pushes on real hardware yield a distribution of outcomes). <a href="https://arxiv.org/abs/1705.10664">arXiv:1705.10664</a>.</li>
<li id="ref-46">Generalist AI, "GEN-0," November 2025 (270K+ hours of manipulation data, growing ~10K hours/week). <a href="https://generalistai.com/blog/nov-04-2025-GEN-0">generalistai.com/blog/nov-04-2025-GEN-0</a>.</li>
</ol>
</details>
