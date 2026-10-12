<!--
  Ch07PropsEmits.vue —— 第 7 章练习页：组件通信
  父组件（本文件）和子组件之间只有两条正规通道：
    1. 往下传数据：props（子组件用 defineProps 接）
    2. 往上报告：事件 emit（子组件用 defineEmits 声明，父组件用 @事件名 接住）
  核心思想是「单向数据流」：谁的数据谁负责改，别人只能请求它改。
  本页把两个子组件用起来，并把「父组件收到了什么」实时显示在页面上。
-->
<script setup>
import { ref, computed } from 'vue'

// 引入子组件：本文件在 src/views 下，所以要 ../ 先回到 src 再进 components
import ChildCounter from '../components/ChildCounter.vue'
import ChildInput from '../components/ChildInput.vue'

/* ========== 演示 1：父传子 props + 子传父 emit ========== */

// 父组件自己的数据。初始值写成提示文字，方便看出「还没收到」和「收到了」的区别
const latestFromChild = ref('（还没有收到子组件的消息）')

// 这就是父组件接住子组件事件的处理函数。
// 参数 value 就是子组件 emit('change', value) 里带出来的那个数据。
function onCountChange(value) {
  latestFromChild.value = value
}

/* ========== 演示 2：组件上的 v-model ========== */

// 和 <ChildInput v-model="keyword" /> 双向绑定的变量
const keyword = ref('')

// 用来演示「手写版 v-model」，它和上面那个 v-model 完全是同一件事
const manualKeyword = ref('')

// 父组件里也能算出长度，说明数据确实同步到了父组件
const keywordLen = computed(() => keyword.value.length)

/* ========== 演示 3：改 props 会报错，看看正确写法 ========== */

// 下面的字符串只是用来说明「错在哪、怎么改」，不会被真的执行
const wrongCode = `// 子组件里这样写会报错：
// Set operation on key "initial" failed: target is readonly
props.initial = 100`

const rightCode = `// 正确做法 1：只是想要一个新值，不修改 → 用 computed 派生
const double = computed(() => props.initial * 2)

// 正确做法 2：想在子组件内部改动 → 先复制一份本地数据
const count = ref(props.initial)
count.value = 100

// 正确做法 3：改完要告诉父组件 → emit 抛上去，让父组件决定
emit('change', count.value)`

// provide / inject 的示意代码：跨层级传数据时用，比一层层传 props 省事
const provideCode = `// 祖先组件：提供一个东西（用 ref 提供，后代拿到的才是活的）
provide('theme', ref('light'))

// 任意深度的后代组件：用同一把钥匙去取，第二个参数是取不到的默认值
const theme = inject('theme', 'light')`
</script>

<template>
  <h1 class="page-title">第 7 章 · 组件通信</h1>
  <p class="page-desc">父子组件怎么说话：往下用 props，往上报事件 emit。</p>

  <div class="tip">
    类比：家长（父组件）给小孩（子组件）零花钱，小孩只能看、只能花，不能偷偷改家长钱包的数字；
    小孩花了钱要回来报告一声，由家长自己决定账怎么记。数据从父到子走 props，从子到父走 emit。
  </div>

  <h2>演示 1：父传子（props）+ 子传父（emit）</h2>
  <p>
    子组件 <code>ChildCounter</code> 通过 <code>:initial</code> 收到父组件给的起始值；
    它内部点按钮改变自己的数据后，用 <code>emit('change', 最新值)</code> 往上报告。
  </p>

  <div class="demo">
    <div class="demo-label">第一个：父组件用「函数」接住事件</div>
    <!--
      :initial="10"   → 传下去的是数字 10（注意有冒号！没冒号就是字符串 "10"）
      @change="onCountChange" → 子组件 emit('change', 值) 时，这个函数会被调用
    -->
    <ChildCounter :initial="10" @change="onCountChange" />
    <p class="mono">父组件收到的值：{{ latestFromChild }}</p>
  </div>

  <div class="demo">
    <div class="demo-label">第二个：起始值不传，用子组件里的 default 默认值 0</div>
    <!--
      这里没有传 :initial，子组件会用自己的默认值 0（defineProps 里写的 default: 0）。
      @change 里直接用 $event 接收数据，这是「只有一行代码」时的简写形式。
    -->
    <ChildCounter @change="latestFromChild = $event" />
    <p class="mono">父组件收到的值：{{ latestFromChild }}</p>
  </div>

  <div class="warn">
    两个演示共享同一个 <code>latestFromChild</code>，所以点哪个都会更新下面那行字。
    注意子组件内部的那个数字，父组件是<strong>改不动</strong>的，
    只能通过 props 给初始值——这就是单向数据流。
  </div>

  <h2>演示 2：组件上的 v-model</h2>
  <p>
    <code>v-model</code> 写在组件上，本质就是「传一个 prop + 监听一个事件」的简写，
    并不是什么黑魔法。下面两行代码完全等价。
  </p>

  <div class="demo">
    <div class="demo-label">写法 A：v-model 语法糖（写起来最省事，推荐）</div>
    <ChildInput v-model="keyword" />
    <p class="mono">父组件的 keyword：{{ keyword === '' ? '（空）' : keyword }}</p>
    <p class="muted">父组件算出的长度：{{ keywordLen }} 个字符</p>
  </div>

  <div class="demo">
    <div class="demo-label">写法 B：手写版，展开后就是 :model-value + @update:model-value</div>
    <!--
      这一行和上面的 <ChildInput v-model="keyword" /> 是同一件事。
      $event 就是子组件抛上来的新值，把它赋给父组件的变量，双向绑定就完成了。
    -->
    <ChildInput
      :model-value="manualKeyword"
      @update:model-value="manualKeyword = $event"
    />
    <p class="mono">父组件的 manualKeyword：{{ manualKeyword === '' ? '（空）' : manualKeyword }}</p>
  </div>

  <div class="tip">
    <code>ChildInput.vue</code> 内部只用了一行 <code>const model = defineModel()</code>
    就实现了 v-model（Vue 3.4+ 稳定可用，本项目是 3.5）。
    它帮你做了两件事：把 prop 和 emit 一起声明好，写 <code>model</code> 时自动 emit 新值。
  </div>

  <h2>演示 3：为什么不能直接改 props</h2>
  <p>如果子组件里写了 <code>props.initial = 100</code>，控制台会报错，页面也可能不更新：</p>

  <pre><code>{{ wrongCode }}</code></pre>

  <p>三种正确的做法：</p>

  <pre><code>{{ rightCode }}</code></pre>

  <div class="warn">
    记住一句话：<strong>props 只能读，不能改。</strong>
    如果父组件的数据能被好几个子组件随便改，出了问题根本查不出是谁改的——
    单向数据流就是为了避免这种混乱。
  </div>

  <h2>补充：不是父子关系怎么办</h2>
  <p>
    如果数据要从「爷爷」传给「孙子」，一层层写 props 太累了（这叫属性钻取）。
    可以用 <code>provide</code> / <code>inject</code>：
  </p>

  <pre><code>{{ provideCode }}</code></pre>

  <div class="tip">
    但数据一多、要跨页面共享时，<code>provide/inject</code> 也很难追踪「这个值到底是谁给的」。
    这种「全局共享状态」的正式方案是 Pinia，第 10 章专门讲。
    新手顺序：先 props/emit → 觉得传得太深了用 provide/inject → 再大就上 Pinia。
  </div>
</template>
