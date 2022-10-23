import {createApp} from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router'
// 引入所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入全局组件
import Breadcrumb from './components/Breadcrumb.vue'
// 时间过滤器
import {useDirective} from "./directives";

const app = createApp(App)
// 时间过滤器
useDirective(app)
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 注册全局组件
app.component('Breadcrumb', Breadcrumb)
app.use(router)
app.mount('#app')
