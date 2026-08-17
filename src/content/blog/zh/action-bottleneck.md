---
title: 'VLA 里 scale 不动的那个字母'
description: '为什么同一份数据上视觉头不过拟合而动作头过拟合，为什么动作没有免费数据，为什么机器人学习的所有成本都汇聚在"接触"上。从头讲清楚。'
pubDate: 2026-08-16
tags: [embodied-ai, robotics, VLA, scaling, world-models]
locale: zh
---

语言模型能通过司法考试，图像模型能画出你描述的任何东西。而那台号称能帮你装洗碗机的机械臂，失败率依然高到没有一家公司敢真正发售。

奇怪的是，这些系统现在共享同一套机器。机器人 AI 最显眼的一族是 **VLA——视觉-语言-动作模型**：摄像头画面和文字指令进去，电机指令出来，一个网络端到端。它还有几个兄弟：**世界-动作模型（WAM）**，联合预测未来的观测和动作<sup><a href="#ref-1">[1]</a></sup>；让语言模型写代码去调用运动原语的系统<sup><a href="#ref-2">[2]</a></sup>；用扩散或流匹配生成整段运动轨迹的策略<sup><a href="#ref-3">[3]</a></sup>。架构各不相同，症状却一样：在每一族里，用互联网预训练过的视觉和语言部分泛化良好，而动作部分是泛化终止的地方。

为什么偏偏是动作？经典的搪塞是莫拉维克悖论——"难的事容易，容易的事难"<sup><a href="#ref-4">[4]</a></sup>——它给现象起了名字，但什么也没解释。真正站得住的解释有两半，而且都不神秘。一半是**统计的**：即使在完全相同的数据上，动作也是一个比像素更难伺候的学习目标——视觉不过拟合的地方它过拟合，原因可以用一百行 Python 演示出来。另一半关乎**价格**：视觉和语言的训练信号是世界免费产好的现成货，而动作信号的每一小时都要花钱买。先讲统计，再讲价格——最后讲两个问题堆在一起的那个位置。

## "scaling 时刻"由什么构成

人们说语言和视觉"完成了 scaling"，指的是两件事同时发生。

**第一，进步变得可预测。** 2020 年，研究者测出语言模型的误差随数据和算力沿平滑的幂律下降——对数坐标上一条直线，横跨七个数量级<sup><a href="#ref-5">[5]</a></sup>。后续工作把指数钉得足够精确，实验室现在直接拿曲线去规划上亿美元的训练<sup><a href="#ref-6">[6]</a></sup>。GPT-3 证明了这份计划会兑现：少样本学习这样的能力随规模出现，不靠新架构<sup><a href="#ref-7">[7]</a></sup>。视觉走了同一条路：从 120 万张标注照片上的 AlexNet<sup><a href="#ref-8">[8]</a></sup>，到 4 亿网络图文对上的 CLIP<sup><a href="#ref-9">[9]</a></sup>，再到 58.5 亿的 LAION<sup><a href="#ref-10">[10]</a></sup>。

**第二——常被忘掉的一半——燃料是免费的。** 互联网本来就在那里。每场论坛争论、每条商品评论、每张带说明的照片，都是人们为自己的理由生产的，而且已经数字化。研究者管这叫 *found data*（现成数据）：日常生活的副产品。GPT-3 的语料大头是 Common Crawl，一个非营利组织免费存档的网络快照<sup><a href="#ref-7">[7]</a>,<a href="#ref-11">[11]</a></sup>；LAION 也是从同一个存档里筛出来的<sup><a href="#ref-10">[10]</a></sup>。第一万亿个 token 和第一个花的钱一样多：零。

所以，scaling 时刻 = 可预测的曲线 + 免费的燃料。动作两样都缺。但在讲缺燃料之前，先讲一个更深的问题——一个加多少燃料都解决不了的问题。

## 同一份数据，两种命运

有一个数据量解释不了的谜题，训练过这类模型的人都撞见过。取一份固定的机器人数据集——比如领域的旗舰共享数据集 Open X-Embodiment<sup><a href="#ref-12">[12]</a></sup>——在完全相同的轨迹上训练一个带两个预测头的模型。一个头预测接下来的视频帧，另一个头预测记录下来的动作。视觉头很本分：训练和验证损失一起下降。动作头不老实：训练准确率一路爬升，验证准确率先升、到顶、然后*往下掉*——教科书式的过拟合曲线。Dyna Robotics 在百万小时规模上报告了完全相同的现象：只用动作训练的模型"停滞并过拟合"，靠视频预测联合训练才稳定下来<sup><a href="#ref-13">[13]</a></sup>。

同样的轨迹。同样的网络。一个目标泛化，另一个死记。为什么？

答案是一个想法：**两个目标坐在演示者决策的两侧。**

演示的每一个时间步都走同一条因果链：演示者做决定 → 手执行 → 世界显示结果。

预测下一帧是个*下游*问题：已知目前的运动，接下来会发生什么？你提问的时候，决定已经做完了——而且它的后果已经可见，因为两帧之间的速度就是最近几条指令的执行记录。难的部分在提问之前就结束了。

预测动作是个*上游*问题：这个人*此刻*会决定什么？在真正的决策点上，观测里没有答案。同一个位置，两个演示者会往相反的方向绕。同一个演示者周一早转弯、周二晚转弯，指令上还叠着手抖。这些都不在像素里——它们还在人的脑子里。

再走一步就到过拟合了：**对神经网络来说，凡是输入决定不了的东西，都和带噪标签没有区别。** 而在带噪标签上训练的网络有一张有据可查的时间表——先学会真实模式，然后开始记忆噪声，从那一刻起验证性能掉头向下、训练性能继续上升<sup><a href="#ref-14">[14]</a></sup>,<sup><a href="#ref-15">[15]</a></sup>。你在动作头上看到的那条先升后降的验证曲线就是这张时间表，触发它的是动作信号里那部分从观测出发本来就不可预测的东西。

还有三个较小的效应在叠加：

- **视觉损失有缓冲垫。** 一帧是几十万个数字，其中大多数——背景、桌面、光照——按惯性延续。视觉损失是一个被容易的、可迁移的结构主导的平均数。一个动作是 7–24 个数字，全是决策；每次失误都落在要害上。（附注：把视觉损失只算在夹爪和目标物体的像素上，差距会回来一截。缓冲垫垫的是平均数，不是操作能力。）
- **动作头能作弊。** 动作在时间上平滑，抄上一个动作就能拿高分，却什么也没学——copycat 问题<sup><a href="#ref-16">[16]</a></sup>。背景细节能认出*这是哪条演示*，解锁一段背好的序列——因果混淆<sup><a href="#ref-17">[17]</a></sup>。真实系统就是这样失败的：LIBERO 基准上 90% 以上的 VLA，物体一换就掉到 0%，诊断为死记硬背的动作序列<sup><a href="#ref-18">[18]</a></sup>。像素没有这种捷径——抄一个标签预测不出一百万个数字。
- **真实样本数比看起来少。** 每一帧都在采样同一套共享的物理。动作只在决策点携带新信息——一条 200 步的轨迹可能只有五个独立选择，中间是自相关的填充物。按决策数来数，同一份数据集对动作头小几千倍。

这些都能做成微缩实验验证。我搭了个最小的版本<sup><a href="#ref-19">[19]</a></sup>：

**设置。** 一个仿真 2D 机器人穿过桌面去目标点，中途绕开障碍物。每条演示带着观测永远不显示的隐藏状态：演示者选了哪一边绕（掷硬币）、他早转弯还是晚转弯的风格、以及指令信号上的抖动。"机械臂"有惯性，所以观测到的位置是原始指令的平滑版——摄像头看到滤波后的手臂，遥操作日志存的是原始信号。两个头用完全相同的输入（最近两个位置）：视觉头预测下一个位置，动作头预测原始指令。

![实验设置：左图为仿真演示按隐藏硬币分左右两侧绕过障碍物；右图为同一段运动的两种记录——锯齿状的原始指令与平滑的惯性滤波轨迹](/images/blog/action-bottleneck/fig-setup.svg)

*实验设置。左：演示按隐藏硬币分叉，转弯早晚的风格差异清晰可见。右：同一段运动的两种记录——动作标签是锯齿状的橙色指令，观测是平滑的蓝色响应。两个头看到的输入完全相同。*

<details>
<summary>仿真代码核心（完整脚本各约 100 行）</summary>

```python
# 每步演示。每条 episode 的隐藏量：side（硬币）、turn_dist（风格）。
if x < OBS_X and (OBS_X - x) < turn_dist and abs(y) < 1.0:
    target = (x + 0.5, side * 1.2)        # 绕行路径点
else:
    target = GOAL
d = unit_vector(target - pos)
cmd = SPEED * d + gauss(0, 0.05)          # 动作标签：意图 + 抖动
exec_v = 0.6 * exec_v + 0.4 * cmd         # 机械臂惯性（低通滤波）
pos = pos + exec_v                        # 观测：滤波后的响应

# 两个头，输入完全相同（最近两个位置）：
#   视觉头预测 pos_next  -> 世界的滤波响应
#   动作头预测 cmd       -> 人的原始信号
# 模型一：最近邻（纯记忆器），200 条训练 / 200 条验证 episode
# 模型二：MLP 4 -> 240 tanh -> 2，梯度下降，8 条训练 / 150 条验证 episode
```

</details>

**结果。** 先看记忆器。训练误差：两个头都是零——记忆器对什么都记得一样牢。验证误差（归一化到 1.0 = 不比瞎猜平均值强）：视觉 0.003，动作 0.631——差约 **190 倍**，输入相同、数据相同、模型相同。决策区附近动作误差爬到 0.75。

同样的不对称还有一条时间轴。把记忆器换成一个用梯度下降训练的小神经网络，并且——为了贴近真实按任务机器人数据的窘境——只给它 *8 条*演示。视觉头几乎没注意到这份贫穷：训练和验证误差一起降到 0.0014 和 0.0019，然后重叠着趴了四千个 epoch。8 条就够，因为目标是共享的物理。动作头画出了每个从业者都见过的那条曲线：验证误差几乎立刻触底（0.53，第 45 个 epoch），然后在余下的整个训练里一路爬升，而训练误差持续下降——结束时 0.31 对 0.60。越拉越宽的缺口，就是网络在往硬币和抖动里挖。

![训练曲线：视觉头的训练与验证误差在 4000 个 epoch 里贴地重叠；动作头的验证误差在第 45 个 epoch 触底后掉头向上，而训练误差持续下降](/images/blog/action-bottleneck/fig-curves.svg)

*同样的数据、同样的网络、同样的训练——只有目标不同。视觉头的两条曲线在地板上重叠；动作头的验证误差在第 45 个 epoch 后掉头向上：从那一刻起，"学到"的都是噪声。*

**是哪个隐藏变量在搞破坏？** 逐个关掉试试（记忆器版本；验证误差，1.0 = 瞎猜平均值）：

| 变体 | 动作头 | 视觉头 |
|---|---|---|
| 全部隐藏（硬币 + 风格 + 抖动） | 0.62 | 0.003 |
| 只留抖动——纯噪声 | 0.36 | 0.002 |
| 只留决策——系统里零噪声 | 0.28 | 0.001 |
| 全部隐藏，但改为预测*执行后的*速度 | 0.22 | 0.003 |

最重要的是两行。第三行：去掉所有随机性——一个完全确定性的世界——动作头*仍然*差约 200 倍，因为未被观测的决策造成的伤害和噪声一模一样，而且和噪声不同，它清洗不掉：它就是信号本身。第四行：把目标挪到下游一步——预测执行后的滤波速度而不是原始指令——误差降到三分之一。难的不是"动作"这个类别，是离隐藏决策的上游距离：目标离决策越近，观测能解释的就越少。

**结论。** 过拟合不是你训练脚本的 bug。它是动作通道在告诉你：它有多大一部分，从观测出发本来就学不到。

这个诊断，领域自己的习惯已经在默默确认：现在没有人单独训练动作头了。Dyna-2 靠视频联合训练来稳定动作学习<sup><a href="#ref-13">[13]</a></sup>；Physical Intelligence 走得更远，直接*切断动作头的梯度*不让它碰语言主干，改用网络数据联合训练主干，因为原始动作梯度会可测量地损坏它<sup><a href="#ref-20">[20]</a></sup>。视觉和语言目标充当压舱石，压着一个太稀、太吵、独自撑不起航行的目标。

所以，每个动作样本教得更少、误导得更多。这是解释的前一半。后一半是：每个动作样本还*更贵*——故事从 GPU 走进了财务部。

## 机器人加入了互联网经济，却没有互联网

想想你上次做晚饭。你的手做了几千次微调——重新握刀，感到番茄皮破开的瞬间松力。这些被记录了多少？零。人类无时无刻不在产生运动数据，却从未记录过任何一条。

所以机器人数据没法"找到"，只能**制造**。标准做法是*遥操作*：一个人戴着 VR 手柄或握着主从臂，像提线木偶一样带机器人做任务，同时记录每个关节角和每帧画面。一小时熟练人工换一小时数据——还要扣掉失败镜次和布景重置。市面报价从每小时几十美元到两百美元左右<sup><a href="#ref-21">[21]</a></sup>。

由此产生的鸿沟很难夸大。Llama 3 用了约 15 万亿词的现成文本<sup><a href="#ref-22">[22]</a></sup>——有人估算 LLM 级语料相当于 10 万年的人类阅读量<sup><a href="#ref-23">[23]</a></sup>。所有主要开放机器人数据集加起来约 11,000 小时<sup><a href="#ref-12">[12]</a>,<a href="#ref-24">[24]</a></sup>。一万一千小时是*十五个月*的不间断经验。这是整个领域的全部共享家底，对面是一整个物种的文字。

## 那份"免费"数据，其实是买来的

显然的绕路：人整天都在动，那就录*人*。戴上头部摄像头和可穿戴传感器，完全跳过机器人，几百万小时看起来触手可及。2026 年的两个旗舰结果把它变成了现实。**Dyna-2** 在一百万小时第一视角人类视频上训练出一条真正的 scaling law——人类视频越多，机器人可测量地越好<sup><a href="#ref-13">[13]</a></sup>。**GEN-1** 的预训练语料，用公司自己的话说，"不含任何机器人数据"<sup><a href="#ref-25">[25]</a></sup>。

现在看小字。GEN-1 的语料来自"低成本可穿戴设备，采集人类进行数百万次活动的数据"<sup><a href="#ref-25">[25]</a></sup>——设备是买的，戴设备的人是招募的。Dyna-2 的一百万小时"由我们的数据合作方以及我们自己的内部运营采集"<sup><a href="#ref-13">[13]</a></sup>。

**委托采集。** 两个都是。按小时付费。*委托数据*——只因有人出资才存在的数据——是现成数据的反面，不管营销怎么说。看清这一点，你就会发现机器人领域根本不存在任何"找到的"路线。给语言和视觉供能的那种网络爬虫，在这里没有对应物。

于是真正的问题变成：买哪种数据，*每单位机器人技能*更便宜？这有数字。委托采集的人类小时比机器人小时便宜大约 2 到 39 倍<sup><a href="#ref-26">[26]</a></sup>。但人类数据带转移折价：在一百万小时人类视频上训练，模型零样本预测*机器人*动作比预测人类动作差约 3 倍（Dyna-2 自测 2.87 倍）<sup><a href="#ref-13">[13]</a></sup>。这就是**本体差距**：看一千小时筷子视频能学到很多关于食物和握法的知识，但没法把运动程序直接交给两指橡胶夹爪。身体之间不共享肌肉记忆。把折价和价差放在一起算，两条路线落在一个数量级以内<sup><a href="#ref-26">[26]</a></sup>——所以半个行业买遥操作、另半个买可穿戴，谁也没甩开谁。

## 每个技能仍然需要一个锚点

不管预训练吃什么，每个已发表系统里都有同一味配料：一小份*在真实机器人上、做真实任务*采的数据。叫它**锚点**。Dyna-2 那里是每任务不超过十小时<sup><a href="#ref-13">[13]</a></sup>；纵观全部记录，没有任何一个演示过的精度技能——毫米级插接、开锁、精细放置——是不带锚点的。

锚点有两个别扭的性质。**它不迁移**：十小时开锁数据买到开锁，买不到叠衣服——像一个每首新曲都得重练十小时的钢琴家，而且每架钢琴都得分别练。**规模替代不了它，但规模通过它起作用**：Dyna-2 的开锁任务，用完全相同的十小时锚点，视频语料十万小时时 0%，一百万小时时 90%<sup><a href="#ref-13">[13]</a></sup>。两半都要读到：视频预训练真切地解锁了技能，*同时*锚点全程必需。

经济账直接跟上。一个锚点花几百到两千美元的机器人时间；语料扩大十倍花几千万。如果巨型语料库靠"消灭锚点"回本，账立刻塌掉——把 GEN-1 已发表任务组合里的所有锚点小时省光，只省约七千美元<sup><a href="#ref-25">[25]</a>,<a href="#ref-26">[26]</a></sup>。那条按任务、按机器人计价的成本线，本该被 scaling 抹掉，现在还在每条流水线里。

那么本体差距至少在随规模*收窄*吧？诚实的回答：不知道。已发表曲线只有四个数据点；拟合它，问"语料多大时人类视频路线追平机器人原生数据"，统计上说得通的答案从一千万小时排到约 10¹⁷ 小时——后者大约等于全人类有史以来活过的总小时数<sup><a href="#ref-26">[26]</a></sup>。这不是预测，是带误差棒的耸肩。任何"还需 N 十亿小时达到人类水平"的标题，请照此对待。

## 测试是隐藏的税

语言模型进步快还有个安静的原因：*测量*它们免费。一次评估就是一个脚本——几千道题，几分钟，零美元，完美复现。机器人评估是物理事件：布景、跑策略、看它成功还是摔杯子、复位、重来，全程有人盯着。

要重复多少次？一百行 Python 就能验证<sup><a href="#ref-19">[19]</a></sup>：

**设置。** 两个仿真策略，真实成功率 80% 和 75%。各"评估" N 次，宣布得分高者胜，把比较重复 40,000 次，数错误判决。

**结果。** 每策略 N=10 次——论文的常态<sup><a href="#ref-29">[29]</a></sup>——判决错误或平局约占一半。N=20 时 42%。N=100 时仍有 22%。另外，把单个策略的成功率钉到 ±2 个百分点需要约 1,030 次试验，与已发表统计指南一致<sup><a href="#ref-27">[27]</a>,<a href="#ref-28">[28]</a></sup>。

**结论。** 在这个领域典型的样本量下，一个宣称的 5 个百分点改进接近抛硬币。认真做一次比较要一天机器人时间，LLM 基准只要几秒。scaling 靠快速迭代吃饭；机器人每圈都交过路费。

仿真部分有效：SIMPLER 基准复现真实策略*排名*的相关性达 r=0.924<sup><a href="#ref-30">[30]</a></sup>，自动评估单元已能无人值守跑真机测试<sup><a href="#ref-31">[31]</a></sup>。但 SIMPLER 自己写明适用范围："刚体操作任务，因为其物理最容易仿真"<sup><a href="#ref-30">[30]</a></sup>。刚体。这把一切引向同一个地址。

## 墙有一个地址：接触

刚体任务——挪积木、拿瓶子——是机器人数据最充足、仿真最可信、评估最便宜的地方。**富接触**任务——紧配合插接、布料、任何软的滑的东西——是三者同时失灵的地方。接触的三个性质导致了它。

**摄像头看不见力。** 看一段手握纸杯的视频：这只手握得稳稳的，还是差一牛顿把杯子捏瘪？像素完全相同。握力、摩擦、打滑前兆——决定精细操作成败的变量，对提供了 99% 训练数据的传感器是隐形的。携带这些信息的通道——触觉——从未被大规模数字化：2026 年一篇触觉论文把 100 小时数据集称为"大规模"，在那个领域确实算<sup><a href="#ref-32">[32]</a></sup>。一百小时，旁边是一百万小时的视频。（触觉并非严格必需——力反馈 2024 年上线之前，外科医生用达芬奇零触觉完成了几百万台手术<sup><a href="#ref-33">[33]</a></sup>——但凡精度撞上不确定性的地方，它都很值钱。）

**接触物理放大微小差异。** 也能在家验证<sup><a href="#ref-19">[19]</a></sup>：

**设置。** 仿真推重物：推力渐增，物体先粘住、突破静摩擦后突然滑出——推家具时那种先卡后窜。跑 400 次，摩擦系数每次变 ±1%（桌面稍潮就免费送你这种变化），对照组是同样 ±1% 的平滑阻尼系统。

**结果。** 平滑系统的结果波动约 1%——噪声进噪声出。粘滑系统在阈值附近，散布宽 **83 倍**；有的几乎不动，有的直接冲过头。远离阈值，效应几乎消失。

**结论。** 在接触转变点附近，看起来完全相同的情形产生截然不同的结果——真机测量同样如此：对同一物体重复完全相同的推动，得到一整个结果分布<sup><a href="#ref-34">[34]</a></sup>。这就是为什么接触任务要很多次演示（每次落点不同）、仿真器恰好在这里失真（1% 建模误差会爆炸）、评估要很多次试验（单次毫无意义）。一个现象，三张账单。注意：这就是过拟合那节的隐藏决策问题换了身衣服——接触，正是世界亲手往动作通道里塞硬币的地方。

叠起来看：触觉数据最稀缺的地方是接触；仿真最弱的地方是接触；评估最贵的地方是接触；动作通道固有的噪声最大的地方，还是接触。几堵墙是同一堵，立在机器人手指碰到世界的位置上。

## 所以，为什么偏偏是动作？

因为动作既是更差的学生，又交着更贵的学费。

**统计上**，动作预测是个上游问题：它必须在决策发生的那一刻猜出决策，赶在后果出现在任何观测里之前。观测决定不了的部分一律表现为噪声，招来捷径，被死记硬背。这就是为什么在同一份数据上，动作头过拟合，而站在每个决策下游的视觉头不过拟合。

**经济上**，信号不免费给你的，就得花钱买：委托采集的人类视频，带约 3 倍本体折价；或全价的机器人小时——外加一个任何规模都还没移除的按任务锚点，外加凡涉接触就得上真机的评估，而有价值的任务恰恰全在接触里。

注意这里面*没有*什么：没有不可能，没有悖论，没有缺失的天才。一个信号质量问题，加一张价目表。这反而是乐观的读法——悖论不向工程低头，但噪声可以建模，捷径可以正则化掉，价格正沿着已发表的曲线往下走。

## 值得盯着的信号

以下信号出现，说明这幅图景开始失效：

1. **一个不靠联合训练压舱、能干净 scale 的纯动作模型**——那意味着统计的那一半在目标函数层面被解决了，而不是打补丁。
2. **无锚点的精度演示**：零任务专属数据做到毫米级。目前没有任何已发表系统做到；哪天做到了，按任务计价的成本线开始死亡。
3. **人类视频语料到达约一千万小时**——本体差距的几种竞争理论在那附近可测量地分开<sup><a href="#ref-26">[26]</a></sup>。按当前速度两三年内到达<sup><a href="#ref-25">[25]</a>,<a href="#ref-35">[35]</a></sup>。
4. **能在布料或可变形物体上正确排序策略的仿真器**——正是 SIMPLER 作者今天划到范围之外的结果<sup><a href="#ref-30">[30]</a></sup>。
5. **可穿戴采集降到每可用小时约 0.1 美元以下**——比现有披露低两个数量级，人类与机器人数据的成本均势翻转。

最后一个随身注脚：本文承重的 2026 年数字——Dyna-2 的、GEN-1 的——都是生产它们的实验室的自我报告，而且没人能独立复现一次百万小时训练。我核实了来源说了什么；能否复现是另一个问题。这份不确定性恰好又是评估瓶颈本身——也是本文我预计过时得最快的部分。

<details>
<summary><strong>参考文献</strong>（点击展开）</summary>
<ol>
<li id="ref-1">Wang et al., "World Action Models" 综述, 2026. <a href="https://arxiv.org/abs/2605.12090">arXiv:2605.12090</a>。</li>
<li id="ref-2">Liang et al., "Code as Policies: Language Model Programs for Embodied Control," 2022. <a href="https://arxiv.org/abs/2209.07753">arXiv:2209.07753</a>。</li>
<li id="ref-3">Chi et al., "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion," RSS 2023. <a href="https://arxiv.org/abs/2303.04137">arXiv:2303.04137</a>。</li>
<li id="ref-4">Hans Moravec, <em>Mind Children</em> (1988)；概述见 <a href="https://en.wikipedia.org/wiki/Moravec%27s_paradox">Moravec's paradox — Wikipedia</a>。</li>
<li id="ref-5">Kaplan et al., "Scaling Laws for Neural Language Models," 2020. <a href="https://arxiv.org/abs/2001.08361">arXiv:2001.08361</a>。</li>
<li id="ref-6">Hoffmann et al., "Training Compute-Optimal Large Language Models" (Chinchilla), NeurIPS 2022. <a href="https://arxiv.org/abs/2203.15556">arXiv:2203.15556</a>。</li>
<li id="ref-7">Brown et al., "Language Models are Few-Shot Learners" (GPT-3), NeurIPS 2020. <a href="https://arxiv.org/abs/2005.14165">arXiv:2005.14165</a>。</li>
<li id="ref-8">Krizhevsky, Sutskever &amp; Hinton, "ImageNet Classification with Deep Convolutional Neural Networks" (AlexNet), NeurIPS 2012. <a href="https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html">论文</a>。</li>
<li id="ref-9">Radford et al., "Learning Transferable Visual Models From Natural Language Supervision" (CLIP), ICML 2021. <a href="https://arxiv.org/abs/2103.00020">arXiv:2103.00020</a>。</li>
<li id="ref-10">Schuhmann et al., "LAION-5B," NeurIPS 2022（从 Common Crawl 筛出的 58.5 亿图文对）. <a href="https://arxiv.org/abs/2210.08402">arXiv:2210.08402</a>。</li>
<li id="ref-11">Common Crawl——非营利网络存档，免费使用. <a href="https://commoncrawl.org/">commoncrawl.org</a>。</li>
<li id="ref-12">Open X-Embodiment Collaboration, "Open X-Embodiment: Robotic Learning Datasets and RT-X Models," 2023（约 100 万条轨迹、22 种机器人、34 个实验室）. <a href="https://arxiv.org/abs/2310.08864">arXiv:2310.08864</a>。</li>
<li id="ref-13">Dyna Robotics, "Dyna-2: A 1-Million-Hour Scaling Law for Robot Manipulation," 2026 年 8 月. <a href="https://www.dyna.co/research/dyna-2">dyna.co/research/dyna-2</a>。"纯动作模型停滞并过拟合"的观察、语料来源引语、2.87 倍零样本人类→机器人差距、每任务 ≤10 小时锚点、开锁 0%→90% 阶梯均出自该报告。</li>
<li id="ref-14">Zhang et al., "Understanding Deep Learning Requires Rethinking Generalization," ICLR 2017. <a href="https://arxiv.org/abs/1611.03530">arXiv:1611.03530</a>。</li>
<li id="ref-15">Arpit et al., "A Closer Look at Memorization in Deep Networks," ICML 2017（网络先学模式，后记噪声）. <a href="https://arxiv.org/abs/1706.05394">arXiv:1706.05394</a>。</li>
<li id="ref-16">Wen et al., "Fighting Copycat Agents in Behavioral Cloning from Observation Histories," NeurIPS 2020. <a href="https://arxiv.org/abs/2010.14876">arXiv:2010.14876</a>。</li>
<li id="ref-17">de Haan, Jayaraman &amp; Levine, "Causal Confusion in Imitation Learning," NeurIPS 2019. <a href="https://arxiv.org/abs/1905.11979">arXiv:1905.11979</a>。</li>
<li id="ref-18">LIBERO-PRO, 2025（LIBERO 上 >90% 的模型在物体/布局扰动下塌到约 0%；诊断为对动作序列的死记硬背）. <a href="https://arxiv.org/abs/2510.03827">arXiv:2510.03827</a>。</li>
<li id="ref-19">文中三个实验（差异过拟合；评估统计；粘滑弥散）为我自己的纯 Python 仿真，各约百行，设置如正文所述。</li>
<li id="ref-20">Driess et al., "Knowledge Insulating Vision-Language-Action Models," Physical Intelligence, 2025（动作梯度损坏 VLM 主干；对策：梯度隔离 + 网络数据联合训练）. <a href="https://arxiv.org/abs/2505.23705">arXiv:2505.23705</a>。</li>
<li id="ref-21">Silicon Valley Robotics Center，机器人训练数据采集成本指南（遥操作全成本报价约 $15–200/小时）. <a href="https://www.roboticscenter.ai/learn/collect-robot-training-data">roboticscenter.ai</a>。</li>
<li id="ref-22">Grattafiori et al., "The Llama 3 Herd of Models," 2024（约 15 万亿训练 token）. <a href="https://arxiv.org/abs/2407.21783">arXiv:2407.21783</a>。</li>
<li id="ref-23">Ken Goldberg, "Good old-fashioned engineering can close the 100,000-year data gap in robotics," <em>Science Robotics</em>, 2025. <a href="https://www.science.org/doi/10.1126/scirobotics.aea7390">doi:10.1126/scirobotics.aea7390</a>。</li>
<li id="ref-24">Qwen-RobotManip 技术报告，2026（九大开放机器人数据集合计约 11,000 小时）. <a href="https://arxiv.org/abs/2606.17846">arXiv:2606.17846</a>。</li>
<li id="ref-25">Generalist AI, "GEN-1," 2026（"The pretraining dataset contains no robot data"；可穿戴设备语料）. <a href="https://generalistai.com/blog/gen-1">generalistai.com/blog/gen-1</a>。</li>
<li id="ref-26">2–39 倍价格比、按成本折算的均势、约七千美元锚点替代上限、差距闭合外推区间（约 10⁷–10¹⁷ 小时）、10⁷ 小时判别点，均为我基于 [13][21][25][35] 披露数据的自行计算（带下限项的曲线重拟合、bootstrap 置信区间、盈亏平衡核算）。</li>
<li id="ref-27">NVIDIA 技术博客，"How to Evaluate General-Purpose Robot Policies for Real-World Deployment"（Clopper-Pearson 试验数换算）. <a href="https://developer.nvidia.com/blog/how-to-evaluate-general-purpose-robot-policies-for-real-world-deployment/">developer.nvidia.com</a>。</li>
<li id="ref-28">Toyota Research Institute, "A Careful Examination of Large Behavior Models"（大规模盲测随机 A/B 评估）. <a href="https://toyotaresearchinstitute.github.io/lbm1/">toyotaresearchinstitute.github.io/lbm1</a>。</li>
<li id="ref-29">PhAIL：真机 VLA 评估实践综述（每条件典型 N=10–20，通常无置信区间），2026. <a href="https://arxiv.org/abs/2605.29710">arXiv:2605.29710</a>。</li>
<li id="ref-30">Li et al., "Evaluating Real-World Robot Manipulation Policies in Simulation" (SIMPLER), CoRL 2024. <a href="https://arxiv.org/abs/2405.05941">arXiv:2405.05941</a> · <a href="https://simpler-env.github.io/">simpler-env.github.io</a>。</li>
<li id="ref-31">Zhou et al., "AutoEval: Autonomous Evaluation of Generalist Robot Manipulation Policies in the Real World," 2025. <a href="https://arxiv.org/abs/2503.24278">arXiv:2503.24278</a>。</li>
<li id="ref-32">"T-Rex" 触觉操作，2026（约 100 小时语料在触觉通道内即称"大规模"）. <a href="https://arxiv.org/abs/2606.17055">arXiv:2606.17055</a>。</li>
<li id="ref-33">Intuitive Surgical，"Intuitive Announces FDA Clearance of da Vinci 5"，2024 年 3 月（达芬奇系列首次配备力反馈）. <a href="https://isrg.intuitive.com/news-releases/news-release-details/intuitive-announces-fda-clearance-da-vinci-5">新闻稿</a>。</li>
<li id="ref-34">Bauza &amp; Rodriguez, "A Probabilistic Data-Driven Model for Planar Pushing," 2017（真机上重复相同推动得到结果分布）. <a href="https://arxiv.org/abs/1705.10664">arXiv:1705.10664</a>。</li>
<li id="ref-35">Generalist AI, "GEN-0," 2025 年 11 月（27 万+小时操作数据，每周约 +1 万小时）. <a href="https://generalistai.com/blog/nov-04-2025-GEN-0">generalistai.com/blog/nov-04-2025-GEN-0</a>。</li>
</ol>
</details>
