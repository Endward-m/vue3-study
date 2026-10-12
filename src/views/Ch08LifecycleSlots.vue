<!--
  Ch08LifecycleSlots.vue —— 第 8 章练习页：生命周期与插槽
  本页有三个演示：
    1. 用 v-if 控制 LifecycleDemo 的显示/隐藏，亲眼看 onMounted / onUpdated / onUnmounted
    2. 用 SlotDemo 演示默认插槽、具名插槽、作用域插槽三种填法
    3. 用 <component :is> + <keep-alive> 演示动态组件和缓存
-->
<script setup>
import { ref, shallowRef, h, defineComponent } from 'vue'

import LifecycleDemo from '../components/LifecycleDemo.vue'
import SlotDemo from '../components/SlotDemo.vue'

/* ==================== 演示 1：生命周期 ==================== */

// 这个布尔值决定子组件「在不在页面上」。
// 从 false 变 true → 子组件被创建并挂载（触发 onMounted）
// 从 true 变 false → 子组件被销毁（触发 onUnmounted）
const showLifecycle = ref(true)

// 父组件保存一份完整日志。
// 为什么要父组件存？因为子组件被销毁时，它自己那份日志也跟着消失了，
// 只有父组件存下来的记录才留得住 onUnmounted 那一行。
const records = ref([])

// 子组件用 emit('lifecycle', 一行文字) 把日志抛上来，这里接住并存起来
function handleLifecycle(line) {
  records.value.push(line)
}

function clearRecords() {
  // 换成新数组而不是 length = 0，是更直观的「清空」写法，两种都可以
  records.value = []
}

/* ==================== 演示 2：插槽 ==================== */

// 子组件 SlotDemo 不知道每一行长什么样，数据由父组件准备，渲染方式也由父组件决定
const students = ref([
  { id: 1, name: '小明', score: 92 },
  { id: 2, name: '小红', score: 78 },
  { id: 3, name: '小刚', score: 85 },
])

/* ==================== 演示 3：动态组件 + keep-alive ==================== */

// 下面这两个迷你组件用 h() 渲染函数写，是为了让本页的演示自包含（不用再多建两个文件）。
// h 和渲染函数属于进阶内容，第 12 章会讲。现在你只要把它们看成两个普普通通的组件即可。
// 注意 name: 'TabA' 是有用的：keep-alive 的 include 就是按这个名字来匹配的。
const TabA = defineComponent({
  name: 'TabA',
  setup() {
    const n = ref(0)
    return () => [
      h('p', '我是组件 A，一个计数器。切到 B 再切回来，如果数字还在，说明 keep-alive 生效了。'),
      h('button', { class: 'btn', onClick: () => n.value++ }, `A 点了 ${n.value} 次`),
    ]
  },
})

const TabB = defineComponent({
  name: 'TabB',
  setup() {
    const n = ref(0)
    return () => [
      h('p', '我是组件 B，也是计数器。两个组件的状态互相独立。'),
      h('button', { class: 'btn', onClick: () => n.value++ }, `B 点了 ${n.value} 次`),
    ]
  },
})

// :is 要绑定的值就是「当前要渲染哪个组件」。
// 这里用 shallowRef 而不是普通 ref：组件对象不需要（也不应该）被深度响应式处理，官方推荐写法。
const current = shallowRef(TabA)

// keep-alive 的开关，用来对比「缓存」和「不缓存」的区别
const useKeepAlive = ref(true)
</script>

<template>
  <h1 class="page-title">第 8 章 · 生命周期与插槽</h1>
  <p class="page-desc">组件从出生到销毁的几个关键节点，以及怎么给组件留下「坑位」。</p>

  <div class="tip">
    生命周期钩子就像人生的几个节点：出生（onMounted）、成长（onUpdated）、去世（onUnmounted）。
    插槽像是子组件身上预留的坑位，填什么由父组件说了算。
  </div>

  <h2>演示 1：亲眼看一次生命周期</h2>
  <p>
    子组件 <code>LifecycleDemo</code> 会把自己每次触发的生命周期都记录到页面上。
    点下面的按钮把它卸下、再装上，观察日志的变化。
  </p>

  <div class="demo">
    <div class="demo-label">用 v-if 控制子组件的存在，切换的瞬间就会触发 mounted / unmounted</div>

    <div class="row">
      <button class="btn" @click="showLifecycle = !showLifecycle">
        {{ showLifecycle ? '卸载子组件（v-if 变 false）' : '挂载子组件（v-if 变 true）' }}
      </button>
      <button class="btn btn-ghost" @click="clearRecords">清空下方父组件日志</button>
    </div>

    <!--
      v-if 为 true 时才渲染 LifecycleDemo。
      真实的挂载时机会比这句代码稍微「晚一点」（等下 nextTick），这正是过程序异步批量的表现。
    -->
    <div v-if="showLifecycle" class="card">
      <!-- @lifecycle 就是父组件接住子组件 emit 的那一行（第 7 章的知识在这里复用了） -->
      <LifecycleDemo @lifecycle="handleLifecycle" />
    </div>
    <p v-else class="muted">
      子组件已经被销毁了，它内部那半份日志也一起消失了；但父组件记下来的日志还在下面。
    </p>
  </div>

  <div class="demo">
    <div class="demo-label">父组件记录的完整生命历程（包含组件销毁那一刻的 onUnmounted）</div>
    <ul class="mono log-list">
      <li v-for="(line, index) in records" :key="index">{{ line }}</li>
    </ul>
    <p v-if="records.length === 0" class="muted">还没有任何记录，点上面的按钮试试。</p>
    <p class="muted">
      小实验：先点几次「点我 +1」，看 onUpdated 的次数怎么涨；再卸载、重新挂载，
      会发现子组件里的计数器被清零了——因为这是全新的一个组件实例。
    </p>
  </div>

  <h2>演示 2：插槽——给组件留坑位</h2>
  <p>
    子组件 <code>SlotDemo</code> 只负责「画框 + 循环」，至于标题写什么、每一行长什么样，
    全部交给父组件决定。这就是插槽的价值：一个组件能适配很多不同的用法。
  </p>

  <div class="demo">
    <div class="demo-label">完整填法：默认插槽 + 具名插槽 #header + 作用域插槽 #row</div>

    <SlotDemo :items="students">
      <!-- 1. 默认插槽：没有名字的那个坑位，直接写内容就是填它 -->
      <p>这段文字是父组件通过「默认插槽」塞进去的，子组件只提供了位置。</p>

      <!-- 2. 具名插槽：用 #header 指定填哪个坑位（# 是 v-slot: 的简写） -->
      <template #header>期末成绩单</template>

      <!--
        3. 作用域插槽：子组件用 :item="item" :index="index" 把数据递出来，
           父组件用 #row="{ item, index }" 接住，再自己决定怎么渲染。
           注意方向：这里的数据是从「子」流到「父」的。
      -->
      <template #row="{ item, index }">
        <span>{{ index + 1 }}. {{ item.name }} —— {{ item.score }} 分</span>
      </template>
    </SlotDemo>
  </div>

  <div class="demo">
    <div class="demo-label">一个坑位都不填：显示子组件里 &lt;slot&gt; 标签之间的「后备内容」</div>
    <!-- 没有传任何插槽内容，所以标题、正文、每一行都用子组件的默认写法 -->
    <SlotDemo :items="students" />
  </div>

  <div class="warn">
    想改「每一行长什么样」，但发现 <code>item</code> 在父组件的默认插槽里用不了？
    那是因为默认插槽的内容属于<strong>父组件的作用域</strong>，只能用父组件的数据。
    想用子组件的每一行数据，就必须走作用域插槽，让子组件把数据递出来。
  </div>

  <h2>演示 3：动态组件 + keep-alive</h2>
  <p>
    <code>&lt;component :is="..."&gt;</code> 就是「一个位置，按变量决定渲染哪个组件」。
    不缓存时，切走的组件会被销毁，状态（计数器）会清零。
  </p>

  <div class="demo">
    <div class="demo-label">切换组件，并对比开启 / 关闭 keep-alive 的差别</div>

    <div class="row">
      <button class="btn btn-ghost" @click="current = TabA">切到组件 A</button>
      <button class="btn btn-ghost" @click="current = TabB">切到组件 B</button>
      <label class="muted">
        <input type="checkbox" v-model="useKeepAlive" />
        开启 keep-alive 缓存
      </label>
    </div>

    <div class="card">
      <!--
        keep-alive 的 include 写组件名：开启开关时缓存 TabA/TabB，关闭时传空数组 = 不缓存任何组件。
        缓存生效时，切走再切回来，组件里的计数器还会是原来的数字。
      -->
      <keep-alive :include="useKeepAlive ? ['TabA', 'TabB'] : []">
        <component :is="current" />
      </keep-alive>
    </div>

    <p class="muted">
      玩法：先在 A 里点 3 次，切到 B，再切回 A。
      勾选了「开启缓存」时数字还是 3；取消勾选后同样的操作，数字会回到 0。
      被缓存的组件再次显示时，触发的是 <code>onActivated</code> 而不是 <code>onMounted</code>。
    </p>
  </div>

  <h2>本章要点回顾</h2>
  <ul>
    <li>
      生命周期钩子必须写在 <code>&lt;script setup&gt;</code> 最外层同步调用，
      放进函数里、<code>setTimeout</code> 里、<code>await</code> 后面都会报「没有活跃组件实例」。
    </li>
    <li>
      最常用的只有两个：进页面请求数据用 <code>onMounted</code>，
      离开页面清理定时器和事件监听用 <code>onUnmounted</code>（不清理就会内存泄漏）。
    </li>
    <li>
      <code>onUpdated</code> 里不要改用在模板上的响应式数据，否则渲染和钩子来回触发就是死循环。
    </li>
    <li>
      数据刚改完、DOM 还没刷新时，用 <code>await nextTick()</code> 等一拍再操作 DOM。
    </li>
  </ul>

  <div class="tip">
    动手练习：打开 <code>src/components/LifecycleDemo.vue</code>，在
    <code>onMounted</code> 里加一个 <code>setInterval</code>（每秒把 count 加 1），
    再在 <code>onUnmounted</code> 里用 <code>clearInterval</code> 清掉它。
    然后把清理那一行注释掉看看区别——不清的话，组件卸载后定时器还在后台跑，
    多切换几次就能感觉到页面变卡，这就是所谓的内存泄漏。
  </div>
</template>

<style scoped>
/* 日志列表的样式：只作用于本页，不影响其他章节 */
.log-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 12.5px;
  color: var(--text-muted);
}

.log-list li {
  padding: 3px 0;
  border-bottom: 1px dashed var(--border);
}

.log-list li:last-child {
  border-bottom: none;
}
</style>
