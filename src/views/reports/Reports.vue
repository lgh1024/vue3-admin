<script setup lang="ts">
// 1. 引入 echarts 按需引入
import * as echarts from 'echarts'
import _ from 'lodash'
import {onMounted, reactive} from "vue";
import {getReports} from "../../api/reports";
import {ElMessage} from "element-plus";

let options = reactive({
  title: { text: '用户来源' },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: { backgroundColor: '#E9EEF3' }
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [ { boundaryGap: false } ],
  yAxis: [ { type: 'value' } ]
})

onMounted(async () => {
  // 3. 基于准备好的dom，初始化echarts实例
  let myChart = echarts.init(document.getElementById('main')!)
  const res: any = await getReports()
  // console.log(res)
  if (res.meta.status !== 200) {
    return ElMessage({
      type: 'error',
      message: res.meta.msg
    })
  }
  // 4. 指定图表的配置项和数据
  const result = _.merge(res.data, options)
  // 5. 使用刚指定的配置项和数据显示图表。
  myChart.setOption(result)
})
</script>

<template>
  <div>
    <!--    面包屑导航-->
    <Breadcrumb data="数据报表"/>
    <!--  卡片-->
    <el-card>
      <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 650px;height:300px;"></div>
    </el-card>
  </div>
</template>

<style scoped lang="less">

</style>