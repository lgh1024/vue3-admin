<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {editOrders, getOrders} from "../../api/orders";
import {ElMessage} from "element-plus";
import {EOrder} from './type'

// 列表数据
let orders = ref<Array<any>>([])
// 每页显示条数
let pagesize = ref<number>(10)
// 当前页码
let pagenum = ref<number>(1)
// 数据总条数
let total = ref<number>(0)
// 编辑对话框的显示
let editOrderdialogVisible = ref<boolean>(false)
//支付方式
const pay = reactive<Array<any>>([
  { state: 1, title: '未支付' },
  { state: 2, title: '支付宝' },
  { state: 3, title: '微信支付' },
  { state: 4, title: '银行卡' }
])
// 是否发货
const send = reactive<Array<any>>([
  { state: 0, title: '否' },
  { state: 1, title: '是' }
])
// 编辑订单表单
const editOrderform = reactive<EOrder>({
  id: -1,
  order_price: 0,
  is_send: '',
  order_pay: ''
})

onMounted(() => {
  getOrdersList(pagesize.value, pagenum.value)
})
// 获取列表数据
const getOrdersList = async (pagesize: number, pagenum: number) => {
  const res: any = await getOrders(pagesize, pagenum)
  if (res.meta.status !== 200) {
    return ElMessage({
      type: 'error',
      message: res.meta.msg
    })
  }
  orders.value = res.data.goods
  total.value = res.data.total
}
// 每页显示条数改变触发
const handleSizeChange = (newPageSize: number) => {
  getOrdersList(newPageSize, pagenum.value)
  pagesize.value = newPageSize
}
// 页码改变触发
const handleCurrentChange = (newPageNum: number) => {
  console.log(newPageNum)
  getOrdersList(pagesize.value, newPageNum)
  pagenum.value = newPageNum
}
//点击编辑按钮获得订单详情
const getOrder = (row: any) => {
  editOrderform.id = row.order_id
  editOrderform.order_price = row.order_price
  editOrderform.is_send = row.is_send
  pay.forEach((item) => {
    if (item.state - 1 == row.order_pay) {
      editOrderform.order_pay = item.title
    }
  })
  editOrderdialogVisible.value = true
}
// 点击确认按钮修改
const editOrdersData = async () => {
  pay.forEach((item) => {
    if (item.title == editOrderform.order_pay) {
      editOrderform.order_pay = String(item.state)
    }
  })
  send.forEach((item) => {
    if (item.title == editOrderform.is_send) {
      editOrderform.is_send = String(item.state)
    }
  })
  const res:any = await editOrders({
    id: Number(editOrderform.id),
    is_send: Number(editOrderform.is_send),
    order_price: Number(editOrderform.order_price),
    order_pay: Number(editOrderform.order_pay)
  })
  // console.log(res)
  if(res.meta.status !== 201) {
    return ElMessage({
      type: 'error',
      message: res.meta.msg
    })
  }
  getOrdersList(pagesize.value, pagenum.value)
  editOrderdialogVisible.value = false
}

</script>

<template>
  <div>
    <Breadcrumb data="订单列表"/>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 订单列表 -->
      <el-table :data="orders" stripe style="width: 100%" border>
        <el-table-column type="index" width="60" label="序号"/>
        <el-table-column prop="order_number" label="订单编号" min-width="300px"/>
        <el-table-column prop="order_price" label="订单价格" min-width="100"/>
        <el-table-column label="付款方式" min-width="100">
          <template #default="scope">
            <el-tag class="ml-2" type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
            <el-tag class="ml-2" v-if="scope.row.order_pay === '1'">支付宝</el-tag>
            <el-tag class="ml-2" type="success" v-if="scope.row.order_pay === '2'">微信支付</el-tag>
            <el-tag class="ml-2" type="info" v-if="scope.row.order_pay === '3'">银行卡</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" min-width="100"/>
        <el-table-column prop="email" label="订单更新时间" min-width="150">
          <template #default="scope">
            <div v-time>{{ scope.row.update_time }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <div class="control">
              <!-- 修改按钮 -->
              <el-button
                  type="primary"
                  icon="EditPen"
                  @click="getOrder(scope.row)"
              >编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
          v-model:currentPage="pagenum"
          v-model:page-size="pagesize"
          :page-sizes="[5, 10, 20, 30]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
      <!-- 编辑订单对话框 -->
      <el-dialog v-model="editOrderdialogVisible" title="编辑订单" width="30%">
        <el-form :model="editOrderform" label-width="100px" ref="editOrderFormRef">
          <el-form-item label="订单价格: ">
            <el-col :span="13">
              <el-input v-model="editOrderform.order_price" />
            </el-col>
          </el-form-item>
          <el-form-item label="支付方式: ">
            <el-select class="m-2" placeholder="Select" v-model="editOrderform.order_pay">
              <el-option
                  v-for="item in pay"
                  :key="item.state"
                  :label="item.title"
                  :value="item.state"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否发货: ">
            <el-select class="m-2" placeholder="Select" v-model="editOrderform.is_send">
              <el-option
                  v-for="item in send"
                  :key="item.state"
                  :label="item.title"
                  :value="item.state"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editOrderdialogVisible = false">取消</el-button>
            <el-button type="primary" @click="editOrdersData">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<style scoped lang="less">

</style>