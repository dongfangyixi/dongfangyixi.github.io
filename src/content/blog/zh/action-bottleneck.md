---
title: 'VLA 里 scale 不动的那个字母'
description: '视觉和语言在文明现成的数据上完成了 scaling，Action 没有。把能找到的每一种解释都红队攻击一遍之后，答案和我预想的不一样。'
pubDate: 2026-08-16
tags: [embodied-ai, robotics, VLA, scaling, world-models]
locale: zh
---

视觉有过自己的 scaling 时刻，语言也有。Action——VLA 里的那个 A——没有。而关于为什么没有，流行的解释已经固化成了几句口头禅：莫拉维克悖论<sup><a href="#ref-1">[1]</a></sup>，机器人没数据，物理太难。

我想要一个比口头禅更好的答案，于是花了三天做一件有点偏执的事：先把"Action 为什么难"的论证做到最强，再花力气把它拆掉。研究 agent 负责收集证据；红队逐条攻击，逐个核对来源；能用数值检验的论断我自己写代码跑；最后是十轮"辩方对质方"的循环，每一轮都必须抓取引文原文、往更深挖一层。前后约一千次文献抓取，所有关键引文逐字核对。

我的论点死了两次。最后活下来的版本，比出发时的更具体，也更出乎意料。

## 先清理口头禅

关于 Action 为什么难，流传最广的几种说法，大多没能扛住和文献的正面接触。

**"Action 没有自监督目标。"** 现在有了：在视频上做 latent action 预测。LAPA 在无标注人类视频上预训练，效果超过了用真实机器人动作标签预训练的 OpenVLA<sup><a href="#ref-2">[2]</a></sup>。目标函数已经存在，真正花钱的是把它落到某台具体机器人的电机上。

**"连续控制打破了 token 配方。"** π0-FAST 把字面意义上的 LLM 配方——离散 token 加交叉熵——跑在了灵巧操作上<sup><a href="#ref-3">[3]</a></sup>。那个著名的误差复合下界是真的<sup><a href="#ref-4">[4]</a></sup>，但离散化的随机策略在定理的适用范围之外。而且成功率随任务长度指数衰减根本不是 Action 特有的：METR 在纯文本 agent 上测到了同样的恒定风险率衰减<sup><a href="#ref-5">[5]</a>,<a href="#ref-6">[6]</a></sup>。机器人特殊的地方在于每次出错的代价，不在衰减规律本身。

**"Sim2real 解决了行走，没解决操作。"** 这句话从 2022 年起就过时了。DeXtreme<sup><a href="#ref-7">[7]</a></sup>、MIT 的 Visual Dexterity<sup><a href="#ref-8">[8]</a></sup>、拿到 87% 灵巧抓取成功率的 DextrAH-G<sup><a href="#ref-9">[9]</a></sup>——全是仿真训练，全是真机。

**"没有触觉就没有灵巧性。"** 外科医生用达芬奇做了几百万台手术，全程零触觉反馈。力反馈第一次出现在达芬奇 5 上——2024 年<sup><a href="#ref-10">[10]</a></sup>。

**"跨本体的数据没法混用。"** π0.5 自己的消融实验说混用是承重墙：去掉跨本体数据，未见过家庭里的成功率从 94% 掉到 49%<sup><a href="#ref-11">[11]</a></sup>。

这几句话每一句都包含一个真实的观察。但没有一句是瓶颈本身。

## 我信了一天的答案

把口头禅清干净，剩下一条不对称性立在那里：文本和图像是文明的"废气"。人类为了自己的理由生产了它们，顺手数字化，几乎零边际成本地堆在那里。而没有任何人的运动指令被记录过。所以动作数据必须被制造出来——遥操作、演示、纠正——按任务、按物理时钟付费。

制造的信号对找到的信号。我很喜欢这个答案：干净，能解释所有数量级差距，红队也基本放行了。

然后深挖循环攻击了它最强的证据，在下面找到了更好的东西。

## 根本不存在"找到的"路线

2026 年反驳"数据故事"最有力的证据，是两个常被引用为"found data 路线终于跑通"的 scaling 结果。Dyna-2：在一百万小时第一视角人类视频上做出的 scaling law<sup><a href="#ref-12">[12]</a></sup>。GEN-1：预训练语料"不含任何机器人数据"的机器人基础模型<sup><a href="#ref-13">[13]</a></sup>。人类视频就是动作的互联网——提取问题解决了，不对称性关闭了。

去读原文的小字。GEN-1 的语料来自"低成本可穿戴设备，采集人类进行数百万次活动的数据"<sup><a href="#ref-13">[13]</a></sup>——设备是买的，戴设备的人是招募的。Dyna-2 的一百万小时"由我们的数据合作方以及我们自己的内部运营采集"<sup><a href="#ref-12">[12]</a></sup>。

两个都是委托采集的。按小时付费。

这就是重组了我整个认知的发现：**2026 年的全部记录里，没有任何东西长得像视觉和语言当年真正赖以 scaling 的那种数据。** 动作没有网络爬虫可爬——连旗舰级的"found data"结果都不是 found 的。真正的比较从来不是"找到的对制造的"，而是委托采集的**人类**数据对委托采集的**机器人**数据。这个比较是有数字的：人类采集每小时便宜大约 2 到 39 倍，但在机器人通道上带着一个实测的 2.87 倍能力折扣——Dyna-2 自己在一百万小时处的零样本差距<sup><a href="#ref-12">[12]</a></sup>。按成本折算，两条路线的差距在一个数量级以内<sup><a href="#ref-25">[25]</a></sup>。

这恰好解释了为什么谁也没赢。如果人类视频真的免费，遥操作早就被埋了；如果它真的没用，没人会掏钱建百万小时语料库。整个领域的僵持，就是这道算术题。

## 难度真正住在哪里

十轮攻击之后，站着的是三个实测事实。

**锚点。** 已发表记录里每一个演示过的精度能力——包括 Dyna-2 自己的全部真机结果——都建立在每任务不超过十小时的人工采集机器人数据上<sup><a href="#ref-12">[12]</a></sup>。这个锚点不跨任务族摊销，语料规模也替代不了它：同样的锚点，在十万小时档位上 Dyna-2 的开锁任务是 0%，在百万小时档位上是 90%<sup><a href="#ref-12">[12]</a></sup>。替代的经济账很残酷——把 GEN-1 组合里所有已发表的锚点小时全部省掉，只能收回大约七千美元，而语料库一个数量级的扩张要花数千万<sup><a href="#ref-13">[13]</a>,<a href="#ref-14">[14]</a>,<a href="#ref-25">[25]</a></sup>。

**本体差距。** 2.87 倍的人类到机器人折扣是真测量<sup><a href="#ref-12">[12]</a></sup>。它的外推不是：对已发表曲线做拟合，闭合点的 90% 置信区间横跨**十个数量级**<sup><a href="#ref-25">[25]</a></sup>。所有"还需要一百亿小时"的标题，都是在四个数据点上做的数字命理学。与此同时，十小时人工数据今天就能按任务关闭同一个差距<sup><a href="#ref-12">[12]</a></sup>。

**评估沿物理边界裂开。** 便宜的机器人评估已经出现——SIMPLER 对真实策略的排序相关性达到 r=0.924<sup><a href="#ref-15">[15]</a></sup>，自动评估单元把人从回路里拿掉了<sup><a href="#ref-16">[16]</a></sup>。但它的作者们把适用范围写得很诚实：它适用于"刚体操作任务，因为其物理最容易仿真"<sup><a href="#ref-15">[15]</a></sup>。在富接触和可变形物体的层里，唯一的验证器仍然是人工搭建的闭环真机试验。

看这三个事实指向哪里。数据最稀缺的地方恰好是接触重要的地方——2026 年触觉论文里的"大规模"指一百个小时<sup><a href="#ref-17">[17]</a></sup>，对面是百万小时的视频语料<sup><a href="#ref-12">[12]</a></sup>和数十亿对的图像数据集。评估最昂贵的地方也恰好是接触重要的地方<sup><a href="#ref-15">[15]</a></sup>。数据的墙和评估的墙是同一堵墙，而且有地址：**接触**。

## 能算的我都自己算了

凡是能数值检验的论断，我用纯 Python 挨个跑了一遍<sup><a href="#ref-26">[26]</a></sup>。

评估统计的论断分毫不差：每个策略跑 10 到 20 次 rollout——这是 VLA 论文的常态<sup><a href="#ref-18">[18]</a></sup>——两个真实差距 5 个百分点的策略，将近一半的概率排序排反；要把置信度压到正负 2 个百分点，需要大约 1030 次 rollout<sup><a href="#ref-19">[19]</a>,<a href="#ref-20">[20]</a></sup>。这个领域的选择信号就是这么吵。FAST 的分词前提也复现了：控制频率升高时每个动作 token 的信息量塌缩，DCT 在平滑轨迹上拿回 10.3 倍压缩<sup><a href="#ref-3">[3]</a></sup>。接触混沌是真的但分区域<sup><a href="#ref-21">[21]</a></sup>：1% 的摩擦参数噪声在黏滑阈值附近产生 83 倍的结果弥散，远离阈值时几乎消失。

有两个实验站在了反方，我留着它们。模式平均——教科书上朴素行为克隆失败的原因<sup><a href="#ref-22">[22]</a></sup>——**没失败成**：只要有任何打破对称的噪声，连 k-NN 策略都会自己选定一个模式。误差复合在我的玩具系统里每步只涨 1.8%，谈不上灾难。两种病理都真实存在，也都比口头禅里的窄。

## 一句话的答案

Action 难以 scale，是因为它的训练信号和验证信号都必须被委托制造——按任务族、在机器人自己的本体上、以正的边际成本——而视觉和语言是在文明的免费废气上完成 scaling 的。所有成本集中的那个位置，恰好是物理变难的位置：接触。

这句话里没有墙，没有不可能。只有一摞价格。

## 什么会让我改主意

一个不可能错的论点不值得发表，所以这里是能打破它的东西。

1. **无锚点的精度结果。** 任何一个已发表的毫米级精度能力，做到零机器人本体后训练。十轮搜索一无所获。
2. **一千万小时判别点。** 本体差距的两种竞争拟合在大约 10⁷ 委托人类小时处可测地分开<sup><a href="#ref-25">[25]</a></sup>。按当前采集速度，两三年内到达<sup><a href="#ref-14">[14]</a></sup>。
3. **仿真评估跨过物理线。** 在**可变形物体**任务族上做出 SIMPLER 级的排序相关性，边界就会移动<sup><a href="#ref-15">[15]</a></sup>。
4. **成本塌方。** 人类采集降到每可用小时约 0.1 美元以下——比现有任何披露低两个数量级<sup><a href="#ref-14">[14]</a></sup>——按成本折算的均势就会翻转。

最后一个诚实的注脚：承重的 2026 年来源——Dyna-2<sup><a href="#ref-12">[12]</a></sup>、GEN-0/GEN-1<sup><a href="#ref-13">[13]</a>,<a href="#ref-14">[14]</a></sup>、π0.7<sup><a href="#ref-23">[23]</a></sup>、Gemini Robotics 2<sup><a href="#ref-24">[24]</a></sup>——都是造出它们的实验室的自我报告。我的流程验证了引文真实存在、内容如其所述，但验证不了结果能否复现。目前没人能。这本身就是评估瓶颈——也是这篇文章里我预计过时得最快的部分。

<details>
<summary><strong>参考文献</strong>（点击展开）</summary>
<ol>
<li id="ref-1">Hans Moravec, <em>Mind Children</em> (1988)；概述见 <a href="https://en.wikipedia.org/wiki/Moravec%27s_paradox">Moravec's paradox — Wikipedia</a>。</li>
<li id="ref-2">Ye et al., "Latent Action Pretraining from Videos" (LAPA), ICLR 2025. <a href="https://arxiv.org/abs/2410.11758">arXiv:2410.11758</a> · <a href="https://latentactionpretraining.github.io/">项目页</a>。</li>
<li id="ref-3">Pertsch et al., "FAST: Efficient Action Tokenization for Vision-Language-Action Models," Physical Intelligence, 2025. <a href="https://arxiv.org/abs/2501.09747">arXiv:2501.09747</a> · <a href="https://www.pi.website/research/fast">π 博客</a>。</li>
<li id="ref-4">Simchowitz, Pfrommer &amp; Jadbabaie, "The Pitfalls of Imitation Learning when Actions are Continuous," COLT 2025. <a href="https://arxiv.org/abs/2503.09722">arXiv:2503.09722</a>。</li>
<li id="ref-5">Kwa et al. (METR), "Measuring AI Ability to Complete Long Tasks," 2025. <a href="https://arxiv.org/abs/2503.14499">arXiv:2503.14499</a>。</li>
<li id="ref-6">Toby Ord, "The Half-Life of AI Agents," 2025. <a href="https://www.tobyord.com/writing/half-life">tobyord.com</a>。</li>
<li id="ref-7">Handa et al., "DeXtreme: Transfer of Agile In-Hand Manipulation from Simulation to Reality," NVIDIA, 2022. <a href="https://arxiv.org/abs/2210.13702">arXiv:2210.13702</a>。</li>
<li id="ref-8">Chen et al., "Visual Dexterity: In-Hand Reorientation of Novel and Complex Object Shapes," <em>Science Robotics</em>, 2023. <a href="https://arxiv.org/abs/2211.11744">arXiv:2211.11744</a>。</li>
<li id="ref-9">Lum et al., "DextrAH-G: Pixels-to-Action Dexterous Arm-Hand Grasping with Geometric Fabrics," 2024. <a href="https://arxiv.org/abs/2407.02274">arXiv:2407.02274</a>。</li>
<li id="ref-10">Intuitive Surgical，"Intuitive Announces FDA Clearance of da Vinci 5"，2024 年 3 月（达芬奇系列首次配备力反馈）。<a href="https://isrg.intuitive.com/news-releases/news-release-details/intuitive-announces-fda-clearance-da-vinci-5">新闻稿</a>。</li>
<li id="ref-11">Physical Intelligence, "π0.5: a Vision-Language-Action Model with Open-World Generalization," 2025（跨本体消融实验）. <a href="https://arxiv.org/abs/2504.16054">arXiv:2504.16054</a> · <a href="https://www.pi.website/blog/pi05">π 博客</a>。</li>
<li id="ref-12">Dyna Robotics, "Dyna-2: A 1-Million-Hour Scaling Law for Robot Manipulation," 2026 年 8 月. <a href="https://www.dyna.co/research/dyna-2">dyna.co/research/dyna-2</a>。文中引语、2.87 倍零样本人类→机器人差距、每任务 ≤10 小时的后训练锚点、开锁任务 0%→90% 的阶梯均出自该报告。</li>
<li id="ref-13">Generalist AI, "GEN-1," 2026（"The pretraining dataset contains no robot data"；可穿戴设备语料）. <a href="https://generalistai.com/blog/gen-1">generalistai.com/blog/gen-1</a>。</li>
<li id="ref-14">Generalist AI, "GEN-0," 2025 年 11 月（27 万+小时操作数据、每周 +1 万小时、scaling 曲线；采集成本与速度数字的依据）. <a href="https://generalistai.com/blog/nov-04-2025-GEN-0">generalistai.com/blog/nov-04-2025-GEN-0</a>。</li>
<li id="ref-15">Li et al., "Evaluating Real-World Robot Manipulation Policies in Simulation" (SIMPLER), CoRL 2024. <a href="https://arxiv.org/abs/2405.05941">arXiv:2405.05941</a> · <a href="https://simpler-env.github.io/">simpler-env.github.io</a>。刚体适用范围的表述与 r=0.924 排序相关性出自该项目发表材料。</li>
<li id="ref-16">Zhou et al., "AutoEval: Autonomous Evaluation of Generalist Robot Manipulation Policies in the Real World," 2025. <a href="https://arxiv.org/abs/2503.24278">arXiv:2503.24278</a>。</li>
<li id="ref-17">"T-Rex" 触觉操作，2026（其约 100 小时语料在触觉通道内即称"大规模"）. <a href="https://arxiv.org/abs/2606.17055">arXiv:2606.17055</a>。</li>
<li id="ref-18">PhAIL：真机 VLA 评估实践综述（每条件典型 N=10–20，无置信区间），2026. <a href="https://arxiv.org/abs/2605.29710">arXiv:2605.29710</a>。</li>
<li id="ref-19">NVIDIA 技术博客，"How to Evaluate General-Purpose Robot Policies for Real-World Deployment"（Clopper-Pearson rollout 算术）. <a href="https://developer.nvidia.com/blog/how-to-evaluate-general-purpose-robot-policies-for-real-world-deployment/">developer.nvidia.com</a>。</li>
<li id="ref-20">Toyota Research Institute, "A Careful Examination of Large Behavior Models"（LBM；大规模盲测随机 A/B 评估）. <a href="https://toyotaresearchinstitute.github.io/lbm1/">toyotaresearchinstitute.github.io/lbm1</a>。</li>
<li id="ref-21">Bauza &amp; Rodriguez, "A Probabilistic Data-Driven Model for Planar Pushing"（重复相同推动下的结果弥散测量），2017. <a href="https://arxiv.org/abs/1705.10664">arXiv:1705.10664</a>。</li>
<li id="ref-22">Chi et al., "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion," RSS 2023（行为克隆模式平均问题的经典表述）. <a href="https://arxiv.org/abs/2303.04137">arXiv:2303.04137</a>。</li>
<li id="ref-23">Physical Intelligence, "π0.7," 2026 年 4 月. <a href="https://www.pi.website/blog/pi07">π 博客</a> · <a href="https://arxiv.org/abs/2604.15483">arXiv:2604.15483</a>。</li>
<li id="ref-24">Google DeepMind，Gemini Robotics 模型系列，2025–2026. <a href="https://deepmind.google/models/gemini-robotics/">deepmind.google/models/gemini-robotics</a>。</li>
<li id="ref-25">2–39 倍价格比、按成本折算的均势、约七千美元的锚点替代上限、差距闭合外推的十个数量级置信区间、以及 10⁷ 小时判别点，均为我基于 [12][13][14] 披露数据的自行计算（带下限项的曲线重拟合、bootstrap 置信区间、盈亏平衡核算）。方法记录在我的研究笔记里。</li>
<li id="ref-26">数值实验（评估统计、动作 token 信息量/DCT、黏滑弥散、模式平均、误差复合）为我自己的纯 Python 仿真；它们检验的论断出自 [3][18][19][21][22]。</li>
</ol>
</details>
