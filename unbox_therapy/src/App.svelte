<script>
  import Router from "svelte-spa-router";
  import { link } from "svelte-spa-router";
  import { routes } from "./route";
</script>

<style>
  #app-page {
    height: 100%;
  }
  #app-page .content {
    padding-top: 90px;
    height: 100%;
  }
  #app-page .page_header {
    position: fixed;
    height: 90px;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0 5vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    z-index: 100;
    box-shadow: 0 -0.4rem 0.9rem 0.2rem rgba(0, 0, 0, 0.5);
  }
  #app-page .page_header a {
    text-decoration: none;
    cursor: pointer;
    color: black;
  }
  .home_icon {
    width: 60px;
    height: 60px;
    background-image: url("Unbox.png");
    background-size: 100% auto;
    color: transparent !important;
  }
  .menu_ul {
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>

<div id="app-page">
  <div class="page_header">
    <a href="/" class="home_icon" rel="prefetch">Home</a>
    <ul class="menu_ul">
      <li>
        <a href="/cnn" use:link rel="prefetch">CNN</a>
      </li>
      <li>
        <a target="_blank" href="/dist/indexnn.html">NN</a>
      </li>
    </ul>
  </div>

  <div class="content">
    <Router {routes} />
  </div>
</div>
