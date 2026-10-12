<!--
  Ch06Components.vue —— 第 6 章练习页：组件化基础
  为什么拆组件？
  页面里的「一块界面」如果会被重复使用（比如用户卡片），就把它单独写成一个 .vue 文件。
  好处有三条：
    1. 复用：写一次，用多次；改一次，全都变。
    2. 隔离：卡片自己的结构和样式关在自己文件里，不容易碰坏别的代码。
    3. 好维护：文件小、名字清楚，一眼看懂它在干什么。
  本页就是「一份组件代码 + 三份数据」和「三份重复代码」的对比。
-->
<script setup>
// 从 components 目录引入子组件。
// 路径小知识：本文件在 src/views/ 下，子组件在 src/components/ 下，
// ../ 表示退到上一级（也就是回到 src），再进 components。
// 另外，import 的名字要和标签名对应：import 什么名字，模板里就能写什么标签。
import UserCard from '../components/UserCard.vue'

// 模拟「从接口拿到的 3 个用户」。真实项目里这一步是发请求（第 11 章讲），
// 这里为了让你专注在组件上，直接写成数组。
// 为什么数据里带 color？因为头像不能用外部图片，我们用一个圆形色块代替。
const users = [
  { id: 1, name: '小明', role: '前端实习生', email: 'xiaoming@example.com', color: '#10a37f' },
  { id: 2, name: '小红', role: 'UI 设计师', email: 'xiaohong@example.com', color: '#3b82f6' },
  { id: 3, name: '小刚', role: '产品经理', email: 'xiaogang@example.com', color: '#f59e0b' },
]

// 下面这段字符串是「不拆组件」时的写法（只放 3 个用户，真实项目里可能是 30 个）。
// 用字符串存起来、再用 {{ }} 显示，是为了让 < > 这些标签符号原样显示在页面上，不被当成真的标签。
// 注意：字符串里的 {{ }} 是纯文本，不会被 Vue 当成插值，放心。
const repeatedCode = `<!-- 用户 1 -->
<div class="user-card">
  <div class="avatar">小</div>
  <div class="info">
    <div class="name">小明</div>
    <div class="role">前端实习生</div>
    <div class="email">xiaoming@example.com</div>
  </div>
</div>

<!-- 用户 2 -->
<div class="user-card">
  <div class="avatar">小</div>
  <div class="info">
    <div class="name">小红</div>
    <div class="role">UI 设计师</div>
    <div class="email">xiaohong@example.com</div>
  </div>
</div>

<!-- 用户 3 -->
<div class="user-card">
  <div class="avatar">小</div>
  <div class="info">
    <div class="name">小刚</div>
    <div class="role">产品经理</div>
    <div class="email">xiaogang@example.com</div>
  </div>
</div>

<!-- ……如果列表有 30 个人，上面这一坨就要写 30 遍 -->`

// 这是「拆组件之后」的写法，同样 3 个用户，只需要几行
const componentCode = `<UserCard v-for="u in users" :key="u.id" :user="u" />`
</script>

<template>
  <!-- 页面开头固定格式：标题 + 一句话说明这一章在讲什么 -->
  <h1 class="page-title">第 6 章 · 组件化基础</h1>
  <p class="page-desc">把一个页面拆成一块块积木，每块积木就是一个组件。</p>

  <div class="tip">
    一句话理解：组件就是「HTML + CSS + JS 打包成的函数」。函数是为了复用代码，
    组件是为了复用界面。一个 .vue 文件就是一个组件。
  </div>

  <h2>演示 1：一份组件代码，渲染 3 个不同的用户</h2>
  <p>
    下面 3 张卡片来自同一个 <code>UserCard.vue</code>，长得一模一样是应该的，
    不同的只是传进去的数据。这就是复用的威力。
  </p>

  <div class="demo">
    <div class="demo-label">用 v-for 循环渲染 UserCard，一共 3 张卡片</div>
    <div class="row">
      <!--
        v-for 循环出 3 个 UserCard 组件实例。
        :key="u.id" 是给每个实例一个唯一身份，列表增删时 Vue 才不会认错人。
        :user="u" 是把当前这个用户对象「传进」组件（这是父传子 props，第 7 章细讲）。
      -->
      <UserCard v-for="u in users" :key="u.id" :user="u" />
    </div>
    <p class="muted">
      本页的模板里只写了 1 行组件标签，页面上却出现了 3 张卡片，这就是「写一次，用多次」。
    </p>
  </div>

  <h2>演示 2：组件标签的两种写法</h2>
  <p>
    组件名用 PascalCase（<code>UserCard</code>）来命名，但模板里写
    <code>&lt;UserCard /&gt;</code> 或 <code>&lt;user-card /&gt;</code> 都可以，Vue 会自动对应上。
  </p>

  <div class="demo">
    <div class="demo-label">左边是 PascalCase 写法，右边是 kebab-case 写法，效果完全一样</div>
    <div class="row">
      <!-- 写法一：首字母大写，和 import 的名字一致（推荐，搜索代码时最好找） -->
      <UserCard :user="users[0]" />

      <!-- 写法二：全小写加横线。Vue 会把 user-card 自动匹配到 UserCard 组件 -->
      <user-card :user="users[1]" />
    </div>
  </div>

  <h2>对比：如果不拆组件，代码要重复写几遍？</h2>
  <p>同一个卡片结构，每个用户都要手写一遍（这里只有 3 个用户，已经有 30 多行）：</p>

  <pre><code>{{ repeatedCode }}</code></pre>

  <p>拆成组件后，模板里只需要这一行：</p>

  <pre><code>{{ componentCode }}</code></pre>

  <div class="warn">
    重复代码最可怕的不是「写起来烦」，而是「改起来漏」。
    产品说「头像换成圆形的」，你要在 30 个地方都改到；漏掉一个，页面上就会出现一个方的头像，
    而且很难找出来是哪一个。拆成组件后，改 1 个文件就够了。
  </div>

  <h2>本页涉及的三个知识点</h2>
  <ul>
    <li>
      <strong>一个 .vue 文件就是一个组件</strong>：里面三块分工明确，
      <code>&lt;script setup&gt;</code> 管逻辑，<code>&lt;template&gt;</code> 管样子，
      <code>&lt;style scoped&gt;</code> 管样式（只影响自己）。
    </li>
    <li>
      <strong>import 之后直接当标签用</strong>：用了 <code>&lt;script setup&gt;</code> 不需要再写
      <code>components: { ... }</code> 去注册，import 进来就能用。
    </li>
    <li>
      <strong>组件里可以再放组件</strong>：就像积木能拼积木。
      判断什么时候该拆：某段界面你「复制粘贴第二次了」，就该把它变成组件。
    </li>
  </ul>

  <div class="tip">
    动手练习：把 <code>src/components/UserCard.vue</code> 里的
    <code>.avatar</code> 的 <code>border-radius</code> 从 50% 改成 8px，
    保存后回到本页看，3 张卡片的头像会一起变方——这就是「改一处，处处生效」。
  </div>
</template>
