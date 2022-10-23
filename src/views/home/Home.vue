<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import { Fold, Expand } from '@element-plus/icons-vue'

const router = useRouter()
let isCollapse = ref<boolean>(false)
//折叠切换
const changeCollapse = () => {
  isCollapse.value = !isCollapse.value
}
const outLogin = () => {
  window.sessionStorage.clear();
  router.push("/login")
  ElMessage({
    type: 'info',
    message: '退出登录'
  })
}
</script>

<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="/vite.svg"/>
        <span>电商后台管理系统</span>

        <div class="icons">
          <Fold
              style="width: 1.8em; height: 1.8em"
              class="fold"
              @click="changeCollapse"
              v-show="!isCollapse"
              color="#fff"
          />
          <Expand
              style="width: 1.8em; height: 1.8em"
              class="fold"
              @click="changeCollapse"
              v-show="isCollapse"
              color="#fff"
          />
        </div>
      </div>
      <el-button type="info" @click="outLogin">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">

        <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            text-color="#fff"
            unique-opened
            :collapse="isCollapse"
            router
        >
          <!-- 菜单 -->
          <el-menu-item index="/user">
            <el-icon><User /></el-icon>
            <span>用户列表</span>
          </el-menu-item>
          <el-menu-item index="/power">
            <el-icon><Box /></el-icon>
            <span>权限列表</span>
          </el-menu-item>
          <el-menu-item index="/goods">
            <el-icon><Goods /></el-icon>
            <span>商品列表</span>
          </el-menu-item>
          <el-menu-item index="/order">
            <el-icon><DocumentCopy /></el-icon>
            <span>订单列表</span>
          </el-menu-item>
          <el-menu-item index="/reports">
            <el-icon><Monitor /></el-icon>
            <span>数据报表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区 -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="less">
.home-container {
  height: 100%;

  .el-header {
    background-color: #444f5a;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;
      margin: 15px;

      span {
        margin-left: 15px;
        display: inline-block;
        min-width: 160px;
      }
    }

    .icons {
      cursor: pointer;
      font-size: 16px;
      line-height: 2px;
      color: #fff;
      text-align: center;
      margin-left: 20px;
    }
  }

  .el-aside {
    background-color: #545c64;
    transition: 0.5s;

    .el-menu {
      border-right: none;
      .el-icon {
        margin-right: 20px;
      }
    }
  }

  .el-main {
    background-color: #f1f2f6;
  }
}
</style>