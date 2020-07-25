<script>
  import Overview from "../overview/Overview.svelte";
  import Article from "../article/article.svelte";
  import { cnnStore } from "../stores.js";
  import { link } from "svelte-spa-router";

  // Enum to control the displaying view
  const View = {
    OVERVIEW: "overview",
    LAYERVIEW: "layerview",
    DETAILVIEW: "detailview"
  };

  let mainView = View.OVERVIEW;

  /* Example to read loaded cnn in other components:
  $: if ( $cnnStore.length != 0) {
    console.log($cnnStore);
  }
  */
</script>

<style>
  #article{
    border-bottom: solid 2px rgb(211, 208, 208);
  }
  #explainer {
    width: 100%;
    padding: 0;
    margin: auto;
    /* outline: 1px solid var(--g-dark-gray); */
  }
  #foot{
    margin-left: auto;
    margin-right: auto;
    max-width: 78ch;
    position:relative;
    border-top: solid 1px #eee;
  }
  #foot .lasttext p{
    padding-top: 10px;
    font-style: italic;
    font-size: 18px;
    color: rgb(226, 195, 90);
  }
  #foot .addition p{
    color: #555;
    font-size: 17px;
    line-height: 1.6;
    padding-bottom: 30px;
  }
  .return {
    position: absolute;
    right: -30%;
    top: 80%;
    font-size: 20px;
    font-style: italic;
    color: steelblue;
  }
  .title{
    font-style: italic;
    color: steelblue;
    font-size: 24px;
    font-weight: 450;
    margin-bottom: 8px;
    margin-top: 44px;
  }
</style>
<div id="article">
  <Article />
</div>
<div id="explainer">
  <Overview />
</div>
<footer id="foot">
    <p class='title'>扩展与补充</p>
    <div class="addition">
      <p>CNN除了能够进行图像分类任务之外，还能够用于图像分割、目标检测等一些更加复杂的任务。同时，由于它的参数共享机制，使得相比于神经网络而已有着更少的网络参数量。在研究者们的努力之下，各种更新更有效的网络设计以及卷积方式得以被提出。CNN还有许多有趣的地方等待着你的探索。</p>
    </div>
    <a href="/home" use:link rel="prefetch">
        <ion-icon class="return" name="arrow-back-circle-outline" size="large"></ion-icon>
    </a>
</footer>