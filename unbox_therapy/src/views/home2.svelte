<script>
  import Knn from "./Knn.svelte";
  import Tree from "./Tree.svelte";
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { link } from "svelte-spa-router";

  var cont;
  var elsArr;
  var closeBtnsArr;
  var dcont;
  var selected = 0;
  var dynamiccss = "cont s--inactive";
  // 不加onMount  cont取不到值
  onMount(async () => {
    cont = document.querySelector(".cont");
    elsArr = [].slice.call(document.querySelectorAll(".el"));
    closeBtnsArr = [].slice.call(document.querySelectorAll(".el__close-btn"));

    setTimeout(function() {
      // cont.classList.remove('s--inactive');
      dynamiccss = "cont";
    }, 200);

    elsArr.forEach(function(el, index) {
      el.addEventListener(
        "click",
        function() {
          selected = index + 1;
          // if (this.classList.contains('s--active')) return;
          // cont.classList.add('s--el-active');
          // this.classList.add('s--active');
        },
        true
      );
    });

    closeBtnsArr.forEach(function(btn) {
      btn.addEventListener(
        "click",
        function(e) {
          e.stopPropagation();
          selected = 0;
          // cont.classList.remove('s--el-active');
          // document.querySelector('.el.s--active').classList.remove('s--active');
        },
        true
      );
    });
  });
</script>

<div>
  <br />
  <h3 style="color: #555;text-align: left;font-weight:300;font-size:20px">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;学校组织去植物园春游，一片特别好看的蓝紫色的花海映入你眼帘，像一只只穿梭在绿草中的美丽蝴蝶。你看到牌上的介绍说：这是鸢尾花，常见的有三大类:
    <br />
    <span>
      <i>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;山鸢尾
        (Iris-setosa)，变色鸢尾(Iris-versicolor)和维吉尼亚鸢尾(Iris-virginica)
      </i>
    </span>
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;他们有着形状与色彩相似的花瓣和萼片。你观察到有一块集中的部分的鸢尾有较大的花瓣，而它旁边的一块的花瓣却很小。你想搞清楚他们究竟属于哪一类鸢尾花，
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;于是你上网搜索，发现网上说可以根据一些特征值来刻画事物的某些方面的特点，比如通过
    花萼的长、花萼的宽、花瓣的长和花瓣的宽来辨别他们。
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;让我们从section1开始吧！
  </h3>
</div>
<div class={selected > 0 ? 'cont s--el-active' : dynamiccss}>
  <!-- cont inner start -->
  <div class="cont__inner">
    <!-- el start -->
    <div class={selected === 1 ? 'el s--active' : 'el'}>
      <div class="el__overflow">
        <div class="el__inner">
          <div class="el__bg" />
          <div class="el__preview-cont">
            <h2 class="el__heading">Section 1</h2>
          </div>
          <div class="el__content">
            <a href="/old" use:link rel="prefetch">
              <div class="el__text">Enter Section 1</div>
            </a>
            <div class="el__close-btn" />
          </div>
        </div>
      </div>
      <div class="el__index">
        <div class="el__index-back">1</div>
        <div class="el__index-front">
          <div class="el__index-overlay" data-index="1">1</div>
        </div>
      </div>
    </div>
    <!-- el end -->
    <!-- el start -->
    <div class={selected === 2 ? 'el s--active' : 'el'}>
      <div class="el__overflow">
        <div class="el__inner">
          <div class="el__bg" />
          <div class="el__preview-cont">
            <h2 class="el__heading">Section 2</h2>
          </div>
          <div class="el__content">
            <a href="/knn" use:link rel="prefetch">
              <div class="el__text">Enter Section 2</div>
            </a>
            <div class="el__close-btn" />
          </div>
        </div>
      </div>
      <div class="el__index">
        <div class="el__index-back">2</div>
        <div class="el__index-front">
          <div class="el__index-overlay" data-index="2">2</div>
        </div>
      </div>
    </div>
    <!-- el end -->
    <!-- el start -->
    <div class={selected === 3 ? 'el s--active' : 'el'}>
      <div class="el__overflow">
        <div class="el__inner">
          <div class="el__bg" />
          <div class="el__preview-cont">
            <h2 class="el__heading">Section 3</h2>
          </div>
          <div class="el__content">
            <a href="/tree" use:link rel="prefetch">
              <div class="el__text">Enter Section 3</div>
            </a>
            <div class="el__close-btn" />
          </div>
        </div>
      </div>
      <div class="el__index">
        <div class="el__index-back">3</div>
        <div class="el__index-front">
          <div class="el__index-overlay" data-index="3">3</div>
        </div>
      </div>
    </div>
    <!-- el end -->
    <!-- el start -->
    <div class={selected === 4 ? 'el s--active' : 'el'}>
      <div class="el__overflow">
        <div class="el__inner">
          <div class="el__bg" />
          <div class="el__preview-cont">
            <h2 class="el__heading">Section 4</h2>
          </div>
          <div class="el__content">
            <a href="/cnn" use:link rel="prefetch">
              <div class="el__text">Enter Section 4</div>
            </a>
            <div class="el__close-btn" />
          </div>
        </div>
      </div>
      <div class="el__index">
        <div class="el__index-back">4</div>
        <div class="el__index-front">
          <div class="el__index-overlay" data-index="4">4</div>
        </div>
      </div>
    </div>
    <!-- el end -->
    <!-- el start -->
    <div class={selected === 5 ? 'el s--active' : 'el'}>
      <div class="el__overflow">
        <div class="el__inner">
          <div class="el__bg" />
          <div class="el__preview-cont">
            <h2 class="el__heading">Section 5</h2>
          </div>
          <div class="el__content">
            <a href="/" use:link rel="prefetch">
              <div class="el__text">Enter Section 5</div>
            </a>
            <div class="el__close-btn" />
          </div>
        </div>
      </div>
      <div class="el__index">
        <div class="el__index-back">5</div>
        <div class="el__index-front">
          <div class="el__index-overlay" data-index="5">5</div>
        </div>
      </div>
    </div>
    <!-- el end -->
  </div>
  <!-- cont inner end -->
</div>
<footer style="background-color: #37474f">
<span style="text-align: right;color: #f6f6f6;font-weight:300;;font-size: 13px">Deecamp2020 4-2 UnboxTherapy </span>
</footer>
