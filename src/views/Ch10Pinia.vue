<!-- ============================================================
  第 10 章 · 状态管理 Pinia —— 练习页

  本项目已经在 src/main.js 里把 Pinia 注册好了，所以本页可以直接用：

      import { createPinia } from 'pinia'
      createApp(App).use(createPinia()).use(router).mount('#app')

  但你必须知道「为什么少了这一步就不行」：
    - 没有它，useCounterStore() 会直接抛错（报错大致是
      getActivePinia() was called but there was no active Pinia）
    - 下面用 try/catch 兜住了这种情况，所以万一没注册页面也不会白屏，
      而是显示一段友好提示，告诉你该去 main.js 加哪两行

  动手作业：打开 src/main.js，把 .use(createPinia()) 这一段注释掉，
  保存刷新本页，亲眼看一次「忘了注册是什么样」，然后记得加回来。
============================================================= -->

<script setup>
// storeToRefs：把 store 里的数据「转成 ref」，解构后依然保持响应式
// 注意：它只用来解构「数据」，方法要直接解构
import { storeToRefs } from 'pinia'

// 我们自己写的仓库，放在 src/stores/counter.js
import { useCounterStore } from '../stores/counter'

// ------------------------------------------------------------
// 关键：Pinia 没注册时，useCounterStore() 会抛错，
// 所以我们用 try/catch 包住，失败就把 store 设为 null，
// 模板那边用 v-if 判断，给出友好提示而不是白屏。
// ------------------------------------------------------------
let store = null
let storeError = ''

try {
  store = useCounterStore()
} catch (e) {
  store = null
  // 把原始报错也存下来，方便你确认「确实是没注册 Pinia」
  storeError = e.message
}

// 下面这几个是要给模板用的「响应式数据」
// 声明在 if 外面，是为了让模板无论在哪种情况下都能安全访问到变量名
let count
let double
let history

if (store) {
  // storeToRefs 必须在拿到 store 之后调用
  // 它的作用：不解构会丢响应式，用了它就能保留响应式
  const refs = storeToRefs(store)
  count = refs.count
  double = refs.double
  history = refs.history
}

// 反面教材：直接解构 store 会得到一个「快照」，永远不会再变
// 这里刻意保留它，就是为了让你在页面上亲眼看到「它一直是 0」。
// 注意它必须是普通变量，如果写成 ref 就失去演示意义了。
const snapshotCount = store ? store.count : null
</script>

<template>
  <h1 class="page-title">第 10 章 · 状态管理 Pinia</h1>
  <p class="page-desc">Pinia 是「公共储物柜」：多个组件共享同一份数据，谁改了大家都看得到。</p>

  <!-- ============================================================
       没装 Pinia 时显示这一段
       ============================================================ -->
  <div v-if="!store">
    <div class="warn">
      <p>
        <strong>
          检测到 Pinia 还没有被注册，所以下面的演示暂时用不了。
          （你是不是把 main.js 里的 .use(createPinia()) 注释掉了？）
        </strong>
      </p>
      <p>请打开 <code>src/main.js</code>，加两行：</p>
      <pre v-pre><code>// 1) 顶部导入
import { createPinia } from 'pinia'

// 2) 挂载前先 use 一下（顺序：先 Pinia 再 router 都可以，但都得在 mount 之前）
createApp(App).use(createPinia()).use(router).mount('#app')
</code></pre>
      <p>保存后浏览器会自动刷新，这个提示就会消失。</p>
      <p class="muted">原始报错信息（可用于确认原因）：{{ storeError }}</p>
    </div>

    <div class="tip">
      为什么会抛错？因为 store 必须依附在一个「已安装的 Pinia 实例」上。
      <code>createPinia()</code> 是把储物柜搬进房间，<code>.use()</code> 才是正式启用；
      少了这一步，<code>useCounterStore()</code> 找不到自己的「家」，只能报错。
    </div>
  </div>

  <!-- ============================================================
       Pinia 正常可用时的完整演示
       ============================================================ -->
  <div v-else>
    <div class="tip">
      Pinia 已就绪。这个 <code>count</code> 不在本组件里，而在
      <code>src/stores/counter.js</code>。任何组件调用 <code>useCounterStore()</code>
      拿到的都是同一个储物柜，所以这里改一下，别处也会跟着变。
    </div>

    <!-- 演示一：state 和 getters -->
    <div class="demo">
      <div class="demo-label">演示 1 · state（count）与 getters（double / isPositive）</div>

      <div class="row">
        <!-- 模板里不用写 .value，Pinia 和 Vue 都会帮我们自动解包 -->
        <span class="big">{{ count }}</span>
        <span class="muted">
          两倍（computed 算出来的）：<span class="mono">{{ double }}</span>
          ，是否为正数：<span class="mono">{{ store.isPositive }}</span>
        </span>
      </div>

      <p class="muted">
        注意 <code>double</code> 我们没有单独存一份，它是 getters 里用 computed 算出来的：
        count 一变它就自动重算，永远不会出现「数据不同步」的问题。
      </p>
    </div>

    <!-- 演示二：actions -->
    <div class="demo">
      <div class="demo-label">演示 2 · 调用 actions 改数据</div>

      <div class="row">
        <!-- 方法直接解构也能用（方法不需要保响应式），这里为了直观，继续用 store. 调用 -->
        <button class="btn" @click="store.increment()">加一</button>
        <button class="btn btn-ghost" @click="store.decrement()">减一</button>
        <button class="btn btn-ghost" @click="store.reset()">复位</button>
      </div>

      <p class="muted">
        所有修改逻辑都写在 store 的 action 里，而不是在组件里直接 count++。
        这样多个组件都来改的时候，规则只有一份，不会改乱。
      </p>
    </div>

    <!-- 演示三：操作历史（state 里是个数组） -->
    <div class="demo">
      <div class="demo-label">演示 3 · history：state 里放的数组</div>

      <p v-if="history.length === 0" class="muted">还没有操作记录，点几个按钮试试。</p>
      <ul v-else>
        <li v-for="(item, index) in history" :key="index">
          <span class="mono">{{ item }}</span>
        </li>
      </ul>

      <p class="muted">复位会清空历史，因为「复位」的意思就是回到干干净净的状态。</p>
    </div>

    <!-- 演示四：storeToRefs 的作用 -->
    <div class="demo">
      <div class="demo-label">演示 4 · storeToRefs：解构之后还能不能响应式？</div>

      <div class="row">
        <div class="card" style="margin: 0; flex: 1">
          <p class="muted">用 storeToRefs 解构出来（正确做法）</p>
          <p>count = <span class="mono">{{ count }}</span></p>
          <p class="muted">它会跟着按钮一起变，因为拿到的还是 ref。</p>
        </div>

        <div class="card" style="margin: 0; flex: 1">
          <p class="muted">直接解构出来（反面教材）</p>
          <p>snapshotCount = <span class="mono">{{ snapshotCount }}</span></p>
          <p class="muted">
            它永远是刚开始那个数字，怎么点都不变。
            因为直接解构拿到的只是一个「快照」，和储物柜已经没关系了。
          </p>
        </div>
      </div>

      <p class="tip">
        口诀：<strong>storeToRefs 只给数据用，方法直接拿。</strong>
        方法本来就是普通函数，不需要响应式，塞进 storeToRefs 反而要多写一层。
      </p>
    </div>

    <!-- 演示五：动手改一改 -->
    <div class="demo">
      <div class="demo-label">演示 5 · 留给你动手的两个小实验</div>
      <ol>
        <li>
          在 <code>src/stores/counter.js</code> 里加一个 getter
          <code>isPositive</code> 一样的 <code>absCount</code>（绝对值），然后回到本页显示它。
        </li>
        <li>
          新建一个 <code>src/views/Ch10PiniaChild.vue</code>，里面也调用
          <code>useCounterStore()</code> 显示 count，把它引入本页。
          点按钮时观察：两个组件是不是同步变化的？为什么会同步？
          （答案：它们拿的是同一个储物柜，不是各自复制的数据。）
        </li>
      </ol>
    </div>

    <div class="warn">
      最后一个容易忽略的坑：Pinia 的数据只在内存里，按 F5 刷新页面就全没了。
      真要持久化，得自己配合 localStorage 存取，或者用社区插件（加上 <code>persist: true</code>）。
      学习阶段先知道有这回事就够了。
    </div>
  </div>

  <div class="tip">
    本章笔记：<code>notes/10-状态管理Pinia.md</code>。
    记住选择标准：这份数据要「大家同一份」才用 Pinia，
    只在自己组件里用的（比如输入框内容）就老老实实放 <code>ref</code>。
  </div>
</template>
