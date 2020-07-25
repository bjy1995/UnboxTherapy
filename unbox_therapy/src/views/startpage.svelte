<script>
import { link } from "svelte-spa-router";
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Dosis:400,700");

:root {
  --main-white-color: #f2f2f2;
  --main-black-color: black;
  --main-purple-color: #9e89b8;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

button {
  background: none;
  outline: none;
  cursor: pointer;
}

ul {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

.page-main {
  font: 16px/1.5 "Dosis", sans-serif;
  /*IE FIX*/
  /*display: flex;
  flex-direction: column;*/
}

/* CONTAINER
–––––––––––––––––––––––––––––––––––––––––––––––––– */
.wrapper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.wrapper > * {
  padding: 20px;
}


/* MAIN
–––––––––––––––––––––––––––––––––––––––––––––––––– */
.page-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  min-height: 300px;
  background: 
    /* var(--main-purple-color) */
    url(../img/machine.png) no-repeat
    center / cover;
  background-blend-mode: luminosity;
  color: var(--main-white-color);
}

.page-main div {
  max-width: 500px;
}

.page-main h1 {
  margin-bottom: 20px;
  font: "Dosis";
  color: var(--main-white-color);
}

.page-main p + p {
  margin-top: 10px;
}

.cta-contact {
  font-family: inherit;
  font-size: 1.2rem;
  padding: 5px 35px;
  border: 1px solid;
  border-radius: 5px;
  color:  var(--main-white-color);
}

/* FOOTER
–––––––––––––––––––––––––––––––––––––––––––––––––– */
.page-footer {
  display: flex;
  flex-direction: column-reverse;
  background: var(--main-white-color);
}

.page-footer ul {
  display: flex;
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.page-footer ul li:not(:last-child) {
  margin-right: 20px;
}


/* MQ
–––––––––––––––––––––––––––––––––––––––––––––––––– */
@media screen and (min-width: 550px) {
  .page-footer {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .page-footer ul {
    margin-bottom: 0;
  }
}

@media screen and (min-width: 768px) {
  body {
    font-size: 18px;
  }

  .page-main {
    padding-left: 90px;
    font-size: 18px;
  }
}
</style>

<div class="wrapper">
  <main class="page-main">
    <div>
      <h1>UnboxAI</h1>
      <p>一个可视化的人工智能算法学习平台</p>
      <button class="cta-contact"><a href="/home" use:link rel="prefetch">Get Started</a></button>
    </div>
  </main>
  <footer class="page-footer">
    <small> Deecamp 2020.</small>
    <ul>
      <li>
        <a href="" target="_blank">
          <ion-icon name="mail-outline"></ion-icon>
        </a>
      </li>
      <li>
        <a href="" target="_blank">
          <ion-icon name="logo-github"></ion-icon>
        </a>
      </li>
    </ul>
  </footer>
</div>