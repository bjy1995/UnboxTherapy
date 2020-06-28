<style>

</style>
<main class="svelte-d6kcga">
  <div class="content listify svelte-a3bmb2">
    <section class="svelte-a3bmb2" data-id="神经网络概论">
      <h2 class="svelte-a3bmb2">
        <span class="offset-anchor" id="神经网络概论"></span>
        <a class="anchor" href="#神经网络概论" aria-hidden> </a>
        神经网络概论
      </h2>
      <h3>
        <span class="offset-anchor" id="构建神经网络"></span>
        <a class="anchor" href="#构建神经网络" aria-hidden=""> </a>
        构建神经网络
      </h3>
      <blockquote>
        <p>
          "Sapper 尚处于早期开发阶段，在发布 1.0
          版本之前，某些地方可能会存在改动。本文档在逐步完善过程中，如果你遇到了问题，请大方地在求助。
        </p>
        <p>请阅读 以帮助你升级到新版本。</p>
      </blockquote>
      <h3>
        <span class="offset-anchor" id="训练神经网络"></span>
        <a class="anchor" href="#训练神经网络" aria-hidden=""> </a>
        " 训练神经网络"
      </h3>
      <p>
        Sapper 是一款用于构建超高性能的 Web 应用的框架。其中有两个基本概念：
      </p>
      <ul>
        <li>应用程序的每个页面都由组件组成</li>
        <li>
          你可以通过在项目的
          <code>src/routes</code>
          目录下添加文件来创建页面。文件的内容都会通过服务器来预渲染，以便确保用户首次访问的速度尽可能快，之后便由客户端应用程序接管。
        </li>
      </ul>
      <p>
        遵循最新的最佳实践构建一个应用程序（包括代码拆分、离线支持、服务端渲染混合客户端渲染等）是非常复杂的。但是借助
        Sapper 可以轻松实现以上这些功能，你只需挥洒自己的创意就行了。
      </p>
      <p>
        虽然阅读此手册你并不需要懂得如何使用
        Svelte，但如果懂的话会更有帮助。简单说，Svelte 是一款 UI
        框架，它能将你的组件高度优化为原生 JavaScript 代码。请参考
        和此以了解更多信息。
      </p>
      <h3>
        <span class="offset-anchor" id="最小化损失"></span>
        <a class="anchor" href="#最小化损失" aria-hidden="true"> </a>
        "最小化损失?"
      </h3>
      <p>
        在战争中，建造桥梁、修路、扫雷并拆除（在战斗条件下均如此）的士兵被称作
        <em>sappers（工兵）</em>
      </p>
      <p>
        对于 Web
        开发者来说，危险性通常低于战斗工兵。但是我们也会面临一些风险环境：性能不足的设备、糟糕的网络以及前端工程固有的复杂度。Sapper（即
        <b>S</b>
        velte
        <b>app</b>
        mak
        <b>er</b>
        的缩写）使你无畏和忠实的战友！
      </p>
      <h3>
        <span class="offset-anchor" id="计算损失函数"></span>
        <a class="anchor" href="#计算损失函数" aria-hidden="true"> </a>
        "与 Next.js 对比"
      </h3>
      <p>
        是由推出的 React 框架，也是 Sapper
        的灵感来源。但两者之间有着明显的区别：
      </p>
      <ul>
        <li>
          Sapper 是基于 Svelte 构建的而非 React， 因此速度更快且你的应用体积更小
        </li>
        <li>
          不同于常规的路由传参方式，我们将路由参数融入文件名中 (参见
          章节)
        </li>
        <li>
          除了创建
          <em>pages（页面文件）</em>
          的方式外, 还可以在
          <code>src/routes</code>
          目录下创建
          <em>server routes（服务端路由）</em>
          。 这样，你添加 JSON API （如，驱动页面的 JSON
          API）到程序中将会变得非常容易。 (参阅
          章节)
        </li>
        <li>
          链接就是简单的
          <code>&lt;a></code>
          标签，这点区别于框架定制的
          <code>&lt;Link></code>
          组件。这就意味着即便是位于 markdown
          内容中的链接也能如常访问（你所看到的这篇教程均是由 markdown
          编写并动态渲染的）。
        </li>
      </ul>
      <h3>
        <span class="offset-anchor" id="入门"></span>
        <a class="anchor" href="#入门" aria-hidden=""> </a>
        "入门"
      </h3>
      <p>构建一个 Sapper 应用程序的最快速方式是使用克隆</p>
      <div class>
        <pre class="language-bash">
          <code>npx   /?????
          >>5555533262626
          </code>
        </pre>
      </div>
    </section>
  </div>
  
  <aside class="sidebar-container svelte-a3bmb2 ">
    <div class="svelte-a3bmb2 sidebar">
      <ul class="svelte-mm3tjv reference-toc">
        <li class="svelte-mm3tjv">
          <a href="#神经网络概论" class="svelte-mm3tjv section">神经网络概论</a>
          <a
            href="#构建神经网络"
            class="svelte-mm3tjv subsection"
            data-level="3">
            构建神经网络
          </a>
          <a
            href="#训练神经网络"
            class="svelte-mm3tjv subsection"
            data-level="3">
            训练神经网络
          </a>
          <a
            href="#最小化损失"
            class="svelte-mm3tjv subsection"
            data-level="3">
            最小化损失？
          </a>
          <a
            href="#计算损失函数"
            class="svelte-mm3tjv subsection"
            data-level="3">
            计算损失函数
          </a>
          <a href="#入门" class="svelte-mm3tjv subsection" data-level="3">
            入门
          </a>
        </li>
        <li class="svelte-mm3tjv">
          <a href="#神经网络概论" class="svelte-mm3tjv section">神经网络概论</a>
          <a
            href="#构建神经网络"
            class="svelte-mm3tjv subsection"
            data-level="3">
            构建神经网络
          </a>
          <a
            href="#训练神经网络"
            class="svelte-mm3tjv subsection"
            data-level="3">
            训练神经网络
          </a>
          <a
            href="#最小化损失"
            class="svelte-mm3tjv subsection"
            data-level="3">
            最小化损失？
          </a>
          <a
            href="#计算损失函数"
            class="svelte-mm3tjv subsection"
            data-level="3">
            计算损失函数
          </a>
          <a href="#入门" class="svelte-mm3tjv subsection" data-level="3">
            入门
          </a>
        </li>
      </ul>
    </div>
  </aside>
</main>
