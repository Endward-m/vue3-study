<!-- ============================================================
  第 12 章 · 工程化与进阶 —— 练习页

  这个页面演示三件事：
    1. 组合式函数（useCounter）：同一个函数调两次，得到两份互不干扰的数据
    2. <style scoped> 的原理与隔离效果
    3. 组件通信方式总览表
============================================================= -->

<script setup>
// 引入我们自己写的组合式函数
import { useCounter } from '../composables/useCounter'

// ------------------------------------------------------------
// 演示一：同一个 useCounter() 调用两次
//
// 为什么解构时要改名？因为两个计数器里都有 count，
// 不改名就会撞车（后面的会把前面的覆盖掉）。
//
// 注意：解构出来的是 ref，在模板里会被自动解包，所以直接写 countA 就行。
// 这两个调用各自在自己的函数内部创建了新的 ref，
// 所以 countA 和 countB 是两份完全独立的数据，改一个绝不影响另一个。
// ------------------------------------------------------------
const {
  count: countA,
  double: doubleA,
  increment: incrementA,
  decrement: decrementA,
  reset: resetA,
} = useCounter() // 不传参数 → 从 0 开始

const {
  count: countB,
  double: doubleB,
  increment: incrementB,
  decrement: decrementB,
  reset: resetB,
} = useCounter(10) // 传 10 → 从 10 开始

// ------------------------------------------------------------
// 演示二：scoped 样式为什么「管不到」某些元素
//
// 下面这段 HTML 是用 v-html 动态塞进页面的。
// Vue 给 scoped 样式加作用范围时，只会给「模板里写死的元素」
// 打上 data-v-xxx 属性；v-html 的内容是运行时才插入的，
// 拿不到这个属性，所以同名 class 也匹配不上 scoped 样式。
// ------------------------------------------------------------
const injectedHtml = '<span class="scoped-box">我是用 v-html 塞进来的，没人给我加 data-v 属性</span>'
</script>

<template>
  <h1 class="page-title">第 12 章 · 工程化与进阶</h1>
  <p class="page-desc">把可复用的逻辑打包带走，把样式关进自己的房间，把性能留给真正卡的地方。</p>

  <!-- ============================================================
       演示一：组合式函数
       ============================================================ -->
  <h2>演示 1 · 组合式函数：一次调用 = 一份独立数据</h2>

  <div class="demo">
    <div class="demo-label">两个计数器来自同一个 useCounter()，但互不干扰</div>

    <div class="row" style="align-items: stretch">
      <div class="card" style="margin: 0; flex: 1; min-width: 240px">
        <p class="muted">计数器 A（useCounter()，从 0 开始）</p>
        <p class="big">{{ countA }}</p>
        <p class="muted">两倍值：<span class="mono">{{ doubleA }}</span></p>
        <div class="row">
          <button class="btn" @click="incrementA()">加一</button>
          <button class="btn btn-ghost" @click="decrementA()">减一</button>
          <button class="btn btn-ghost" @click="resetA()">复位到 0</button>
        </div>
      </div>

      <div class="card" style="margin: 0; flex: 1; min-width: 240px">
        <p class="muted">计数器 B（useCounter(10)，从 10 开始）</p>
        <p class="big">{{ countB }}</p>
        <p class="muted">两倍值：<span class="mono">{{ doubleB }}</span></p>
        <div class="row">
          <button class="btn" @click="incrementB()">加一</button>
          <button class="btn btn-ghost" @click="decrementB()">减一</button>
          <button class="btn btn-ghost" @click="resetB()">复位到 10</button>
        </div>
      </div>
    </div>

    <p class="muted">
      点 A 的按钮，B 一点都不动（反过来也一样）。看起来是两套完全一样的代码，
      但 <code>useCounter</code> 里的 <code>ref</code> 写在函数体内部，
      所以每次调用都会新建一份。这就是「逻辑复用」而不是「数据共享」。
    </p>
    <p class="muted">
      顺带一提：A 复位回到 0、B 复位回到 10，因为复位用的是「当初传进来的初始值」（闭包）。
    </p>
  </div>

  <div class="tip">
    组合式函数就像「料理包」：锅、铲、步骤打包好，谁想做饭拆一包，各做各的。
    Pinia 的 store 更像「公司食堂」：只做一锅，所有人吃同一份。
    要「各一份」就用组合式函数，要「同一份」就用 Pinia——这一条判断标准能解决 90% 的选择困难。
  </div>

  <!-- ============================================================
       演示二：style scoped
       ============================================================ -->
  <h2>演示 2 · 单文件组件的样式隔离（scoped）</h2>

  <div class="demo">
    <div class="demo-label">同样一个 class，一个带 scoped 样式，一个不带</div>

    <!-- 这个元素写在模板里，编译时会被加上 data-v-xxx 属性，所以能被下面的 scoped 样式命中 -->
    <p><span class="scoped-box">我在模板里写着，拿到了 data-v 属性，所以被染成了绿色。</span></p>

    <!-- 这段内容的 class 是运行时才插进来的，元素上没有 data-v 属性，所以样式命中不了 -->
    <p v-html="injectedHtml"></p>

    <p class="muted">
      两边的 class 都是 <code>scoped-box</code>，但只有第一个变绿了。
      原因：<code>&lt;style scoped&gt;</code> 编译后大致是
      <code>.scoped-box[data-v-7ba5bd90] { ... }</code>，
      它会要求元素身上带着本组件专属的那个属性。模板里的元素会被自动加上，
      <code>v-html</code> 插进来的不会，所以被「隔离」在外。
    </p>

    <p class="muted">
      动手验证：右键「检查」第一个绿色元素，你会看到它身上多了个 <code>data-v-</code> 开头的属性，
      而 v-html 那个 span 上没有。
    </p>
  </div>

  <div class="demo">
    <div class="demo-label">scoped 的另一个好处：不污染别人</div>
    <p class="muted">
      本页的 <code>&lt;style scoped&gt;</code> 里给 <code>.demo-label</code> 加了一点小样式
      （左边多了一条竖线）。你现在看到的所有「演示 X」小标题都带上了它。
      现在点左边去第 11 章看看：那边的 <code>.demo-label</code> 完全不受影响，还是原样。
      这就是 scoped 的价值——你可以放心大胆地起类名，不用担心撞车。
    </p>
  </div>

  <!-- ============================================================
       演示三：组件通信方式总览
       ============================================================ -->
  <h2>演示 3 · 组件通信方式总览</h2>

  <p>学到这一章，主要的通信方式你已经全见过了。放在一起对比，选起来就不纠结了：</p>

  <table>
    <thead>
      <tr>
        <th>方式</th>
        <th>方向</th>
        <th>适合场景</th>
        <th>什么时候别用</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>props</td>
        <td>父 → 子</td>
        <td>父组件给子组件喂数据</td>
        <td>层级很深，要层层搬运</td>
      </tr>
      <tr>
        <td>emits</td>
        <td>子 → 父</td>
        <td>子组件有动作要通知父组件</td>
        <td>要通知的对象不是父级</td>
      </tr>
      <tr>
        <td>v-model</td>
        <td>双向</td>
        <td>表单类组件，父子同步一个值</td>
        <td>逻辑复杂时看不清数据来源</td>
      </tr>
      <tr>
        <td>provide / inject</td>
        <td>祖先 → 后代（跨层）</td>
        <td>主题、语言这类「一给一大片」的配置</td>
        <td>数据经常变，来源难追踪</td>
      </tr>
      <tr>
        <td>Pinia</td>
        <td>任意方向</td>
        <td>跨页面、跨层级共享的数据</td>
        <td>只在一个页面用的局部状态</td>
      </tr>
      <tr>
        <td>插槽 slot</td>
        <td>父传「结构」给子</td>
        <td>外壳固定、内容可变的容器组件</td>
        <td>只是传数据、不传结构</td>
      </tr>
      <tr>
        <td>组合式函数</td>
        <td>各用各的</td>
        <td>多处复用同一套逻辑（数据互不相干）</td>
        <td>需要共享同一份数据时要用 Pinia</td>
      </tr>
    </tbody>
  </table>

  <div class="tip">
    选择建议，按顺序问自己：
    <br />
    1. 只是父子关系？→ <code>props</code> + <code>emits</code>（最直观，先用它）
    <br />
    2. 是表单控件要双向同步？→ <code>v-model</code>
    <br />
    3. 隔了好几层，且数据基本不变？→ <code>provide</code> / <code>inject</code>
    <br />
    4. 跨页面、多组件共享、还会频繁变？→ <code>Pinia</code>
    <br />
    5. 只想让子组件决定「长什么样」？→ 插槽
    <br />
    6. 只想复用逻辑、不需要共享同一份数据？→ 组合式函数
  </div>

  <div class="warn">
    性能小抄（先认识，用到再查，别一上来就优化）：
    <code>v-once</code> 只渲染一次、<code>v-memo</code> 依赖没变就跳过更新、
    <code>shallowRef</code> 不做深层监听、
    路由懒加载 <code>() =&gt; import(...)</code>（本项目每章都用了）、
    超大列表用虚拟滚动（只渲染看得见的那几行）。
    <br />
    真卡了先用浏览器性能面板找到瓶颈再动手，凭感觉优化往往只增加了代码复杂度。
  </div>

  <div class="tip">
    本章笔记：<code>notes/12-工程化与进阶.md</code>。
    下一步最该做的一件事：<strong>自己从零写一个小项目</strong>（待办清单、记账本都行），
    把 props、路由、Pinia、请求这些串起来用一遍，比再看十篇教程都管用。
  </div>
</template>

<style scoped>
/* ============================================================
   scoped 样式：只对本组件的元素生效
   编译后选择器会变成 .scoped-box[data-v-xxxx] 这种形式，
   所以它既不会影响别的组件，别的组件也不会影响它。
   ============================================================ */

/* 演示二里「能变绿」的那个元素靠这条规则；v-html 插进来的同名元素命中不了 */
.scoped-box {
  color: #10a37f;
  font-weight: 600;
  border-bottom: 2px solid #10a37f;
}

/* 给本页所有「演示 X」小标题加一条竖线。
   加了 scoped，所以别的章节完全不受影响（你可以切过去对比验证） */
.demo-label {
  border-left: 3px solid #10a37f;
  padding-left: 8px;
  color: #2f3542;
}
</style>
