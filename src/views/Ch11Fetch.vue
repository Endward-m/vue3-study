<!-- ============================================================
  第 11 章 · 与后端交互 —— 练习页

  这里用的全部是 src/api/mock.js 里的「假接口」，
  不会发出任何真实网络请求，断网也能正常玩。

  页面分三块：
    1. 三态演示：loading / error / data（可手动模拟失败）
    2. 用 fetchUser 演示「请求成功但查不到数据」也算错误
    3. 「请求还没回来，组件就卸载了」会发生什么（能真实看到证据）
============================================================= -->

<script setup>
import { ref, onUnmounted } from 'vue'
// 引入本地假接口：一个查列表，一个查用户
import { fetchTodos, fetchUser } from '../api/mock'

// ============================================================
// 第一部分：三态演示（loading / error / data）
// ============================================================

const loading = ref(false) // 正在请求中
const error = ref('') // 错误信息，空字符串代表没错误
const todos = ref([]) // 真正的数据
const simulateFail = ref(false) // 勾上就故意让请求失败，方便看错误长什么样

async function loadTodos() {
  loading.value = true
  error.value = '' // 每次重试前先清掉上次的错误，否则会显示过期信息

  try {
    // await 之后要等 800ms 才会继续往下执行，这期间 loading 是 true
    todos.value = await fetchTodos({
      fail: simulateFail.value, // 假接口支持「故意失败」
      delay: 800,
    })
  } catch (e) {
    // 请求失败只负责「记下错误」，怎么展示交给模板去判断
    error.value = e.message
    todos.value = []
  } finally {
    // finally 里关 loading：不管成功还是失败都一定会执行
    // 如果写在 try 末尾，一旦失败就会永远转圈
    loading.value = false
  }
}

// ============================================================
// 第二部分：请求「成功」但业务上没找到数据
// ============================================================

const userId = ref(1)
const user = ref(null)
const userError = ref('')
const userLoading = ref(false)

async function loadUser() {
  userLoading.value = true
  userError.value = ''
  user.value = null

  try {
    // 注意要传数字：输入框 v-model.number 会把内容转成数字
    user.value = await fetchUser(userId.value)
  } catch (e) {
    // mock 里「查不到用户」也是走 reject，所以这里能统一接住
    userError.value = e.message
  } finally {
    userLoading.value = false
  }
}

// ============================================================
// 第三部分：「请求还没回来，组件就卸载了」
//
// 场景：用户点了一个 3 秒的请求，等不及，切到别的章节去了。
// 这时组件被卸载，但 Promise 还在跑；3 秒后数据回来，
// 代码还在执行 todos.value = ...，可那个 ref 已经没人看了。
//
// 为了让你「离开页面再回来还能看到发生了什么」，
// 我们把日志存进 localStorage（它不会随组件卸载而消失）。
// ============================================================

const LOG_KEY = 'ch11-unmount-demo-log'

// 读取上次留下的日志（加 try 是为了防止本地存了坏数据导致整页崩掉）
function readLogs() {
  try {
    const raw = localStorage.getItem(LOG_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

const logs = ref(readLogs())

function pushLog(text) {
  // 只留最近 6 条，免得日志无限增长
  logs.value = [...logs.value, text].slice(-6)
  localStorage.setItem(LOG_KEY, JSON.stringify(logs.value))
}

function clearLogs() {
  logs.value = []
  localStorage.removeItem(LOG_KEY)
}

// 这个变量的作用是「我还活着吗」，每个组件实例各有一份（不是共享的）
let isMounted = true

// 组件卸载时把旗子放倒
onUnmounted(() => {
  isMounted = false
})

async function startLongRequest() {
  pushLog('发起了一次要 3 秒的请求……')
  const data = await fetchTodos({ delay: 3000 })

  // 关键判断：如果组件已经卸载，就别再更新状态，直接收工
  if (!isMounted) {
    pushLog(`请求回来了（拿到 ${data.length} 条），但组件已卸载：这次更新的状态没人看得到`)
    return
  }

  pushLog(`请求回来了（拿到 ${data.length} 条），组件还在，正常更新数据`)
}
</script>

<template>
  <h1 class="page-title">第 11 章 · 与后端交互</h1>
  <p class="page-desc">前端发 HTTP 请求，后端回一段 JSON；要等数据的地方，永远记得处理三态。</p>

  <div class="tip">
    本页全部使用 <code>src/api/mock.js</code> 里的本地假接口（用 <code>setTimeout</code> 假装网络延迟），
    <strong>不会发出任何真实网络请求</strong>，所以断网也能练。
    本项目没有安装 axios，所以演示统一用浏览器自带的 <code>fetch</code> 思路来写。
  </div>

  <!-- ============================================================
       演示一：三态处理
       ============================================================ -->
  <h2>演示 1 · loading / error / data 三态</h2>

  <div class="demo">
    <div class="demo-label">点按钮 → 显示加载中 → 成功出列表 / 失败出错误和重试按钮</div>

    <div class="row">
      <button class="btn" :disabled="loading" @click="loadTodos">
        {{ loading ? '加载中…' : '加载待办' }}
      </button>

      <!-- 勾上以后请求一定会失败，用来观察 error 状态长什么样 -->
      <label class="muted">
        <input v-model="simulateFail" type="checkbox" />
        模拟请求失败
      </label>
    </div>

    <!-- 状态一：加载中。用 v-if / v-else-if / v-else 保证同一时刻只显示一种 -->
    <p v-if="loading" class="muted">加载中，请稍等（假接口故意延迟了 800ms）…</p>

    <!-- 状态二：出错。这里必须给「重试」按钮，否则用户只能干瞪眼 -->
    <div v-else-if="error">
      <p style="color: #c0392b">出错了：{{ error }}</p>
      <button class="btn btn-ghost" @click="loadTodos">重试</button>
    </div>

    <!-- 状态三：有数据 -->
    <div v-else-if="todos.length">
      <ul>
        <li v-for="item in todos" :key="item.id">
          <span :style="{ textDecoration: item.done ? 'line-through' : 'none' }">{{ item.title }}</span>
          <span class="muted">{{ item.done ? ' 已完成' : ' 未完成' }}</span>
        </li>
      </ul>
    </div>

    <!-- 还没点过按钮时的初始状态，也要给个交代，别让页面空着 -->
    <p v-else class="muted">还没有数据，点上面的「加载待办」试试。</p>
  </div>

  <div class="warn">
    两个关于 <code>fetch</code> 的重点（虽然本页没真发请求，但道理一样）：
    <br />
    1. <code>await fetch(url)</code> 拿到的只是「响应对象」，还要再 <code>await res.json()</code> 才是数据；
    <br />
    2. <code>fetch</code> <strong>不会</strong>因为 404 / 500 抛错，必须自己判断 <code>res.ok</code>。
  </div>

  <!-- ============================================================
       演示二：查一个不存在的用户
       ============================================================ -->
  <h2>演示 2 · 「请求成功」但查不到数据也是错误</h2>

  <div class="demo">
    <div class="demo-label">假接口里只有 1、2、3 号用户，输入别的数字就会失败</div>

    <div class="row">
      <!-- v-model.number 会把输入转成数字，省得自己 Number() -->
      <input v-model.number="userId" type="number" style="width: 90px" />
      <button class="btn" :disabled="userLoading" @click="loadUser">
        {{ userLoading ? '查询中…' : '查询用户' }}
      </button>
    </div>

    <p v-if="userLoading" class="muted">查询中…</p>
    <div v-else-if="userError">
      <p style="color: #c0392b">{{ userError }}</p>
      <p class="muted">真实后端查不到东西时，通常返回 404，前端就应该走错误分支，而不是硬着头皮渲染。</p>
    </div>
    <p v-else-if="user">
      <span class="mono">{{ user.name }}</span> ·
      <span class="mono">{{ user.age }}</span> 岁 ·
      来自 <span class="mono">{{ user.city }}</span>
    </p>
    <p v-else class="muted">还没查询。</p>
  </div>

  <!-- ============================================================
       演示三：组件卸载与未完成的请求
       ============================================================ -->
  <h2>演示 3 · 请求还没回来，组件就卸载了</h2>

  <div class="demo">
    <div class="demo-label">操作步骤：点下面的按钮 → 立刻点左边侧边栏的其他章节 → 再切回来</div>

    <div class="row">
      <button class="btn" @click="startLongRequest">发起一次 3 秒的请求</button>
      <button class="btn btn-ghost" @click="clearLogs">清空日志</button>
    </div>

    <p class="muted">
      日志存在 localStorage 里（所以离开页面再回来还看得到）：
    </p>

    <p v-if="logs.length === 0" class="muted">（暂时没有日志）</p>
    <ul v-else>
      <li v-for="(line, index) in logs" :key="index">
        <span class="mono">{{ line }}</span>
      </li>
    </ul>

    <div class="tip">
      如果第三步里出现「组件已卸载」那句，说明你亲眼看到了这个现象：
      数据回来了，但组件早就不在了。不会报大错，只是白干一场，
      而且如果后面还接着别的逻辑（比如弹提示），就会莫名其妙地弹出来。
      <br />
      这也是为什么真实项目里会用 <code>AbortController</code> 主动取消请求，
      或者像本页这样用 <code>isMounted</code> 旗子判断一下再更新状态。
    </div>
  </div>

  <pre v-pre><code>// 本页「安全写法」的核心就三行：
let isMounted = true
onUnmounted(() =&gt; { isMounted = false })

const data = await fetchTodos()
if (!isMounted) return   // 组件走了就别再更新状态
todos.value = data
</code></pre>

  <div class="tip">
    本章笔记：<code>notes/11-与后端交互.md</code>。
    里面还讲了 axios 的等价写法、用 <code>request()</code> 统一封装、
    <code>.env</code> 环境变量，以及跨域和 Vite 的 <code>server.proxy</code>。
  </div>
</template>
