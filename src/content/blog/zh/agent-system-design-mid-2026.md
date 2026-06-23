---
title: "AI Agent 系统设计现状，2026 年中"
description: "架构、框架、上下文工程，以及把 Demo 跑成生产级要填的坑。"
pubDate: 2026-06-22
tags: ["agents", "systems", "context-engineering", "MCP", "survey"]
locale: zh
---

*过去几天翻了不少论文、工程博客、各家文档。有些争论已经没必要继续了，有些坑还在等人跳进去才发现，有些东西吹得太过。以下是我的笔记。*

---

## 架构之争，打完了

2025 年 6 月，这个争论在两天之内被烧到了顶点。

6 月 12 日，Cognition（Devin 的背后团队）发了篇博客，标题直接叫 **"Don't Build Multi-Agents"**[^1]。Walden Yan 的论证很具体：把任务拆给多个 Agent，"决策变得过于分散，上下文无法在 Agent 之间充分共享"（"decision-making ends up being too dispersed and context isn't able to be shared thoroughly enough between the agents"）。他的例子是一针见血的——让一个子 Agent做背景，另一个做角色，结果一个画了超级马里奥风格，另一个画了完全对不上的鸟。"Action 承载了隐含决策，冲突的决策带来糟糕的结果。"他的建议：用单线程 Agent，真要处理长上下文就加一个独立的压缩模型。

第二天，6 月 13 日，Anthropic 发了一篇篇幅相当的工程博客——**"How We Built Our Multi-Agent Research System"**[^2]。结论完全相反：他们的多 Agent 系统在内部评测上比单 Agent Opus 4高了 90.2%。但紧接着就加了一句关键限制："需要所有 Agent共享同一上下文的领域，或者 Agent 之间依赖关系很多的领域，目前不适合多 Agent 系统"（"domains that require all agents to share the same context or involve many dependencies between agents are not a good fit for multi-agent systems today"）。

科技媒体立刻把两篇并排打上了"AI 领袖在 Agent 架构上公开对立"的标题[^3]。但你把这两段话放在一起读——

Cognition 说：多 Agent 不行，因为上下文没法充分共享。Anthropic 说：多 Agent 行，但不适合需要共享上下文的场景。

他们在故障模式上达成了完全一致。区别只是 Cognition 把这条边界当作"所以别用"，Anthropic 把它当作"所以只在满足条件时用"。同一个诊断，不同的处方。读到 Anthropic 那句限制条件时我才反应过来——这两篇根本不是在对立，是在互补。

后来的学术工作补上了理论底座。2026 年 4 月，Tran 和 Kiela（Stanford / Cohere）在 arXiv 上发了一篇论文[^9]，在 Qwen3、DeepSeek、Gemini 2.5 上跑了一组干净实验：**思考 token 预算拉平后，单 Agent 在多跳推理上匹配甚至超越多 Agent。**

实验结论本身不算意外——毕竟 Anthropic 和 Cognition 已经从工程直觉上摸到了这个边界。这篇工作真正加分的地方是给这个直觉找到了一个严格的理论框架。

Shannon 在 1948 年那篇开山之作里证明了一个简洁的结论：对于构成马尔可夫链 X → Y → Z 的三个随机变量，有 **I(X; Z) ≤ I(X; Y)**。这就是**数据处理不等式**（Data Processing Inequality）。翻译成白话：你对一段信息做的任何处理——压缩、传递、转发、总结——都不可能增加它包含的信息量。最多保持不变。实际操作中，一定会丢失。

把它套到 Agent 系统里：Agent A 把自己对任务的理解压缩成一条消息发给 Agent B，这条消息对原始理解的保真度不可能超过 100%，实际上一定不到 100%。Agent B 再把理解压缩发给 Agent C，又是一层损失。链上的每一跳都在丢信息。Tran 和 Kiela 把这层数学保证直接扣在了多 Agent 架构上：信息在多 Agent 之间的损失，不是某个实现细节没做好，是架构的拓扑结构本身就保证了一定会漏。

到 2026 年，争论的双方实际上已经把边界画出来了。

**默认单 Agent。** 一个模型在循环里调用工具。遇到确实能拆开的任务——子问题互相独立、可以并行跑——就拉几个子 Agent 出来，每个只拿自己需要的上下文进去，跑完把压缩摘要扔回来，然后销毁。

Anthropic 把这种模式叫"subagent architecture"，Cognition后来叫"manager-worker delegation"，OpenAI 叫"agents as tools"。架构图画出来长得一模一样。

多 Agent 没死。但门槛明确了：任务能拆成广度优先的并行子问题、子 Agent 不需要共享可变上下文、你愿意付约 15 倍 token 成本。三条缺一条，Anthropic 原话——"不适合。"

我的经验法则是：如果你数不清楚这几条在不在，那就不在。先用单 Agent 跑起来。

[^1]: Walden Yan, "Don't Build Multi-Agents," Cognition Blog, June 12, 2025. https://cognition.com/blog/dont-build-multi-agents
[^2]: Hadfield et al., "How we built our multi-agent research system," Anthropic Engineering Blog, June 13, 2025. https://www.anthropic.com/engineering/built-multi-agent-research-system
[^3]: "AI Leaders Clash Over Agent Architecture as Cognition and Anthropic Reveal Opposing Design Strategies," CTOL.digital, June 2025.

![Anthropic 多 Agent 研究架构：主导 Agent 接收查询、规划，派生专门子 Agent 并行搜索，各子 Agent 独立上下文窗口。](/images/blog/agent-system-design-2026/multi-agent-arch.png)

*Orchestrator-Worker 实战：主导 Agent 拆解查询，子 Agent 并行搜索，各自上下文隔离。来源：Anthropic Engineering，2025年6月。*

---

## 瓶颈不在推理，在上下文

这是全文最核心的判断。是我翻完这些材料后脑子里挥之不去的东西。

Agent 就是"一个 LLM 在循环中自主调用工具"（Simon Willison 给的定义，Anthropic 到处引用）。听着简单。但每一轮工具调用都产更多 token，有些对下一轮关键，有些是纯噪音。注意力预算是有限的——不管你模型窗口标 200K 还是 1M。

而且烂起来不是线性的。这一点我第一次看到数据时愣了一下。

Chroma Research 用控制变量实验测了 18 个前沿模型[^4]。结论很刺眼：**所有模型的性能随输入长度持续下降，且窗口远未填满时就开始了。**200K 窗口的模型，大约 50K token 处就开始掉准确率。不是到了极限突然崩，是一条缓慢向下的斜坡。一直往下出溜。

你的模型能力是"前 50K 左右处理得不错，后面越来越差"。别被窗口容量那个数字骗了。该盯的指标是信噪比。

![Context rot：Claude、GPT-4.1、Qwen3 和 Gemini 2.5 Flash 在控制变量任务上，准确率随输入长度持续下滑。](/images/blog/agent-system-design-2026/context-rot.jpg)

*即使是简单任务，四个模型家族随输入增长都在持续退化。整条坡度，不是悬崖。来源：Chroma Research，"Context Rot"，2025年7月。*

有了这个前提再看编排模式，本质就变了。

**编排就是披了皮的上下文管理。** 多 Agent 好使，主因不是"多智能体协作更聪明"——是并行窗口烧了更多 token，且各子任务的噪音不互相污染。压缩、做笔记、按需检索——全在干同一件事：固定窗口里把信噪比顶上去。Cognition 反多 Agent 的论证根也在上下文：你没法把一堆多轮对话的丰富上下文干净地跨 Agent 边界传递。

实操层面只有四招。压缩（总结旧窗口重开新的）、结构化笔记（关键状态存到上下文外的文件里）、子 Agent 隔离（它在外面烧10K+ token 搜索，回来只带 1K 摘要）、按需检索（别什么都往里塞）。这四招用好了，比追更大的窗口有效得多。

![Anthropic 系统完整控制/数据流：计划持久化到外部内存防止窗口截断；子 Agent 充当压缩过滤器。](/images/blog/agent-system-design-2026/multi-agent-flow.png)

*上下文管理的真实代价：主导 Agent 窗口会超 200K token 然后截断，所以计划必须外存；子 Agent 本质是压缩层。来源：Anthropic Engineering，2025年6月。*

### 让模型学会自己管上下文

当前的做法是手写压缩规则、手工调阈值。能用，但终究是补丁。

2025 年有三篇工作指向一个更有野心的方向——**把上下文管理变成RL 训练目标。** 让模型学会自己判断该记什么、扔什么、什么时候折叠。我读这三篇的时候感觉它们在讲同一件事，只是切面不同。

Context-Folding（Sun et al., arXiv 2510.11967, 字节/CMU）的思路最直观：Agent 分叉出去处理子任务，子轨迹完成后"折叠"成摘要塞回主上下文。FoldGRPO 训完，用 **32K token 预算在 SWE-Bench Verified 上拿到 58%。** 基线模型要花 327K。

十分之一上下文，同一个分数。这数字我当时看了两遍。

IterResearch（arXiv 2511.07327, 阿里/人大）从 MDP 切入：每次交互不追加历史，而是重构一个马尔可夫状态——"此刻需要知道的信息"。2048 次交互，工作空间恒定约 40K token。性能从 3.5% 爬到 42.5%。

AgentGym-RL（arXiv 2509.08755, 复旦）则盯着训练稳定性：从零 RL 训 Agent，渐进拉长交互轮次防止训崩。

都还在论文阶段，离产品化有距离。但方向足够清晰——下一代 Agent 的方向是学会自己管理上下文，而不是靠更精巧的手写规则续命。

我猜这个方向两年内会出现第一个产品级实现。Context-Folding 的思路——分支、折叠、回来——和 Anthropic 现在手写的 subagent summary 模式本质上是同一个形状。区别只是一个用 RL 学，一个用手写规则。RL 版本一定会替代手写版本，问题只是时间。

![Context-Folding：Agent 分叉到临时子轨迹，中间步骤折叠成摘要回到主上下文。](/images/blog/agent-system-design-2026/context-folding-example.jpg)

*分支-折叠机制：局部子任务在临时上下文探索，结束后折叠为摘要。来源：Context-Folding 项目页面，2025年10月。*

![FoldGRPO 训练结果：Folding Agent 在 1/10 上下文预算下打平 ReAct 基线。](/images/blog/agent-system-design-2026/context-folding-model.jpg)

*FoldGRPO+折叠，十分之一上下文预算拿到同等分数。来源：Context-Folding 项目页面。*

---

## 砍掉 98% token 的操作，和它要付的代价

上下文是瓶颈。那 2025 年底最值得关注的技术就是这个：**用代码调用代替直接工具调用。**

思路不复杂。别让 Agent 逐个调 MCP 工具。把 MCP 服务器挂成文件系统中的类型化代码模块。Agent 写代码调用它们，在沙箱里做数据过滤、跑循环，只把最终需要的部分打印出来。

这解决了两个真实存在、不是假想的问题。

第一，工具定义吃上下文。五个 MCP 服务器，光 schema 定义就吃约 55K token。对话还没开始，窗口先少了一截。第二，中间结果吃上下文。每个工具调用的返回值全部塞回模型。两小时对话转录在两次调用间被复制一遍——约 50K token，对模型来说全是已知信息。

效果如何？Anthropic 把一个工作流从 **150K token 压到 2K。98.7%。** Cloudflare 独立搞出了同样设计，叫它 Code Mode。

我第一次看到 150K→2K 这个数字时觉得是不是小数点标错了。没有。

额外还有几件赠品：上下文前数据过滤（5 行数据进模型，不是10,000 行）、控制流效率（循环在代码里跑，省掉 Agent 来回对话的轮次）、隐私隔离（中间结果和 PII 留在沙箱，不进模型上下文）。

Opus 4.5 代做到了产品级：Tool Search Tool 按需加载，85% token削减，MCP-eval 准确率 79.5%→88.1%。Programmatic Tool Calling，75 工具基准上约 38% 更少计费。

![传统 MCP：所有工具定义和中间结果全部进入模型上下文。代码执行版：MCP 暴露为文件系统中类型化代码模块。](/images/blog/agent-system-design-2026/mcp-code-exec.png)

*代码执行解决的 token 膨胀。来源：Anthropic，"Code Execution with MCP"，2025年11月。*

但免费午餐并不存在。

> **你要先有一个沙箱。** 让 Agent 写代码然后直接执行——那代码
> 是 LLM 生成的、不受信任的——没有隔离就是在裸奔。Anthropic[^5]
> 原文："代码执行需要安全的执行环境，包括适当的沙箱、资源
> 限制和监控。这些基础设施要求增加了直接工具调用所不需要的
> 运维开销和安全考量。"

这句话值得停下来想一秒。这不是建议。是硬前提。

所以沙箱现在是 Agent 栈里争夺最激烈的一块地皮。隔离分三档，判断标准非常直接：你的 workload 吃到了攻击者能控制的输入吗？吃到了，就别在共享内核上跑。

| 级别 | 技术 | 适用场景 |
|-------|------|----------|
| 容器 | Docker/runc | 不够。共享内核，逃逸一次全跪 |
| 用户态内核 | gVisor | 可信代码路径。GPU 直通没戏 |
| microVM | Firecracker/Kata | **生产基线。** 硬件隔离。125ms 启动，5-30ms 快照/恢复 |

快照/恢复不只是性能优化——是多轮 Agent 会话的运维命根。每轮省 200-500ms，累加起来就是能不能上生产的分界线。

---

## 几个还没摆平的事

架构定了。上下文优化有方案。沙箱选型也清楚。

那还剩什么悬着的？三件事。

**MCP 安全。**

MCP 是工具接口的事实标准，这没什么好争。2026 版规范把协议层改成无状态、加了扩展框架、异步 Tasks、沙箱 MCP Apps。方向对的。

但安全不在协议层解决。MCP 的设计就没打算管这个。

Tool poisoning 是新一代 prompt injection。恶意指令藏在工具描述里。Agent 读得到，调用者看不到。持久生效，随包分发，每次调用都触发。已有学术工作[^8]记录了工具描述注入、毒化响应、跨工具升级、服务器冒充——不是概念验证，是可复现的攻击。

连强化模型也不免疫。Gray Swan 红队测试[^7]：Opus 4.5 的 prompt injection 攻击成功率随尝试次数攀升。单次查询个位数百分比。100 次后就完全是另一回事了。

多租户隔离、速率限制、成本归属——MCP 协议不管这些。它的定位就不在这个层面。做 Agent 平台的人，这才是你真正要写的代码：一个网关层，强制租户隔断、工具白名单、身份绑定、成本封顶、异常告警。子 Agent 递归派生这种事，在变账单之前会先在 token消耗曲线上冒尖。

**记忆基准测试。**

不绕弯子。不同供应商在相同数据集上拿不同方法测出不同数字，然后各自说第一。Zep 和 Mem0 在 LOCOMO 和 LongMemEval 上互相质疑对方分数——两边同时声称行业领先。

你品品这个局面。

记忆本身重要。但选型时别看基准表比大小。从文件外存加压缩起步。便宜，自己可控，没厂商锁。等你用自己的数据测出真实的召回差距，再评估专用方案。用你的数据跑，别看厂商的 benchmark。

**脚手架的影响被低估了。**

一个数据点：Opus 4.5，同一个模型。刚性脚手架下 CORE-Bench[^6]：42%。修完脚手架：**95%。**

没换模型。修的是脚手架。

SWE-bench 这类 benchmark 测的是模型 × 脚手架，不是模型本身。你不能拆开看。2026 年的趋势是减法——模型越强，脚手架越薄。每次升级模型，第一件事不是加功能——是试砍。

---

## 如果今天让我从头搭

以下是我的选择。你当参考。

**默认单 Agent。** 多 Agent 不是不能用，但要先证明单 Agent 不够——任务真能拆成互不依赖的并行子问题，且你愿意付 15 倍 token。我见过太多团队一上来就想做多 Agent，因为"听起来更高级"。别。它只是更贵。

**上下文管理做成平台原语。** 压缩、笔记、子 Agent 摘要隔离——这些是中间件，不该散落在应用代码各处。从第一天就埋点：每轮进来了什么 token，压缩丢掉了什么，哪个子 Agent 回传了什么摘要。这些数据后来会救你的命。

**沙箱按威胁模型选，不按习惯。** Agent 生成的代码只要可能吃到攻击者控制的输入→Firecracker/Kata。可信路径→gVisor。GPU 沙箱目前两条路：裸金属 Firecracker+VFIO 或者买 Modal。取决于你的GPU 规模，不是信仰。

**程序化工具调用不是可选功能。** 98% token 削减，叠 prompt caching 更猛。前提——你沙箱已经搭了。没沙箱别开，开了是给自己埋雷。

**MCP 治理层自己写。** 协议不管的那些事——租户隔离、工具白名单、身份绑定、成本归属、异常检测——这些才是你平台真正值钱的部分。

**把脚手架当模型一样管。** 给它版本号，A/B 测每次改动。升级模型时先问"能砍掉什么"，不是"能加上什么"。

**记忆别过度投入。** 文件外存加压缩起步完全够了。真出现了召回需求，用你自己的数据评估，别看厂商基准表。

**RL-for-Agent 方向持续关注。** Context-Folding、IterResearch、AgentGym-RL 指向的不是更好的压缩算法——是根本范式的转换。Agent自己学会管上下文那天，你今天手写的那些规则大部分可以删掉。确保你的脚手架到时候删得动。

---

[^4]: K. Hong, A. Troynikov, J. Huber, "Context Rot: How Increasing Input Tokens Impacts LLM Performance," Chroma Research, July 14, 2025. https://research.trychroma.com/context-rot
[^5]: A. Jones, C. Kelly, "Code execution with MCP: building more efficient agents," Anthropic Engineering Blog, November 4, 2025. https://www.anthropic.com/engineering/code-execution-with-mcp
[^6]: Anthropic internal evaluation; cited in Anthropic engineering posts and third-party analysis. The 42%→95% delta demonstrates harness-sensitivity of agent benchmarks.
[^7]: Gray Swan AI, red-teaming evaluation of frontier model prompt injection resistance, 2025–2026.
[^8]: Tool poisoning and MCP security: see arXiv 2601.17549 (tool-description injection), arXiv 2603.22489 (cross-tool escalation and server impersonation).
[^9]: Dat Tran, Douwe Kiela, "Single-Agent LLMs Outperform Multi-Agent Systems on Multi-Hop Reasoning Under Equal Thinking Token Budgets," arXiv 2604.02460, April 2, 2026 (v1). The Data Processing Inequality is from Shannon, "A Mathematical Theory of Communication," Bell System Technical Journal, 1948; Tran & Kiela apply it to the multi-agent setting.
*文中图片来自 Anthropic Engineering、Context-Folding 项目页和Chroma Research，图注已标出处。模型数据来自各实验室（Anthropic、OpenAI、Google），截至 2026 年中，均为自报数据，非独立复现。*

