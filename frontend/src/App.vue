<template>
  <div id="app">
    <h1>小型網頁計算機</h1>
    <nav>
      <router-link to="/">查詢/計算</router-link>
      <span> | </span>
      <router-link to="/edit">新增資料</router-link>
      <span> | </span>
      <router-link to="/import">匯入excel</router-link>
      <span> | </span>
      <router-link to="/manage">資料管理</router-link>


    </nav>
    <main>
      <router-view />


    </main>
  </div>
</template>


<style scoped>
nav {
  margin-bottom: 2rem;
}
nav a {
  font-weight: bold;
  margin: 0 10px;
}
</style>
