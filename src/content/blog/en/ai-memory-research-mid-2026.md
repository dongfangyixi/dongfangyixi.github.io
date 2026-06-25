---
title: "The State of AI Memory Research, Mid-2026: A Review of 28 Papers"
description: "Two months of memory research, read end-to-end. The field is being forced past its founding assumption — that memory means an external store you retrieve from and rewrite after every turn."
pubDate: 2026-06-25
tags: ["memory", "agents", "survey", "RAG", "context-engineering", "continual-learning"]
locale: en
---

*I read 28 memory papers released between early April and mid-June 2026 — systems, benchmarks, position papers, one pure-theory result — and tried to read them against each other rather than one at a time. This is the synthesis: what the field assumed, what just broke, and where the load-bearing problems actually are. It is long. The executive summary and the two tables are enough if you only want the shape.*

---

## Executive summary

For three years the working definition of "agent memory" has been stable and mostly unexamined: keep an external store, retrieve from it by similarity, and let an LLM rewrite the store after every interaction. Call it the **retrieve-and-rewrite consensus**. Almost every production system runs on some version of it.

This quarter's papers are an attack on that consensus from three independent directions, and most of the authors don't seem to realize they're converging.

**First, the diagnostics.** A controlled study from UIUC (paper 22) shows that LLM-driven consolidation is a *compounding lossy rewrite* — feed a memory system correct experiences and let it self-update, and accuracy can fall **below a no-memory baseline** (GPT-5.4 on an ARC-AGI stream: 100% → 52.6% after ten rounds of self-consolidation). An NTU study (18) shows memory-augmented agents don't escape the continual-learning stability–plasticity dilemma; they relocate it from weight-space to retrieval-space. A new benchmark, STALE (20), shows the best frontier model can revise a stale belief only ~30% of the time even when the contradicting evidence is sitting in its retrieved context. And EvoMemBench (26), the most careful benchmark in the set, finds that **no external-memory method dominates long-context, and several drop below a no-memory baseline at 128K tokens**.

**Second, the theory.** A CUHK position paper (16) argues that retrieval is categorically *not* memory — it proves an Ω(k²) sample-complexity separation between retrieval (which scales with stored compositional examples) and parametric learning (which doesn't), independent of context-window size. Its title is the thesis: contextual agentic memory is a *memo*, not memory.

**Third, the constructive fork.** Everyone responding constructively is implicitly choosing a point on one axis: **where memory lives.** From the context window (optical compression, 15) → smarter external stores (most papers) → graphs and structured stores (08, 13, 14, 31) → all the way into model weights (MEMO, 24, literally trains a model to *be* the memory). The further right you go, the more durable and compositional the memory and the harder it is to update.

The strongest signal across all 28: **write-time is overtaking read-time as the hard problem.** What to store, when to consolidate, which beliefs to retire — these now matter more than retrieval ranking. STALE puts adjudication at write time; Auto-Dreamer (28) makes consolidation a *learned offline* operation; When-to-Forget (07) builds an outcome-driven forgetting primitive. Retrieval is close to solved relative to these.

My judgment, stated up front and defended at the end: the three most promising directions are **(1) learned offline consolidation** decoupled from acquisition, **(2) write-side validity and governance**, and **(3) parametric / black-box memory modules**. The crowded middle — "let an LLM continuously rewrite a text store" — is on a collision course with paper 22's result and will not survive contact with long deployments.

---

## The 28 papers

Dates and model names are reported as printed in each PDF.

| # | Short title | Group | Date | Memory locus | One-line contribution | Verdict |
|---|---|---|---|---|---|---|
| 02 | Memory in the LLM Era | CUHK-SZ / Huawei | Apr 1 | survey + bench | 4-stage taxonomy (extract/manage/store/retrieve) + same-framework re-impl of 10 methods | incremental, foundational |
| 03 | Memory Intelligence Agent | ECNU / Shanghai AI Lab | Apr 19 | param ↔ non-param | bidirectional episodic↔weights loop with online test-time RL for deep-research agents | genuinely new |
| 04 | PASK | NTU / NUS | Apr 9 | hierarchical | proactive streaming demand-detection + 3-tier user memory, <1s | new task, std memory |
| 05 | Artifacts as Memory | Openmind / Cohere | Apr 9 | environment | RL theorem: the *environment* can store memory; Artifact Reduction Theorem | genuinely new (theory) |
| 06 | Self-Evolving Extraction (CluE) | USC / UCSB | Apr 13 | external text | cluster-by-scenario evolution of the *extraction prompt* across heterogeneous tasks | incremental |
| 07 | When to Forget | Baris Simsek (solo) | Apr 13 | governance | outcome-driven per-memory "Memory Worth" with an a.s.-convergence proof | genuinely new (narrow) |
| 08 | GAM | ZJU / Rutgers | Apr 14 | graph + hier | sleep-consolidation FSM: buffer episodically, consolidate only at semantic boundaries | genuinely new |
| 09 | Memory Transfer Learning | KAIST / NYU | Apr 15 | external | cross-domain memory study: transferable value is *meta-knowledge*, not code | new findings |
| 10 | Prism | Roche (solo) | Apr 8 | hybrid | evolutionary multi-agent memory substrate w/ entropy stratification + replicator dynamics | incremental |
| 11 | SCG-MEM | UnionPay | Apr 22 | symbolic + graph | prefix-trie constrained decoding for memory keys → zero "structural hallucination" | genuinely new (mechanism) |
| 12 | Stateless Decision Memory (DPM) | independent | Apr 22 | stateless log | event-sourcing for regulated agents; statelessness/replay as the real adoption driver | repackaging → framing |
| 13 | StructMem | ZJU / Ant | Apr 23 | hier event-graph | memory unit = temporally grounded *relational event*, not fact/triplet; ~18× cheaper than graph | incremental |
| 14 | HLTM (LinkedIn) | LinkedIn | May 30 | tree / schema | schema-aligned memory tree (privacy isolation + O(height) updates); deployed, real A/B | valuable industrial |
| 15 | OCR-Memory | HKU / UNT | Apr 29 | optical | store trajectories as images; Locate-and-Transcribe retrieval, >10× token compression | genuinely new (concept) |
| 16 | Memo, Not Memory | CUHK | Apr 30 | position | retrieval ≠ memory; Ω(k²) compositional sample-complexity separation | genuinely new (theory) |
| 17 | RepoDoc | Sun Yat-sen | Apr 29 | code KG | repo knowledge graph for doc generation + semantic-impact incremental updates | incremental |
| 18 | Continual Learning → Memory | NTU | Apr 29 | external | CL dilemma relocates to retrieval-space; "retrieval diversity collapse" | genuinely new (diagnostic) |
| 20 | STALE | Wuhan / HKUST | May 7 | symbolic state | implicit-conflict benchmark (Type I/II) + write-side belief adjudication (CUPMEM) | genuinely new (bench) |
| 21 | TreeMem | USTC / Tencent | May 6 | multi-agent | tree-structured rollouts → per-agent credit for RL-trained memory pipelines | incremental→new |
| 22 | Useful Memories Become Faulty | UIUC / Tsinghua | May 13 | diagnostic | LLM consolidation is a compounding lossy rewrite that can go below no-memory | genuinely new |
| 23 | EVOLVEMEM | UNC / Berkeley | May 13 | external | self-evolve the *retrieval configuration*, not just content, via AutoResearch loop | genuinely new (idea) |
| 24 | MEMO | NUS / MIT / A*STAR | May 20 | weights | memory *is* a trained model, queried as a black-box oracle; transfers across LLMs | genuinely new |
| 25 | MemRepair | Beihang / HKU | May 17 | hier (domain) | 3-tier memory (history-fix / security-pattern / failure→success) for vuln repair; SoTA | domain new |
| 26 | EvoMemBench | HKUST-GZ | Jun 15 | benchmark | unified 2×2 (scope × content) bench, 15 methods, single backbone | incremental, valuable |
| 27 | Rethinking How to Remember (TriMem) | HKBU / UT Austin | May 19 | tri-granular | raw + facts + profiles with source pointers; TextGrad lifelong prompt evolution | incremental→new |
| 28 | Auto-Dreamer | UIUC / UCSD | May 20 | external | learn offline consolidation as a GRPO-trained tool-using operator; "region rewriting" | genuinely new |
| 29 | MemGym | Rutgers / Princeton / MSR | May 20 | benchmark | memory-isolated scoring across coding/web/tool/search; learned compression critic | genuinely new (infra) |
| 31 | FluxMem | ZJU / Alibaba | May 27 | evolving graph | memory as editable connectivity; feedback-driven topology edits + maturity metric | genuinely new (framing) |

![The 2026 memory landscape: papers mapped by where memory physically lives (context window → external store → graph → weights) and whether the hard work is at read or write time.](/images/blog/memory-2026/memory-landscape.svg)

*Reading the map: the field's center of gravity (external text stores, read-side) is the crowded retrieve-and-rewrite consensus. The interesting work is leaving it — rightward into structure and weights, and upward into write-time consolidation and governance.*

---

## 1. The reckoning: diagnostics, benchmarks, and the case that the consensus is breaking

Start here, because the constructive papers make more sense once you've seen what they're reacting to.

**Useful Memories Become Faulty (22)** is the most important negative result of the quarter. The team builds ARC-AGI Stream, a controlled testbed with programmatic ground truth and an auditable vocabulary of memory operations (Retain / Delete / Consolidate), then runs the consolidators everyone cites — CLIN, Agent Workflow Memory, Dynamic Cheatsheet, ACE — and watches them degrade. The headline: GPT-5.4 solves a 19-problem ARC slice at 100% with no memory at all, and *streaming consolidation drives it to 52.6% by round 10*. WebShop's AWM degrades 0.64 → 0.20 as examples grow 8 → 128 (no-memory is also 0.20 — so the memory adds nothing but cost and noise). A raw-trajectory episodic baseline matches or beats every fancy consolidator. The mechanism is compounding: each rewrite is a lossy summary of the last, and the loss accumulates. This single finding undercuts the consolidation loops in at least half the other papers, none of which cite it (timing) or defend against it.

**Continual Learning → Memory (18)**, from NTU, is the theoretical companion to 22's empirics. Its claim: swapping weight updates for an external store does not dissolve the stability–plasticity dilemma — it moves it from weight-space interference to *retrieval-space competition* under a finite context window. They introduce a clean (k, v) decomposition (value = raw trajectory vs distilled insight; key = storage granularity and retrieval frequency) and show negative forward transfer with raw memory (ALFWorld −9.5) flipping positive with abstracted insight (+6.5), and a "retrieval diversity collapse" where homogeneous new entries crowd old ones out of the top-k. The lesson abstraction helps, but finer granularity only helps when the source pool is *diverse*.

**STALE (20)** isolates a failure the field had been measuring around: belief invalidation. Most memory benchmarks test static retrieval; STALE tests whether an agent updates a stored belief when later evidence *implicitly* invalidates it, with no explicit negation. It separates Type I (co-referential: same attribute, new incompatible value) from the harder Type II (propagated: an update cascades through a latent dependency). Results are brutal — the best model, Gemini-3.1-pro, scores 55.2% overall; most memory frameworks score below 10%; plain GPT-4o-mini scores 8.7%. The diagnostic is the sharp part: new evidence is retrieved in 77.5% of failure cases but only 3.3% of co-recalled stale entries get flagged for update. They call it the **current-state adjudication gap** — retrieval visibility is not answer authority. Their fix (CUPMEM, write-side adjudication on a typed state schema) lifts the same backbone from 8.7% → 68.0%, which is the strongest evidence in the set for the write-side thesis.

**EvoMemBench (26)** is the benchmark to internalize. A 2×2 taxonomy — memory scope (in-episode vs cross-episode) × content (knowledge vs execution) — over six datasets, 15 memory methods, one fixed backbone (DeepSeek-V3.2). Eight findings, the uncomfortable ones being: long-context baselines are highly competitive (Gemini-3-Flash ranks #1 on in-episode knowledge); memory helps under tight context (+14.5 at 16K) but several methods *fall below no-memory at 128K*; memory is much better at retention than revision; and the real bottleneck is forming *reusable* knowledge, not storing more. Different execution domains favor different families (tool-use → retrieval, web → general long-term, embodied → procedural), so "general memory" is, empirically, not yet a thing.

**MemGym (29)** attacks the measurement problem itself. Existing agent benchmarks report only end-task success, conflating memory with reasoning and tool-use errors. MemGym runs paired with-/without-memory rollouts under a *fixed reasoner* so the delta isolates the memory module, across coding, web, tool-dialogue, and search. It exposes "illusory memory pressure" (facts re-derivable from the repo or pretraining) and defeats it with fictionalized synthetic tasks — fictionalizing a deep-research task drops the no-memory score from 0.70–0.85 to near zero, revealing the true memory gap. Its sleeper contribution is MEMRM, a Qwen3-1.7B critic fine-tuned to predict "behavior unchanged if compressed" at sub-second cost (AUROC 0.985 in-distribution), replacing $2/episode Docker rollouts — though it does not generalize OOD, which is honestly reported.

**Memory in the LLM Era (02)** is the organizing scaffold: a 4-stage decomposition (Information Extraction → Management → Storage → Retrieval) with 10 methods re-implemented in one framework. Its empirical contribution is the robustness axes nobody else measured uniformly — token cost, context scalability, position sensitivity, backbone dependence. Tree/hierarchical methods (MemTree, MemOS) win; a recombination of the two sets a new bar at <450 tokens/dialogue. Use this paper as the map, not the destination.

**Where this leaves us:** four independent results (22, 18, 20, 26) say the same thing in different languages — naive external memory that an LLM continuously rewrites is fragile, often worse than nothing, and the failures concentrate at write/update time. Everything below is a response.

---

## 2. The position papers: what *is* memory?

**Memo, Not True Memory (16)** is the sharpest argument in the set and worth reading in full. It draws a hard line between two ways to change an agent: **change C** (the context — RAG, scratchpads, MemGPT, every external store) versus **change θ** (the weights). It grounds this in Complementary Learning Systems neuroscience: brains have a fast hippocampal exemplar store *and* slow neocortical weight consolidation; today's agents implement only the hippocampal half. Then the theorem (Compositional Sample Complexity Separation): retrieval needs n_R = Ω(k²) stored compositional examples to cover a task, parametric fine-tuning needs n_P = O((d + log 1/δ)/δ), and the ratio is independent of context-window size. Bigger windows do not close the gap. It adds a security corollary — persistent poisoning probability → 1 over sessions (citing MINJA's 98.2% injection success persisting across sessions) — and prescribes an asynchronous offline consolidation channel into weights. The mechanism prescription repackages known tools (LoRA, MEMIT, TTT), but the framing and the theorem are a genuine contribution. This is the paper MEMO (24) answers.

**Artifacts as Memory (05)** is the most original *theory* in the set, from a different tradition entirely (RL, situated cognition). It asks whether the environment can be an agent's memory — formalizing the "extended mind" idea that observations left in the world (a trail of breadcrumbs) substitute for internal capacity. The Artifact Reduction Theorem proves a history containing an artifact has a reduced representation with identical predictive mutual information, and an operational definition of "externalizes memory" via capacity-matching: a linear Q-agent with 16 weights, given a visible path, matches a 64-weight agent without one — up to 48 weights/action of memory offloaded into the world. The domain is a toy 13×13 gridworld and DQN can't even learn under the non-stationary fading-path variant, so it's empirically narrow. But it's the only paper that treats memory as something that need not live inside the agent at all, and the formalism is new.

**Stateless Decision Memory (12)** comes from the opposite pole — enterprise pragmatism — and lands a framing worth absorbing. Its claim: regulated decisioning (underwriting, claims, clinical) runs on RAG *despite* worse decision quality because deployment is load-bearing on four properties stateful memory violates by construction — deterministic replay, auditable rationale, multi-tenant isolation, statelessness for horizontal scale. Its DPM (an append-only event log + a single task-conditioned projection at decision time, no runtime memory object) is admittedly just event-sourcing. The contribution is identifying that **statelessness and replayability, not retrieval quality, are the real adoption drivers** — and showing the projection beats incremental summarization at tight budgets (factual precision +0.515, 7.4× faster) while exposing 1 nondeterministic call instead of 83–97. Small-n (10 cases, one model family), but the argument reframes what "good memory" means in production.

These three disagree about almost everything except the meta-point: there is a large gap between research sophistication and what actually ships, and "more retrieval" is not closing it.

---

## 3. Rethinking the unit of memory

If the store is the problem, maybe the problem is *what you put in it*. Four papers attack the atomic-fact default.

**TriMem (27, "Rethinking How to Remember")** quantifies the indictment: extracting atomic facts loses 14.5% more information than keeping raw dialogue (storage completeness 80.8% vs 95.3%), and reasoning F1 collapses 55.3 → 35.8 from single- to multi-evidence questions. Its answer is to keep three coexisting representations — verbatim raw dialogue, atomic facts, and synthesized per-person profiles — linked by source pointers so lossy compression is recoverable, and to evolve the extraction/profile prompts with TextGrad (LLM-judge feedback backpropagated as prompt edits) rather than RL weight updates. It tops LoCoMo and PerLTQA; the ingredients are individually known, the composition (pointers + profiles + prompt-level lifelong evolution) is fresh.

**StructMem (13)** makes the argument cleanest: the memory unit should be a *temporally grounded relational event*, not a fact and not a triplet. Flat memory loses relational structure; graph memory recovers it but is expensive and fragile. StructMem extracts factual *and* relational entries per utterance, anchors both to a timestamp, and consolidates in periodic batches (exploiting temporal locality to avoid the quadratic dedup of graphs). The payoff is mostly efficiency — SoTA-adjacent accuracy at ~18× fewer tokens and ~50× fewer API calls than graph memory (Mem0g). It's incremental in a crowded space, but the "right unit" framing is correct.

**GAM (08)** targets *memory contamination* — Memory Loss (old nodes isolated) and Semantic Drift ("Apple-fruit" vs "Apple-tech" conflated) — with a sleep-consolidation finite-state machine: buffer incoming utterances into a local event graph with strict write-isolation, and consolidate into the global topic graph *only at semantic boundaries* (detected by an LLM discriminator on sparse events). This decoupling of fast episodic writes from slow consolidation is the same instinct as Auto-Dreamer and CLS, arrived at independently, and it works (LoCoMo +18% temporal F1 over Mem0 at the lowest token cost in its table). Its own data shows the cost, though: consolidation compresses chronological cues, so Mem0 still beats it on one temporal split.

**FluxMem (31)** is the most ambitious version — memory as continuously evolving *connectivity*. A heterogeneous three-layer graph (semantic / episodic / procedural) whose topology is edited online from execution feedback: under-connection triggers link expansion, over-connection triggers pruning, granularity mismatch triggers unit-content reshaping. Offline, a Procedure Evolution Maturity Score gates consolidation of recurring skills so mature subgraphs can bypass retrieval entirely. It posts strong multi-benchmark numbers (GAIA +12.7 absolute on Kimi K2) but reports *no* compute/latency/cost, which for a closed-loop online-edit system is the number that matters.

**SCG-MEM (11)** is the outlier with a genuinely new mechanism. The problem it names — "structural hallucination," where letting an LLM generate memory keys produces plausible keys that don't exist in the store — is real and under-discussed. The fix is elegant: encode the store's concepts as a prefix trie and do *schema-constrained decoding*, masking any token that would leave the trie, so P(generated key ∉ store) = 0 by construction. A Piagetian assimilation/accommodation loop grows the trie when the model hits genuinely novel concepts. It needs token-level logit access (small open models only) and has no forgetting mechanism, but constrained decoding over *dynamic, evolving* keys is a real new tool, not a wrapper.

---

## 4. The learned-memory turn: consolidation and self-evolution as first-class operations

The biggest shift this quarter is treating memory operations — consolidation, retrieval configuration, credit assignment — as things you *learn*, not things you prompt.

**Auto-Dreamer (28)** is the cleanest instance and, to me, one of the two or three most important systems here. It decouples fast per-session acquisition (a fixed append-only writer) from slow cross-session consolidation (a *learned* operator), following CLS theory. The operator's primitive is "region rewriting": select a region of memory, treat it as read-only evidence, run a bounded tool-use rollout (search / check / trace-provenance / synthesize), and emit a fresh replacement set that *supersedes* the region. Replacement (not in-place CRUD) makes abstraction, dedup, contradiction-resolution, and omission-based forgetting the default semantics — information survives only if re-synthesized. It's trained with GRPO on a counterfactual-utility reward: mask a fraction of synthesized entries and measure the performance drop, so load-bearing entries get credit and redundant ones get ~0. The results are a Pareto win — ScienceWorld 41.1% at 6.9K tokens vs UMEM's 34.1% at 80.9K, with a claimed 12× smaller active bank — and it transfers to held-out ALFWorld/WebArena without retraining. This is what "self-improving memory" should look like, and crucially it answers paper 22: consolidation is safe when it's *trained against downstream utility* instead of prompted.

**EVOLVEMEM (23)** makes a different thing learnable: the *retrieval configuration*. Every other system freezes the scoring functions, fusion weights, and context budgets at deploy time; EVOLVEMEM runs an AutoResearch loop (Evaluate → Diagnose → Propose → Guard) in which an LLM reads per-question failure logs and proposes structured edits to the full retrieval config θ — including *new config dimensions not in the original space* — with revert-on-regression guards. LoCoMo F1 0.305 → 0.543 over evolution rounds, with positive (Pareto) cross-benchmark transfer rather than the catastrophic transfer you'd fear. It's offline and needs labeled QA, but "make the retrieval policy a self-evolving optimization target" is a genuinely new axis.

**MIA (03)** builds the full bidirectional loop for deep-research agents: a non-parametric store of compressed search *trajectories* ("how," not "what") feeds a Planner, and each batch the Planner is GRPO-retrained on that memory — episodic memory distilled into weights, online, at test time. It even runs unsupervised, using a three-reviewer "peer-review" panel (Reasoning / Sourcing / Validity + an Area Chair) as approximate supervision. Heavy infrastructure, but the explicit non-parametric↔parametric conversion is the direction paper 16 is pointing at, implemented.

**TreeMem (21)** solves a narrower training problem: in a builder→summarizer→responder memory pipeline trained with RL, how do you assign per-agent credit from a single final reward without hand-designed per-agent rewards (which invite reward hacking)? Answer: expand the rollout into a tree (G builder × J summarizer × K responder leaves), compute rewards only at leaves, and average up the branches. It's a transfer of tree-credit ideas from single-policy reasoning RL to heterogeneous multi-agent memory, well-ablated (PersonaMem +7.5% over the best baseline).

**CluE (06)** evolves the *extraction prompt* across heterogeneous tasks — the insight being that one static extraction prompt can't serve personalization, problem-solving, and agentic tasks at once. Its move is to cluster training examples by "extraction scenario" (not by dataset) before analysis, so conflicting signals don't dilute each other; +9.04% relative gain where rivals like MemEvolve trade one category off against another. A clean delta on an existing analyzer-proposer loop, plus a useful heterogeneity benchmark (BEHEMOTH) with a utility-driven (non-LLM-judge) metric.

**Prism (10)** is the maximalist: eight subsystems unifying layered files, vector, graph, and evolutionary search under game-theoretic dynamics (entropy-stratified storage, replicator-decay confidence converging to an "Evolutionary Stable Memory Set," Value-of-Information retrieval with a Hedge bandit, CUSUM-triggered reflection). It's theoretically dense and posts strong numbers (LoCoMo +31.2% over Mem0; 4-agent discovery 2.8× single-agent), but it's solo-authored, leans on a simulated baseline, and mostly *relabels and stitches* existing paradigms with off-the-shelf theorems. The genuinely new piece — entropy stratification + replicator dynamics — is interesting; the empirical case is thin.

The tension nobody resolves: self-evolution and paper 22 are on a collision course. Auto-Dreamer escapes by training the operator against downstream utility; the prompt-evolution and graph-edit approaches (CluE, EVOLVEMEM, FluxMem) rely on an LLM rewriting memory and have no defense against the compounding-loss result beyond "we measured it on a benchmark and it went up." That's exactly what AWM and CLIN could say before paper 22 tested them at length.

---

## 5. Memory in the weights, on new media, and when to forget

Three papers leave the text-store paradigm entirely.

**MEMO (24)** is the direct answer to paper 16's "go to the weights." Its move: *memory is a trained model.* A small MEMORY model M_φ is SFT'd on synthesized "reflections" (a five-step pipeline distilling a corpus into self-contained, cross-document QA), then a frozen EXECUTIVE model queries it as a black-box oracle through a three-stage grounding → entity-ID → synthesis protocol. The two things that make it more than "fine-tune on your docs": memory is **corpus-size-independent at inference** (constant-time, no index) and **plug-and-play across LLMs** (no weight or logit access needed — unlike latent-memory methods that couple memory to one model). It beats graph-RAG (HippoRAG2) on NarrativeQA and MuSiQue, is far more noise-robust (distractors cost it 0–1.8% vs retrieval's 5–6%), and supports continual updates via task-vector model merging — though merging costs 11–19 accuracy points, the honest weak spot. When the answer is genuinely absent from the EXECUTIVE's knowledge and raw evidence is decisive, retrieval still wins (BrowseComp-Plus). Parametric memory isn't universally better; it's better at synthesis and robustness, worse at verbatim evidence access.

**OCR-Memory (15)** changes the *medium*: render agent trajectories into images (with Set-of-Mark visual anchors) and store those. A fine-tuned optical model does "Locate-and-Transcribe" — it emits a binary relevance vector per image and then *deterministically fetches the exact stored text*, so retrieval is 100% faithful (no generation, no hallucination) at >10× token compression. It even has "optical forgetting": older memories are downsampled to lower resolution, and a retrieved low-res memory can be re-rendered to full fidelity on demand — vivid-to-fuzzy memory as a resolution knob. The costs are real (specialized model, 80× more disk, higher latency), and the concept leans on an off-the-shelf optical backbone, but "the memory medium is images" is a new paradigm with a clean faithfulness/efficiency trade.

**When to Forget (07)** is the smallest and most disciplined paper in the set: a single forgetting primitive, "Memory Worth," defined by two counters — successes and failures over episodes where a memory was retrieved — with an almost-sure convergence proof to the true success-conditional probability. It separates "uncertain" (insufficient evidence) from "mixed-outcome" (sufficient but ambiguous), which a single 0.5 score conflates, and it's explicit that the signal is *associational, not causal* (a "hitchhiker" memory always co-retrieved with a good one inherits undeserved credit — quantified, not hidden). All-synthetic validation and a manual evidence-floor hyperparameter limit it, but it's the only paper that treats forgetting as an outcome-driven governance primitive with a theorem, and the honesty about its own failure modes is a model for the field.

---

## 6. Built to ship: production and domain systems

The applied papers are where you see which ideas survive contact with real constraints.

**HLTM (14)** is the standout — LinkedIn's deployed hiring-agent memory, the only paper with production A/B evidence (1,000+ recruiter seats, invoked in >40% of sessions, 5–10pp reduction in negative feedback). Its key design choice is anti-trendy and correct: the memory tree's topology mirrors *enterprise ownership* (project → seat → org), **not** semantic clustering — because semantic clusters mix tenants (a privacy violation) and require re-clustering on every update. Schema-aligned topology buys hard tenant isolation, clean GDPR deletion, and lossless O(tree-height) incremental updates. Components (RAPTOR retrieval, multi-view nodes) are known; the schema-aligned-vs-semantic decision is the transferable lesson, and it's one most research systems get backwards.

**MemRepair (25)** applies a three-tier memory to repository-level vulnerability repair: History-Fix (project style), Security-Pattern (cross-project rationale), and the distinctive **Refinement-Trajectory** tier (failure → success deltas, activated only after a failed validation). It's SoTA on SEC-Bench (58.0% vs 38.5%) at 1/5 the cost, and the ablation is the interesting part — the failure→success trajectory tier (L3) is the single most valuable component (50.5% alone), more than past-fixes or patterns. Domain-specific, but it operationalizes "learn from your failures" as a typed memory tier.

**RepoDoc (17)** builds a repository knowledge graph as the backbone for documentation generation, with bidirectional semantic-impact propagation for incremental updates (a git diff triggers a BFS over the graph to find exactly which docs to regenerate). 97% update recall, 3× faster, 85% fewer tokens than flat-text baselines. Not "memory" in the conversational sense, but a clean example of structured memory enabling *selective* update — the property flat stores lack.

**PASK (04)** is a proactive-assistant system (infer latent needs from a stream, intervene in <1s) with a competent three-tier cache/main/external memory. The new task and the consented real-world benchmark are the contributions; the memory module is a solid recombination (MemoryOS-style hierarchy, bounded-tree lazy merging) rather than a new mechanism.

**Memory Transfer Learning (09)** is an empirical study with no new system but findings worth keeping. Across six coding benchmarks it shows cross-domain memory *does* transfer, and isolates *why*: the transferable value is meta-knowledge (test-driven verification +15.0%, iterative-workflow discipline +14.5%, anti-pattern avoidance +14.4%), not algorithmic/code transfer (+5.5%). Abstraction dictates transferability (Insight > Summary > Workflow > Trajectory), and — counterintuitively — plain embedding similarity beats LLM reranking and adaptive rewriting in dynamic agentic settings. It also documents negative transfer from domain-mismatched anchoring, which dovetails with paper 18's dilution finding.

---

## Cross-paper comparison

Restricting to the *system* papers (benchmarks and pure theory excluded), along the dimensions that actually separate them:

| System | Representation | Write / consolidate | Retrieval | Forgetting | Self-evolving? | Headline result |
|---|---|---|---|---|---|---|
| TriMem (27) | raw + facts + profiles | prompt-level (TextGrad) | dense top-25 + index expand | none | prompt | LoCoMo SoTA, ~1.2K ctx tokens |
| StructMem (13) | relational events | periodic batch synthesis | dense + timestamp reconstruct | none | no | 76.8 LoCoMo at ~18× lower cost |
| GAM (08) | dual graph (event/topic) | at semantic boundaries | graph anchor + drill-down | write-isolation | no | +18% temporal F1, lowest tokens |
| FluxMem (31) | 3-layer evolving graph | online edits + offline skills | activated subgraph | link pruning | topology | GAIA +12.7 abs (no cost data) |
| SCG-MEM (11) | trie + assoc. graph | assimilate/accommodate | constrained decode + propagate | none | schema | +94.5% avg F1 (small models) |
| Auto-Dreamer (28) | typed text + provenance | **learned offline** (GRPO) | dense top-K | omission (re-synth) | learned operator | Pareto: 41% at 6.9K tokens |
| MIA (03) | trajectories + weights | episodic→**weights** (RL) | similarity+value+frequency | similarity replace | learned (RL) | +7.5 text avg over baselines |
| EVOLVEMEM (23) | typed multi-view | dedup + decay | **evolvable config** | importance decay | retrieval policy | LoCoMo 0.31→0.54 |
| MEMO (24) | **model weights** | SFT on reflections | NL oracle queries | (in small model) | merge updates | beats graph-RAG, noise-robust |
| OCR-Memory (15) | **images** | append + downsample | optical locate-transcribe | resolution decay | no | 100% faithful, >10× compress |
| HLTM (14) | schema tree | bottom-up aggregation | subtree-scoped hybrid | clean deletion | no | deployed; −5–10pp neg. feedback |
| MemRepair (25) | 3-tier (domain) | on success/failure | two-tier priority | recency pruning | no | 58% SEC-Bench, 1/5 cost |
| When-to-Forget (07) | counters over any store | n/a | reweights existing | **outcome-driven** | no | ρ=0.89 utility recovery (synth) |
| DPM (12) | append-only log | identity (no rewrite) | single projection | none (immutable) | no | replayable; +0.52 precision |

Three patterns fall out of the table:

- **Forgetting is mostly a blank column.** Of the systems, only Auto-Dreamer (omission via re-synthesis), When-to-Forget (outcome-driven), FluxMem (link pruning), and OCR-Memory (resolution decay) treat forgetting as a designed operation. Most "none" entries are an admission, not an oversight — and paper 22 says that's exactly where the failures live.
- **Self-evolution is splitting into "prompt/config" vs "learned operator."** The prompt/config camp (TriMem, EVOLVEMEM, CluE, FluxMem) is cheaper and broadly applicable but exposed to compounding LLM-rewrite loss. The learned-operator camp (Auto-Dreamer, MIA, TreeMem) is heavier (needs RL infra) but trains directly against downstream utility, which is the only demonstrated defense against degradation.
- **The representation axis is bimodal.** Most systems cluster at "structured external text/graph"; two have jumped the gap to other substrates (MEMO → weights, OCR-Memory → images). There is almost nothing in between, and "in between" (latent-soft-token memory) is exactly what MEMO criticizes as representation-coupled.

---

## The technical trajectory: how we got here and where it's converging

A rough timeline of the underlying ideas, with this quarter's papers as the leading edge:

1. **Context-window extension (2023–24).** Just make the window bigger. Defeated by context rot — measured degradation well before the window fills. Every paper here takes this as settled background.
2. **Retrieval-augmented external memory (2024–25).** MemGPT, MemoryBank, Mem0, A-Mem: store text, embed, retrieve top-k. This is the consensus the reviewed papers are reacting to. It is the default baseline in all 28 and the thing 22/18/20/26 show breaking.
3. **Structured and hierarchical memory (late 2025 → now).** Trees (MemTree, MemOS, HLTM), graphs (Zep, GAM, FluxMem), events (StructMem). The motivation is relational reasoning and selective update; the cost is extraction fragility and consolidation overhead. This is the busiest lane in the review.
4. **Self-evolving memory (now).** The store stops being static — content evolves (most), and increasingly the *machinery* evolves too: extraction prompts (CluE), retrieval configs (EVOLVEMEM), graph topology (FluxMem), or a learned consolidation operator (Auto-Dreamer). This is the quarter's defining move.
5. **The parametric turn (now, early).** MEMO and the position of paper 16: stop indexing text, put knowledge in weights — but in a *separate, swappable* model, not the agent's. MIA builds the round-trip. This is the youngest lane and, I think, the most important.
6. **New substrates and governance (now, scattered).** Optical memory (15), environment-as-memory (05), outcome-driven forgetting (07), write-side adjudication (20). These don't form a lane yet; they're individual escapes from the text-store frame.

The convergence is clearer than the divergence. Read together, the papers are circling **one** insight from many sides: *the memory problem is a write-time problem.* Retrieval ranking is a solved-enough subroutine. The hard, unsolved questions are all on the write path — what to consolidate (Auto-Dreamer, GAM), when (semantic boundaries, offline schedules), which beliefs to retire (STALE, When-to-Forget), and whether the LLM doing the rewriting is silently corrupting the store (22). Even the parametric papers are really write-side arguments: MEMO's whole pitch is that *encoding* into weights composes and resists noise better than *indexing* text.

The second convergence is on **CLS as the reference architecture.** Auto-Dreamer, GAM, and "Memo, Not Memory" independently invoke the same fast-episodic / slow-consolidated split from neuroscience. When three papers from non-overlapping groups reach for the same biological metaphor in one quarter, the metaphor is doing real work: it predicts that you need *both* a fast lossless episodic buffer *and* a slow, careful consolidation channel — and that the field's error was building only the first and then trying to make it do the second's job by prompting an LLM to rewrite it.

---

## Open problems and where I'd put my chips

What remains genuinely unsolved, in rough order of how load-bearing it is:

**1. Reliable consolidation.** Paper 22 is the open wound. We do not have a consolidation mechanism that is *guaranteed* not to degrade over long horizons. Auto-Dreamer is the best answer (train the operator against downstream utility with a counterfactual reward), and I'd bet on that template — but it needs RL infrastructure most teams won't run, and it's trained on a single environment. The open question is whether a *training-free* consolidation operator can be made safe, or whether safe consolidation fundamentally requires a learned, utility-grounded operator. My guess: the latter, and the prompt-rewrite camp is living on borrowed time.

**2. Belief invalidation and conflict resolution.** STALE shows the best models update stale beliefs ~30% of the time *with the evidence in context*. This is the gap between a knowledge base and a memory: a memory has to retire what's no longer true. Write-side adjudication (STALE's CUPMEM, 8.7%→68%) is the right shape but depends on a hand-specified state schema. Schema-free invalidation is wide open and, I think, the single highest-value unsolved problem here — because every long-running personal or enterprise agent hits it on day two.

**3. Forgetting as a first-class operation.** Mostly a blank column above. When-to-Forget is the only principled primitive and it's explicitly associational, synthetic-only, and stationary. Causal credit ("did this memory *cause* the success?"), non-stationary worth under distribution shift, and forgetting that preserves auditable evidence while retiring conclusions — all open.

**4. Evaluation that isolates memory.** EvoMemBench and MemGym are real progress (paired deltas, fixed reasoners, fictionalization to kill pretraining leakage), but they also reveal that "memory ability" may not be separable from reasoning and retrieval as a clean capability — MemGym admits its memory-gain metric isn't a clean ablation. Until we can measure memory in isolation, "method X beats Y" claims remain backbone- and benchmark-entangled. Treat every leaderboard number in this review as conditional.

**5. Privacy, security, multi-tenancy.** Paper 16's persistent-poisoning bound (compromise probability → 1 over sessions) and HLTM's schema-aligned isolation are the only serious treatments. Most research systems would leak across tenants or accumulate poisoned memories indefinitely. This is where production reality (12, 14) is ahead of research.

**6. Shared memory across agents.** Prism and TreeMem touch it; nobody solves cross-agent consistency, conflict, or trust. Given the parallel agent-architecture consensus, this will be next quarter's busy lane.

**Where I'd put my chips**, concretely:

- **Most promising: learned offline consolidation (Auto-Dreamer's template) + parametric memory modules (MEMO).** These are the two ideas that actually answer the diagnostics. Consolidation-as-a-learned-operator answers paper 22; memory-as-a-swappable-model answers paper 16's compositionality theorem while staying black-box-compatible. I expect the strongest 2027 systems to combine them: a fast episodic text buffer, a learned consolidation operator, and a periodically-trained parametric memory model as the slow neocortical channel. That's CLS, built correctly, for the first time.
- **Underrated: write-side governance (STALE + When-to-Forget).** Unglamorous, theorem-shaped, and exactly where deployments fail. The team that ships schema-free belief invalidation wins the personal-assistant market.
- **Overrated: maximalist self-evolving graph systems** that report SoTA accuracy and no cost numbers (FluxMem is the clearest case; Prism the most theoretical). The accuracy is real; the silence on latency/cost/long-horizon stability is the tell. Until one of them is run for 500+ sessions and survives paper 22's stress test, treat the numbers as benchmark-fitted.
- **Watch closely: optical memory (15) and environment-as-memory (05).** Both are early and narrow, but they're the only two papers questioning the substrate itself, and substrate questions are where step-changes come from.

If I had to compress 28 papers into one sentence: the field spent three years perfecting how to *read* from memory and is now discovering, from four directions at once, that the hard part was always how to *write*.

---

*Twenty-eight papers, April–June 2026. Methods, numbers, and limitations are drawn from the papers as written; dates and model versions are reported as printed in each PDF and are lab/author claims, not independently verified. Where I've given a judgment — most/least promising — it's mine, and I've tried to make it falsifiable rather than safe.*
