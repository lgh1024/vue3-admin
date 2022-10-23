<script setup lang="ts">
defineProps(['data'])
</script>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ data }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style scoped lang="less">
.el-breadcrumb {
  min-width: 115px;
}
</style>