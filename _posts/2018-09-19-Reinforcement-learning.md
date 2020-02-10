---
layout: post
title:  "Reinforcement learning"
date:   2018-09-09 15:03:25
categories: original
---

# Exploration in reinforcement learning

## Exploration

### $ \epsilon $-greedy 

$\epsilon$-greedy perhaps the implimentational easiest way to conduct exploration in reinforcement learning (RL). However it achieves amazing performance in most RL tasks. 

greedy means take what the policy or Q function tells you to do

$\epsilon$ means that a random action is taken with a probability of $\epsilon$ .


$$
a=\left\{
\begin{array}{cl}
\pi(s), & & in & &{p(1 - \epsilon)} \\
random(A), & &in&&{p(\epsilon)}
\end{array}
\right.
$$




### Boltzmann (Gibbs, Softmax) action-selection

In Boltzmann exploration, we would ideally like to exploit all the information present in the estimated Q-values produced by our network. *Boltzmann exploration* does just this. Instead of always taking the optimal action, or taking a random action, this approach involves choosing an action with weighted probabilities. To accomplish this we use a softmax over the networks estimates of value for each action. In this case the action which the agent estimates to be optimal is most likely (but is not guaranteed) to be chosen. The biggest advantage over e-greedy is that information about likely value of the other actions can also be taken into consideration. 

**Adjusting during training**: In practice we utilize an additional temperature parameter (τ) which is annealed over time. This parameter controls the spread of the softmax distribution, such that all actions are considered equally at the start of training, and actions are sparsely distributed by the end of training.



### Discovery of Subgoals

Amy Mcgovern and Andrew G. Barto. Automatic discovery of subgoals in reinforcement learning using diverse density. In Proc. of ICML, 2001.

Sandeep Goel and Manfred Huber. Subgoal discovery for hierarchical reinforcement learning using learned policies. In Ingrid Russell and Susan M. Haller, editors, FLAIRS Conference, pages 346–350. AAAI Press, 2003.

### Count based

Haoran Tang, Rein Houthooft, Davis Foote, Adam Stooke, Xi Chen, Yan Duan, John Schulman, Filip De Turck, and Pieter Abbeel. #exploration: A study of count-based exploration for deep reinforcement learning. CoRR, abs/1611.04717, 2016.

Jarryd Martin, Suraj Narayanan Sasikumar, Tom Everitt, and Marcus Hutter. Count-based exploration in feature space for reinforcement learning. CoRR, abs/1706.08090, 2017.

### Use approximations of a state-transition graph to exploit structural patterns

Sridhar Mahadevan. Proto-value functions: Developmental reinforcement learning. In Proceedings of the 22Nd International Conference on Machine Learning, ICML ’05, pages 553–560, New York, NY, USA, 2005. ACM.

Marlos C. Machado, Marc G. Bellemare, and Michael H. Bowling. A laplacian framework for option discovery in reinforcement learning. CoRR, abs/1703.00956, 2017.

### Reward "bonus"

takes a Bayesian approach by maintaining a model of the dynamics of the environment, obtaining a posterior of the model after taking an action, and using the KL divergence between these two models as a bonus. The intuition behind this approach is that encouraging actions that make large updates to the model allows the agent to better explore areas where the current model is inaccurate.

Rein Houthooft, Xi Chen, Yan Duan, John Schulman, Filip De Turck, and Pieter Abbeel. Curiosity-driven exploration in deep reinforcement learning via bayesian neural networks. CoRR, abs/1605.09674, 2016.



Deepak Pathak, Pulkit Agrawal, Alexei A. Efros, and Trevor Darrell. Curiosity-driven exploration by self-supervised prediction. CoRR, abs/1705.05363, 2017.

Fernando Fernandez and Manuela Veloso. Probabilistic policy reuse in a reinforcement learning agent. In Proceedings of the Fifth International Joint Conference on Autonomous Agents and Multiagent Systems, AAMAS ’06, pages 720–727, New York, NY, USA, 2006. ACM.



### Evolution strategy




$$
\begin{aligned}
a_i^j = \sum_{i=1}^{15}f_6 
\end{aligned}
$$

* if we want to start our work with reinforcement learning we should know that if one want to go one should know where to go

* How to make the Eq in the middle of the page