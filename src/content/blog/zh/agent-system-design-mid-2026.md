---
title: "AI Agent 系统设计现状，2026 年中"
description: "一份关于架构、框架、上下文工程以及将生产级 Agent 与 Demo 区分开来的基础设施底层的综述。"
pubDate: 2026-06-22
tags: ["agents", "systems", "context-engineering", "MCP", "survey"]
locale: zh
---

*2026 年中。领域已收敛到一个清晰的共识架构。争论的焦点不再是 prompt 技巧——
而是上下文工程、沙箱隔离，以及将生产级 Agent 与 Demo 区分开来的基础设施。
本文是对当前局面的一份综述：哪些已经尘埃落定，哪些仍然悬而未决。*

---

## TL;DR

1. **架构已收敛。** 单个推理模型在循环中调用工具，当任务真正可并行化时派生
   短暂的、上下文隔离的子 Agent。P2P "群聊"式设计已失势。Orchestrator-Worker
   模式胜出。

2. **上下文是瓶颈，不是推理能力。** "Context rot"（上下文腐烂）是真实的且已被
   量化——所有前沿模型在输入变长时性能持续下降。核心认知转变：把有限的注意力
   预算当作稀缺资源来管理，而非模型智商。

3. **"Code Execution with MCP" 是 ROI 最高的上下文优化。** Anthropic 将
   一个工作流从 150K token 降至 2K token（98.7%），方法是将工具呈现为代码 API
   而非直接调用。代价：上下文节省需要用沙箱基础设施来支付。

4. **框架分层而非直接竞争：** 持久化运行时层（LangGraph、Microsoft Agent
   Framework、ADK 2.0），高层易用 SDK 层（OpenAI Agents SDK、LangChain
   `create_agent`、Pydantic AI），以及跨领域开放标准（MCP、A2A、Agent Skills）。

5. **MCP 已成为事实上的工具标准，正在成熟为真正的基础设施**——但安全性
   （Tool poisoning、通过工具描述的 prompt injection）是软肋。

---

## 1. 共识架构

2026 年的生产模式词汇已稳定。常见模式包括：**单 Agent 循环**（推荐默认）、
**Orchestrator-Worker**（规划者分解任务并委派给专业 Worker）、**顺序流水线**、
**扇出/扇入**（并行独立子任务）、**辩论/制作-检查**（验证）。

来自多个独立来源的关键经验发现：**在思考 token 预算相等的情况下，具有良好
上下文管理的单 Agent 通常在多跳推理上优于多 Agent 系统。**Tran & Jin
（arXiv 2604.02460）在 Qwen3、DeepSeek 和 Gemini 2.5 上证明了这一点，其理论
基础是数据处理不等式——将决策分散到多个 Agent 中不可避免地会在边界处丢失信息。

![Anthropic 的多 Agent 研究架构：一个主导 Agent 接收查询、规划，并派生专门的子 Agent 并行搜索，每个子 Agent 拥有独立的上下文窗口。](/images/blog/agent-system-design-2026/multi-agent-arch.png)

*Orchestrator-Worker 模式实践：主导 Agent 分解查询并委派给具有隔离上下文窗口
的并行子 Agent。来源：Anthropic Engineering，2025年6月。*

> **2026 年的共识，一句话：** 单个 Orchestrator 拥有完整的对话上下文，
> 派生短暂的、上下文隔离的子 Agent，子 Agent 仅返回压缩后的摘要。
> Anthropic、Cognition、OpenAI、Microsoft 和 LangChain 均汇聚于此。

多 Agent 仍有其位置——但仅限于任务真正可广度优先并行化、子 Agent 不需要共享
可变上下文、且任务价值显著超过约 15 倍 token 成本乘数时。Anthropic 自己的
多 Agent 研究系统在内部研究评估中比单 Agent 提升了 90.2%，但同时明确指出
"需要共享上下文或涉及大量 Agent 依赖的领域目前不适合多 Agent 系统。"

---

## 2. 上下文工程：真正的瓶颈

过去 9 个月的定义性认知转变：Agent 只是"一个在循环中自主使用工具的 LLM"。
关于 Agent 的一切困难都源于一个事实——**每一轮都会生成更多可能对下一轮有用
的 token，而注意力预算是有限的，且呈非线性退化。**

Chroma Research 在受控任务上测试了 18 个前沿模型，发现**性能随输入长度
持续下降，且远在窗口填满之前就开始退化。**一个 200K 窗口的模型在约 50K
token 时就开始退化。这不是悬崖，而是渐变的梯度。真正重要的指标是信噪比，
而非容量。

![Context rot：Claude、GPT-4.1、Qwen3 和 Gemini 2.5 Flash 在受控任务上的准确率随输入长度持续下降。](/images/blog/agent-system-design-2026/context-rot.jpg)

*即使在一个简单任务上，四个模型家族的性能都随输入长度持续下降——是连续的，
而非悬崖式。来源：Chroma Research，"Context Rot"，2025年7月。*

这重新框定了编排模式——它们本质上是**伪装的上下文管理策略**：

- **多 Agent 子 Agent** 之所以有效，主要是因为它们通过并行上下文窗口
  *消耗更多 token*，*并且*将探索噪音与主导 Agent 的上下文隔离开来。
- **压缩、笔记、即时检索**都是最大化单一窗口内信噪比的尝试。
- **Cognition 的反多 Agent 论点**本质上是一个上下文论点：你无法可靠地将
  丰富的多轮上下文跨 Agent 边界序列化。

有效的技术：压缩（总结并重新初始化窗口）、结构化笔记（写入上下文外的文件）、
子 Agent 上下文隔离（搜索消耗 10K+ token，返回 1K token 摘要）、Agent 检索
（按需加载数据，而非预先嵌入所有内容）。

![Anthropic 系统的完整控制/数据流：计划被持久化到内存中以在窗口截断后幸存；子 Agent 充当压缩过滤器。](/images/blog/agent-system-design-2026/multi-agent-flow.png)

*Anthropic 多 Agent 系统中的上下文管理机制：计划被持久化到内存，因为主导
Agent 的窗口将超过 200K token；子 Agent 消耗自己的上下文并返回精炼摘要。
来源：Anthropic Engineering，2025年6月。*

### RL 前沿：训练 Agent 管理自己的上下文

三篇 2025 年的论文指向同一方向——将上下文管理作为学习策略的一部分，
而非外部脚手架：

- **Context-Folding**（字节跳动/CMU）：Agent 分支到子轨迹处理子任务，
  然后"折叠"（总结）回来。使用 FoldGRPO 训练。在 **32K token 预算下达到
  SWE-Bench Verified 58%**，而基线需要 327K。
- **IterResearch**（阿里/Renmin）：将长程研究重新表述为具有马尔可夫状态
  重构的 MDP。在恒定约 40K token 工作空间内扩展到 2048 次交互，性能从
  3.5% 提升至 42.5%。
- **AgentGym-RL**（复旦 NLP）：从零开始训练 Agent（无 SFT），使用渐进式
  视界扩展以防止训练崩溃。

![Context-Folding：Agent 分支到临时子轨迹，然后将中间步骤折叠，仅保留简洁摘要。](/images/blog/agent-system-design-2026/context-folding-example.jpg)

*分支-折叠机制：局部子任务在临时上下文中探索，然后折叠为摘要。来源：
Context-Folding 项目页面，2025年10月。*

![FoldGRPO 训练与基准测试结果：Folding Agent 在远小于基线的上下文预算下达到或超过 ReAct 基线。](/images/blog/agent-system-design-2026/context-folding-model.jpg)

*FoldGRPO + context-folding 在 1/10 的上下文预算下匹配基线。来源：
Context-Folding 项目页面。*

这些是研究成果，不是产品——但方向明确：下一代 Agent 将学会管理自己的上下文，
而非依赖手工调整的压缩规则。

---

## 3. Code Execution with MCP：98% 的 Token 削减

2025 年末最重要的上下文技术是将工具呈现为 Agent 以编程方式调用的**代码 API**，
而非直接工具调用。

它解决的两个问题：
1. **工具定义膨胀**：预先加载所有工具定义。5 服务器 MCP 设置在对话开始前
   就是约 55K token。
2. **中间结果膨胀**：每个工具结果都经过模型的上下文。

![传统 MCP：所有工具定义和中间结果流经模型上下文。代码执行则将 MCP 服务器暴露为类型化代码模块的文件系统。](/images/blog/agent-system-design-2026/mcp-code-exec.png)

*代码执行解决的 token 膨胀问题。将 MCP 服务器呈现为代码 API 使 Anthropic 将
一个工作流从 150K token 降至 2K token（98.7%）。来源：Anthropic，"Code
Execution with MCP"，2025年11月。*

Anthropic 的示例：**150K → 2K token（98.7% 削减）。**Cloudflare 独立地得出
了相同的设计。额外收益：上下文前数据过滤（5 行而非 10,000 行）、高效控制流
（循环在代码中，而非 Agent 循环往返）、隐私保护操作（PII 留在沙箱中）。

这在 Anthropic 的 **Advanced Tool Use**（Opus 4.5 代）中被产品化：
- **Tool Search Tool**：按需延迟加载工具。85% token 削减；MCP-eval 准确率
  从 79.5% → 88.1%。
- **Programmatic Tool Calling**：在 75 工具基准测试上约 38% 更少的计费输入
  token。

> **代价：** 运行 Agent 生成的代码需要安全的执行环境。上下文的节省需要
> 用沙箱基础设施来支付。

---

## 4. 沙箱：安全边界所在

大规模运行不受信任的、LLM 生成的代码是硬基础设施问题。隔离光谱：

| 级别 | 技术 | 特征 |
|-------|-----------|----------------|
| 容器 | Docker/runc | 共享主机内核 — **不足以运行不受信任的 Agent 代码** |
| 用户空间内核 | **gVisor** | ~10–30% I/O 开销，快速启动；无 GPU 直通 |
| microVM | **Firecracker / Kata** | 硬件级隔离，~125ms 启动，5–30ms 快照/恢复 |

**2026 年生产基线：** 对不受信任的 Agent 生成代码和多租户隔离使用
Kata/Firecracker microVM；对可信代码或计算密集型路径使用 gVisor（其较浅的
边界可接受）。

**为什么这对平台构建者很重要：** 沙箱就是安全边界。Prompt injection 意味着
任何网页内容、仓库文件或第三方 API 响应都可能包含攻击。如果 Agent 读取了
攻击者控制的输入，它响应中生成的代码必须被视为潜在敌对。快照/恢复是运营
基础——在多轮之间保留文件系统+内存状态而非重新初始化，每轮节省 200–500ms。

---

## 5. MCP 规模化：安全现实

MCP 是生产部署中占主导地位的工具接口。2026 年规范使协议在协议层**无状态**，
增加扩展框架、异步 Tasks 和沙箱化 MCP Apps。

但安全图景是诚实且未解决的：

- **Tool poisoning** 是新的 prompt injection——恶意指令隐藏在 Agent 读取但用户
  看不到的工具描述中。它是持久的（随包发布，每次调用触发），在 MCP 兼容
  平台上广泛有效。
- 学术工作（arXiv 2601.17549, 2603.22489）记录了工具描述注入、毒化响应、
  跨工具升级和服务器冒充。
- 即使是强化模型也不能免疫：Opus 4.5 的 prompt injection 攻击成功率随尝试
  次数上升。
- **协议层未解决：** 多租户数据隔离、速率限制、成本归属、配置可移植性。
  这些都是平台层的问题。

对于以基础设施为重点的构建者，这正是平台增值的地方：一个 **Agent 网关**，
执行租户隔离、工具白名单、身份绑定和异常检测（一个子 Agent 递归派生子 Agent
会在变成账单之前表现为 token 消耗尖峰）。

---

## 6. 模型与脚手架边界

Anthropic 评估工作中一个引人注目的例子：**Opus 4.5 在刚性脚手架下 CORE-Bench
得分 42%，但在脚手架/评分修复后跳升至 95%。**脚手架主导了测量结果。
SWE-bench 本质上同时评估脚手架和模型。

2026 年的方向：随着推理模型的改进，**减去**脚手架复杂性。模型越来越多地完成
脚手架过去编码的规划工作。但脚手架仍然是一流的系统对象——状态管理、上下文
策划和压缩即使使用固定模型也可能成为性能瓶颈。

---

## 7. 记忆：一个争议类别

市场分为几种范式：**Letta**（类 OS 分级记忆，自我编辑 + 睡眠时计算）、
**Mem0**（向量 + 可选图，低足迹）、**Zep/Graphiti**（时态知识图谱，SOC 2 /
HIPAA）。

关键警告：基准测试数字是供应商的战场。在相同的数据集上，不同供应商使用
不同的测量方法声称不同的分数——"每个人都可以同时声称领先。"实践建议：
从文件支持的外部记忆 + 压缩开始（便宜、可控、无锁定），只有在能够测量
自己数据上具体的回忆质量差距时，才采用专用记忆层。

---

## 关键要点

**给 Agent 基础设施构建者的建议：**

1. **默认采用具有良好上下文管理的单 Agent。** 多 Agent 是广度优先、可并行
   工作的专用工具，仅当任务价值显著超过约 15 倍 token 成本时使用。
2. **将上下文管理作为平台原语。** 压缩、结构化笔记和子 Agent 摘要隔离
   应该是内置中间件，而非应用代码。
3. **沙箱即安全边界。** 不受信任代码用 Firecracker/Kata；可信路径用 gVisor。
   快照/恢复用于会话状态。
4. **程序化工具调用是 ROI 最高的优化。** 98% token 削减——但需要第 3 点的
   沙箱。
5. **自己构建 MCP 治理层。** 租户隔离、工具白名单、身份绑定和成本归属是
   协议无法解决的平台问题。
6. **监测脚手架。** 版本化、A/B 测试，跟踪每个脚手架的基准差异。升级模型
   时，测试*移除*复杂性，而非增加。
7. **关于记忆，不要过早过度投入。** 文件支持的外部记忆 + 压缩，直到测量到
   真正的差距。
8. **关注 RL-for-Agent 前沿。** Context-Folding、IterResearch 和 AgentGym-RL
   指向学会管理自己上下文的 Agent——下一代技术栈。

---

*文中图片转载自 Anthropic Engineering、Context-Folding 项目页面和 Chroma
Research，图注中已标明出处。引用的模型能力数据来自主要实验室（Anthropic、
OpenAI、Google），截至 2026 年中，应视为实验室报告数据，非独立复现。*
