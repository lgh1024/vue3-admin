<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {
  changeUserStatus,
  getUser,
  addUser,
  editUsersFromId,
  deleteUsersFromId,
  getRoles,
  assignUserRole
} from '../../api/user'
import {ElMessage, FormRules} from "element-plus";
import {AUser, EUser, ARole} from './type'
import {addUserFormRules, userFormRules} from "../../utils/formRules";

// 用户数据列表
let usersData = ref<Array<object>>([])
// 数据总条数
let total = ref<number>(0)
// 当前页码
let pagenum = ref<number>(1)
// 每页显示条数
let pagesize = ref<number>(5)
// 查询关键词
let query = ref<string>('')
// 控制添加用户对话框的显示
const addUserdialogVisible = ref<boolean>(false)
// 添加用户的表单数据
const addUserform = reactive<AUser>({
  username: '',
  password: '',
  email: '',
  mobile: ''
})
const addUserFormRef = ref()  // 添加用户表单的ref
// 添加用户的规则
const addUserRules = reactive<FormRules>(addUserFormRules)
// 控制编辑用户对话框的显示
const editUserdialogVisible = ref<boolean>(false)
// 编辑用户表单
const editUserform = reactive<EUser>({
  id: -1,
  username: '',
  email: '',
  mobile: ''
})
// 编辑用户表单的ref
const editUserFormRef = ref()
//编辑用户表单规则
const editUserRules = reactive(userFormRules)
// 控制分配角色对话框的显示
const assignRoledialogVisible = ref(false)
//分配角色的表单
const assignRoleform = reactive<ARole>({
  id: -1,
  username: '',
  role_name: '',
  roleId: ''
})
let roles = ref<Array<object>>([])

onMounted(() => {
  getUserList(pagenum.value, pagesize.value)
})
// 获取列表数据
const getUserList = async (pagenum: number, pagesize: number, query?: string) => {
  const res: any = await getUser({pagenum, pagesize, query})
  // console.log(res)
  if (res.meta.status !== 200) {
    return ElMessage({
      type: 'error',
      message: res.meta.msg
    })
  }
  pagenum = res.data.pagenum
  total.value = res.data.total
  usersData.value = res.data.users
  /* ElMessage({
     type: 'success',
     message: res.meta.msg
   })*/
  // 获取反派角色的下来列表
  const res1: any = await getRoles()
  // console.log(res1)
  if (res1.meta.status !== 200) {
    return ElMessage({
      type: 'error',
      message: res.meta.msg
    })
  }
  roles.value = res1.data
}
// 根据id查询
const searchUser = () => {
  if (query.value !== '') return getUserList(pagenum.value, pagesize.value, query.value)
  getUserList(pagenum.value, pagesize.value)
}
// 重置搜索表单
const resetForm = () => {
  query.value = ''
  getUserList(pagenum.value, pagesize.value)
}
// 修改用户状态
const changeStatus = async (uid: number, type: boolean) => {
  const res: any = await changeUserStatus(uid, type)
  // console.log(res)
  if (res.meta.status !== 200) {
    return ElMessage({
      type: 'error',
      message: res.meta.msg
    })
  }
  ElMessage({
    type: 'success',
    message: res.meta.msg
  })
}
// 分页
// 每页显示条数改变触发
const handleSizeChange = (val: number) => {
  getUserList(pagenum.value, val)
  pagesize.value = val
}
// 页码改变触发
const handleCurrentChange = (val: number) => {
  getUserList(val, pagesize.value)
  pagenum.value = val
}
// 点击确认添加用户
const addUsers = () => {
  addUserFormRef.value!.validate(async (isValidate: boolean) => {
    if (!isValidate) return
    const res: any = await addUser(addUserform)
    // console.log(res)
    if (res.meta.status !== 201) {
      return ElMessage({
        type: 'error',
        message: res.meta.msg
      })
    }
    getUserList(pagenum.value, pagesize.value)
    addUserFormRef.value!.resetFields()
    addUserdialogVisible.value = false
    ElMessage({
      type: 'success',
      message: res.meta.msg
    })
  })
}
// 点击编辑按钮获得用户信息
const editGetUser = (username: string, email: string, mobile: string, id: number) => {
  editUserdialogVisible.value = true
  editUserform.username = username
  editUserform.email = email
  editUserform.mobile = mobile
  editUserform.id = id
}
// 点击确认编修改用户信息
const editUser = () => {
  editUserFormRef.value.validate(async (isValidate: boolean) => {
    if (!isValidate) return
    const res: any = await editUsersFromId(editUserform)
    // console.log(res)
    if (res.meta.status !== 200) {
      return ElMessage({
        type: 'error',
        message: res.meta.msg
      })
    }
    getUserList(pagenum.value, pagesize.value)
    ElMessage({
      type: 'success',
      message: res.meta.msg
    })
    editUserdialogVisible.value = false
  })
}
//删除用户
const deleteUser = (id: number, username: string) => {
  ElMessageBox.confirm(`确认删除用户${username}吗`, '删除用户', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res: any = await deleteUsersFromId(id)
    // console.log(res)
    if (res.meta.status !== 200) {
      return ElMessage({
        type: 'error',
        message: res.meta.msg
      })
    }
    getUserList(pagenum.value, pagesize.value)
    ElMessage({
      type: 'success',
      message: res.meta.msg
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除'
    })
  })
}
//点击分配角色按钮获得用户信息
const getUserRole = (id: number, username: string, role_name: string) => {
  assignRoleform.id = id
  assignRoleform.username = username
  assignRoleform.role_name = role_name
  assignRoledialogVisible.value = true
}
//点击确认分配角色
const assignRole = async () => {
  const res: any = await assignUserRole(assignRoleform.id, Number(assignRoleform.roleId))
  // console.log(res)
  if (res.meta.status !== 200) {
    return ElMessage({
      type: 'error',
      message: res.meta.msg
    })
  }
  getUserList(pagenum.value, pagesize.value)
  ElMessage({
    type: 'success',
    message: res.meta.msg
  })
  assignRoledialogVisible.value = false
}
</script>

<template>
  <div>
    <!-- 面包屑导航区 -->
    <Breadcrumb data="用户列表"/>
    <!-- 卡片区域  -->
    <el-card class="box-card">
      <template #header>
        <!--        头部区域-->
        <div class="card-header">
          <!--          搜索表单-->
          <el-form style="min-width: 400px">
            <el-row :gutter="20">
              <el-col :span="13">
                <el-form-item>
                  <el-input placeholder="请输入用户名称" width="200px" v-model.number="query"/>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-button type="primary" icon="Search" @click="searchUser">查询</el-button>
                <el-button style="margin-left: 3px" icon="Refresh" @click="resetForm">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
          <!--          添加用户-->
          <el-button
              type="primary"
              @click="addUserdialogVisible = true"
          >
            添加用户
          </el-button>
        </div>
      </template>
      <!--      列表区域-->
      <el-table :data="usersData" stripe style="width: 100%" border>
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="username" label="姓名" min-width="200"/>
        <el-table-column prop="mobile" label="手机号码" min-width="200"/>
        <el-table-column prop="email" label="邮箱" min-width="200"/>
        <el-table-column prop="role_name" label="角色" min-width="100"/>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-switch
                v-model="scope.row.mg_state"
                class="ml-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                @change="changeStatus(scope.row.id, scope.row.mg_state)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template #default="scope">
            <div class="control">
              <!-- 修改按钮 -->
              <el-button
                  type="primary"
                  icon="EditPen"
                  @click="editGetUser(scope.row.username, scope.row.email, scope.row.mobile, scope.row.id)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                  type="danger"
                  icon="Delete"
                  @click="deleteUser(scope.row.id, scope.row.username)"
              ></el-button>
              <!-- 分配角色按钮 -->
              <el-tooltip
                  effect="dark"
                  content="分配角色"
                  placement="top"
                  :enterable="false"
              >
                <el-button
                    type="warning"
                    icon="Setting"
                    @click="getUserRole(scope.row.id, scope.row.username, scope.row.role_name)"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
          v-model:currentPage="pagenum"
          v-model:page-size="pagesize"
          :page-sizes="[2, 5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
      <!--      添加用户的对话框-->
      <el-dialog
          v-model="addUserdialogVisible"
          title="添加用户"
          width="30%"
      >
        <el-form :model="addUserform" label-width="80px" :rules="addUserRules" ref="addUserFormRef">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserform.username"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserform.password"/>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserform.email"/>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUserform.mobile"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addUserdialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addUsers"
            >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
      <!-- 编辑用户对话框 -->
      <el-dialog v-model="editUserdialogVisible" title="编辑用户" width="30%">
        <el-form
            :model="editUserform"
            label-width="80px"
            :rules="editUserRules"
            ref="editUserFormRef"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUserform.username" disabled/>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserform.email"/>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editUserform.mobile"/>
          </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
          <el-button @click="editUserdialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editUser">确认</el-button>
        </span>
        </template>
      </el-dialog>
      <!-- 分配角色对话框 -->
      <el-dialog v-model="assignRoledialogVisible" title="编辑用户" width="30%">
        <el-form :model="assignRoleform" label-width="100px" ref="assignRoleFormRef">
          <el-form-item label="用户名: ">
            {{ assignRoleform.username }}
          </el-form-item>
          <el-form-item label="当前角色: ">
            {{ assignRoleform.role_name }}
          </el-form-item>
          <el-form-item label="分配新角色: ">
            <el-select class="m-2" placeholder="Select" v-model="assignRoleform.roleId">
              <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
          <el-button @click="assignRoledialogVisible = false">取消</el-button>
          <el-button type="primary" @click="assignRole">确认</el-button>
        </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<style scoped lang="less">
</style>