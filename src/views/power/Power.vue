<script setup lang="ts">
import {getRightsList} from "../../api/power";
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";

// 权限数据列表
let power = ref<Array<object>>([])

onMounted(async () => {
  const res: any = await getRightsList()
  // console.log(res)
  if(res.meta.status !== 200) {
    return ElMessage({
      type: 'error',
      message: res.meta.msg
    })
  }
  power.value = res.data
})
</script>

<template>
  <div>
    <Breadcrumb data="权限列表"/>
    <!--  卡片区域  -->
    <el-card>
      <el-table :data="power" stripe style="width: 100%" border>
        <el-table-column type="index" width="60" label="序号" />
        <el-table-column prop="authName" label="权限名称" min-width="85px" />
        <el-table-column label="权限等级" min-width="85px" >
          <template #default="scope">
            <el-tag class="ml-2" v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag class="ml-2" type="success" v-if="scope.row.level === '1'">二级权限</el-tag>
            <el-tag class="ml-2" type="warning" v-if="scope.row.level === '2'">三级权限</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="访问路径" min-width="85px" />
      </el-table>
    </el-card>
  </div>
</template>

<style scoped lang="less">
</style>