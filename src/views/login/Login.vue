<script setup lang="ts">
import {reactive, ref, getCurrentInstance} from "vue";
import type {ElForm, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRouter} from "vue-router";
import {getAccout} from '../../api/login'
import {Login} from './type'
import {loginFormRules} from "../../utils/formRules";

const router = useRouter()
const loginFormRef = ref<InstanceType<typeof ElForm>>()

// 登录表单的数据绑定对象
const loginForm = reactive<Login>({
  username: 'admin',
  password: '123456'
})

// 表单的验证规则
const loginRules = reactive<FormRules>(loginFormRules)

// 登录
const login = () => {
  loginFormRef.value?.validate(async (isvalidate: boolean) => {
    if (!isvalidate) return
    const res: any = await getAccout({...loginForm})
    if (res.meta.status !== 200) {
      return ElMessage({
        type: 'error',
        message: '登录失败'
      })
    }
    ElMessage({
      type: 'success',
      message: res.meta.msg
    })
    window.sessionStorage.setItem('token', res.data.token)
    router.push('/home')
  })
}

const resetLoginForm = () => {
  loginFormRef.value!.resetFields()
}

</script>

<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="/vite.svg">
      </div>
      <!-- 登录表单区域 -->
      <el-form
          ref="loginFormRef"
          status-icon
          :model="loginForm"
          :rules="loginRules"
          label-width="120px"
          class="login_form"
      >
        <!--          用户-->
        <el-form-item label-width="0" prop="username">
          <el-input
              v-model="loginForm.username"
              placeholder=""
              prefix-icon="User"
          >
          </el-input>
        </el-form-item>
        <!--        密码-->
        <el-form-item label-width="0" prop="password">
          <el-input
              v-model="loginForm.password"
              placeholder=""
              type="password"
              prefix-icon="Lock"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.login_container {
  height: 100%;
  background-color: #11999e;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>