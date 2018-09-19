---
layout: post
comments: false
title: "Attention? Attention!"
date: 2018-06-24 11:07:00
tags: review
image: "transformer.png"
---

> Attention has been a fairly popular concept and a useful tool in the deep learning community in recent years. In this post, we are gonna look into how attention was invented, and various attention mechanisms and models, such as transformer and SNAIL.

<!--more-->

{: class="table-of-content"}
* TOC
{:toc}

Attention is, to some extent, motivated by how we pay visual attention to different regions of an image or correlate words in one sentence. Take the picture of a Shiba Inu in Fig. 1 as an example. 

![shiba]({{ '/assets/images/shiba-example-attention.png' | relative_url }})
{: style="width: 100%;" class="center"}
*Fig. 1. A Shiba Inu in a men’s outfit. The credit of the original photo goes to Instagram [@mensweardog](https://www.instagram.com/mensweardog/?hl=en).*

Human visual attention allows us to focus on a certain region with "high resolution" (i.e. look at the pointy ear in the yellow box) while perceiving the surrounding image in "low resolution" (i.e. now how about the snowy background and the outfit?), and then adjust the focal point or do the inference accordingly. Given a small patch of an image, pixels in the rest provide clues what should be displayed there. We expect to see a pointy ear in the yellow box because we have seen a dog’s nose, another pointy ear on the right, and Shiba's mystery eyes (stuff in the red boxes). However, the sweater and blanket at the bottom would not be as helpful as those doggy features.

Similarly, we can explain the relationship between words in one sentence or close context. When we see "eating", we expect to encounter a food word very soon. The color term describes the food, but probably not so much with "eating" directly.


![sentence]({{ '/assets/images/sentence-example-attention.png' | relative_url }})
{: style="width: 65%;" class="center"}
*Fig. 2. One word "attends" to other words in the same sentence differently.*

In a nutshell, attention in the deep learning can be broadly interpreted as a vector of importance weights: in order to predict or infer one element, such as a pixel in an image or a word in a sentence, we estimate using the attention vector how strongly it is correlated with (or "*attends to*" as you may have read in many papers) other elements and take the sum of their values weighted by the attention vector as the approximation of the target.



## What’s Wrong with Seq2Seq Model?

The **seq2seq** model was born in the field of language modeling ([Sutskever, et al. 2014](https://papers.nips.cc/paper/5346-sequence-to-sequence-learning-with-neural-networks.pdf)). Broadly speaking, it aims to transform an input sequence (source) to a new one (target) and both sequences can be of arbitrary lengths. Examples of transformation tasks include machine translation between multiple languages in either text or audio, question-answer dialog generation, or even parsing sentences into grammar trees. 

The seq2seq model normally has an encoder-decoder architecture, composed of:
- An **encoder** processes the input sequence and compresses the information into a context vector (also known as sentence embedding or "thought" vector) of a *fixed length*. This representation is expected to be a good summary of the meaning of the *whole* source sequence. 
- A **decoder** is initialized with the context vector to emit the transformed output. The early work only used the last state of the encoder network as the decoder initial state.


Both the encoder and decoder are recurrent neural networks, i.e. using [LSTM or GRU](http://colah.github.io/posts/2015-08-Understanding-LSTMs/) units.

![encoder-decoder model with additive attention layer]({{ '/assets/images/encoder-decoder-example.png' | relative_url }})
{: style="width: 100%;" class="center"}
*Fig. 3. The encoder-decoder model, translating the sentence "she is eating a green apple" to Chinese. The visualization of both encoder and decoder is unrolled in time.*

A critical and apparent disadvantage of this fixed-length context vector design is incapability of remembering long sentences. Often it has forgotten the first part once it completes processing the whole input. The attention mechanism was born ([Bahdanau et al., 2015](https://arxiv.org/pdf/1409.0473.pdf)) to resolve this problem.



## Born for Translation

The attention mechanism was born to help memorize long source sentences in neural machine translation ([NMT](https://arxiv.org/pdf/1409.0473.pdf)). Rather than building a single context vector out of the encoder's last hidden state, the secret sauce invented by attention is to create shortcuts between the context vector and the entire source input. The weights of these shortcut connections are customizable for each output element.

While the context vector has access to the entire input sequence, we don’t need to worry about forgetting. The alignment between the source and target is learned and controlled by the context vector. Essentially the context vector consumes three pieces of information:
- encoder hidden states;
- decoder hidden states;
- alignment between source and target.


![encoder-decoder model with additive attention layer]({{ '/assets/images/encoder-decoder-attention.png' | relative_url }})
{: style="width: 100%;" class="center"}
*Fig. 4. The encoder-decoder model with additive attention mechanism in [Bahdanau et al., 2015](https://arxiv.org/pdf/1409.0473.pdf).*


### Definition

Now let’s define the attention mechanism introduced in NMT in a scientific way. Say, we have a source sequence $$\mathbf{x}$$ of length $$n$$ and try to output a target sequence $$\mathbf{y}$$ of length $$m$$:

$$
\begin{aligned}
\mathbf{x} &= [x_1, x_2, \dots, x_n] \\
\mathbf{y} &= [y_1, y_2, \dots, y_m]
\end{aligned}
$$

(Variables in bold indicate that they are vectors; same for everything else in this post.)


The encoder is a [bidirectional RNN](https://www.coursera.org/lecture/nlp-sequence-models/bidirectional-rnn-fyXnn) (or other recurrent network setting of your choice) with a forward hidden state $$\overrightarrow{\boldsymbol{h}}_i$$ and a backward one $$\overleftarrow{\boldsymbol{h}}_i$$. A simple concatenation of two represents the encoder state. The motivation is to include both the preceding and following words in the annotation of one word. 

$$
\boldsymbol{h}_i = [\overrightarrow{\boldsymbol{h}}_i^\top; \overleftarrow{\boldsymbol{h}}_i^\top]^\top, i=1,\dots,n
$$


The decoder network has hidden state $$\boldsymbol{s}_t=f(\boldsymbol{s}_{t-1}, y_{t-1}, \mathbf{c}_t)$$ for the output word at position t, $$t=1,\dots,m$$, where the context vector $$\mathbf{c}_t$$ is a sum of hidden states of the input sequence, weighted by alignment scores:

$$
\begin{aligned}
\mathbf{c}_t &= \sum_{i=1}^n \alpha_{t,i} \boldsymbol{h}_i & \small{\text{; Context vector for output }y_t}\\
\alpha_{t,i} &= \text{align}(y_t, x_i) & \small{\text{; How well two words }y_t\text{ and }x_i\text{ are aligned.}}\\
&= \frac{\text{score}(\boldsymbol{s}_t, \boldsymbol{h}_i)}{\sum_{i'=1}^n \text{score}(\boldsymbol{s}_t, \boldsymbol{h}_{i'}))} & \small{\text{; Softmax of some predefined alignment score.}}.
\end{aligned}
$$

The alignment model assigns a score $$\alpha_{t,i}$$ to the pair of input at position i and output at position t, $$(y_t, x_i)$$, based on how well they match. The set of $$\{\alpha_{t, i}\}$$ are weights defining how much of each source hidden state should be considered for each output. In Bahdanau's paper, the alignment score $$\alpha$$ is parametrized by a **feed-forward network** with a single hidden layer and this network is jointly trained with other parts of the model. The score function is therefore in the following form, given that tanh is used as the non-linear activation function: 


$$
\text{score}(\boldsymbol{s}_t, \boldsymbol{h}_i) = \mathbf{v}_a^\top \tanh(\mathbf{W}_a[\boldsymbol{s}_t; \boldsymbol{h}_i])
$$

where both $$\mathbf{v}_a$$ and $$\mathbf{W}_a$$ are weight matrices to be learned in the alignment model.

The matrix of alignment scores is a nice byproduct to explicitly show the correlation between source and target words.

![alignment matrix]({{ '/assets/images/bahdanau-fig3.png' | relative_url }})
{: style="width: 65%;" class="center"}
*Fig. 5. Alignment matrix of "L'accord sur l'Espace économique européen a été signé en août 1992" (French) and its English translation "The agreement on the European Economic Area was signed in August 1992". (Image source: Fig 3 in [Bahdanau et al., 2015](https://arxiv.org/pdf/1409.0473.pdf))*

Check out this nice [tutorial](https://www.tensorflow.org/versions/master/tutorials/seq2seq) by Tensorflow team for more implementation instructions.



## A Family of Attention Mechanisms

With the help of the attention, the dependencies between source and target sequences are not restricted by the in-between distance anymore! Given the big improvement by attention in machine translation, it soon got extended into the computer vision field ([Xu et al. 2015](http://proceedings.mlr.press/v37/xuc15.pdf)) and people started exploring various other forms of attention mechanisms ([Luong, et al., 2015](https://arxiv.org/pdf/1508.04025.pdf); [Britz et al., 2017](https://arxiv.org/abs/1703.03906); [Vaswani, et al., 2017](http://papers.nips.cc/paper/7181-attention-is-all-you-need.pdf)).

### Summary

Below is a summary table of several popular attention mechanisms (or broader categories of attention mechanisms).

{: class="info"}
| Name | Alignment score function | Citation |
| -------------------------- | ------------- | ------------- |
| Additive(*) | $$\text{score}(\boldsymbol{s}_t, \boldsymbol{h}_i) = \mathbf{v}_a^\top \tanh(\mathbf{W}_a[\boldsymbol{s}_t; \boldsymbol{h}_i])$$ | [Bahdanau2015](https://arxiv.org/pdf/1409.0473.pdf) |
| Location-Base | $$\alpha_{t,i} = \text{softmax}(\mathbf{W}_a \boldsymbol{s}_t)$$<br/>Note: This simplifies the softmax alignment max to only depend on the target position. | [Luong2015](https://arxiv.org/pdf/1508.04025.pdf) |
| General | $$\text{score}(\boldsymbol{s}_t, \boldsymbol{h}_i) = \boldsymbol{s}_t^\top\mathbf{W}_a\boldsymbol{h}_i$$<br/>where $$\mathbf{W}_a$$ is a trainable weight matrix in the attention layer. | [Luong2015](https://arxiv.org/pdf/1508.04025.pdf) |
| Dot-Product | $$\text{score}(\boldsymbol{s}_t, \boldsymbol{h}_i) = \boldsymbol{s}_t^\top\boldsymbol{h}_i$$ | [Luong2015](https://arxiv.org/pdf/1508.4025.pdf) |
| Scaled Dot-Product(^) | $$\text{score}(\boldsymbol{s}_t, \boldsymbol{h}_i) = \frac{\boldsymbol{s}_t^\top\boldsymbol{h}_i}{\sqrt{n}}$$<br/>Note: very similar to the dot-product attention except for a scaling factor; where n is the dimension of the source hidden state. | [Vaswani2017](http://papers.nips.cc/paper/7181-attention-is-all-you-need.pdf) |
| Self-Attention(&) | Relating different positions of the same input sequence. Theoretically the self-attention can adopt any score functions above, but just replace the target sequence with the same input sequence. | [Cheng2016](https://arxiv.org/pdf/1601.06733.pdf) |
| Global/Soft | Attending to the entire input state space. | [Xu2015](http://proceedings.mlr.press/v37/xuc15.pdf) |
| Local/Hard | Attending to the part of input state space; i.e. a patch of the input image. | [Xu2015](http://proceedings.mlr.press/v37/xuc15.pdf); [Luong2015](https://arxiv.org/pdf/1508.04025.pdf) |

(*) Referred to as "concat" in Luong, et al., 2015 and as "additive attention" in Vaswani, et al., 2017.<br/>
(^) It adds a scaling factor $$1/\sqrt{n}$$, motivated by the concern when the input is large, the softmax function may have an extremely small gradient, hard for efficient learning.<br/>
(&) Also, referred to as "intra-attention" in Cheng et al., 2016 and some other papers.



### Self-Attention

**Self-attention**, also known as **intra-attention**, is an attention mechanism relating different positions of a single sequence in order to compute a representation of the same sequence. It has been shown to be very useful in machine reading, abstractive summarization, or image description generation.

The [long short-term memory network](https://arxiv.org/pdf/1601.06733.pdf) paper used self-attention to do machine reading. In the example below, the self-attention mechanism enables us to learn the correlation between the current words and the previous part of the sentence. 

![intra-attention]({{ '/assets/images/cheng2016-fig1.png' | relative_url }})
{: style="width: 70%;" class="center"}
*Fig. 6. The current word is in red and the size of the blue shade indicates the activation level. (Image source: [Cheng et al., 2016](https://arxiv.org/pdf/1601.06733.pdf))*

In the [show, attend and tell](http://proceedings.mlr.press/v37/xuc15.pdf) paper, self-attention is applied to the image to generate proper descriptions. The image is first encoded by a convolutional neural network and a recurrent network with self-attention consumes the convolution feature maps to generate the descriptive words one by one. The visualization of the attention weights clearly demonstrates which regions of the image the model pays attention to so as to output a certain word.

![show-attend-and-tell]({{ '/assets/images/xu2015-fig6b.png' | relative_url }})
{: style="width: 100%;" class="center"}
*Fig. 7. "A woman is throwing a frisbee in a park." (Image source: Fig. 6(b) in [Xu et al. 2015](http://proceedings.mlr.press/v37/xuc15.pdf))*


### Soft vs Hard Attention

The "soft" vs "hard" attention is another way to categorize how attention is defined. The original idea was proposed in 
the [show, attend and tell](http://proceedings.mlr.press/v37/xuc15.pdf) paper. Based on whether the attention has access to the entire image or only a patch:

- **Soft** Attention: the alignment weights are learned and placed "softly" over all patches in the source image; essentially the same idea as in [Bahdanau et al., 2015](https://arxiv.org/pdf/1409.0473.pdf).
    - Pro: the model is smooth and differentiable.
    - Con: expensive when the source input is large.
- **Hard** Attention: only selects one patch of the image to attend to at a time. 
    - Pro: less calculation at the inference time.
    - Con: the model is non-differentiable and requires more complicated techniques such as variance reduction or reinforcement learning to train. ([Luong, et al., 2015](https://arxiv.org/pdf/1508.04025.pdf))


### Global vs Local Attention

[Luong, et al., 2015](https://arxiv.org/pdf/1508.04025.pdf) proposed the "global" and "local" attention. The global attention is similar to the soft attention, while the local one is an interesting blend between [hard and soft](#soft-vs-hard-attention), an improvement over the hard attention to make it differentiable: the model first predicts a single aligned position for the current target word and a window centered around the source position is then used to compute a context vector.

![global-local-attention]({{ '/assets/images/luong2015-fig2-3.png' | relative_url }})
{: style="width: 100%;" class="center"}
*Fig. 8. Global vs local attention (Image source: Fig 2 & 3 in [Luong, et al., 2015](https://arxiv.org/pdf/1508.04025.pdf))*


## Transformer

["Attention is All you Need"](http://papers.nips.cc/paper/7181-attention-is-all-you-need.pdf)
 (Vaswani, et al., 2017), without a doubt, is one of the most impactful and interesting paper in 2017. It presented a lot of improvements to the soft attention and make it possible to do seq2seq modeling *without* recurrent network units. The proposed "**transformer**" model is entirely built on the self-attention mechanisms without using sequence-aligned recurrent architecture.

The secret receipt is carried in its model architecture.

### Key, Value and Query

The major component in the transformer is the unit of *multi-head self-attention mechanism*. The transformer views the encoded representation of the input as a set of **key**-**value** pairs, $$(\mathbf{K}, \mathbf{V})$$, both of dimension $$n$$ (input sequence length); in the context of NMT, both the keys and values are the encoder hidden states. In the decoder, the previous output is compressed into a **query** ($$\mathbf{Q}$$ of dimension $$m$$) and the next output is produced by mapping this query and the set of keys and values. 

The transformer adopts the [scaled dot-product attention](#summary): the output is a weighted sum of the values, where the weight assigned to each value is determined by the dot-product of the query with all the keys:

$$
\text{Attention}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{softmax}(\frac{\mathbf{Q}\mathbf{K}^\top}{\sqrt{n}})\mathbf{V}
$$


### Multi-Head Self-Attention

![multi-head scaled dot-product attention]({{ '/assets/images/multi-head-attention.png' | relative_url }})
{: style="width: 40%;" class="center"}
*Fig. 9. Multi-head scaled dot-product attention mechanism. (Image source: Fig 2 in [Vaswani, et al., 2017](http://papers.nips.cc/paper/7181-attention-is-all-you-need.pdf))*


Rather than only computing the attention once, the multi-head mechanism runs through the scaled dot-product attention multiple times in parallel. The independent attention outputs are simply concatenated and linearly transformed into the expected dimensions. I assume the motivation is because embedding always helps? ;) According to the paper, *"multi-head attention allows the model to jointly attend to information from different representation **subspaces** at different positions. With a single attention head, averaging inhibits this."*

$$
\begin{aligned}
\text{MultiHead}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) &= [\text{head}_1; \dots; \text{head}_h]\mathbf{W}^O \\
\text{where head}_i &= \text{Attention}(\mathbf{Q}\mathbf{W}^Q_i, \mathbf{K}\mathbf{W}^K_i, \mathbf{V}\mathbf{W}^V_i)
\end{aligned}
$$

where $$\mathbf{W}^Q_i$$, $$\mathbf{W}^K_i$$, $$\mathbf{W}^V_i$$, and $$\mathbf{W}^O$$ are parameter matrices to be learned.


### Encoder

![Transformer encoder]({{ '/assets/images/transformer-encoder.png' | relative_url }})
{: style="width: 60%;" class="center"}
*Fig. 10. The transformer’s encoder. (Image source: [Vaswani, et al., 2017](http://papers.nips.cc/paper/7181-attention-is-all-you-need.pdf))*

The encoder generates an attention-based representation with capability to locate a specific piece of information from a potentially infinitely-large context.
- A stack of N=6 identical layers.
- Each layer has a **multi-head self-attention layer** and a simple position-wise **fully connected feed-forward network**.
- Each sub-layer adopts a [**residual**](https://arxiv.org/pdf/1512.03385.pdf) connection and a layer **normalization**.
All the sub-layers output data of the same dimension $$d_\text{model} = 512$$.


### Decoder

![Transformer decoder]({{ '/assets/images/transformer-decoder.png' | relative_url }})
{: style="width: 58%;" class="center"}
*Fig. 11. The transformer’s decoder. (Image source: [Vaswani, et al., 2017](http://papers.nips.cc/paper/7181-attention-is-all-you-need.pdf))*

The decoder is able to retrieval from the encoded representation.
- A stack of N = 6 identical layers
- Each layer has two sub-layers of multi-head attention mechanisms and one sub-layer of fully-connected feed-forward network.
- Similar to the encoder, each sub-layer adopts a residual connection and a layer normalization.
- The first multi-head attention sub-layer is **modified** to prevent positions from attending to subsequent positions, as we don’t want to look into the future of the target sequence when predicting the current position.


### Full Architecture

Finally here is the complete view of the transformer's architecture: 
- Both the source and target sequences first go through embedding layers to produce data of the same dimension $$d_\text{model} =512$$. 
- To preserve the position information, a sinusoid-wave-based positional encoding is applied and summed with the embedding output. 
- A softmax and linear layer are added to the final decoder output. 

![Transformer model]({{ '/assets/images/transformer.png' | relative_url }})
{: style="width: 100%;" class="center"}
*Fig. 12. The full model architecture of the transformer. (Image source: Fig 1 & 2 in [Vaswani, et al., 2017](http://papers.nips.cc/paper/7181-attention-is-all-you-need.pdf).)*



## SNAIL

The transformer has no recurrent or convolutional structure, even with the positional encoding added to the embedding vector, the sequential order is only weakly incorporated. For problems sensitive to the positional dependency like [reinforcement learning]({{ site.baseurl }}{% post_url 2018-02-19-a-long-peek-into-reinforcement-learning %}), this can be a big problem.

The **Simple Neural Attention [Meta-Learner](http://bair.berkeley.edu/blog/2017/07/18/learning-to-learn/)** (**SNAIL**) ([Mishra et al., 2017](http://metalearning.ml/papers/metalearn17_mishra.pdf)) was developed partially to resolve the problem with [positioning](#full-architecture) in the transformer model by combining the self-attention mechanism in transformer with [temporal convolutions](https://deepmind.com/blog/wavenet-generative-model-raw-audio/). It has been demonstrated to be good at both supervised learning and reinforcement learning tasks.

![SNAIL]({{ '/assets/images/snail.png' | relative_url }})
{: style="width: 100%;" class="center"}
*Fig. 13. SNAIL model architecture (Image source: [Mishra et al., 2017](http://metalearning.ml/papers/metalearn17_mishra.pdf))*


SNAIL was born in the field of meta-learning, which is another big topic worthy of a post by itself. But in simple words, the meta-learning model is expected to be generalizable to novel, unseen tasks in the similar distribution. Read [this](http://bair.berkeley.edu/blog/2017/07/18/learning-to-learn/) nice introduction if interested.
 


## Self-Attention GAN

Finally I would like to mention a type of [Generative Adversarial Network (GAN)]({{ site.baseurl }}{% post_url 2017-08-20-from-GAN-to-WGAN %}) published recently, **Self-Attention GAN** (**SAGAN**; [Zhang et al., 2018](https://arxiv.org/pdf/1805.08318.pdf)), and see how attention helps improve the quality of generative images. 

The classic [DCGAN](https://arxiv.org/abs/1511.06434) (Deep Convolutional GAN) represents both discriminator and generator as multi-layer convolutional networks. However, the representation capacity of the network is restrained by the filter size, as the feature of one pixel is limited to a small local region. In order to connect regions far apart, the features have to be dilute through layers of convolutional operations and the dependencies are not guaranteed to be maintained.

As the (soft) self-attention in the vision context is designed to explicitly learn the relationship between one pixel and all other positions, even regions far apart, it can easily capture global dependencies. Hence GAN equipped with self-attention is expected to **handle details better**, hooray!


![Conv vs self-attention on images]({{ '/assets/images/conv-vs-self-attention.png' | relative_url }})
{: style="width: 100%;" class="center"}
*Fig. 14. Convolution operation and self-attention have access to regions of very different sizes.*

The SAGAN adopts the [non-local neural network](https://arxiv.org/pdf/1711.07971.pdf) to apply the attention computation. The convolutional image feature maps $$\mathbf{x}$$ is branched out into three copies, corresponding to the concepts of [key, value, and query](#key-value-and-query) in the transformer:
- Key: $$f(\mathbf{x}) = \mathbf{W}_f \mathbf{x}$$
- Query: $$g(\mathbf{x}) = \mathbf{W}_g \mathbf{x}$$
- Value: $$h(\mathbf{x}) = \mathbf{W}_h \mathbf{x}$$

Then we apply the dot-product attention to output the self-attention feature maps:

$$
\begin{aligned}
\alpha_{i,j} &= \text{softmax}(f(\mathbf{x}_i)^\top g(\mathbf{x}_j)) \\
\mathbf{o}_j &= \sum_{i=1}^N \alpha_{i,j} h(\mathbf{x}_i)
\end{aligned}
$$


![SAGAN]({{ '/assets/images/self-attention-gan-network.png' | relative_url }})
{: style="width: 100%;" class="center"}
*Fig. 15. The self-attention mechanism in SAGAN. (Image source: Fig. 2 in [Zhang et al., 2018](https://arxiv.org/pdf/1805.08318.pdf))*

Note that $$\alpha_{i,j}$$ is one entry in the attention map, indicating how much attention the model should pay to the i-th position when synthesizing the j-th location. $$\mathbf{W}_f$$, $$\mathbf{W}_g$$, and $$\mathbf{W}_h$$ are all 1x1 convolution filters. If you feel that 1x1 conv sounds like a weird concept (i.e., isn't it just to multiply the whole feature map with one number?), watch this short [tutorial](https://www.youtube.com/watch?v=9EZVpLTPGz8) by Andrew Ng. The output $$\mathbf{o}_j$$ is a column vector of the final output $$\mathbf{o}= (\mathbf{o}_1, \mathbf{o}_2, \dots, \mathbf{o}_j, \dots, \mathbf{o}_N)$$.


Furthermore, the output of the attention layer is multiplied by a scale parameter and added back to the original input feature map:

$$
\mathbf{y} = \mathbf{x}_i + \gamma \mathbf{o}_i
$$

While the scaling parameter $$\gamma$$ is increased gradually from 0 during the training, the network is configured to first rely on the cues in the local regions and then gradually learn to assign more weight to the regions that are further away.

![SAGAN examples]({{ '/assets/images/SAGAN-examples.png' | relative_url }})
{: style="width: 100%;" class="center"}
*Fig. 16. 128×128 example images generated by SAGAN for different classes. (Image source: Partial Fig. 6 in [Zhang et al., 2018](https://arxiv.org/pdf/1805.08318.pdf))*


## References

[1] ["Attention and Memory in Deep Learning and NLP."](http://www.wildml.com/2016/01/attention-and-memory-in-deep-learning-and-nlp/) - Jan 3, 2016 by Denny Britz

[2] ["Neural Machine Translation (seq2seq) Tutorial"](https://www.tensorflow.org/versions/master/tutorials/seq2seq)

[3] Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio. ["Neural machine translation by jointly learning to align and translate."](https://arxiv.org/pdf/1409.0473.pdf) ICLR 2015.

[4] Kelvin Xu, Jimmy Ba, Ryan Kiros, Kyunghyun Cho, Aaron Courville, Ruslan Salakhudinov, Rich Zemel, and Yoshua Bengio. ["Show, attend and tell: Neural image caption generation with visual attention."](http://proceedings.mlr.press/v37/xuc15.pdf) ICML, 2015.

[5] Ilya Sutskever, Oriol Vinyals, and Quoc V. Le. ["Sequence to sequence learning with neural networks."](https://papers.nips.cc/paper/5346-sequence-to-sequence-learning-with-neural-networks.pdf) NIPS 2014. 

[6] Thang Luong, Hieu Pham, Christopher D. Manning. ["Effective Approaches to Attention-based Neural Machine Translation."](https://arxiv.org/pdf/1508.04025.pdf) EMNLP 2015.

[7] Denny Britz, Anna Goldie, Thang Luong, and Quoc Le. ["Massive exploration of neural machine translation architectures."](https://arxiv.org/abs/1703.03906) ACL 2017.

[8] Ashish Vaswani, et al. "Attention is all you need." NIPS 2017. http://papers.nips.cc/paper/7181-attention-is-all-you-need.pdf

[9] Jianpeng Cheng, Li Dong, and Mirella Lapata. ["Long short-term memory-networks for machine reading."](https://arxiv.org/pdf/1601.06733.pdf) EMNLP 2016.

[10] Xiaolong Wang, et al. ["Non-local Neural Networks."](https://arxiv.org/pdf/1711.07971.pdf) CVPR 2018

[11] Han Zhang, Ian Goodfellow, Dimitris Metaxas, and Augustus Odena. ["Self-Attention Generative Adversarial Networks."](https://arxiv.org/pdf/1805.08318.pdf) arXiv preprint arXiv:1805.08318 (2018). 

[12] Nikhil Mishra, Mostafa Rohaninejad, Xi Chen, and Pieter Abbeel. ["A simple neural attentive meta-learner."](http://metalearning.ml/papers/metalearn17_mishra.pdf) NIPS Workshop on Meta-Learning. 2017.

[13] ["WaveNet: A Generative Model for Raw Audio"](https://deepmind.com/blog/wavenet-generative-model-raw-audio/) - Sep 8, 2016 by DeepMind.
