<!-- ============================================================
  Ch04Reactivity.vue —— 第 4 章「响应式核心」练习页
  这一页用并排对比的方式，让你亲眼看到：
    1. ref 和 reactive 各自怎么写、怎么改
    2. 解构 reactive 会丢响应式（错的例子 vs 用 toRefs 修好的例子）
    3. 数组 push / 整体替换 / 改下标，页面会不会更新
  文件结构顺序：<script setup> → <template> → <style scoped>
============================================================= -->

<script setup>
// ref 万能盒子、reactive 给对象装监控、toRefs / toRef 用来「保住」响应式
import { ref, reactive, toRefs, toRef } from 'vue'

/* ============================================================
   演示 1：ref 计数器
   ============================================================ */
// ref 里存的是一个数字。注意：数字这种简单值只能用 ref 装，不能用 reactive
const refCount = ref(0)

// 在 js 里改 ref 的值，必须通过 .value（「打开盒子」）
function addRef() {
  refCount.value = refCount.value + 1
}

function resetRef() {
  refCount.value = 0
}

/* ============================================================
   演示 1 的另一半：reactive 计数器
   ============================================================ */
// reactive 只能接收对象或数组，所以这里把数字包进一个对象里
const reactiveState = reactive({
  count: 0,
})

// reactive 不需要 .value，直接改对象的属性
function addReactive() {
  reactiveState.count = reactiveState.count + 1
}

function resetReactive() {
  reactiveState.count = 0
}

/* ============================================================
   演示 2：解构 reactive 会丢响应式（这是本章最重要的坑）
   ============================================================ */
const user = reactive({
  name: '小明',
  count: 0,
})

// 错误示范：这样写相当于把 user.count 的数字「抄」了一份出来
// 它是「那一刻的快照」，一个普通数字，之后 user.count 再变它也不会动
const { count: snapshotCount } = user

// 正确示范：toRefs 会把每个属性都转成一个 ref
// 这个 ref 是「连着原对象」的，所以 user.count 一变，这里立刻能读到新值
const { count: linkedCount } = toRefs(user)

// 也可以只转一个属性，用 toRef：第一个参数是原对象，第二个参数是属性名
const nameLink = toRef(user, 'name')

// 所有按钮都只改 user 这一个源数据，方便对比「谁跟着变了」
function addUserCount() {
  user.count = user.count + 1
}

function toggleUserName() {
  user.name = user.name === '小明' ? '小红' : '小明'
}

function resetUser() {
  user.count = 0
  user.name = '小明'
}

/* ============================================================
   演示 3：数组的修改
   ============================================================ */
// 用 ref 包一个数组，这是日常最推荐的写法
const list = ref(['苹果', '香蕉'])

// push：用数组自己的方法往末尾加一项，能触发更新
// 名字里带上序号，是为了每一眼都能看出确实加进去了新的一项
function pushItem() {
  list.value.push('新条目 ' + (list.value.length + 1))
}

// 整体替换：直接把 list.value 换成一个全新的数组
// 为什么这样不会丢响应式？因为监控装在「盒子」上，换盒子里的东西不影响监控
function replaceAll() {
  list.value = ['西瓜', '葡萄', '草莓']
}

function resetList() {
  list.value = ['苹果', '香蕉']
}

// reactive 装的数组，直接改下标也能更新（Vue3 底层用 Proxy，能拦住下标变化）
const nums = reactive([1, 2, 3])

function changeFirstNum() {
  // 这在 Vue2 里是不生效的，必须用 $set；Vue3 已经修好了，可以直接写
  nums[0] = nums[0] + 100
}

function pushNum() {
  nums.push(nums.length + 1)
}

/* ============================================================
   演示 4：把 ref 和 reactive 并排写一遍，方便你对照记
   ============================================================ */
// 同一件事「记录一个名字」，两种写法对照着看
const nameByRef = ref('小明')

const nameByReactive = reactive({
  value: '小明',
})

function changeBothNames() {
  // 左边：ref 要 .value
  nameByRef.value = nameByRef.value === '小明' ? '小红' : '小明'
  // 右边：reactive 不用 .value
  nameByReactive.value = nameByReactive.value === '小明' ? '小红' : '小明'
}
</script>

<template>
  <h1 class="page-title">第 4 章 · 响应式核心</h1>
  <p class="page-desc">响应式就是「数据变了，用到它的地方自动更新」，靠 ref 和 reactive 来实现。</p>

  <!-- ============================================================
       演示 1：ref vs reactive 计数器并排对比
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 1：ref 和 reactive 各做一个计数器，并排对比</div>

    <div class="row" style="align-items: stretch">
      <div class="card" style="flex: 1; margin: 0">
        <h3 style="margin-top: 0">ref 计数器</h3>
        <!-- 模板里用 ref 不需要 .value，Vue 会自动「脱盒」 -->
        <p class="big">{{ refCount }}</p>
        <div class="row">
          <button class="btn" @click="addRef">加 1</button>
          <button class="btn btn-ghost" @click="resetRef">归零</button>
        </div>
        <p class="muted" style="margin-bottom: 0">
          js 里必须写 <span class="mono">refCount.value++</span>，模板里直接写 <span class="mono">refCount</span>。
        </p>
      </div>

      <div class="card" style="flex: 1; margin: 0">
        <h3 style="margin-top: 0">reactive 计数器</h3>
        <!-- reactive 是普通对象的样子，模板里直接读属性 -->
        <p class="big">{{ reactiveState.count }}</p>
        <div class="row">
          <button class="btn" @click="addReactive">加 1</button>
          <button class="btn btn-ghost" @click="resetReactive">归零</button>
        </div>
        <p class="muted" style="margin-bottom: 0">
          两边都不用写 <span class="mono">.value</span>，直接写
          <span class="mono">reactiveState.count++</span>。
        </p>
      </div>
    </div>

    <div class="tip">
      <strong>为什么 ref 要多写一个 .value？</strong>
      把 ref 想成一个快递盒：盒子上装着 Vue 的监控装置。在 js 里你手里拿着的是盒子，得先打开（.value）才能拿到里面的数据；模板里 Vue 知道你要取值，帮你自动打开。
      盒子不是麻烦，它是 Vue 用来「追踪变化」的抓手。
    </div>
  </div>

  <!-- ============================================================
       演示 2：解构 reactive 丢响应式 + toRefs 修正
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 2：解构 reactive 会丢响应式 —— 先看错的例子，再看 toRefs 怎么修</div>

    <div class="row">
      <button class="btn" @click="addUserCount">把 user.count 加 1</button>
      <button class="btn btn-ghost" @click="toggleUserName">切换姓名</button>
      <button class="btn btn-ghost" @click="resetUser">重置</button>
      <span class="muted">所有按钮改的都是同一个源数据 user</span>
    </div>

    <table>
      <thead>
        <tr>
          <th>显示的是什么</th>
          <th>写法</th>
          <th>当前值</th>
          <th>会不会跟着变</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>源数据本体</td>
          <td class="mono">user.count</td>
          <td class="mono big" style="font-size: 18px">{{ user.count }}</td>
          <td>会，它就是源头</td>
        </tr>
        <tr>
          <td>普通解构（错误）</td>
          <td class="mono">const { count } = user</td>
          <td class="mono big" style="font-size: 18px">{{ snapshotCount }}</td>
          <td>不会，这只是个「快照」</td>
        </tr>
        <tr>
          <td>toRefs 解构（正确）</td>
          <td class="mono">const { count } = toRefs(user)</td>
          <td class="mono big" style="font-size: 18px">{{ linkedCount }}</td>
          <td>会，它连着原对象</td>
        </tr>
        <tr>
          <td>toRef 单个属性（正确）</td>
          <td class="mono">toRef(user, 'name')</td>
          <td class="mono" style="font-size: 16px">{{ nameLink }}</td>
          <td>会，原理同上</td>
        </tr>
      </tbody>
    </table>

    <div class="warn">
      <strong>为什么快照不会变？</strong>
      <span class="mono">const { count } = user</span> 相当于「把盒子里的数字抄在另一张纸上」。你改盒子，纸上的数字当然不动。
      <span class="mono">toRefs</span> 做的事是「不抄值，改成给你一张写着盒子地址的地址条」，看地址就能读到最新值。
    </div>

    <p class="muted" style="margin-bottom: 0">
      小提醒：用 toRefs 解构出来的东西是 ref，所以在 js 里操作它要写
      <span class="mono">linkedCount.value</span>；在模板里照旧不用写。
    </p>
  </div>

  <!-- ============================================================
       演示 3：数组的修改会不会更新
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 3：修改数组 —— push、整体替换、改下标，页面会不会更新</div>

    <h3 style="margin-top: 0">ref 包着的数组</h3>
    <p class="mono" style="font-size: 16px">{{ list }}</p>
    <div class="row">
      <button class="btn" @click="pushItem">push 加一项</button>
      <button class="btn" @click="replaceAll">整体替换 list.value = [...]</button>
      <button class="btn btn-ghost" @click="resetList">还原</button>
      <span class="muted">当前长度：{{ list.length }}</span>
    </div>
    <p class="muted">
      两种都会更新，但原因不一样：push 是「改盒子里已有的数组」，整体替换是「换掉盒子里的东西」。
      盒子上的监控一直都在，所以两种情况 Vue 都能收到通知。
    </p>

    <h3>reactive 包着的数组</h3>
    <p class="mono" style="font-size: 16px">{{ nums }}</p>
    <div class="row">
      <button class="btn" @click="changeFirstNum">把第 0 项加 100（改下标）</button>
      <button class="btn" @click="pushNum">push 加一项</button>
    </div>
    <p class="muted" style="margin-bottom: 0">
      改下标 <span class="mono">nums[0] = ...</span> 在 Vue2 里是不生效的，必须用
      <span class="mono">$set</span>。Vue3 底层换成了 Proxy，能直接拦住下标变化，所以正常写法就行，不用再记 $set。
    </p>
  </div>

  <!-- ============================================================
       演示 4：同一件事的两种写法对照
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 4：同一件事，ref 写法和 reactive 写法对照</div>

    <div class="row">
      <div class="card" style="flex: 1; margin: 0">
        <p class="muted">ref 写法</p>
        <p class="mono">const nameByRef = ref('小明')</p>
        <p style="font-size: 18px">{{ nameByRef }}</p>
      </div>
      <div class="card" style="flex: 1; margin: 0">
        <p class="muted">reactive 写法</p>
        <p class="mono">const nameByReactive = reactive({ value: '小明' })</p>
        <p style="font-size: 18px">{{ nameByReactive.value }}</p>
      </div>
    </div>

    <div class="row">
      <button class="btn" @click="changeBothNames">同时改两个</button>
      <span class="muted">一个改了 .value，一个直接改属性，效果一样</span>
    </div>
  </div>

  <!-- ============================================================
       对比总结表
       ============================================================ -->
  <h2>ref 与 reactive 对比表</h2>
  <table>
    <thead>
      <tr>
        <th>对比项</th>
        <th>ref</th>
        <th>reactive</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>能包什么</td>
        <td>任何类型（数字、字符串、数组、对象）</td>
        <td>只能对象或数组</td>
      </tr>
      <tr>
        <td>js 里取值</td>
        <td class="mono">要写 .value</td>
        <td class="mono">不写，直接读属性</td>
      </tr>
      <tr>
        <td>模板里取值</td>
        <td class="mono">不写 .value</td>
        <td class="mono">和普通对象一样</td>
      </tr>
      <tr>
        <td>整体替换变量</td>
        <td>安全，<span class="mono">x.value = 新值</span> 不丢响应式</td>
        <td>会丢，别写 <span class="mono">state = 新对象</span></td>
      </tr>
      <tr>
        <td>解构后还有响应式吗</td>
        <td>不涉及</td>
        <td>没有，要用 toRefs / toRef</td>
      </tr>
      <tr>
        <td>新手建议</td>
        <td>推荐，什么都能装，规矩统一</td>
        <td>可选，适合成组的状态</td>
      </tr>
    </tbody>
  </table>

  <div class="tip">
    <strong>结论：新手统一用 ref。</strong>
    不是 reactive 不好，而是团队里统一一套写法，读代码的人不用每次思考「这里要不要 .value」，出错概率更低。
  </div>

  <div class="card">
    <h3 style="margin-top: 0">动手试试（做完再回去看笔记里的自测题）</h3>
    <ol>
      <li>在演示 2 里反复点「把 user.count 加 1」，盯着表格里三行的数字，感受「快照」和「连着原对象」的区别。</li>
      <li>把演示 3 的 nums 改成用 ref 包起来，还能不能改下标？试完再改回来。</li>
      <li>在演示 1 里故意把 <span class="mono">refCount.value++</span> 写成 <span class="mono">refCount++</span>，看看浏览器控制台会报什么错，记住这个错误长什么样。</li>
      <li>给演示 1 的 reactive 计数器加一个「随便改个无关的数据」，观察它会不会受影响。</li>
    </ol>
  </div>
</template>

<style scoped>
/* 这里只做一点排版美化，逻辑部分完全不依赖这些样式 */

.demo .card {
  margin: 8px 0;
}

.demo table {
  margin-top: 12px;
}

.demo h3 {
  margin: 18px 0 6px;
}
</style>
