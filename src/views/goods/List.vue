<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {getGoods, deleteGoods, getCategories, putGoods, editGoodsFromId} from "../../api/goods";
import {ElMessage} from "element-plus";
import {addGoodsFormRules} from "../../utils/formRules";
import {AGoods, EGoods} from "./type";

// 查询关键词
let query = ref<string>('')
// 每页显示条数
let pagesize = ref<number>(10)
// 当前页码
let pagenum = ref<number>(1)
// 控制添加用户对话框的显示
const addGoodsdialogVisible = ref<boolean>(false)
// 商品数据列表
let goods = ref<Array<object>>([])
// 数据总条数
let total = ref<number>(0)

const addGoodsForm = reactive<AGoods>({
  goods_name: '',
  goods_price: null!,
  goods_weight: null!,
  goods_number: null!,
  goods_introduce: '',
  goods_cat: ''
})
// 添加用户表单的ref
const addGoodsRef = ref()
// 添加商品的规则
const addGoodsRules = reactive(addGoodsFormRules)
// 联级选择框数据
const categories = ref<Array<any>>([])
// 联级选择框的规则
const cascaderProps = {
  value: 'cat_id',
  label: 'cat_name',
  children: 'children',
  expandTrigger: 'hover'
}
// 联级选择框绑定的数组
let selectKeys = ref<Array<any>>([])
// 控制编辑用户对话框的显示
const editGoodsdialogVisible = ref<boolean>(false)
// 编辑用户表单
const editGoodsform = reactive<EGoods>({
  id: 0,
  goods_name: '',
  goods_price: 0,
  goods_number: 0,
  goods_weight: 0
})
// 编辑用户表单的ref
const editGoodsFormRef = ref()
//编辑用户表单规则
const editGoodsRules = reactive(addGoodsFormRules)

onMounted(() => {
  getGoodsList(pagenum.value, pagesize.value)
  getCategoriesData()
})

// 获取列表数据
const getGoodsList = async (pagenum: number, pagesize: number, query?: string) => {
  const res: any = await getGoods({pagenum, pagesize, query})
  // console.log(res)
  if (res.meta.status !== 200) {
    return ElMessage({
      type: 'error',
      message: res.meta.msg
    })
  }
  goods.value = res.data.goods
  total.value = res.data.total
}
//查询商品
const searchGoods = () => {
  if (query.value === '') {
    getGoodsList(pagenum.value, pagesize.value)
  }
  getGoodsList(pagenum.value, pagesize.value, query.value)
}
// 重置搜索表单
const resetForm = () => {
  query.value = ''
  getGoodsList(pagenum.value, pagesize.value)
}
// 删除商品
const deleteGoodsData = (id: number) => {
  ElMessageBox.confirm(`确认删除该商品吗`, '删除商品', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res: any = await deleteGoods(id)
    // console.log(res)
    setTimeout(() => {
      getGoodsList(pagenum.value, pagesize.value)
      ElMessage({
        type: 'success',
        message: res.meta.msg
      })
    }, 100)
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除'
    })
  })
}
//每页显示条数改变触发
const handleSizeChange = (newPageSize: number) => {
  getGoodsList(pagenum.value, newPageSize)
  pagesize.value = newPageSize
}
//页码改变触发
const handleCurrentChange = (newPageNum: number) => {
  getGoodsList(newPageNum, pagesize.value)
  pagenum.value = newPageNum
}
//联级选择框选择回调
const handleCascaderchange = (newKeys: any) => {
  selectKeys.value = newKeys
  addGoodsForm.goods_cat = newKeys.join(',')
}
// 获取联级选择框数据
const getCategoriesData = async () => {
  const res: any = await getCategories()
  // console.log(res)
  if (res.meta.status !== 200) {
    return ElMessage({
      type: 'error',
      message: res.meta.msg
    })
  }
  categories.value = res.data
}
// 添加商品列表数据
const putGoodsList = async () => {
  const res: any = await putGoods(addGoodsForm)
  // console.log(res)
  if (res.meta.status !== 201) {
    return ElMessage({
      type: 'error',
      message: res.meta.msg
    })
  }
  getGoodsList(pagenum.value, pagesize.value)
  addGoodsdialogVisible.value = false
  addGoodsRef.value!.resetFields()
  ElMessage({
    type: 'success',
    message: res.meta.msg
  })
}
// 点击编辑按钮获得用户信息
const editGetGoods = (goods_name: string, goods_price: number, goods_weight: number, goods_number: number, id: number) => {
  editGoodsdialogVisible.value = true
  editGoodsform.goods_name = goods_name
  editGoodsform.goods_price = goods_price
  editGoodsform.goods_number = goods_number
  editGoodsform.goods_weight = goods_weight
  editGoodsform.id = id
}
// 点击确认编修改用户信息
const editGoods = () => {
  editGoodsFormRef.value.validate(async (isValidate: boolean) => {
    if (!isValidate) return
    const res: any = await editGoodsFromId(editGoodsform)
    // console.log(res)
    if (res.meta.status !== 201) {
      return ElMessage({
        type: 'error',
        message: res.meta.msg
      })
    }
    getGoodsList(pagenum.value, pagesize.value)
    ElMessage({
      type: 'success',
      message: res.meta.msg
    })
    editGoodsdialogVisible.value = false
  })
}
</script>

<template>
  <div>
    <!-- 面包屑导航区 -->
    <Breadcrumb data="商品列表"/>
    <!-- 卡片区域  -->
    <el-card>
      <!--头部区域-->
      <div class="card-header">
        <!--搜索表单-->
        <el-form style="min-width: 400px">
          <el-row :gutter="20">
            <el-col :span="13">
              <el-form-item>
                <el-input placeholder="请输入商品名称" width="200px" v-model.number="query"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-button type="primary" icon="Search" @click="searchGoods">查询</el-button>
              <el-button style="margin-left: 3px" icon="Refresh" @click="resetForm">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <!-- 添加用户-->
        <el-button
            type="primary"
            @click="addGoodsdialogVisible = true"
        >
          添加商品
        </el-button>
      </div>
      <!-- 列表区域-->
      <el-table :data="goods" stripe style="width: 100%" border>
        <el-table-column type="index" width="60" label="序号"/>
        <el-table-column prop="goods_name" label="商品名称" min-width="600"/>
        <el-table-column prop="goods_price" label="商品价格" min-width="90"/>
        <el-table-column prop="goods_number" label="商品数量" min-width="90"/>
        <el-table-column label="操作" width="130">
          <template #default="scope">
            <div class="control">
              <!-- 修改按钮 -->
              <el-button
                  type="primary"
                  icon="EditPen"
                  @click="editGetGoods(scope.row.goods_name, scope.row.goods_price, scope.row.goods_number, scope.row.goods_weight, scope.row.goods_id)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                  type="danger"
                  icon="Delete"
                  @click="deleteGoodsData(scope.row.goods_id)"
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
          v-model:currentPage="pagenum"
          v-model:page-size="pagesize"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="pagination"
      />
      <!-- 添加商品的对话框-->
      <el-dialog
          v-model="addGoodsdialogVisible"
          title="添加商品"
          width="50%"
      >
        <el-form
            :inline="true"
            :model="addGoodsForm"
            :rules="addGoodsRules"
            label-position="top"
            ref="addGoodsRef"
        >
          <el-tabs tab-position="left">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addGoodsForm.goods_name" />
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addGoodsForm.goods_price" type="number" min="0" />
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addGoodsForm.goods_weight" type="number" min="0" />
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addGoodsForm.goods_number" type="number" min="0" />
              </el-form-item>
              <el-form-item label="商品分类">
                <el-cascader
                    :options="categories"
                    :props="cascaderProps"
                    @change="handleCascaderchange"
                />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
              <el-button @click="addGoodsdialogVisible = false">取消</el-button>
              <el-button type="primary" @click="putGoodsList"
              >确定</el-button
              >
            </span>
        </template>
      </el-dialog>
      <!-- 编辑用户对话框 -->
      <el-dialog v-model="editGoodsdialogVisible" title="编辑用户" width="40%">
        <el-form
            :model="editGoodsform"
            label-width="80px"
            :rules="editGoodsRules"
            ref="editGoodsFormRef"
        >
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editGoodsform.goods_name"/>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editGoodsform.goods_price"/>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editGoodsform.goods_number"/>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editGoodsform.goods_weight"/>
          </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
          <el-button @click="editGoodsdialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editGoods">确认</el-button>
        </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<style scoped lang="less">
</style>