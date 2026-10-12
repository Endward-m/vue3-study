// ============================================================
// main.js —— 整个项目的「入口文件」
// 浏览器打开网页后，第一个被执行的 JS 文件就是它。
// 第 2 章会逐行讲解这里每一句是什么意思，现在看不懂没关系。
// ============================================================

// 1. 从 vue 里借一个「创建应用」的函数
import { createApp } from 'vue'

// 2. 引入全局样式（第 12 章会讲）
import './style.css'

// 3. 引入根组件 App.vue
import App from './App.vue'

// 4. 引入路由（第 9 章会讲）
import router from './router'

// 5. 引入 Pinia「公共储物柜」（第 10 章会讲）
import { createPinia } from 'pinia'

// 6. 三件事：创建应用 → 装上 Pinia 和路由 → 挂载到 index.html 里的 #app 上
//    use() 就是「装插件」的意思，装的东西越多，能用的能力越多。
//    注意：必须在 mount 之前装好，mount 之后再加就来不及了。
createApp(App).use(createPinia()).use(router).mount('#app')
