<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
@import './assets/css/reset.css';
.app {
  height: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>