<!-- ============================================================
  App.vue —— 根组件（整个页面的外壳）
  它由三部分组成：
    1. <script setup>  ← 逻辑（JS）
    2. <template>      ← 结构（HTML）
    3. <style>         ← 样式（CSS，本例中用全局 style.css）
  第 2 章会详细讲这三块，现在先感受一下。
============================================================= -->

<script setup>
// 从路由文件里把章节列表拿过来，用于渲染左侧菜单
import { chapters } from './router'
</script>

<template>
  <div class="layout">
    <!-- 左侧：章节导航 -->
    <aside class="sidebar">
      <h2>Vue3 学习路线</h2>
      <nav>
        <!-- router-link 会生成一个 <a> 标签，点击切换页面 -->
        <router-link v-for="c in chapters" :key="c.path" :to="c.path">
          {{ c.no }}. {{ c.title }}
        </router-link>
      </nav>
    </aside>

    <!-- 右侧：当前章节的内容，由路由决定显示哪个组件 -->
    <main class="main">
      <div class="content">
        <router-view />
      </div>
    </main>
  </div>
</template>
