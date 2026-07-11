import { createFileRoute } from "@tanstack/react-router";
import {
  Article,
  C,
  Callout,
  Diagram,
  DocsShell,
  Figure,
  FlowRow,
  KeyTerms,
  LayerStack,
  P,
  Prose,
  References,
  Section,
  useSvgId,
} from "../../features/docs";
import { makeDocJsonLd, makeHead } from "../../features/seo/seo";

const LLM_TITLE = "Large Language Models — nand2web";
const LLM_DESC =
  "A large language model is a neural network trained to predict the next token in a sequence at enormous scale. That one objective produces a system that translates, writes code, and reasons — powered by the Transformer architecture.";

export const Route = createFileRoute("/docs/llm")({
  head: () =>
    makeHead({
      title: LLM_TITLE,
      description: LLM_DESC,
      path: "/docs/llm",
      jsonLd: makeDocJsonLd({
        title: LLM_TITLE,
        description: LLM_DESC,
        path: "/docs/llm",
        breadcrumbLabel: "Large Language Models",
      }),
    }),
  component: Page,
});

function Page() {
  return (
    <DocsShell active="llm">
      <Article
        title={{ en: "Large Language Models", ja: "大規模言語モデル（LLM）" }}
        lead={{
          en: "A large language model is a neural network trained on a simple objective — predict the next token in a sequence — applied at enormous scale. That one objective, repeated over hundreds of billions of examples, produces a system that can translate languages, write code, summarise documents, and reason about novel problems. Understanding why requires understanding the architecture beneath: the Transformer.",
          ja: "大規模言語モデルとは、シンプルな目的——シーケンス内の次のトークンを予測する——を巨大なスケールで適用したニューラルネットワークです。その一つの目的が、数千億のサンプルにわたって繰り返されることで、言語翻訳・コード生成・文書要約・未知の問題への推論が可能なシステムが生まれます。その理由を理解するには、基盤となるアーキテクチャ——Transformerを理解する必要があります。",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* 1. What an LLM is                                                 */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="what-is-llm"
          title={{ en: "What an LLM is", ja: "LLMとは何か" }}
        >
          <Prose
            paragraphs={[
              {
                en: "At its core, a large language model is a **function that takes a sequence of tokens and returns a probability distribution over the next token**. During training, the model sees a token, predicts what comes next, compares its prediction to the actual next token (using a loss function called cross-entropy), and adjusts its parameters to do better next time. That is the entirety of the training signal.",
                ja: "その本質において、大規模言語モデルはトークンのシーケンスを受け取り、次のトークンに対する**確率分布を返す関数**です。学習中、モデルはトークンを見て次のトークンを予測し、その予測を実際の次のトークンと比較し（クロスエントロピーと呼ばれる損失関数を使用）、次回により良い予測ができるようにパラメータを調整します。それが学習シグナルのすべてです。",
              },
              {
                en: "The surprising result — confirmed empirically but still not fully explained theoretically — is that **scale unlocks capabilities**. A model trained on billions of tokens with billions of parameters starts exhibiting qualitatively new behaviours: it can follow instructions it was never explicitly taught, translate between languages seen only incidentally in the training data, and solve multi-step reasoning problems. This phenomenon, sometimes called **emergent capability**, is one reason LLMs are scientifically interesting beyond engineering.",
                ja: "驚くべき結果——実験的に確認されているが、理論的にはまだ完全には説明されていない——は、**スケールが能力を解放する**ということです。数十億のトークンで学習された数十億のパラメータを持つモデルは、質的に新しい振る舞いを示し始めます：明示的に教えられたことのない指示に従い、学習データに偶然しか含まれていない言語間で翻訳し、多段階の推論問題を解きます。この現象は**創発的能力**と呼ばれることもあり、LLMがエンジニアリングを超えて科学的に興味深い理由のひとつです。",
              },
              {
                en: "The 'large' in LLM refers to both the model size (parameter count, measured in billions) and the training data (often trillions of tokens scraped from the web, books, and code). The model itself is a **Transformer neural network** — a specific architecture introduced in 2017 that has become the default building block for nearly every frontier language model. It stores all learned knowledge in its weights — there is no external database during inference, only the parameters.",
                ja: "LLMの「大規模」は、モデルサイズ（数十億単位で測定されるパラメータ数）と学習データ（ウェブ・書籍・コードからスクレイピングされた、しばしば数兆トークン）の両方を指します。モデル自体は**Transformerニューラルネットワーク**——2017年に導入され、ほぼすべてのフロンティア言語モデルのデフォルトの構成要素となった特定のアーキテクチャです。学習されたすべての知識はその重みに格納されます——推論中に外部データベースはなく、パラメータのみです。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. Tokens & embeddings                                            */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="tokens"
          title={{ en: "Tokens & embeddings", ja: "トークンと埋め込み" }}
        >
          <Prose
            paragraphs={[
              {
                en: "Text cannot be fed directly into a neural network — it must be converted to numbers first. The first step is **tokenisation**: splitting text into discrete units called **tokens**. Tokens are not words; they are subword pieces. The dominant algorithm is **Byte-Pair Encoding (BPE)**: starting from individual bytes (or characters), the most frequent adjacent pair is merged into one token, and the process is repeated until the vocabulary reaches the target size (typically 32 000–100 000 tokens). Common English words become a single token; rare words or novel strings are split into multiple pieces.",
                ja: "テキストはそのままニューラルネットワークに入力することはできません——まず数値に変換する必要があります。最初のステップは**トークン化**：テキストを**トークン**と呼ばれる離散単位に分割することです。トークンは単語ではなく、サブワード片です。主流のアルゴリズムは**バイトペアエンコーディング（BPE）**：個々のバイト（または文字）から始め、最も頻繁に隣接するペアを一つのトークンにマージし、語彙が目標サイズ（通常32,000〜100,000トークン）に達するまで繰り返します。一般的な英単語は一つのトークンになり、希少な単語や新しい文字列は複数の片に分割されます。",
              },
              {
                en: "Each token in the vocabulary is then mapped to a dense numeric vector called an **embedding**. Think of an embedding as coordinates in a high-dimensional space (512 to 8 192 dimensions, depending on the model). Tokens with similar meaning end up in nearby regions of this space — a geometric encoding of semantics. The embedding matrix is a learned parameter; its initial values are random, and training adjusts them so that the geometry supports prediction. Before any transformer layer runs, the raw token ID (an integer from 0 to vocabulary size) is looked up in this matrix and replaced with its vector.",
                ja: "語彙内の各トークンは、**埋め込み（embedding）**と呼ばれる密な数値ベクトルにマッピングされます。埋め込みは高次元空間（モデルにより512〜8,192次元）での座標と考えてください。意味が似たトークンはこの空間の近い領域に位置します——意味論の幾何学的エンコーディングです。埋め込み行列は学習されたパラメータで、初期値はランダムであり、学習が予測をサポートするように幾何を調整します。Transformerレイヤーが実行される前に、生のトークンID（0から語彙サイズまでの整数）はこの行列で検索され、そのベクトルに置き換えられます。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "Text is tokenised into subword pieces, then each token is looked up in an embedding matrix to produce a vector.",
              ja: "テキストはサブワード片にトークン化され、各トークンが埋め込み行列で検索されてベクトルが生成される。",
            }}
          >
            <FlowRow
              steps={[
                {
                  label: { en: "Raw text", ja: "生テキスト" },
                  sub: { en: '"hello world"', ja: '"hello world"' },
                },
                {
                  label: { en: "Tokens", ja: "トークン" },
                  sub: { en: "BPE subwords", ja: "BPEサブワード" },
                },
                {
                  label: { en: "Token IDs", ja: "トークンID" },
                  sub: { en: "[15496, 995]", ja: "[15496, 995]" },
                },
                {
                  label: { en: "Embeddings", ja: "埋め込みベクトル" },
                  sub: { en: "float32 vectors", ja: "float32ベクトル" },
                },
              ]}
            />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 3. Neural network basics                                          */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="nn-basics"
          title={{
            en: "Neural network basics",
            ja: "ニューラルネットワークの基礎",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "A neural network is, at bottom, a composition of linear transformations and nonlinear activation functions. The basic unit is the **neuron**: it takes a vector of inputs, computes a weighted sum, adds a bias, and passes the result through a nonlinear function (the **activation** — historically sigmoid, now mostly ReLU or its variants). Stack many neurons in parallel into a **layer**, then compose many layers, and you have a deep network.",
                ja: "ニューラルネットワークは、本質的には線形変換と非線形活性化関数の合成です。基本単位は**ニューロン**：入力ベクトルを受け取り、重み付き和を計算し、バイアスを加え、結果を非線形関数（**活性化関数**——歴史的にはシグモイド、現在は主にReLUまたはその変種）に通します。多くのニューロンを並列に積み重ねると**レイヤー**になり、多くのレイヤーを合成すると深層ネットワークになります。",
              },
              {
                en: "**Training** is the process of finding weights that make the network useful. The recipe is: (1) pass a batch of inputs through the network to produce predictions (**forward pass**); (2) compute the loss — a number that measures how wrong the predictions are; (3) compute the gradient of the loss with respect to every weight using **backpropagation** — a systematic application of the chain rule of calculus that works backward through the computation graph; (4) update each weight by a small step in the direction that reduces the loss (**gradient descent**, typically with the Adam optimiser). Repeat for millions of batches.",
                ja: "**学習**はネットワークを有用にする重みを見つけるプロセスです。レシピは：(1) バッチの入力をネットワークに通して予測を生成する（**順伝播**）；(2) 予測がどれだけ間違っているかを測定する数値——損失を計算する；(3) 計算グラフを逆向きに体系的に連鎖律を適用する**誤差逆伝播法**を使い、すべての重みに対する損失の勾配を計算する；(4) 損失を減少させる方向に小さなステップで各重みを更新する（**勾配降下法**、通常はAdamオプティマイザで）。数百万バッチについてこれを繰り返す。",
              },
              {
                en: "The crucial insight of backpropagation is that gradients are **composable**: the gradient at any layer is the product of gradients of all layers above it. This means a network with 100 layers can still be trained efficiently — each weight gets a numerically precise gradient telling it exactly how to adjust to reduce the loss. The total number of learnable parameters in a modern LLM ranges from a few billion to over a trillion.",
                ja: "誤差逆伝播法の重要な洞察は、勾配が**合成可能**だということです：任意のレイヤーの勾配は、それより上のすべてのレイヤーの勾配の積です。これにより、100レイヤーのネットワークも効率的に学習できます——各重みは、損失を減らすためにどのように調整すべきかを数値的に正確に示す勾配を受け取ります。最新のLLMの学習可能なパラメータの総数は数十億から1兆以上にわたります。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. The Transformer                                                */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="transformer"
          title={{ en: "The Transformer", ja: "Transformerアーキテクチャ" }}
        >
          <Prose
            paragraphs={[
              {
                en: "The **Transformer**, introduced in Vaswani et al. (2017) under the title 'Attention Is All You Need', replaced recurrent networks as the architecture of choice for sequence modelling. Its key idea is **self-attention**: every position in the sequence attends to every other position directly, in parallel, in a single operation. This removes the sequential bottleneck of RNNs and makes the architecture highly parallelisable on modern GPUs.",
                ja: "**Transformer**は、Vaswaniら（2017年）の「Attention Is All You Need」という論文でシーケンスモデリングの主流アーキテクチャとして再帰型ネットワークに取って代わりました。その核心的なアイデアは**自己注意（self-attention）**：シーケンス内のすべての位置が、単一の演算で直接かつ並列に他のすべての位置に注意を向けます。これによりRNNの逐次的なボトルネックが除去され、現代のGPU上でアーキテクチャが高度に並列化可能になります。",
              },
              {
                en: "**Self-attention** works as follows. For each token, three vectors are computed from its embedding: a **Query** (Q — what am I looking for?), a **Key** (K — what do I contain?), and a **Value** (V — what should I contribute?). The attention score between token i and token j is the dot product of Q_i and K_j, scaled by the square root of the key dimension to prevent large magnitudes. A softmax over all j turns scores into a probability distribution; the output for token i is then the weighted sum of all V_j. In matrix form: `Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V`.",
                ja: "**自己注意**の仕組みは次の通りです。各トークンについて、その埋め込みから3つのベクトルが計算されます：**クエリ**（Q——何を探しているか？）、**キー**（K——何を含んでいるか？）、**バリュー**（V——何を提供すべきか？）。トークンiとjの間の注意スコアはQ_iとK_jの内積であり、大きな値を防ぐためにキー次元の平方根でスケーリングされます。すべてのjに対するsoftmaxがスコアを確率分布に変換し、トークンiの出力はすべてのV_jの重み付き和になります。行列形式では：`Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V`。",
              },
              {
                en: "**Multi-head attention** runs several attention computations in parallel with different learned projection matrices (the 'heads'), then concatenates and projects the results. Different heads learn to attend to different kinds of relationships — one head might focus on syntactic agreement, another on co-reference, another on positional proximity.",
                ja: "**マルチヘッド注意**は、異なる学習された射影行列（「ヘッド」）で並列に複数の注意計算を実行し、結果を連結して射影します。異なるヘッドは異なる種類の関係に注意するよう学習します——あるヘッドは統語的一致に、別のヘッドは照応関係に、また別のヘッドは位置的近接性に焦点を当てるかもしれません。",
              },
              {
                en: "Each transformer block pairs multi-head attention with a **position-wise feed-forward network** (FFN): two linear layers with a ReLU or GELU in between, applied independently to each token position. The FFN is where most of the raw parameter count lives in large models. Both the attention sublayer and the FFN sublayer are wrapped with a **residual connection** (the input is added to the output) and **layer normalisation**. Residual connections prevent gradient vanishing in very deep networks; layer norm stabilises training by normalising activations within each layer.",
                ja: "各Transformerブロックはマルチヘッド注意と**位置ごとのフィードフォワードネットワーク**（FFN）を組み合わせます：ReLUまたはGELUを挟んだ2つの線形レイヤーで、各トークン位置に独立して適用されます。FFNは大規模モデルでほとんどの生のパラメータ数が存在する場所です。注意サブレイヤーとFFNサブレイヤーの両方は**残差接続**（入力が出力に加算される）と**レイヤー正規化**でラップされます。残差接続は非常に深いネットワークでの勾配消失を防ぎ、レイヤー正規化は各レイヤー内の活性化を正規化して学習を安定させます。",
              },
              {
                en: "Standard self-attention is **position-agnostic** — shuffling all tokens would produce the same attention scores. To inject positional information, early models added a **sinusoidal positional encoding** to the embeddings. Modern LLMs instead use **Rotary Position Embedding (RoPE)** or **ALiBi**, which encode relative distance more efficiently and generalise better to sequences longer than those seen in training.",
                ja: "標準的な自己注意は**位置に無関係**です——すべてのトークンをシャッフルしても同じ注意スコアが生成されます。位置情報を注入するために、初期モデルは埋め込みに**正弦波位置エンコーディング**を加えていました。最新のLLMは代わりに**Rotary Position Embedding（RoPE）**または**ALiBi**を使用します。これらは相対距離をより効率的にエンコードし、学習中に見たよりも長いシーケンスに対してより良く汎化します。",
              },
            ]}
          />

          <Figure
            caption={{
              en: "A single Transformer block: token embeddings enter at the bottom, pass through multi-head attention and a feed-forward network (each with residual + layer norm), and exit as refined representations.",
              ja: "単一のTransformerブロック：トークン埋め込みが下から入り、マルチヘッド注意とフィードフォワードネットワーク（各々残差接続＋レイヤー正規化あり）を通り、洗練された表現として出力される。",
            }}
          >
            <TransformerBlockDiagram />
          </Figure>

          <Figure
            caption={{
              en: "A complete decoder-only LLM stacks N transformer blocks between the embedding layer and the output projection.",
              ja: "デコーダーのみのLLMは、埋め込みレイヤーと出力射影の間にN個のTransformerブロックを積み重ねる。",
            }}
          >
            <LayerStack
              layers={[
                {
                  label: {
                    en: "Output logits → softmax → token",
                    ja: "出力ロジット → softmax → トークン",
                  },
                  tone: "accent",
                },
                {
                  label: {
                    en: "Linear projection (vocab size)",
                    ja: "線形射影（語彙サイズ）",
                  },
                  tone: "zinc",
                },
                {
                  label: {
                    en: "Transformer Block × N (attention + FFN)",
                    ja: "Transformerブロック × N（注意 + FFN）",
                  },
                  tone: "emerald",
                },
                {
                  label: {
                    en: "Token embeddings + positional info",
                    ja: "トークン埋め込み + 位置情報",
                  },
                  tone: "zinc",
                },
                {
                  label: { en: "Tokeniser (BPE)", ja: "トークナイザー（BPE）" },
                  tone: "zinc",
                },
              ]}
            />
          </Figure>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 5. Training                                                       */}
        {/* ---------------------------------------------------------------- */}
        <Section id="training" title={{ en: "Training", ja: "学習" }}>
          <Prose
            paragraphs={[
              {
                en: "LLM training happens in two main phases. **Pretraining** is the expensive, large-scale phase: the model is fed enormous amounts of text (typically scraped from the web, books, academic papers, and code), and trained with the **next-token prediction** objective. At each position, the model predicts the probability of the next token; the loss is the average negative log-likelihood over all positions and all tokens in the batch. With a vocabulary of size V, random guessing would give a loss of log(V); a well-trained model achieves a much lower loss, implying it has learned genuine structure of the language.",
                ja: "LLMの学習は主に2つのフェーズで行われます。**事前学習**はコストのかかる大規模なフェーズです：モデルは膨大な量のテキスト（通常はウェブ・書籍・学術論文・コードからスクレイピング）を入力され、**次トークン予測**の目的で学習されます。各位置でモデルは次のトークンの確率を予測し、損失はバッチ内のすべての位置とすべてのトークンに対する平均負の対数尤度です。サイズVの語彙でランダムに推測するとlog(V)の損失になり、よく学習されたモデルははるかに低い損失を達成し、言語の真の構造を学習したことを示します。",
              },
              {
                en: "Pretraining produces a **base model** that is very good at continuing text — it will complete a sentence in a statistically plausible way — but is not yet an assistant. To make it follow instructions and behave helpfully, a second phase is applied: **instruction fine-tuning** on a curated dataset of (instruction, response) pairs. This shifts the model's output distribution toward being useful and on-topic rather than merely plausible.",
                ja: "事前学習により、テキストを続けることが非常に得意な**ベースモデル**が生成されます——統計的にもっともらしい方法で文章を完成させます——しかし、まだアシスタントではありません。指示に従い、役立つ振る舞いをするために、2番目のフェーズが適用されます：（指示、応答）ペアのキュレーションされたデータセットでの**指示ファインチューニング**。これにより、モデルの出力分布は単に尤もらしいものではなく、有用でトピックに合ったものになります。",
              },
              {
                en: "**Reinforcement Learning from Human Feedback (RLHF)** goes a step further for alignment. Human raters compare pairs of model responses and indicate which is better; these preferences train a **reward model**. The language model is then fine-tuned with Proximal Policy Optimisation (PPO) to maximise the reward model's score, subject to a KL penalty that prevents the model from drifting too far from the supervised baseline. The result is a model that is more helpful, less likely to produce harmful content, and better calibrated to human preferences than one produced by instruction fine-tuning alone.",
                ja: "**人間のフィードバックによる強化学習（RLHF）**はアライメントのためにさらに一歩進みます。人間の評価者がモデル回答のペアを比較し、どちらが良いかを示します。これらの好みが**報酬モデル**を学習します。次に言語モデルは、教師あり学習のベースラインから大きく逸脱しないようにKL正則化を加えながら、報酬モデルのスコアを最大化するように近接方策最適化（PPO）でファインチューニングされます。結果は、指示ファインチューニングのみで生成されたものより、より役立ち、有害なコンテンツを生成する可能性が低く、人間の好みとの整合性が高いモデルです。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 6. Inference                                                      */}
        {/* ---------------------------------------------------------------- */}
        <Section id="inference" title={{ en: "Inference", ja: "推論（生成）" }}>
          <Prose
            paragraphs={[
              {
                en: "At inference time, the model generates text **autoregressively**: it produces one token at a time, appends it to the context, then feeds the extended context back in to produce the next token. A response of 1 000 tokens requires 1 000 separate forward passes through the model. This is why inference throughput and latency are serious engineering problems at scale.",
                ja: "推論時、モデルは**自己回帰的**にテキストを生成します：一度に一つのトークンを生成し、それをコンテキストに追加し、拡張されたコンテキストを再び入力して次のトークンを生成します。1,000トークンの応答には、モデルを通じた1,000回の独立した順伝播が必要です。これが、スケールにおいて推論スループットとレイテンシが深刻なエンジニアリング問題である理由です。",
              },
              {
                en: "The **KV cache** is the key optimisation for autoregressive inference. In self-attention, the K and V matrices for all previous tokens are recomputed every step if you naively rerun the full forward pass. The KV cache stores these computed K/V tensors so that each new token only requires computing its own Q, K, V and attending to the cached K and V tensors from prior positions. Memory usage scales linearly with context length and batch size.",
                ja: "**KVキャッシュ**は自己回帰的推論の主要な最適化です。自己注意において、単純に完全な順伝播を再実行すると、すべての前トークンのKおよびV行列が毎ステップ再計算されます。KVキャッシュはこれらの計算済みK/Vテンソルを保存するため、各新しいトークンは自身のQ、K、Vを計算し、前の位置からのキャッシュされたK/Vテンソルに注意を向けるだけで済みます。メモリ使用量はコンテキスト長とバッチサイズに比例します。",
              },
              {
                en: "The output at each step is a probability distribution over the vocabulary. **Greedy** sampling takes the single most probable token. **Temperature** sampling scales the logits before the softmax: low temperature (< 1) sharpens the distribution toward the top candidate (more deterministic), high temperature (> 1) flattens it (more random). **Top-p (nucleus) sampling** samples from the smallest set of tokens whose cumulative probability exceeds p, discarding the long tail of unlikely tokens. These sampling strategies let users trade off creativity against coherence.",
                ja: "各ステップの出力は語彙に対する確率分布です。**貪欲**サンプリングは最も確率が高い単一トークンを選択します。**温度**サンプリングはsoftmax前にロジットをスケーリングします：低温度（< 1）はトップ候補に向けて分布を鋭くし（より決定論的）、高温度（> 1）は分布を平坦にします（よりランダム）。**Top-p（nucleus）サンプリング**は累積確率がpを超える最小のトークンセットからサンプリングし、可能性の低いトークンの長テールを破棄します。これらのサンプリング戦略により、ユーザーは創造性と一貫性のトレードオフを調整できます。",
              },
              {
                en: "The **context window** is the maximum number of tokens the model can attend to at once — it is a hard architectural limit set during training. Common sizes range from a few thousand tokens to over one hundred thousand. Tokens beyond the context window are simply not accessible to the model; there is no implicit memory of them.",
                ja: "**コンテキストウィンドウ**は、モデルが一度に注意を向けられるトークンの最大数です——学習中に設定されるアーキテクチャ上のハード制限です。一般的なサイズは数千トークンから100,000以上まで様々です。コンテキストウィンドウを超えるトークンはモデルから単純にアクセスできません；それらの暗黙のメモリはありません。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 7. Capabilities & limits                                          */}
        {/* ---------------------------------------------------------------- */}
        <Section
          id="capabilities"
          title={{
            en: "Capabilities & limits",
            ja: "能力と限界",
          }}
        >
          <Prose
            paragraphs={[
              {
                en: "One of the most striking properties of LLMs is **in-context learning**: a model can learn to perform a new task purely from examples placed in its prompt, with no weight updates. Show it three (input, output) pairs and it will generalise the pattern to a fourth, even for tasks it was never explicitly trained on. This is qualitatively different from classical supervised learning, which requires gradient updates for every new task.",
                ja: "LLMの最も印象的な特性の一つは**インコンテキスト学習**です：モデルはプロンプトに置かれた例からだけで、重みの更新なしに新しいタスクを実行するよう学習できます。3つの（入力、出力）ペアを示すだけで、明示的に学習されたことのないタスクについても4番目のものを汎化します。これは、すべての新しいタスクに勾配更新を必要とする古典的な教師あり学習とは質的に異なります。",
              },
              {
                en: "LLMs have no access to real-time information, no ability to verify facts, and no distinction between things they know well and things they are uncertain about. Their knowledge is frozen at the training cutoff. They can be confidently wrong — producing plausible-sounding but false statements. They also reproduce biases present in the training data.",
                ja: "LLMはリアルタイム情報へのアクセスがなく、事実を検証する能力がなく、よく知っていることと不確かなことを区別できません。その知識は学習カットオフ時点で凍結されています。自信を持って間違える可能性があります——もっともらしく聞こえるが間違っている文を生成します。また、学習データに存在するバイアスを再現します。",
              },
            ]}
          />

          <Callout
            tone="warn"
            title={{ en: "Hallucination", ja: "幻覚（ハルシネーション）" }}
            t={{
              en: "LLMs frequently produce false information stated as fact — a phenomenon called **hallucination**. The model has no internal ground truth; it generates tokens that are statistically likely to follow the prompt, not tokens that are factually correct. It will invent plausible-sounding citations, dates, and code that subtly doesn't work. Never use LLM output in a safety-critical context without independent verification.",
              ja: "LLMはしばしば事実として述べられた虚偽の情報を生成します——これは**幻覚（ハルシネーション）**と呼ばれる現象です。モデルは内部に基礎となる真実を持っていません；プロンプトに続くことが統計的に尤もらしいトークンを生成するのであって、事実として正しいトークンではありません。もっともらしく聞こえる引用・日付・微妙に動かないコードを捏造します。安全性が重要なコンテキストでは、独立した検証なしにLLMの出力を使用しないでください。",
            }}
          />

          <P
            t={{
              en: "Context-window limits are a practical constraint: a model with a 128 000-token context can read roughly 100 000 words of text, which is already several full novels. But once the relevant information falls outside the window, the model has no access to it. Very long contexts also cause a known phenomenon called **lost in the middle**: models tend to recall information near the start and end of the context better than information buried in the centre.",
              ja: "コンテキストウィンドウの制限は実用上の制約です：128,000トークンのコンテキストを持つモデルは約100,000語のテキストを読むことができ、それはすでに数冊分の完全な小説に相当します。しかし、関連情報がウィンドウ外に落ちると、モデルはそれにアクセスできません。非常に長いコンテキストは**「中間で迷子」**と呼ばれる既知の現象も引き起こします：モデルはコンテキストの最初と最後の近くの情報をコンテキストの中央に埋もれた情報よりよく想起する傾向があります。",
            }}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* 8. Using LLMs                                                     */}
        {/* ---------------------------------------------------------------- */}
        <Section id="using-llms" title={{ en: "Using LLMs", ja: "LLMの活用" }}>
          <Prose
            paragraphs={[
              {
                en: "**Prompting** is the primary interface to a deployed LLM. The quality of the output depends heavily on how the prompt is structured. *Zero-shot* prompting simply states the task. *Few-shot* prompting provides examples in the prompt, exploiting in-context learning. *Chain-of-thought* prompting asks the model to reason step-by-step before giving an answer, which dramatically improves performance on multi-step problems. Effective prompting is a learned skill, not magic.",
                ja: "**プロンプティング**はデプロイされたLLMへの主要なインターフェースです。出力の品質は、プロンプトの構造に大きく依存します。*ゼロショット*プロンプティングは単純にタスクを述べます。*フューショット*プロンプティングはプロンプト内に例を提供し、インコンテキスト学習を利用します。*チェーンオブソート*プロンプティングは、答えを出す前に段階的に推論するようモデルに依頼し、多段階問題でのパフォーマンスを劇的に向上させます。効果的なプロンプティングは習得されるスキルであり、魔法ではありません。",
              },
              {
                en: "**Retrieval-Augmented Generation (RAG)** addresses the hallucination and knowledge-cutoff problems by giving the model access to an external corpus at inference time. A retriever (often a dense vector search over embedded document chunks) finds relevant passages for the query and prepends them to the prompt. The model then generates its answer grounded in the retrieved text rather than purely in its trained weights. RAG does not eliminate hallucination entirely but substantially reduces factual errors on domain-specific questions.",
                ja: "**検索拡張生成（RAG）**は、推論時にモデルが外部コーパスにアクセスできるようにすることで、幻覚と知識カットオフの問題に対処します。リトリーバー（多くの場合、埋め込まれた文書チャンクに対する密なベクトル検索）がクエリに関連するパッセージを見つけ、それらをプロンプトの先頭に追加します。モデルは純粋に学習された重みではなく、取得されたテキストに基づいて回答を生成します。RAGは幻覚を完全には排除しませんが、ドメイン固有の質問での事実誤りを大幅に削減します。",
              },
              {
                en: "**Tool use and agents** extend LLMs further. The model can be given descriptions of tools (a calculator, a web search API, a code executor) in its system prompt. When the model decides it needs a tool, it emits a structured call; an orchestration layer executes it and returns the result; the model continues generating with the tool output in context. With a planning loop, this produces an **agent** that can take multi-step actions in the world. The nand2web site itself was built primarily with an LLM coding agent, demonstrating the practical reach of these systems for software engineering tasks.",
                ja: "**ツール使用とエージェント**はLLMをさらに拡張します。モデルにはシステムプロンプトでツールの説明（電卓・ウェブ検索API・コード実行器）が与えられます。モデルがツールを必要と判断すると、構造化された呼び出しを出力し、オーケストレーション層がそれを実行して結果を返し、モデルはコンテキスト内のツール出力を使って生成を続けます。計画ループにより、これは世界で多段階のアクションを取れる**エージェント**を生成します。nand2webサイト自体は主にLLMコーディングエージェントで構築され、ソフトウェアエンジニアリングタスクへのこれらのシステムの実用的な到達範囲を示しています。",
              },
              {
                en: "**Fine-tuning vs prompting** is a practical choice. Fine-tuning modifies the model's weights on a task-specific dataset, which can improve performance on narrow tasks and reduce prompt length. It is expensive, requires GPU infrastructure, and risks catastrophic forgetting of general capabilities. Prompting keeps the base model unchanged and works at inference time. For most applications, sophisticated prompting and RAG outperform fine-tuning at lower cost; fine-tuning makes most sense when the target domain's style or vocabulary is very different from the pretraining distribution.",
                ja: "**ファインチューニング対プロンプティング**は実用的な選択です。ファインチューニングはタスク固有のデータセットでモデルの重みを変更し、狭いタスクでのパフォーマンスを向上させ、プロンプト長を削減できます。コストがかかり、GPUインフラを必要とし、一般的な能力の壊滅的忘却のリスクがあります。プロンプティングはベースモデルを変更せず、推論時に機能します。ほとんどのアプリケーションでは、高度なプロンプティングとRAGがより低コストでファインチューニングを上回ります；ターゲットドメインのスタイルや語彙が事前学習分布と大きく異なる場合にファインチューニングが最も意味をなします。",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Key terms                                                         */}
        {/* ---------------------------------------------------------------- */}
        <Section id="glossary" title={{ en: "Key terms", ja: "重要用語" }}>
          <KeyTerms
            terms={[
              {
                term: "Token",
                def: {
                  en: "The atomic unit of text that an LLM processes — a subword piece produced by BPE tokenisation, typically 3–5 characters for common English text.",
                  ja: "LLMが処理するテキストの原子単位——BPEトークン化によって生成されるサブワード片で、一般的な英語テキストでは通常3〜5文字。",
                },
              },
              {
                term: "Embedding",
                def: {
                  en: "A dense real-valued vector representing a token (or sentence) in a high-dimensional learned space. Semantically similar tokens have nearby embeddings.",
                  ja: "高次元の学習された空間においてトークン（または文）を表す密な実数値ベクトル。意味的に類似したトークンは近い埋め込みを持つ。",
                },
              },
              {
                term: "Attention",
                def: {
                  en: "A mechanism that computes, for each token position, a weighted sum of all other positions' values, where weights are determined by query–key dot products. Lets the model integrate information from anywhere in the context.",
                  ja: "各トークン位置について、クエリ・キーの内積で決定される重みを使って他のすべての位置のバリューの重み付き和を計算するメカニズム。モデルがコンテキストのどこからでも情報を統合できるようにする。",
                },
              },
              {
                term: "Transformer",
                def: {
                  en: "The neural network architecture underlying all major LLMs: stacked blocks of multi-head self-attention and feed-forward networks with residual connections and layer normalisation.",
                  ja: "主要なすべてのLLMの基盤となるニューラルネットワークアーキテクチャ：残差接続とレイヤー正規化を持つマルチヘッド自己注意とフィードフォワードネットワークのブロックを積み重ねたもの。",
                },
              },
              {
                term: "Pretraining",
                def: {
                  en: "The large-scale phase of LLM training where the model is trained on next-token prediction over hundreds of billions of tokens, learning general language structure.",
                  ja: "数千億トークンに対して次トークン予測で学習されるLLM学習の大規模フェーズ。一般的な言語構造を学習する。",
                },
              },
              {
                term: "RLHF",
                def: {
                  en: "Reinforcement Learning from Human Feedback — a fine-tuning technique that uses a human-preference-trained reward model to guide the LLM toward more helpful and less harmful outputs via PPO.",
                  ja: "人間のフィードバックによる強化学習——人間の好みで学習された報酬モデルを使ってPPOでLLMをより役立ち有害性の低い出力に向けるファインチューニング技術。",
                },
              },
              {
                term: "Hallucination",
                def: {
                  en: "The tendency of LLMs to confidently produce factually incorrect information, because they predict statistically likely tokens rather than verified true statements.",
                  ja: "LLMが確認された真実の文ではなく統計的に尤もらしいトークンを予測するため、自信を持って事実に反する情報を生成する傾向。",
                },
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* References                                                        */}
        {/* ---------------------------------------------------------------- */}
        <References
          items={[
            {
              title:
                "Vaswani et al. — Attention Is All You Need (arXiv:1706.03762)",
              href: "https://arxiv.org/abs/1706.03762",
              note: {
                en: "The original Transformer paper that introduced self-attention, multi-head attention, and positional encodings.",
                ja: "自己注意・マルチヘッド注意・位置エンコーディングを導入したオリジナルのTransformer論文。",
              },
            },
            {
              title: "Jay Alammar — The Illustrated Transformer",
              href: "https://jalammar.github.io/illustrated-transformer/",
              note: {
                en: "A visual, step-by-step walkthrough of the Transformer architecture; the clearest diagram-based explanation available.",
                ja: "Transformerアーキテクチャの視覚的・段階的なウォークスルー；利用可能な最も明確な図解説明。",
              },
            },
            {
              title: "Andrej Karpathy — nanoGPT",
              href: "https://github.com/karpathy/nanoGPT",
              note: {
                en: "A minimal, readable PyTorch implementation of a GPT-style decoder-only transformer — the best code-first introduction to LLM internals.",
                ja: "GPTスタイルのデコーダーのみのTransformerの最小限で読みやすいPyTorch実装——LLM内部へのコードファーストの最良の入門。",
              },
            },
            {
              title: "3Blue1Brown — Neural Networks (video series)",
              href: "https://www.3blue1brown.com/topics/neural-networks",
              note: {
                en: "Animated visual introduction to neural networks, gradient descent, and backpropagation.",
                ja: "ニューラルネットワーク・勾配降下法・誤差逆伝播法のアニメーションによる視覚的入門。",
              },
            },
            {
              title: "Anthropic — Documentation",
              href: "https://docs.anthropic.com/",
              note: {
                en: "Official API and prompting documentation, including guides on prompt engineering and tool use.",
                ja: "プロンプトエンジニアリングとツール使用のガイドを含む公式APIおよびプロンプティングドキュメント。",
              },
            },
            {
              title:
                "Ouyang et al. — Training language models to follow instructions with human feedback (InstructGPT)",
              href: "https://arxiv.org/abs/2203.02155",
              note: {
                en: "The paper describing RLHF fine-tuning of GPT-3 into InstructGPT — the technique behind ChatGPT-style alignment.",
                ja: "GPT-3をInstructGPTにRLHFファインチューニングした論文——ChatGPTスタイルのアライメントの基礎技術。",
              },
            },
            {
              title:
                "Lewis et al. — Retrieval-Augmented Generation (arXiv:2005.11401)",
              href: "https://arxiv.org/abs/2005.11401",
              note: {
                en: "The paper that formalised RAG: combining a dense retriever with a sequence-to-sequence generator.",
                ja: "密なリトリーバーとシーケンス対シーケンス生成器を組み合わせたRAGを正式化した論文。",
              },
            },
          ]}
        />
      </Article>
    </DocsShell>
  );
}

// ---------------------------------------------------------------------------
// Transformer block SVG diagram
// ---------------------------------------------------------------------------

function TransformerBlockDiagram() {
  const sid = useSvgId();
  return (
    <Diagram
      label={{
        en: "Transformer block diagram: input embeddings flow through multi-head attention (with residual + layer norm) then a feed-forward network (with residual + layer norm) to produce output representations",
        ja: "Transformerブロック図：入力埋め込みがマルチヘッド注意（残差接続＋レイヤー正規化あり）を経てフィードフォワードネットワーク（残差接続＋レイヤー正規化あり）に流れ、出力表現を生成する",
      }}
      viewBox="0 0 480 420"
      maxHeight={400}
    >
      {/* Background */}
      <rect width="480" height="420" fill={C.panel} rx="8" />

      {/* ── Input ── */}
      <rect
        x="155"
        y="16"
        width="170"
        height="38"
        rx="6"
        fill={C.muted}
        stroke={C.faint}
        strokeWidth="1"
      />
      <text
        x="240"
        y="40"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        Input embeddings
      </text>

      {/* Arrow: input → MHA */}
      <line
        x1="240"
        y1="54"
        x2="240"
        y2="80"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arr")})`}
      />

      {/* ── Multi-Head Attention box ── */}
      <rect
        x="100"
        y="82"
        width="280"
        height="52"
        rx="6"
        fill={C.muted}
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text
        x="240"
        y="106"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        Multi-Head Self-Attention
      </text>
      <text x="240" y="124" textAnchor="middle" fill={C.faint} fontSize="10">
        Q · K / √d_k → softmax → · V
      </text>

      {/* Residual bypass: input ──╮ */}
      <path
        d="M 100 35 Q 60 35 60 108 L 60 134 Q 60 160 100 160"
        fill="none"
        stroke={C.line}
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* Arrow: MHA → Add&Norm */}
      <line
        x1="240"
        y1="134"
        x2="240"
        y2="152"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arr")})`}
      />

      {/* ── Add & Norm 1 ── */}
      <rect
        x="155"
        y="154"
        width="170"
        height="34"
        rx="6"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="1.5"
      />
      <text
        x="240"
        y="175"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        Add &amp; Norm
      </text>

      {/* Arrow into bypass join */}
      <path
        d="M60 160 L100 171"
        fill="none"
        stroke={C.line}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arrl")})`}
      />

      {/* Arrow: Add&Norm → FFN */}
      <line
        x1="240"
        y1="188"
        x2="240"
        y2="212"
        stroke={C.accent}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arr")})`}
      />

      {/* ── Feed-Forward Network ── */}
      <rect
        x="100"
        y="214"
        width="280"
        height="52"
        rx="6"
        fill={C.muted}
        stroke={C.warn}
        strokeWidth="1.5"
      />
      <text
        x="240"
        y="238"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        Feed-Forward Network (FFN)
      </text>
      <text x="240" y="256" textAnchor="middle" fill={C.faint} fontSize="10">
        Linear → ReLU/GELU → Linear (per token)
      </text>

      {/* Residual bypass 2: from after AddNorm1 ──╮ */}
      <path
        d="M 380 171 Q 420 171 420 238 L 420 270 Q 420 298 380 298"
        fill="none"
        stroke={C.line}
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* Arrow: FFN → Add&Norm 2 */}
      <line
        x1="240"
        y1="266"
        x2="240"
        y2="284"
        stroke={C.warn}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arrw")})`}
      />

      {/* ── Add & Norm 2 ── */}
      <rect
        x="155"
        y="286"
        width="170"
        height="34"
        rx="6"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="1.5"
      />
      <text
        x="240"
        y="307"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        Add &amp; Norm
      </text>

      {/* Arrow into bypass 2 join */}
      <path
        d="M420 270 L380 296"
        fill="none"
        stroke={C.line}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arrl")})`}
      />

      {/* Arrow: Add&Norm2 → Output */}
      <line
        x1="240"
        y1="320"
        x2="240"
        y2="348"
        stroke={C.high}
        strokeWidth="1.5"
        markerEnd={`url(#${sid("arrg")})`}
      />

      {/* ── Output ── */}
      <rect
        x="155"
        y="350"
        width="170"
        height="38"
        rx="6"
        fill={C.muted}
        stroke={C.high}
        strokeWidth="1"
      />
      <text
        x="240"
        y="374"
        textAnchor="middle"
        fill={C.text}
        fontSize="12"
        fontWeight="600"
      >
        Output representations
      </text>

      {/* Legend */}
      <line
        x1="30"
        y1="392"
        x2="50"
        y2="392"
        stroke={C.line}
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <text x="56" y="396" fill={C.faint} fontSize="9">
        residual
      </text>
      <line
        x1="130"
        y1="392"
        x2="150"
        y2="392"
        stroke={C.accent}
        strokeWidth="1.5"
      />
      <text x="156" y="396" fill={C.faint} fontSize="9">
        data flow
      </text>

      {/* Arrow markers */}
      <defs>
        <marker
          id={sid("arr")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.accent} />
        </marker>
        <marker
          id={sid("arrg")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.high} />
        </marker>
        <marker
          id={sid("arrw")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.warn} />
        </marker>
        <marker
          id={sid("arrl")}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 z" fill={C.line} />
        </marker>
      </defs>
    </Diagram>
  );
}
