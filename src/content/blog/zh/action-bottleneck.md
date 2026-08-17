---
title: 'VLA 里 scale 不动的那个字母'
description: '机器人 AI 里真正 scale 不动的部分：不存在的免费数据、每个任务都要的锚点、昂贵的测试——以及它们为什么全部汇聚在"接触"上。从头讲清楚。'
pubDate: 2026-08-16
tags: [embodied-ai, robotics, VLA, scaling, world-models]
locale: zh
---

语言模型能通过司法考试，图像模型能画出你描述的任何东西。而那台号称能帮你装洗碗机的机械臂，失败率依然高到没有一家公司敢真正发售。

奇怪的是，这三样东西现在住在同一种模型里。机器人 AI 的当前标准形态叫 **VLA——视觉-语言-动作模型（vision-language-action model）**：摄像头画面和一句文字指令进去，电机指令出来，一个神经网络端到端跑完。视觉和语言这两半在互联网上预训练过，表现出色——今天的机器人真的能听懂"把水壶后面那个红杯子拿起来"。卡住的是动作这一半：每秒二十到五十条的电机指令流。泛化能力到这里就停了。

为什么偏偏是动作？经典的搪塞是莫拉维克悖论——"难的事容易，容易的事难"<sup><a href="#ref-1">[1]</a></sup>——它给现象起了个名字，但什么也没解释。真正站得住的解释是经济性的。值得慢慢讲一遍，因为它能预测机器人技术会在哪里变好、在哪里不会。

## "scaling 时刻"由什么构成

人们说语言和视觉"完成了 scaling"，指的是两件事同时发生。

**第一，进步变得可预测。** 2020 年，研究者测出语言模型的误差随数据和算力沿一条平滑的幂律下降——在对数坐标上是一条直线，横跨七个数量级<sup><a href="#ref-2">[2]</a></sup>。后续工作把指数钉得足够精确，实验室现在直接拿这条曲线去规划上亿美元的训练<sup><a href="#ref-3">[3]</a></sup>。能力变成了可以*计划*的东西。GPT-3 证明了这份计划会兑现：少样本学习这样的能力是随规模出现的，不靠任何新架构<sup><a href="#ref-4">[4]</a></sup>。视觉走的是同一条路：从在 120 万张标注照片上学习的 AlexNet<sup><a href="#ref-5">[5]</a></sup>，到从网上爬来 4 亿图文对的 CLIP<sup><a href="#ref-6">[6]</a></sup>，再到 58.5 亿的 LAION<sup><a href="#ref-7">[7]</a></sup>。

**第二——这是常被忘掉的一半——燃料是免费的。** 互联网本来就在那里。每一场论坛争论、每一条商品评论、每一张带说明的照片，都是人们为自己的理由生产的，而且已经数字化了。研究者管这叫 *found data*（现成数据）：作为日常生活副产品存在的数据。GPT-3 的语料大头是 Common Crawl，一个非营利组织免费存档的网络快照<sup><a href="#ref-4">[4]</a>,<a href="#ref-8">[8]</a></sup>；LAION 也是从同一个存档里筛出来的<sup><a href="#ref-7">[7]</a></sup>。第一万亿个 token 和第一个 token 花的钱一样多：零。没有人被雇来写互联网。

所以，scaling 时刻 = 一条可预测的曲线 + 免费的燃料。把这两半都记住。动作两半都缺——而且缺的方式比表面看起来有意思得多。

## 机器人加入了互联网经济，却没有互联网

想想你上次做晚饭的情形。你的手做了几千次微调——重新握刀，感到番茄皮破开的瞬间松力。这些被记录下来了多少？零。一个比特都没有。人类无时无刻不在产生运动数据，却从来没有记录过任何一条。

所以机器人的数据没法"找到"，只能**制造**。标准做法叫*遥操作*（teleoperation）：一个人戴着 VR 手柄或握着主从臂，像操纵提线木偶一样带着机器人做任务，同时记录每个关节角度和每帧画面。一小时熟练人工换一小时数据——还要扣掉失败的镜次和布景重置。市面上这种服务的全成本报价从每小时几十美元到两百美元左右<sup><a href="#ref-9">[9]</a></sup>。

结果是一道很难夸大的数据鸿沟。Meta 的 Llama 3 用了约 15 万亿词的现成文本<sup><a href="#ref-10">[10]</a></sup>——有人估算 LLM 级语料相当于 10 万年的人类阅读量<sup><a href="#ref-11">[11]</a></sup>。机器人领域的旗舰共享数据集 Open X-Embodiment 汇集了 34 个实验室的产出，约一百万条简短演示<sup><a href="#ref-12">[12]</a></sup>；把所有主要开放数据集加起来，大约 11,000 小时<sup><a href="#ref-13">[13]</a></sup>。一万一千小时，等于十五个月的不间断经验。这就是整个领域的全部共享家底——对面是一整个物种的文字。

大多数人的答案到这里就停了：*机器人没有互联网，所以机器人 AI 缺数据。*没错，但只对了一半。到 2026 年这不再是有意思的答案，因为这个领域找到了一条看起来能绕过去的路——而那条路的小字，改变了整幅图景。

## 那份"免费"数据，其实是买来的

绕路的思路很直接。人类整天都在动。给人头上绑个摄像头，手上或许再加传感器，录*人*就行——不需要机器人，不需要遥操作台，就是普通人做家务。几百万小时忽然变得触手可及。先从人类视频里大规模学会"操作是怎么回事"，最后再翻译到机器人身上。

两个旗舰结果把这条路变成了现实。**Dyna-2** 在一百万小时第一视角（头戴摄像头）人类视频上训练，得到了一条真正的 scaling law：人类视频越多，机器人表现可测量地越好<sup><a href="#ref-14">[14]</a></sup>。**GEN-1** 走得更远，预训练完全不用机器人数据——用公司自己的话说，语料"不含任何机器人数据"<sup><a href="#ref-15">[15]</a></sup>。媒体把这些解读为"动作的互联网"终于到来。

现在看小字。GEN-1 的语料来自"低成本可穿戴设备，采集人类进行数百万次活动的数据"<sup><a href="#ref-15">[15]</a></sup>——设备是买的，戴设备的人是招募的。Dyna-2 的一百万小时"由我们的数据合作方以及我们自己的内部运营采集"<sup><a href="#ref-14">[14]</a></sup>。

换句话说：**委托采集**。每一小时都是付了钱的。这值得单独起个名字，因为它是整个故事的关键。*委托数据*（commissioned data）指只因有人出资才存在的数据——不管营销怎么说，它是现成数据的反面。一旦看清这一点，你就会发现机器人领域根本不存在任何"找到的"路线：遥操作不是，"大规模人类视频"也不是。给语言和视觉供能的那种网络爬虫，在这里没有对应物。

所以真正的问题从来不是"机器人能不能找到免费数据"（不能），而是"**买哪种数据，每单位机器人技能更便宜**——人的小时还是机器人的小时？"这个问题有数字：

- 委托采集的*人类*小时（可穿戴、头戴摄像头）比委托采集的*机器人*小时（遥操作）便宜大约 2 到 39 倍<sup><a href="#ref-16">[16]</a></sup>。
- 但人类数据带着一笔转移折价。在一百万小时人类视频上训练，模型预测*人类*动作很准——但零样本预测*机器人*动作时差了约 3 倍（Dyna-2 自己测出 2.87 倍）<sup><a href="#ref-14">[14]</a></sup>。这就是**本体差距**（embodiment gap）：看一千小时的筷子使用视频，能学到很多关于食物、握法和物理的知识——但没法把运动程序直接交给一个两指橡胶夹爪。身体之间不共享肌肉记忆。

把折价和价格优势放在一起算，两条路线的差距落在一个数量级以内<sup><a href="#ref-16">[16]</a></sup>。这一道算术题，比任何技术论证都更能解释行业现状：为什么一半公司在买遥操作、另一半在买可穿戴设备，为什么谁也没有甩开谁。不存在免费的路——只有两条明码标价的路，而且价格接近。

## 事实一：每个技能仍然需要一个锚点

不管预训练吃的是什么，每一个已发表的系统里都有同一味配料：一小份*在真实机器人上、做真实任务*采集的数据。叫它**锚点**（anchor）。在 Dyna-2 那里是每任务不超过十小时<sup><a href="#ref-14">[14]</a></sup>；在我能查到的全部记录里，没有任何一个演示过的精度技能——毫米级插接、开锁、精细放置——是不带锚点的。

锚点有两个别扭的性质。

**它不迁移。** 十小时的开锁数据买到的是开锁。买不到叠衣服。想象一个钢琴家，不管已经会多少首曲子，每首新曲都必须重新练十小时——这就是今天的机器人学习，而且每个型号的机器人都得分别练。

**规模替代不了它——但规模确实通过它起作用。** Dyna-2 的开锁任务，用完全相同的十小时锚点：人类视频语料是十万小时时，成功率 0%；一百万小时时，90%<sup><a href="#ref-14">[14]</a></sup>。这句话要读仔细，因为两半都重要：视频预训练真真切切解锁了这个技能（0 到 90 不是噪声），*同时*锚点全程都是必需品。预训练放大锚点；但还没有任何东西替代锚点。

这决定了整个领域的经济结构。一个锚点花几百到两千美元的机器人时间。而视频语料扩大十倍要花几千万美元。如果建巨型语料库的目的是消灭锚点，账立刻塌掉：把 GEN-1 已发表任务组合里的所有锚点小时全部省掉，只能省下约七千美元<sup><a href="#ref-15">[15]</a>,<a href="#ref-16">[16]</a></sup>。语料规模必须靠别的东西回本——更广的泛化、更强的稳健性——因为作为"锚点消除器"，它贵了几千倍。那条按任务、按机器人计价的成本线，本该被 scaling 抹掉，现在还留在每一条流水线里。

## 事实二：没人知道更多视频能不能关闭本体差距

乐观的故事说本体差距是暂时的：继续堆人类视频，3 倍折价会缩到零。也许吧。但这个外推的诚实版本相当谦卑。已发表的曲线只有四个语料规模的数据点。拟合它，再问"语料到多大，人类视频路线能追平机器人原生数据的表现？"——统计上说得通的答案从大约一千万小时，一直排到 10¹⁷ 小时——后一个数字大约等于全人类有史以来活过的全部小时数<sup><a href="#ref-16">[16]</a></sup>。这不是预测。这是带误差棒的耸肩。

所以当某家实验室宣布"还需要 N 十亿小时达到人类水平"，请像对待一个用四份季报推出来的股价目标一样对待它。差距是真实的、测量过的；关闭它的时间表是无法确定的——而且它可能从侧面关闭：靠更好的模型架构而不是更多小时。同一套算术显示，只需要几代模型级别的改进就相当于整个差距<sup><a href="#ref-16">[16]</a></sup>。

## 事实三：测试是隐藏的税

语言模型进步这么快，还有一个安静的原因：*测量*它们是免费的。一次评估就是一个脚本——几千道题，几分钟，零美元，完美复现。现在来测一台机器人。每一次测试都是一个物理事件：布置场景，跑策略，看它成功还是把杯子摔了，把一切复位，再来一次。全程有个人站在旁边。

要重复多少次才算数？这件事一百行 Python 就能验证，所以我验证了<sup><a href="#ref-17">[17]</a></sup>。

**设置。** 模拟两个机器人策略，真实成功率分别是 80% 和 75%。各自"评估" N 次（按真实成功率抛硬币），然后宣布得分高的那个更好。把整个比较重复 40,000 次，数一数评估把排名弄错或打平的频率。

**结果。** 每个策略 N=10 次时，错误或打平的判决约占一半。N=20 时，42%。就算 N=100——整整一天的机器人时间——还有 22%。另外：要把单个策略的成功率钉在 ±2 个百分点以内，需要约 1,030 次试验，与已发表的统计指南一致<sup><a href="#ref-18">[18]</a>,<a href="#ref-19">[19]</a></sup>。

**结论。** 机器人论文通常每任务报告 10–20 次试验<sup><a href="#ref-20">[20]</a></sup>。在这个样本量下，一个宣称的 5 个百分点的改进接近抛硬币。这个领域的进步信号泡在评估噪声里——而认真做一次比较要花一天机器人时间，LLM 基准只要几秒。scaling 靠的是快速迭代；机器人在每一圈都要交过路费。

仿真是显然的解法，而且部分有效：SIMPLER 基准复现真实策略的*排名*，相关性达到 r=0.924<sup><a href="#ref-21">[21]</a></sup>；自动评估单元已经能在没有人的情况下跑真机测试<sup><a href="#ref-22">[22]</a></sup>。但读读 SIMPLER 作者自己写的适用范围："刚体操作任务，因为其物理最容易仿真"<sup><a href="#ref-21">[21]</a></sup>。刚体。这把我们带到了所有线索一直指向的那个地方。

## 墙有一个地址：接触

刚体任务——挪积木、拿瓶子——是机器人数据最充足、仿真器最可信、评估最便宜的地方。**富接触**任务——插一个紧配合的接头、叠布料、抓任何软的或滑的东西——是三者同时失灵的地方。这不是巧合。接触的三个性质导致了它。

**摄像头看不见力。** 看一段手握纸杯的视频：这只手是握得稳稳的，还是差一牛顿就把杯子捏瘪？像素完全相同。握力、摩擦、打滑的前兆——决定精细操作成败的变量，对提供了 99% 机器人训练数据的那种传感器是隐形的。真正携带这些信息的通道——触觉——从未被大规模数字化：2026 年一篇触觉论文把自己 100 小时的数据集称为"大规模"，而在那个领域这确实算大<sup><a href="#ref-23">[23]</a></sup>。一百小时，旁边是一百万小时的视频。（触觉并非严格*必需*——在力反馈 2024 年终于上线之前，外科医生用达芬奇零触觉地完成了几百万台手术<sup><a href="#ref-24">[24]</a></sup>——但凡是精度撞上不确定性的地方，它都很值钱。）

**接触物理会放大微小差异。** 这也是在家就能验证的<sup><a href="#ref-17">[17]</a></sup>。

**设置。** 模拟推一个重物：推力缓缓加大，物体先粘住不动，静摩擦被突破后突然滑出——就是你推家具时那种先卡后窜的感觉。跑 400 次，每次把摩擦系数变化 ±1%——桌面稍微潮一点就能免费送你这种变化。作为对照，把同样的 ±1% 加到一个平滑系统上（黏性阻尼，没有粘滑阈值）。

**结果。** 平滑系统里，结果的分散度约 1%——噪声进，噪声出。粘滑系统在阈值附近，最终位置的分散度大 83 倍；有的试验几乎没动，有的直接冲过头。远离阈值时，效应几乎消失。

**结论。** 在接触转变点附近，看起来完全相同的物理情形会产生截然不同的结果。真实机器人上的测量显示同样的现象——对同一个物体重复完全相同的推动，得到的是一整个结果分布<sup><a href="#ref-25">[25]</a></sup>。这就是为什么接触任务需要很多次演示（每次落点都不同），为什么仿真器恰好在这里和现实对不上（1% 的建模误差会爆炸），为什么评估需要很多次试验（单次结果毫无意义）。一个物理现象，三张账单。

现在把三个事实叠起来。触觉数据最稀缺的地方，恰好是接触重要的地方。仿真最弱的地方，恰好是接触重要的地方。评估最贵的地方，恰好是接触重要的地方。数据的墙、仿真的墙、测试的墙是同一堵墙，它就立在机器人手指碰到世界的位置上。

## 所以，为什么偏偏是动作？

因为它的训练信号和测试信号都有单价，而视觉和语言的信号是免费拿到的。

机器人的每一小时能力都是买来的：要么买委托采集的人类视频，承担实测约 3 倍的转移折价；要么按全价买机器人时间——外加一个任何规模都还没能移除的按任务锚点，外加凡是涉及接触就必须上真机的评估，而有意思的任务恰恰全在接触里。

注意这句话里*没有*什么：没有不可能，没有缺失的突破，没有悖论。只有账目明细。这反倒是乐观的读法——悖论不向预算低头，价格会。而其中好几项价格，正沿着已发表的曲线往下走。

## 值得盯着的信号

如果这幅图景是对的，它就能做出预测。以下是能告诉你它开始失效的信号——每一条都比任何演示视频更有含金量：

1. **无锚点的精度演示。** 一台机器人在*零*任务专属数据的情况下完成毫米级任务。到目前为止，没有任何已发表系统做到过。哪天有人做到，按任务计价的那条成本线就开始死亡。
2. **人类视频语料达到约一千万小时。** 在那个规模附近，关于本体差距的几种竞争理论会可测量地分开<sup><a href="#ref-16">[16]</a></sup>。按当前采集速度，两三年内到达<sup><a href="#ref-15">[15]</a>,<a href="#ref-26">[26]</a></sup>。
3. **一个能在布料或可变形物体上正确排序策略的仿真器。** 那会把评估的墙从接触边界上挪开——而这正是 SIMPLER 作者今天明确划到范围之外的结果<sup><a href="#ref-21">[21]</a></sup>。
4. **可穿戴采集降到每可用小时约 0.1 美元以下**——比现有披露低两个数量级。到那个价格，人类数据和机器人数据的成本均势会彻底翻转。

最后一个要随身携带的注脚：本文承重的 2026 年数字——Dyna-2 的、GEN-1 的——都是生产它们的实验室的自我报告，而且机器人领域没有任何人能独立复现一次百万小时的训练。我核实了这些来源说了什么；它们能否复现是另一个问题。这份不确定性，恰好又是评估瓶颈本身——也是这篇文章里我预计过时得最快的部分。

<details>
<summary><strong>参考文献</strong>（点击展开）</summary>
<ol>
<li id="ref-1">Hans Moravec, <em>Mind Children</em> (1988)；概述见 <a href="https://en.wikipedia.org/wiki/Moravec%27s_paradox">Moravec's paradox — Wikipedia</a>。</li>
<li id="ref-2">Kaplan et al., "Scaling Laws for Neural Language Models," 2020. <a href="https://arxiv.org/abs/2001.08361">arXiv:2001.08361</a>。</li>
<li id="ref-3">Hoffmann et al., "Training Compute-Optimal Large Language Models" (Chinchilla), NeurIPS 2022. <a href="https://arxiv.org/abs/2203.15556">arXiv:2203.15556</a>。</li>
<li id="ref-4">Brown et al., "Language Models are Few-Shot Learners" (GPT-3), NeurIPS 2020（少样本能力随规模出现；语料以 Common Crawl 为主）. <a href="https://arxiv.org/abs/2005.14165">arXiv:2005.14165</a>。</li>
<li id="ref-5">Krizhevsky, Sutskever &amp; Hinton, "ImageNet Classification with Deep Convolutional Neural Networks" (AlexNet), NeurIPS 2012. <a href="https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html">论文</a>。</li>
<li id="ref-6">Radford et al., "Learning Transferable Visual Models From Natural Language Supervision" (CLIP), ICML 2021. <a href="https://arxiv.org/abs/2103.00020">arXiv:2103.00020</a>。</li>
<li id="ref-7">Schuhmann et al., "LAION-5B: An Open Large-Scale Dataset for Training Next Generation Image-Text Models," NeurIPS 2022（从 Common Crawl 筛出的 58.5 亿图文对）. <a href="https://arxiv.org/abs/2210.08402">arXiv:2210.08402</a>。</li>
<li id="ref-8">Common Crawl——非营利网络存档，免费使用. <a href="https://commoncrawl.org/">commoncrawl.org</a>。</li>
<li id="ref-9">Silicon Valley Robotics Center，机器人训练数据采集成本指南（遥操作全成本报价；各供应商约 $15–200/小时）. <a href="https://www.roboticscenter.ai/learn/collect-robot-training-data">roboticscenter.ai</a>。</li>
<li id="ref-10">Grattafiori et al., "The Llama 3 Herd of Models," 2024（约 15 万亿训练 token）. <a href="https://arxiv.org/abs/2407.21783">arXiv:2407.21783</a>。</li>
<li id="ref-11">Ken Goldberg, "Good old-fashioned engineering can close the 100,000-year data gap in robotics," <em>Science Robotics</em>, 2025. <a href="https://www.science.org/doi/10.1126/scirobotics.aea7390">doi:10.1126/scirobotics.aea7390</a>。</li>
<li id="ref-12">Open X-Embodiment Collaboration, "Open X-Embodiment: Robotic Learning Datasets and RT-X Models," 2023（约 100 万条轨迹、22 种机器人、34 个实验室）. <a href="https://arxiv.org/abs/2310.08864">arXiv:2310.08864</a>。</li>
<li id="ref-13">Qwen-RobotManip 技术报告，2026（九大开放机器人数据集合计约 11,000 小时）. <a href="https://arxiv.org/abs/2606.17846">arXiv:2606.17846</a>。</li>
<li id="ref-14">Dyna Robotics, "Dyna-2: A 1-Million-Hour Scaling Law for Robot Manipulation," 2026 年 8 月. <a href="https://www.dyna.co/research/dyna-2">dyna.co/research/dyna-2</a>。语料来源引语、2.87 倍零样本人类→机器人差距、每任务 ≤10 小时锚点、开锁任务 0%→90% 阶梯均出自该报告。</li>
<li id="ref-15">Generalist AI, "GEN-1," 2026（"The pretraining dataset contains no robot data"；可穿戴设备语料）. <a href="https://generalistai.com/blog/gen-1">generalistai.com/blog/gen-1</a>。</li>
<li id="ref-16">2–39 倍价格比、按成本折算的均势、约七千美元的锚点替代上限、差距闭合外推区间（约 10⁷ 到 10¹⁷ 小时）、架构路线的换算、以及 10⁷ 小时判别点，均为我基于 [9][14][15][26] 披露数据的自行计算（带下限项的曲线重拟合、bootstrap 置信区间、盈亏平衡核算）。</li>
<li id="ref-17">文中两个实验（评估统计；粘滑弥散）为我自己的纯 Python 仿真，各约百行；设置如正文所述。</li>
<li id="ref-18">NVIDIA 技术博客，"How to Evaluate General-Purpose Robot Policies for Real-World Deployment"（Clopper-Pearson 试验数换算）. <a href="https://developer.nvidia.com/blog/how-to-evaluate-general-purpose-robot-policies-for-real-world-deployment/">developer.nvidia.com</a>。</li>
<li id="ref-19">Toyota Research Institute, "A Careful Examination of Large Behavior Models"（LBM；大规模盲测随机 A/B 评估）. <a href="https://toyotaresearchinstitute.github.io/lbm1/">toyotaresearchinstitute.github.io/lbm1</a>。</li>
<li id="ref-20">PhAIL：真机 VLA 评估实践综述（每条件典型 N=10–20，通常无置信区间），2026. <a href="https://arxiv.org/abs/2605.29710">arXiv:2605.29710</a>。</li>
<li id="ref-21">Li et al., "Evaluating Real-World Robot Manipulation Policies in Simulation" (SIMPLER), CoRL 2024. <a href="https://arxiv.org/abs/2405.05941">arXiv:2405.05941</a> · <a href="https://simpler-env.github.io/">simpler-env.github.io</a>。刚体适用范围表述与 r=0.924 排序相关性出自该项目发表材料。</li>
<li id="ref-22">Zhou et al., "AutoEval: Autonomous Evaluation of Generalist Robot Manipulation Policies in the Real World," 2025. <a href="https://arxiv.org/abs/2503.24278">arXiv:2503.24278</a>。</li>
<li id="ref-23">"T-Rex" 触觉操作，2026（其约 100 小时语料在触觉通道内即称"大规模"）. <a href="https://arxiv.org/abs/2606.17055">arXiv:2606.17055</a>。</li>
<li id="ref-24">Intuitive Surgical，"Intuitive Announces FDA Clearance of da Vinci 5"，2024 年 3 月（达芬奇系列首次配备力反馈）. <a href="https://isrg.intuitive.com/news-releases/news-release-details/intuitive-announces-fda-clearance-da-vinci-5">新闻稿</a>。</li>
<li id="ref-25">Bauza &amp; Rodriguez, "A Probabilistic Data-Driven Model for Planar Pushing," 2017（真实硬件上重复完全相同的推动得到结果分布）. <a href="https://arxiv.org/abs/1705.10664">arXiv:1705.10664</a>。</li>
<li id="ref-26">Generalist AI, "GEN-0," 2025 年 11 月（27 万+小时操作数据，每周约 +1 万小时；采集速度数字的依据）. <a href="https://generalistai.com/blog/nov-04-2025-GEN-0">generalistai.com/blog/nov-04-2025-GEN-0</a>。</li>
</ol>
</details>
