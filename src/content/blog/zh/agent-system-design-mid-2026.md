---
title: "Agent 的上下文管理"
description: "从 2025 年的多 Agent 争论，到 Claude Code、Codex、OpenClaw 和 Hermes 的记忆设计，Agent 系统的难点正在从编排转向上下文管理。"
pubDate: 2026-06-22
tags: ["agents", "systems", "context-engineering", "memory", "MCP"]
locale: zh
---

2025 年 6 月 12 日，Cognition 发了一篇标题直接的博客，**"Don't Build Multi-Agents"**[^1]。这家公司因为 Devin 被更多人认识。文章里，Walden Yan 反复讲一个问题：任务一旦拆给多个 Agent，决策会分散，上下文也很难在 Agent 之间完整共享。

他举了一个图像生成的例子。一个子 Agent 负责背景，另一个负责角色，最后的结果拼在一起时，风格和设定对不上。错误并不来自某个子 Agent 单独做错了一步，而是多个局部上下文里的隐含判断没有被重新对齐。

第二天，Anthropic 发了另一篇文章，**"How We Built Our Multi-Agent Research System"**[^2]。标题看起来像是站在 Cognition 的反面。他们的多 Agent 研究系统在内部评测里好过单 Agent。但 Anthropic 也写了限制条件：“some domains that require all agents to share the same context or involve many dependencies between agents are not a good fit for multi-agent systems today.” 如果一个领域要求所有 Agent 共享同一批上下文，或者 Agent 之间存在很多依赖关系，今天的多 Agent 系统并不合适。

当时，媒体自然把这两篇文章写成一次公开分歧[^3]。但把两边的条件放在一起看，分歧没有标题里那么大。Cognition 说，多 Agent 的风险在于上下文跨过 Agent 边界时会失真；Anthropic 说，多 Agent 只适合上下文可以隔离的任务。

真正有用的部分藏在限制条件里：多 Agent 是否成立，取决于上下文能不能被拆开。拆不开，Agent 越多，信息损失越难控制。

---

## 长窗口先变钝

Agent 常被定义成“一个 LLM 在循环里调用工具”。这个定义很短，麻烦也从循环开始。

用户的要求、系统提示、项目规则、历史消息、文件片段、网页内容、工具 schema、工具返回值、模型自己的计划和中间推理，都会挤进同一个窗口。上下文窗口变大之后，最早被缓解的是装不下的问题；随后更难处理的是窗口里什么值得留下。

Chroma Research 在 2025 年做过一组控制变量实验，测了 18 个前沿模型[^4]。他们观察到的现象更像一条缓慢下滑的坡：输入越长，准确率越低，很多模型在远没填满标称窗口时就开始退化。一个标称 200K token 的窗口，可能在 50K token 左右已经明显变钝。

这让“上下文管理”变成比“上下文长度”更实际的问题。长窗口只是给系统更多放东西的地方。放进去的是证据、噪音、旧计划、过期约束，还是工具吐出来的中间垃圾，结果完全不同。

![Context rot：Claude、GPT-4.1、Qwen3 和 Gemini 2.5 Flash 在控制变量任务上，准确率随输入长度持续下滑。](/images/blog/agent-system-design-2026/context-rot.jpg)

*即使任务很简单，多个模型家族也会随输入增长持续退化。它更像一段坡，不像悬崖。来源：Chroma Research，"Context Rot"，2025 年 7 月。*

有了这个前提，很多 Agent 系统里的设计突然有了共同解释。Skills 的按需加载、`CLAUDE.md` 或 `AGENTS.md` 这样的外部规则文件、会话压缩、记忆搜索、子 Agent、代码执行沙箱，看起来分属不同层，其实都在回答同一个问题：哪些信息此刻必须进入模型窗口，哪些信息可以留在窗口外。

---

## 少加载成了第一条规则

Claude Code 和 Codex 都把一类东西做得很轻：可复用的能力描述。

在 Claude Code 里，技能由 `SKILL.md` 及配套文件组成。技能列表和简短描述会先进入上下文，完整说明和引用文件只在需要时加载[^5]。Anthropic 把这称为 progressive disclosure。Codex 的技能设计也走同一条路：启动时只加载技能名称、描述和路径；`SKILL.md` 主体、参考文档、脚本和素材，都在任务需要时再读入[^6]。

这不是语义上的小优化。一个团队如果给 Agent 配了十几个技能，每个技能都有长说明、样例、脚本和背景资料，全量加载很快会把窗口污染掉。按需加载把“这个能力存在”与“这个能力的全部细节”分开。模型先知道可以去哪里取，等任务真的需要，再把那一小段拿进来。

Claude Code 的记忆机制也遵循类似原则。`CLAUDE.md` 可以放项目约定、命令、风格偏好；更长的材料可以拆成 topic 文件，主文件只保留索引，用 `@path/to/file` 按需引入[^7]。Codex 也把持久指令分成不同层：当前对话里的临时约束、仓库里的 `AGENTS.md`、全局配置、技能、插件、MCP 连接器，各自覆盖不同范围[^8]。

这里的关键变化不在文件格式，而在加载策略。早期 Agent 应用常把“所有可能有用的说明”先塞进 prompt。到 2026 年中，更成熟的系统开始把 prompt 变成一个索引页：少量稳定约束常驻，细节留在外部，靠路径、工具或检索召回。

---

## 记忆被分成两层

“全局上下文库 + 按需检索”已经是很多 Agent 系统的基本做法。只是它很少被包装成一个单独功能，更多时候藏在 memory、session search、file search、context engine 这些名字下面。

OpenAI 的 File Search 提供了一个通用形态：文件进 vector store，检索时同时做语义搜索和关键词搜索，再把相关片段交给模型[^9]。这适合产品里的知识库、文档库和历史资料。Agent 不需要一开始读完整个库，只要在需要时取回几段候选材料。

开源 Agent 框架里也能看到同样的拆法。OpenClaw 把记忆拆成 `MEMORY.md`、daily notes 和可搜索索引。`MEMORY.md` 适合保存长期偏好、身份、项目约束；daily notes 保存每天的工作轨迹；`memory_search` 通过语义和关键词检索找回旧事实[^10]。它的上下文引擎负责把规则、工具、记忆、文件和历史按预算组装进模型窗口，而不是让所有历史自然堆上去[^11]。

Hermes Agent 的做法更像把一个本地工作台拆成几层。`MEMORY.md` 和 `USER.md` 存少量高价值常驻信息，历史会话进 SQLite/FTS5，可以通过 `session_search` 搜索；skills 也分成列表、全文和引用文件三级加载[^12]。会话快满时，它会压缩对话，并在压缩前让记忆系统先消化可能值得长期保存的信息[^13]。

这些设计的共同点很朴素：全局信息不等于全量上下文。真正全局的是外部库、索引和状态；模型每一轮看到的是当前任务需要的切片。向量检索适合语义相近但措辞不同的资料，关键词检索适合命令、错误码、函数名、专有名词，SQL 或结构化查询适合带时间、状态、权限和实体关系的记录。生产系统通常会混用，而不是把所有记忆都交给一种检索方式。

---

## 压缩只能保住一部分

当窗口继续增长，系统会进入第二层处理：压缩。

Claude Code 支持手动 `/compact`，接近窗口上限时也会自动压缩[^14]。OpenClaw 也把 compaction 放进上下文引擎流程里，会在压缩前触发 memory flush，尽量把高价值信息写到长期记忆里[^15]。Hermes Agent 的压缩命令同样会先让记忆系统处理当前对话，再生成新的摘要继续会话[^13]。

压缩解决的是继续运行的问题，不保证完整保真。一个摘要可以保留目标、约束、关键发现和当前计划，但很难保留所有失败路径、细碎证据和隐含语气。它更像一次状态迁移：把系统带到下一轮，而不是把过去原封不动搬过去。

这也是为什么很多产品把“常驻记忆”和“历史摘要”分开。常驻记忆适合保存稳定偏好和长期事实，摘要适合保存当前任务进度，检索库适合保留可回查证据。三者混在一起，会让 Agent 在后续轮次里既想遵守旧偏好，又想引用旧证据，还想延续未完成计划，最后每一项都说不清来源。

2025 年后的研究开始把这件事做成可学习策略。Context-Folding 让 Agent 在局部任务上分叉，结束后把轨迹折叠成摘要回到主上下文[^16]。U-Fold 进一步讨论了如何在长链推理里动态决定折叠位置[^17]。这些工作还不能直接替代生产系统里的手写规则，但它们指向了一个方向：上下文管理不会永远只靠“到多少 token 就总结一次”。

![Context-Folding：Agent 分叉到临时子轨迹，中间步骤折叠成摘要回到主上下文。](/images/blog/agent-system-design-2026/context-folding-example.jpg)

*分支-折叠机制：局部子任务在临时上下文探索，结束后折叠为摘要。来源：Context-Folding 项目页面，2025 年 10 月。*

![FoldGRPO 训练结果：Folding Agent 在 1/10 上下文预算下打平 ReAct 基线。](/images/blog/agent-system-design-2026/context-folding-model.jpg)

*FoldGRPO + 折叠，在显著更低的上下文预算下接近高预算基线。来源：Context-Folding 项目页面。*

---

## 子 Agent 买来窗口也带来损耗

把这个逻辑放回多 Agent，原稿里最容易出错的一点就清楚了：不能从“跨 Agent 传消息会丢信息”推出“所以应该用子 Agent”。

2026 年 4 月，Tran 和 Kiela 在多跳推理任务上做了一个更直接的对照[^18]。他们把思考 token 预算拉平后发现，单 Agent 可以匹配甚至超过多 Agent。论文借用了香农信息论里的数据处理不等式解释这个问题：对于一条信息链 X → Y → Z，有 I(X; Z) ≤ I(X; Y)。换成 Agent 系统，一个 Agent 把自己的理解压成消息传给另一个 Agent，后者再压给第三个 Agent，每一跳都可能丢掉信息。

子 Agent 返回摘要也一样。摘要能让主 Agent 少看很多过程噪音，但它也会删掉东西。删掉的可能是无关网页、重复搜索结果，也可能是后来才显得重要的细节。这个损耗不会因为架构名字叫 subagent、worker、tool agent 就消失。

所以子 Agent 的价值需要另算。它可以买来额外上下文窗口，可以并行搜索，可以在局部任务里调用一堆工具，可以把网页、代码仓库和日志里的噪音挡在主窗口外。代价落在通信损失、协调开销、token 成本和失败追踪上。

Anthropic 的多 Agent 研究系统正是沿着这个边界设计：主导 Agent 规划，多个子 Agent 并行搜索，各自有独立上下文窗口，最后把压缩结果交回主导 Agent[^2]。Cognition 后来的 manager-worker delegation 也更接近这种局部委托，而不是一群平级 Agent 共享同一个任务大脑[^19]。

![Anthropic 多 Agent 研究架构：主导 Agent 接收查询、规划，派生专门子 Agent 并行搜索，各子 Agent 独立上下文窗口。](/images/blog/agent-system-design-2026/multi-agent-arch.png)

*Orchestrator-worker 模式：主导 Agent 拆解查询，子 Agent 在隔离上下文中并行搜索。来源：Anthropic Engineering，2025 年 6 月。*

这让多 Agent 的适用条件变窄了。任务能拆成相对独立的并行问题，子 Agent 不需要共享可变状态，局部搜索会产生大量噪音，任务价值足以覆盖数倍 token 成本，这时子 Agent 才有意义。多数编码任务经常不满足这些条件：文件、测试、错误路径和设计意图彼此牵连，多个 Agent 各做一段，再把理解压成几句摘要，容易把真正难的部分压掉。

---

## 工具结果最好先在窗口外过滤

上下文浪费不只发生在 Agent 之间，也发生在工具调用里。

传统 MCP 调用有两个成本。第一，工具定义本身会占窗口。几个 MCP server 加起来，schema 可能先吃掉几万 token。第二，中间结果会直接进入模型上下文。一个工具返回 10,000 行数据，模型真正需要的也许只有过滤后的 5 行，但在直接调用模式下，过滤之前的数据已经进来了。

2025 年底，Anthropic 提出一个替代方案：把 MCP server 暴露成文件系统里的类型化代码模块，让 Agent 写代码在沙箱里调用、过滤、聚合，最后只把必要结果打印回模型[^20]。在他们给出的例子里，一个工作流的上下文消耗从约 150K token 降到 2K token。

![传统 MCP：所有工具定义和中间结果全部进入模型上下文。代码执行版：MCP 暴露为文件系统中类型化代码模块。](/images/blog/agent-system-design-2026/mcp-code-exec.png)

*代码执行解决的 token 膨胀：工具定义按需加载，中间结果在沙箱内过滤。来源：Anthropic，"Code Execution with MCP"，2025 年 11 月。*

这类方案的收益很明确：让中间过程留在程序运行时里，模型只看筛过的结果。代价也很明确：Agent 写出来的代码是不可信代码。只要输入里有网页、仓库、用户上传文件、第三方 API 响应，就要假设生成代码可能被 prompt injection 影响。

于是沙箱也进入上下文管理的范围。容器适合开发和可信任务，但共享内核，不适合作为不可信代码的最终边界。gVisor 这类用户态内核启动快，适合部分可信路径。Firecracker/Kata 这类 microVM 更适合生产里的多租户隔离，运维成本也更高。Agent 会话是多轮的，快照和恢复会变得重要；每轮都冷启动，延迟会慢慢变成产品问题。

---

## 循环搬进脚本和工作流

长任务里的上下文管理，还有一层更不显眼的变化：循环本身开始从聊天历史里搬出去。

Claude Code 的 dynamic workflows 鼓励把固定流程做成脚本，由脚本在每一步给 Claude 提供状态、工件和下一步动作[^21]。它的技能体系里也包含 `/loop` 这样的交互循环能力：反复执行任务、评审结果、根据反馈改进。Codex 的产品形态也把类似能力拆到不同表面：仓库规则放在 `AGENTS.md`，可复用流程放在 skill，外部状态和工具放进 MCP 或连接器，成体系的长期任务再交给 workflows[^8]。

这类设计把状态从聊天历史转到脚本和文件。一个长循环如果全靠聊天历史维持，十轮以后，模型看到的就会混进旧假设、过期错误、无关命令输出和几次中途改变的目标。脚本、工作流和状态文件可以把这些变量落到窗口外，模型每一轮只读当前需要处理的状态。

这也是 loop engineering 这个说法变得有用的地方。它把“执行、检查、修正、继续”做成可观察的系统，而不只是继续加长 prompt。每一轮保留什么，丢掉什么，写入哪里，下一轮怎么取回，才是长任务能否继续跑下去的关键。

---

## 上下文管理变成运行时

把这些材料放在一起，2026 年中 Agent 系统的形状比一年前清楚一些。

最先变化的是加载方式。技能、项目规则、工具说明和长文档只暴露索引，细节按需进入窗口。Claude Code、Codex、OpenClaw、Hermes 都在这么做。

随后是外部状态。长期偏好、项目记忆、会话历史、文件库和结构化记录被放进文件、数据库、vector store、FTS 索引或 SQL 表。模型看到的是检索结果，不是全部历史。

窗口继续增长时，系统开始压缩。会话快满时，当前状态被迁移到摘要里，更稳定的事实写进长期记忆。压缩保住连续性，也会丢细节，所以关键证据仍要能从外部库回查。

最后是隔离。子 Agent、沙箱和工具执行环境都可以消耗大量局部 token，把噪音挡在主窗口外。它们带来的通信损失和安全成本，需要在系统设计时明算。

这些动作加起来，才是今天更接近生产的上下文管理。它不再只是 prompt 工程，也不只是 RAG。它像一个小型运行时：负责装配、检索、压缩、隔离、审计，还要记录每一轮哪些信息进入了窗口，哪些被丢到窗口外。

MCP 在这里扮演的是连接协议。它让工具更容易接入，但工具接进来以后，租户隔离、工具白名单、身份绑定、成本归属、异常检测和 prompt injection 防护，都还要平台自己处理[^22]。上下文越分散，这些治理问题越难绕开。

---

## 还没有结束的变量

到 2026 年中，比较稳的判断反而朴素。

单 Agent 仍然是大多数任务的起点。需要拆出去的，通常是可并行、可隔离、噪音多的局部工作。子 Agent 的摘要会丢信息，压缩会丢信息，检索也会漏信息；系统设计要做的是让这些损失可见，而不是假设某个架构会自动消除它们。

长窗口还会继续变长，但 Agent 的能力不会只由窗口长度决定。一个能把上下文移到窗口外、按需取回、在合适的时候压缩、在危险边界里执行工具的系统，会比一个只会把历史往窗口里堆的系统更稳。

最新研究还在往前推。Context-Folding、U-Fold 这类工作尝试让模型学会何时折叠上下文；AgentGym-RL、IterResearch 关注长程交互里的训练和状态重构[^23]。这些方向现在更像信号，还不是生产系统的替代品。

真正的考验仍然在工程里。一次长任务跑到第 40 轮，用户改过三次目标，工具返回过几万行日志，模型做过两次错误假设，系统还能不能说清楚当前状态从哪里来，哪些证据仍然可靠，哪些记忆应该被撤销。这些问题解决得越好，Agent 才越像一个能长期工作的系统，而不是一次很长的对话。

---

[^1]: Walden Yan, "Don't Build Multi-Agents," Cognition Blog, June 12, 2025. https://cognition.ai/blog/dont-build-multi-agents
[^2]: Anthropic Engineering, "How we built our multi-agent research system," June 13, 2025. https://www.anthropic.com/engineering/multi-agent-research-system
[^3]: "AI Leaders Clash Over Agent Architecture as Cognition and Anthropic Reveal Opposing Design Strategies," CTOL.digital, June 2025.
[^4]: K. Hong, A. Troynikov, J. Huber, "Context Rot: How Increasing Input Tokens Impacts LLM Performance," Chroma Research, July 14, 2025. https://research.trychroma.com/context-rot
[^5]: Anthropic, Claude Code Docs, "Skills." https://code.claude.com/docs/en/skills
[^6]: OpenAI, Codex Docs, "Agent Skills." https://developers.openai.com/codex/skills
[^7]: Anthropic, Claude Code Docs, "Memory." https://code.claude.com/docs/en/memory
[^8]: OpenAI, Codex Docs, "AGENTS.md," "Memories," and "Workflows." https://developers.openai.com/codex/guides/agents-md ; https://developers.openai.com/codex/memories ; https://developers.openai.com/codex/workflows
[^9]: OpenAI Platform Docs, "File Search." https://platform.openai.com/docs/guides/tools-file-search
[^10]: OpenClaw Docs, "Memory." https://docs.openclaw.ai/concepts/memory
[^11]: OpenClaw Docs, "Context Engine." https://docs.openclaw.ai/concepts/context-engine
[^12]: Nous Research, Hermes Agent Docs and repository. https://hermes-agent.nousresearch.com/ ; https://github.com/nousresearch/hermes-agent
[^13]: Nous Research, Hermes Agent, memory and context management docs. https://hermes-agent.nousresearch.com/
[^14]: Anthropic, Claude Code Docs, "Context Window." https://code.claude.com/docs/en/context-window
[^15]: OpenClaw Docs, "Context Engine Lifecycle." https://docs.openclaw.ai/concepts/context-engine
[^16]: Sun et al., "Context-Folding: Context Management for Efficient Agentic Reasoning," arXiv 2510.11967, 2025. https://arxiv.org/abs/2510.11967
[^17]: "U-Fold: Universal Context Folding for Long-Context Reasoning," arXiv 2601.18285, 2026. https://arxiv.org/abs/2601.18285
[^18]: Dat Tran, Douwe Kiela, "Single-Agent LLMs Outperform Multi-Agent Systems on Multi-Hop Reasoning Under Equal Thinking Token Budgets," arXiv 2604.02460, April 2, 2026. https://arxiv.org/abs/2604.02460
[^19]: Cognition, "Introducing Devin 2.0," April 2025. https://cognition.ai/blog/introducing-devin-2-0
[^20]: Anthropic Engineering, "Code execution with MCP: building more efficient agents," November 4, 2025. https://www.anthropic.com/engineering/code-execution-with-mcp
[^21]: Anthropic, Claude Code Docs, "Dynamic Workflows." https://code.claude.com/docs/en/dynamic-workflows
[^22]: Tool poisoning and MCP security: arXiv 2601.17549; arXiv 2603.22489. 相关论文记录了工具描述注入、工具响应毒化、跨工具升级和服务器冒充等攻击形态。
[^23]: Context-Folding / U-Fold / AgentGym-RL / IterResearch 仍应视为研究阶段信号。除公开论文和项目页外，文中没有把这些结果当作已被生产系统独立复现的结论。

*文中图片来自 Anthropic Engineering、Context-Folding 项目页和 Chroma Research，图注已标出处。模型和评测数据来自各实验室或论文截至 2026 年中的公开材料，未独立复现的数字应按厂商或论文自报结果理解。*
