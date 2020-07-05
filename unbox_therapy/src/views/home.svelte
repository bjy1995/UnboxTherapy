<style>
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif;
  }
  .Content-module--content__title--2nRHa {
    font-size: 2.5rem;
    line-height: 3.25rem;
    margin-top: 2.4375rem;
    font-weight: 500;
  }
  .Content-module--content__subtitle--34jJU {
    font-size: 1.875rem;
    line-height: 2.4375rem;
  }
  .Content-module--content__spacer--2kN9Y {
    margin-bottom: 1.625rem;
  }
  .katex-display {
    margin: 1em auto;
    margin-top: 1em;
    margin-right: auto;
    margin-bottom: 1em;
    margin-left: auto;
    display: block;
    text-align: center;
  }
  .katex {
    font: normal 1.21em KaTeX_Main, Times New Roman, serif;
    line-height: 1.2;
    text-indent: 0;
    text-rendering: auto;
  }
  .katex .katex-mathml {
    position: absolute;
    clip: rect(1px, 1px, 1px, 1px);
    padding: 0;
    border: 0;
    height: 1px;
    width: 1px;
    overflow: hidden;
  }
  .katex-display > .katex > .katex-html {
    display: block;
    position: relative;
  }
  .katex .base {
    position: relative;
    white-space: nowrap;
    width: min-content;
  }
  .katex .base,
  .katex .strut,
  .katex .mspace {
    display: inline-block;
  }
  .inline-square {
    margin-left: 5px;
    width: 12px;
    height: 12px;
    display: inline-block;
  }
  .left_tree {
    position: fixed;
    top: 90px;
    width: 16vw;
    height: 100%;
    background: rgba(103, 103, 120, 1);
  }
  .left_tree ul {
    list-style: none;
  }
  .left_tree li a {
    color: white;
  }
  .right_content {
    margin-left: auto;
    margin-right: auto;
    max-width: 100ch;
    height: calc(100% - 90px);
  }
  .name_md {
    font-size: 20px;
    font-weight: 600;
  }
  /* 这是用来固定锚点位置的 具体样式在.name_md里写 */
  .extra {
    border-top: solid 200px #fff;
    margin-top: -200px;
  }
</style>

<div class="left_tree">
  <ul>
    <li>
      <a href="#Zero">Let’s get started!</a>
    </li>
    <li>
      <a href="#One">1. Building Blocks: Neurons</a>
    </li>
    <li>
      <a href="#One1">1.1 A Simple Example</a>
    </li>
    <li>
    <a href="#One2">1.2 Coding a Neuron</a>
    </li>
    <li>
    <a href="#Two">2. Combining Neurons into a Neural Network</a>
    </li>
    <li>
    <a href="Two1">2.1 An Example:Feedforward</a>
    </li>
  </ul>
</div>

<div class="right_content">
  <div class="name_md extra" id="Zero"></div>
  <div>
    <h1 class="Content-module--content__title--2nRHa ">
      Machine Learning for Beginners: An Introduction to Neural Networks
    </h1>
    <h2 class="Content-module--content__subtitle--34jJU">
      A simple explanation of how they work and how to implement one from
      scratch in Python.
    </h2>
    <div class="Content-module--content__spacer--2kN9Y" />
    <p>
      Here’s something that might surprise you:
      <strong>neural networks aren’t that complicated!</strong>
      The term “neural network” gets used as a buzzword a lot, but in reality
      they’re often much simpler than people imagine.
    </p>
    <p>
      <strong>
        This post is intended for complete beginners and assumes ZERO prior
        knowledge of machine learning
      </strong>
      . We’ll understand how neural networks work while implementing one from
      scratch in Python.
    </p>
    <p>Let’s get started!</p>
  </div>

  <div class="name_md extra" id="One"><h2>1. Building Blocks: Neurons</h2></div>
  <div>
    <p>
      First, we have to talk about neurons, the basic unit of a neural network.
      <strong>
        A neuron takes inputs, does some math with them, and produces one output
      </strong>
      . Here’s what a 2-input neuron looks like:
    </p>
    <p>photo。。。emmm....可以交互吗</p>
    <p>
      3 things are happening here. First, each input is multiplied by a weight:
      <span class="inline-square" style="background-color:rgb(200, 0, 0)" />
    </p>
    <span class="katex-display">
      <span class="katex">
        <span class="katex-mathml">
          <math>
            <semantics>
              <mrow>
                <msub>
                  <mi>x</mi>
                  <mn>1</mn>
                </msub>
                <mo>→</mo>
                <msub>
                  <mi>x</mi>
                  <mn>1</mn>
                </msub>
                <mo>∗</mo>
                <msub>
                  <mi>w</mi>
                  <mn>1</mn>
                </msub>
              </mrow>
              <annotation encoding="application/x-tex">
                x_1 \rightarrow x_1 * w_1
              </annotation>
            </semantics>
          </math>
        </span>
        <span class="katex-html" aria-hidden="true">
          <span class="base">
            <span
              class="strut"
              style="height:0.58056em;vertical-align:-0.15em" />
            <span class="mord">
              <span class="mord mathdefault">x</span>
              <span class="msupsub">
                <span class="vlist-t vlist-t2">
                  <span class="vlist-r">
                    <span class="vlist" style="height:0.30110799999999993em">
                      <span
                        style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em">
                        <span class="pstrut" style="height:2.7em" />
                        <span class="sizing reset-size6 size3 mtight">
                          <span class="mord mtight">1</span>
                        </span>
                      </span>
                    </span>
                    <span class="vlist-s">​</span>
                  </span>
                  <span class="vlist-r">
                    <span class="vlist" style="height:0.15em">
                      <span />
                    </span>
                  </span>
                </span>
              </span>
            </span>
            <span class="mspace" style="margin-right:0.2777777777777778em" />
            <span class="mrel">→</span>
            <span class="mspace" style="margin-right:0.2777777777777778em" />
          </span>
          <span class="base">
            <span
              class="strut"
              style="height:0.61528em;vertical-align:-0.15em" />
            <span class="mord">
              <span class="mord mathdefault">x</span>
              <span class="msupsub">
                <span class="vlist-t vlist-t2">
                  <span class="vlist-r">
                    <span class="vlist" style="height:0.30110799999999993em">
                      <span
                        style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em">
                        <span class="pstrut" style="height:2.7em" />
                        <span class="sizing reset-size6 size3 mtight">
                          <span class="mord mtight">1</span>
                        </span>
                      </span>
                    </span>
                    <span class="vlist-s">​</span>
                  </span>
                  <span class="vlist-r">
                    <span class="vlist" style="height:0.15em">
                      <span />
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </span>
    </span>
  </div>

  <div class="name_md extra" id="One1"><h3>1.1 A Simple Example</h3></div>
  <div>
    <p>
      Assume we have a 2-input neuron that uses the sigmoid activation function
      and has the following parameters:
    </p>
    <span class="katex-display">
      <span class="katex">
        <span class="katex-mathml">
          <math>
            <semantics>
              <mrow>
                <mi>w</mi>
                <mo>=</mo>
                <mo stretchy="false">[</mo>
                <mn>0</mn>
                <mo separator="true">,</mo>
                <mn>1</mn>
                <mo stretchy="false">]</mo>
              </mrow>
              <annotation encoding="application/x-tex">w = [0, 1]</annotation>
            </semantics>
          </math>
        </span>
        <span class="katex-html" aria-hidden="true">
          <span class="base">
            <span class="strut" style="height:0.43056em;vertical-align:0em" />
            <span class="mord mathdefault" style="margin-right:0.02691em">
              w
            </span>
            <span class="mspace" style="margin-right:0.2777777777777778em" />
            <span class="mrel">=</span>
            <span class="mspace" style="margin-right:0.2777777777777778em" />
          </span>
          <span class="base">
            <span class="strut" style="height:1em;vertical-align:-0.25em" />
            <span class="mopen">[</span>
            <span class="mord">0</span>
            <span class="mpunct">,</span>
            <span class="mspace" style="margin-right:0.16666666666666666em" />
            <span class="mord">1</span>
            <span class="mclose">]</span>
          </span>
        </span>
      </span>
    </span>
  </div>
</div>
