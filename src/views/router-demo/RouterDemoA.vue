<!-- ============================================================
  RouterDemoA.vue —— 嵌套路由的子页面 A

  它在 src/router/index.js 里被注册成了 /ch09 的子路由：
      { path: 'nested/:id', component: () => import('../views/router-demo/RouterDemoA.vue') }

  于是 /ch09/nested/42 这个地址会这样渲染：
      App.vue 的 router-view  → Ch09Router（第 9 章正文）
        └── 正文末尾的 router-view → RouterDemoA（就是本文件）

  想亲手感受路由配置，最好的办法是回到 src/router/index.js 改一改，再刷新试试。
============================================================= -->

<script setup>
// 用 useRouter 拿到「路由器」，才能靠代码主动跳转
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回按钮：直接跳回第 9 章。
// 这里不用 go(-1) 是因为「后退一步」依赖用户的浏览历史，
// 如果用户是直接打开这个地址进来的，go(-1) 可能会跑到站外去。
function goBack() {
  router.push('/ch09')
}
</script>

<template>
  <div class="card">
    <h3>子页面 A</h3>
    <p>我是嵌套路由里的子页面 A，内容会显示在父级的 router-view 里。</p>
    <p class="muted">如果你能在 /ch09/nested/42 这个地址下看到我，说明你的路由注册成功啦。</p>
    <div class="row">
      <button class="btn btn-ghost" @click="goBack">返回第 9 章</button>
    </div>
  </div>
</template>
