<!-- ============================================================
  第 9 章 · 路由 Vue Router —— 练习页

  这个页面干三件事：
    1. 把「当前路由信息」全部显示出来（用 useRoute 读）
    2. 用按钮练习编程式导航（用 useRouter 跳）
    3. 用代码块展示本项目真实路由表长什么样，以及嵌套路由该怎么加

  注意：本页只是「看和玩」，不会去修改 src/router/index.js。
============================================================= -->

<script setup>
// useRoute：读当前路由信息（只读，相当于「看一眼现在在哪儿」）
// useRouter：拿到路由器实例（用来「主动跳转」）
// 这两个名字差一个 r，最容易记混：带 r 的能开车，不带 r 的只能看路牌
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

// route.query 是一个对象，直接放到模板里会显示成 [object Object]，
// 所以转成 JSON 字符串，看得清楚一点
const queryText = computed(() => {
  const keys = Object.keys(route.query)
  // 没有查询参数时给个提示，免得读者以为程序坏了
  return keys.length === 0 ? '（空的。点下面的「带 query 跳转」就有了）' : JSON.stringify(route.query)
})

// params 同理：/ch09 这条路由本身没有 :参数，所以现在一定是空的。
// 想看到它有值，就点演示 3 里那个 /ch09/nested/42 的链接（第 9 章配了一条嵌套路由）
const paramsText = computed(() => {
  const keys = Object.keys(route.params)
  return keys.length === 0 ? '（空的。当前 /ch09 这条路由没有定义 :参数）' : JSON.stringify(route.params)
})

// ---------- 编程式导航：四种常见跳法 ----------

// 1) push：去新页面，会在浏览器历史里留一条记录（能后退回来）
function goCh11() {
  router.push('/ch11')
}

// 2) push + query：跳转时顺手带上一点信息
//    跳完地址栏会变成 /ch09?from=button&time=...，上面「query」那一行就能看到
function goWithQuery() {
  router.push({ path: '/ch09', query: { from: 'button', time: Date.now() } })
}

// 3) replace：跳转但不留历史记录。用完浏览器「后退」回不到这里，
//    适合「登录成功后跳首页」这种不想让用户退回去的场景
function goReplaceCh12() {
  router.replace('/ch12')
}

// 4) go(-1)：后退一步，等于点了浏览器的前进/后退箭头
//    如果用户是直接输网址进来的，后退可能跑到站外去，所以别乱用
function goBack() {
  router.go(-1)
}
</script>

<template>
  <h1 class="page-title">第 9 章 · 路由 Vue Router</h1>
  <p class="page-desc">路由就是一张「网址 → 页面组件」的对照表，换页不刷新整页。</p>

  <!-- ============================================================
       演示一：读当前路由信息
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 1 · 用 useRoute() 读当前路由信息</div>

    <!-- route 是响应式的，地址一变这里就跟着变，不用手动刷新 -->
    <p>
      当前网址（fullPath）：<span class="mono">{{ route.fullPath }}</span>
    </p>
    <p>
      路径（path）：<span class="mono">{{ route.path }}</span>
    </p>
    <p>
      路由名字（name）：<span class="mono">{{ route.name === undefined ? '（本项目的路由没有取名字）' : route.name }}</span>
    </p>
    <p>
      动态参数（params）：<span class="mono">{{ paramsText }}</span>
    </p>
    <p>
      查询参数（query）：<span class="mono">{{ queryText }}</span>
    </p>
    <p>
      附加信息（meta）：<span class="mono">{{ JSON.stringify(route.meta) }}</span>
    </p>

    <p class="muted">
      小实验：直接在浏览器地址栏最后加上 <code>?debug=1</code> 然后回车，
      你会看到「查询参数」那一行立刻冒出来了。（query 就是不参与路由匹配的额外小纸条）
    </p>
  </div>

  <!-- ============================================================
       演示二：编程式导航（用代码跳转）
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 2 · 用 useRouter() 主动跳转</div>

    <div class="row">
      <!-- 点击会跳到第 11 章。注意看地址栏的变化，以及左侧菜单的高亮 -->
      <button class="btn" @click="goCh11">push 去第 11 章</button>

      <!-- 跳到自己并带上 query，重点看上面的「查询参数」 -->
      <button class="btn btn-ghost" @click="goWithQuery">带 query 跳转</button>

      <!-- replace 不留历史记录，跳走之后浏览器后退回不到这里 -->
      <button class="btn btn-ghost" @click="goReplaceCh12">replace 去第 12 章</button>

      <!-- go(-1) 等于点了后退键 -->
      <button class="btn btn-ghost" @click="goBack">后退一步 go(-1)</button>
    </div>

    <p class="muted">
      push 和 replace 的唯一区别就是「要不要留历史记录」，其他都一样。
      你可以点「push 去第 11 章」再点浏览器后退：能回来；换成 replace 就回不来了。
    </p>
  </div>

  <!-- ============================================================
       演示三：声明式导航（用标签跳）
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 3 · 用 router-link 声明式跳转</div>

    <div class="row">
      <!-- router-link 最终会渲染成一个 <a> 标签，
           但它会拦住默认的整页跳转，改成用 JS 换组件 -->
      <router-link to="/ch10">去第 10 章（Pinia）</router-link>

      <!-- 下面这个地址是「嵌套路由」：
           父页面（本页）完全不动，只有页尾那个 <router-view /> 里换成子页面 -->
      <router-link to="/ch09/nested/42">去 /ch09/nested/42（子路由，带参数 42）</router-link>
    </div>

    <div class="tip">
      第二个链接指向 <code>/ch09/nested/42</code>，它已经在
      <code>src/router/index.js</code> 里注册成了一条 <strong>嵌套路由</strong>。
      点它之后本页正文不会消失，只有页尾那个 <code>&lt;router-view /&gt;</code> 里会换成子页面。
      跳过去以后记得往上看一眼「动态参数（params）」那一行，会变成 <code>{"id":"42"}</code>——
      这就是网址里的 <code>:id</code> 那个「坑」被填进去的值。
    </div>
  </div>

  <!-- ============================================================
       演示四：本项目的真实路由表
       ============================================================ -->
  <h2>本项目路由表长什么样</h2>

  <p>
    打开 <code>src/router/index.js</code>，你会看到 <code>routes</code> 就是那张对照表。
    下面按「一条一条写」的方式把它拆开看（真实文件里用了数组映射，写法更省事）：
  </p>

  <!-- pre 用来显示代码。加 v-pre 是告诉 Vue「这里别当模板编译」，
       这样里面的花括号和标签会原样显示出来，而不是被当成数据去解析 -->
  <pre v-pre><code>// 从 vue-router 里借两个工具
import { createRouter, createWebHistory } from 'vue-router'

// routes 就是「网址 → 组件」的对照表，一个对象一条规则
const routes = [
  // redirect：访问根路径时直接跳到 /ch00，避免打开网站看到空白
  { path: '/', redirect: '/ch00' },

  // 普通路由：网址 /ch09 就显示 Ch09Router 这个组件
  { path: '/ch09', component: () =&gt; import('../views/Ch09Router.vue'), meta: { title: '路由' } },

  // 懒加载写法 () =&gt; import(...)：用到时才下载这段代码，首屏更快
  // meta 是自己贴的便利贴，路由守卫可以读它（比如标记「需要登录」）
]

// 组装成路由器：history 决定网址的样子，routes 就是上面的表
const router = createRouter({
  history: createWebHistory(), // 网址干净的 /ch09 形式；另一种是带 # 的 hash 模式
  routes,
})

export default router // 导出给 main.js，在那边 app.use(router) 才算装好
</code></pre>

  <p>
    文件位置记牢：<code>src/router/index.js</code>；
    装到应用上的地方是 <code>src/main.js</code> 里的 <code>createApp(App).use(router)</code>。
    左边侧边栏的每个菜单项，都是 <code>App.vue</code> 里用 <code>router-link</code> 循环渲染出来的，
    右边的内容区则是一个 <code>router-view</code>——门和房间的分工。
  </p>

  <!-- ============================================================
       演示五：动态路由 / 嵌套路由 / 404 的写法（只讲不跑）
       ============================================================ -->
  <h2>动态路由、嵌套路由、404 怎么写</h2>

  <div class="demo">
    <div class="demo-label">动态路由：一条规则匹配无数个网址</div>
    <p>网址里的冒号段落就是一个「坑」，能装任意内容：</p>
    <pre v-pre><code>// /user/1、/user/2、/user/100 都会匹配到 UserDetail
{ path: '/user/:id', component: UserDetail }

// 组件里这样把坑里的值取出来：
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.params.id)   // 访问 /user/42 时得到 "42"（注意是字符串）
</code></pre>
    <p class="muted">
      坑点：从 /user/1 跳到 /user/2 时，用的是同一个组件，Vue 会复用它而不重新创建，
      所以 onMounted 不会执行第二次。要监听参数变化得用 watch。
    </p>
  </div>

  <div class="demo">
    <div class="demo-label">嵌套路由：页面里再套页面（父组件框架不动，只有里面换）</div>
    <pre v-pre><code>{
  path: '/ch09',
  component: Ch09Router,      // 外层框架
  children: [
    // 子路由的 path 不要以 / 开头！不写 / 表示「拼在父路径后面」
    // 最终匹配：/ch09/nested/42
    { path: 'nested/:id', component: RouterDemoA },
    { path: 'other', component: RouterDemoB },
  ],
}
</code></pre>
    <p class="tip">
      上面这段配置在本项目里<strong>已经写好了</strong>：打开
      <code>src/router/index.js</code>，看第 9 章那一条，就能找到
      <code>children</code>、<code>nested/:id</code> 和 <code>other</code> 两个子路由。
      对应的组件放在 <code>src/views/router-demo/</code> 下（RouterDemoA.vue / RouterDemoB.vue）。
    </p>
    <p class="muted">
      动手作业：对着这段代码，把 <code>children</code> 里那条 <code>other</code> 删掉试试，
      然后访问 <code>/ch09/other</code>——你会发现「地址变了但内容区空了」，
      因为那个地址已经没人管了。改坏了不要紧，加回来就行。
    </p>
    <p class="muted">
      提示：给父路由加 children 之后，想让子页面真的显示出来，父组件模板里必须再放一个
      <code>&lt;router-view /&gt;</code>——本页末尾那个就是干这个用的。
    </p>
  </div>

  <div class="demo">
    <div class="demo-label">404 兜底页</div>
    <pre v-pre><code>// 放在 routes 数组的最后一条！
// 因为它能匹配「任何路径」，放前面会把其他路由全吃掉
{ path: '/:pathMatch(.*)*', name: 'notFound', component: NotFoundPage }
</code></pre>
  </div>

  <div class="demo">
    <div class="demo-label">路由守卫：门口的保安</div>
    <pre v-pre><code>router.beforeEach((to, from) =&gt; {
  const isLoggedIn = !!localStorage.getItem('token')

  // 想去需要登录的页面，但没登录 → 改道去登录页
  if (to.meta.requiresAuth &amp;&amp; !isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  return true   // 放行
})
</code></pre>
    <p class="muted">
      meta 是你自己贴的便利贴（比如 <code>meta: { requiresAuth: true }</code>），
      守卫就是照着便利贴做检查的保安。这是最经典的「登录拦截」写法。
    </p>
  </div>

  <!-- ============================================================
       演示六：子路由的「坑位」
       ============================================================ -->
  <h2>演示 6 · 子路由显示在这里</h2>
  <p>
    下面这块就是一个 <code>&lt;router-view /&gt;</code>，专门用来显示「子路由」的页面。
    去看演示 3，点一下 <code>/ch09/nested/42</code>：上面的正文不会消失，只有下面这块会换成子页面。
  </p>

  <div class="demo">
    <div class="demo-label">子路由出口：当前地址没匹配到子路由时，这里就是空的</div>
    <router-view />
    <p class="muted">
      空白是正常的——「没有子页面要显示」和「页面坏了」是两回事。
      这也是排查路由问题的第一个思路：先看地址有没有匹配上。
    </p>
  </div>

  <div class="tip">
    本章笔记：<code>notes/09-路由VueRouter.md</code>。
    建议的动手顺序：先按上面的作业把 children 改一改，再试着加一条 404 兜底路由，
    最后给某条路由加个守卫，打印一下 to 和 from。
  </div>
</template>
