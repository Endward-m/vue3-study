<!-- ============================================================
  RouterDemoB.vue —— 嵌套路由的子页面 B

  和 RouterDemoA.vue 是一对，注册路径是 /ch09/other。
  切换 A / B 的时候，父组件 Ch09Router 不会重新创建，只有 router-view 里换人。

  动手小实验：在 src/router/index.js 里把本文件这条路由删掉，
  再刷新 /ch09/other，就能看到「地址没人管 → 内容区空白」是什么样子。
============================================================= -->

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 和 A 一样，点按钮回到第 9 章
// 对比一下：A 用的是 push，你也可以把它改成 replace 试试区别
function goBack() {
  router.push('/ch09')
}
</script>

<template>
  <div class="card">
    <h3>子页面 B</h3>
    <p>我是嵌套路由里的子页面 B，和 A 长得像，但它们是两个不同的组件。</p>
    <p class="muted">切换 A / B 的时候，父组件不会重新创建，只有 router-view 里换人。</p>
    <div class="row">
      <button class="btn btn-ghost" @click="goBack">返回第 9 章</button>
    </div>
  </div>
</template>
