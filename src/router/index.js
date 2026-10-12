// ============================================================
// 路由配置：把「网址」和「页面组件」一一对应起来
// 第 9 章会详细讲这里，现在只需要知道：
// 左边侧边栏的每一个菜单，都来自下面 chapters 数组。
// ============================================================

import { createRouter, createWebHistory } from 'vue-router'

export const chapters = [
  { path: '/ch00', no: '00', title: '开始之前', file: () => import('../views/Ch00BeforeStart.vue') },
  { path: '/ch01', no: '01', title: 'JS 前置知识', file: () => import('../views/Ch01JsBasics.vue') },
  { path: '/ch02', no: '02', title: '认识 Vue3', file: () => import('../views/Ch02HelloVue.vue') },
  { path: '/ch03', no: '03', title: '模板语法', file: () => import('../views/Ch03TemplateSyntax.vue') },
  { path: '/ch04', no: '04', title: '响应式核心', file: () => import('../views/Ch04Reactivity.vue') },
  { path: '/ch05', no: '05', title: '计算属性与侦听器', file: () => import('../views/Ch05ComputedWatch.vue') },
  { path: '/ch06', no: '06', title: '组件化基础', file: () => import('../views/Ch06Components.vue') },
  { path: '/ch07', no: '07', title: '组件通信', file: () => import('../views/Ch07PropsEmits.vue') },
  { path: '/ch08', no: '08', title: '生命周期与插槽', file: () => import('../views/Ch08LifecycleSlots.vue') },
  {
    path: '/ch09',
    no: '09',
    title: '路由 Vue Router',
    file: () => import('../views/Ch09Router.vue'),
    // children 就是「嵌套路由」：父页面（第 9 章正文）不动，
    // 只在父页面里的 <router-view /> 那里换人。
    // 注意子路由的 path 不要以 / 开头，不写 / 表示「拼在父路径后面」。
    children: [
      { path: 'nested/:id', component: () => import('../views/router-demo/RouterDemoA.vue') },
      { path: 'other', component: () => import('../views/router-demo/RouterDemoB.vue') },
    ],
  },
  { path: '/ch10', no: '10', title: '状态管理 Pinia', file: () => import('../views/Ch10Pinia.vue') },
  { path: '/ch11', no: '11', title: '与后端交互', file: () => import('../views/Ch11Fetch.vue') },
  { path: '/ch12', no: '12', title: '工程化与进阶', file: () => import('../views/Ch12Advanced.vue') },
]

const routes = [
  { path: '/', redirect: '/ch00' },
  ...chapters.map((c) => ({
    path: c.path,
    component: c.file,
    meta: { title: c.title },
    // 只有第 9 章配了 children，其他章节这里是 undefined，vue-router 会自动忽略
    children: c.children,
  })),
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
