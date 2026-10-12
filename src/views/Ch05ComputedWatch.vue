<!-- ============================================================
  Ch05ComputedWatch.vue —— 第 5 章「计算属性与侦听器」练习页
  四个演示，对应本章四个主角：
    1. computed：购物车小计（顺带用「重算次数」证明它有缓存）
    2. computed：搜索过滤（把一长串筛选逻辑从模板里抽出来）
    3. watch：监听搜索词，做副作用（打日志）
    4. watchEffect：自动收集依赖
  文件结构顺序：<script setup> → <template> → <style scoped>
============================================================= -->

<script setup>
// computed 算结果、watch / watchEffect 做事情，三兄弟一起 import 进来
import { ref, computed, watch, watchEffect } from 'vue'

/* ============================================================
   演示 1：购物车小计
   ============================================================ */
// 购物车数据：每一项有 单价 price 和 数量 qty
const cart = ref([
  { id: 1, name: '苹果', price: 5, qty: 2 },
  { id: 2, name: '牛奶', price: 12, qty: 1 },
  { id: 3, name: '面包', price: 8, qty: 3 },
])

// 用来显示「computed 到底重新算了几次」
const computedRunCount = ref(0)

// computed 的特点是「有缓存」：只有它用到的数据（cart）变了才重新算
// 注意下面这个计数是「教学用的例外」：真实项目里不要在 computed 里写这种副作用。
// 加它只是为了把「缓存」这件看不见的事变成看得见的数字
const totalPrice = computed(() => {
  computedRunCount.value = computedRunCount.value + 1
  // reduce 是数组的累加方法：把每一项的 price * qty 加起来
  return cart.value.reduce((sum, item) => sum + item.price * item.qty, 0)
})

// 顺便再算几个常用的派生值：总件数、平均单价
const totalCount = computed(() => cart.value.reduce((sum, item) => sum + item.qty, 0))
const averagePrice = computed(() => {
  // 除不尽的时候保留两位小数，toFixed 会返回字符串
  if (totalCount.value === 0) return '0.00'
  return (totalPrice.value / totalCount.value).toFixed(2)
})

// 修改数量：按 id 找到那一项，再改 qty
// 为什么按 id 找而不是按下标？因为下标会随着增删错位，靠 id 最稳
function changeQty(id, step) {
  const item = cart.value.find((i) => i.id === id)
  if (item.qty + step < 0) return // 数量不能变成负数
  item.qty = item.qty + step
}

// 一个和总价「完全无关」的数据。它的唯一用途是：
// 让你点它的时候页面会重新渲染，从而亲眼看到 totalPrice 并没有跟着重算
const unrelated = ref(0)

/* ============================================================
   演示 2：用 computed 做搜索过滤
   ============================================================ */
const allNames = ref(['苹果', '香蕉', '橙子', '牛奶', '面包', '牛肉', '鸡蛋', '西瓜'])
const keyword = ref('')

// 「关键词过滤后的列表」本身就是「由数据算出来的结果」，非常适合用 computed
// 好处：模板里只写 filteredNames，一行搞定，不用塞一长串 filter 逻辑
const filteredNames = computed(() => {
  const key = keyword.value.trim() // trim 去掉首尾空格，避免「打了空格就搜不到」
  if (!key) return allNames.value // 没输入关键词时，原样返回全部
  return allNames.value.filter((name) => name.includes(key))
})

// 命中数量也是算出来的，同样用 computed
const matchCount = computed(() => filteredNames.value.length)

/* ============================================================
   演示 3：watch 监听搜索词，做副作用
   ============================================================ */
// 把日志也放到页面上，这样不用开控制台也能看到「副作用确实发生了」
const watchLogs = ref([])

// watch 第 1 个参数：要监听谁（这里是搜索词）
// watch 第 2 个参数：变了之后做什么，参数是「新值」和「旧值」
watch(keyword, (newVal, oldVal) => {
  // 做副作用就该来这种地方：打日志、存 localStorage、发请求
  console.log('[watch] 搜索词变了：', oldVal, '→', newVal)
  // 新日志放最前面，方便一眼看到最新的一条
  watchLogs.value.unshift(`「${oldVal || '空'}」变成了「${newVal || '空'}」`)
  // 最多只留 6 条，免得页面被刷爆
  if (watchLogs.value.length > 6) watchLogs.value.pop()
})

function clearLogs() {
  watchLogs.value = []
}

/* ============================================================
   演示 4：watchEffect 自动收集依赖
   ============================================================ */
// 城市：和搜索词一起被 watchEffect 自动「盯上」
const city = ref('北京')

// 这个 ref 只用来看结果，所以只写不读
// 为什么强调「只写不读」？因为一读就会变成 watchEffect 的依赖，
// 一写又触发自己，那就永远停不下来了
const effectText = ref('')

// watchEffect 不需要告诉它监听谁：函数里用到了 keyword.value 和 city.value，
// 它就自动把这两个记成依赖，任何一个变了都会重新执行
// 而且它是「立刻先执行一次」的，所以页面一打开这句就有值
watchEffect(() => {
  effectText.value = `搜索「${keyword.value || '空'}」+ 城市「${city.value}」`
  console.log('[watchEffect] 重新执行了')
})
</script>

<template>
  <h1 class="page-title">第 5 章 · 计算属性与侦听器</h1>
  <p class="page-desc">computed 负责「算出一个结果」，watch 和 watchEffect 负责「数据变了就去做点事」。</p>

  <!-- ============================================================
       演示 1：购物车小计 + computed 缓存
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 1：购物车小计 —— 总价是算出来的，而且它有缓存</div>

    <div class="cart-item" v-for="item in cart" :key="item.id">
      <span style="flex: 1">{{ item.name }}</span>
      <span class="muted">单价 {{ item.price }} 元</span>
      <button class="btn btn-ghost" @click="changeQty(item.id, -1)">-</button>
      <span class="mono" style="width: 28px; text-align: center">{{ item.qty }}</span>
      <button class="btn btn-ghost" @click="changeQty(item.id, 1)">+</button>
      <span class="muted" style="width: 72px; text-align: right">
        小计 {{ item.price * item.qty }} 元
      </span>
    </div>

    <!-- 关键：把总价放在前面显示，好让「重算次数」拿到的是最新的数字 -->
    <p style="margin: 12px 0 4px">
      总价：<span class="big">{{ totalPrice }}</span> 元
    </p>
    <p class="muted" style="margin: 0">
      共 {{ totalCount }} 件，平均每件约 {{ averagePrice }} 元
    </p>

    <div class="row" style="margin-top: 10px">
      <button class="btn btn-ghost" @click="unrelated = unrelated + 1">
        点我改一个和总价无关的数据（当前 {{ unrelated }}）
      </button>
    </div>

    <p class="muted" style="margin-bottom: 0">
      computed 重新计算的次数：<span class="mono big" style="font-size: 18px">{{ computedRunCount }}</span>
    </p>

    <div class="tip">
      <strong>动手感受「缓存」：</strong>
      点上面的「无关按钮」十下，页面确实重新渲染了（数字在变），但「computed 重新计算的次数」一动不动，因为总价的依赖数据没变，Vue 直接把上次的结果拿给你。
      再点一次商品的 + / -，次数才会涨 1，因为这次它是真的需要重算了。
      如果你把总价改写成普通函数，上面那个次数就会跟着每次渲染一起涨——这就是 computed 和 methods 最大的区别。
    </div>
  </div>

  <!-- ============================================================
       演示 2：computed 做搜索过滤
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 2：用 computed 做搜索过滤 —— 把一长串筛选逻辑从模板里抽出来</div>

    <div class="row">
      <input v-model="keyword" placeholder="输入关键词，试试 牛 / 果 / 蛋" />
      <button class="btn btn-ghost" @click="keyword = ''">清空</button>
      <span class="muted">命中 {{ matchCount }} 项 / 共 {{ allNames.length }} 项</span>
    </div>

    <div class="row" style="margin-top: 10px">
      <!-- 模板里只写一个干净的名字，筛选细节全在 computed 里 -->
      <span v-for="name in filteredNames" :key="name" class="tag">{{ name }}</span>
      <!-- 一条都没匹配上时给个提示 -->
      <span v-if="matchCount === 0" class="muted">没有匹配到任何水果或食材</span>
    </div>

    <p class="muted" style="margin-bottom: 0">
      filteredNames 和 matchCount 都是 computed：数据一变它们自动重算，模板里当普通变量用就行，不需要加括号调用。
    </p>
  </div>

  <!-- ============================================================
       演示 3：watch 监听搜索词
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 3：watch 监听搜索词 —— 数据变了，就去做一件事（副作用）</div>

    <p class="muted" style="margin-top: 0">
      上面演示 2 的搜索框和这里是同一个数据，你在那儿打字，这里就会记一笔。
      同时打开 F12 的 Console，能看到 <span class="mono">[watch]</span> 打出来的新值和旧值。
    </p>

    <div class="row">
      <button class="btn btn-ghost" @click="clearLogs">清空日志</button>
      <span class="muted">只保留最近 6 条</span>
    </div>

    <ul class="log-list">
      <li v-for="(log, index) in watchLogs" :key="index">
        <span class="muted mono">{{ index + 1 }}</span>
        <span>{{ log }}</span>
      </li>
    </ul>
    <p v-if="watchLogs.length === 0" class="muted" style="margin-bottom: 0">
      还没有日志，去上面的搜索框打几个字吧。
    </p>

    <div class="warn">
      <strong>易混点：watch 是用来「做事」的，不是用来「算值」的。</strong>
      像「总价是多少」「过滤后有哪些」这种要一个结果的，用 computed；
      像「换了城市要重新请求天气」「内容变了要存进 localStorage」这种要产生动作的，用 watch。
    </div>
  </div>

  <!-- ============================================================
       演示 4：watchEffect 自动收集依赖
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 4：watchEffect —— 不告诉它监听谁，它自己看你用了谁</div>

    <div class="row">
      <!-- 这个输入框绑的是同一个 keyword，watchEffect 里也用到了它 -->
      <input v-model="keyword" placeholder="改这里也会让 watchEffect 重新跑" />
      <select v-model="city">
        <option value="北京">北京</option>
        <option value="上海">上海</option>
        <option value="广州">广州</option>
      </select>
    </div>

    <p style="margin-bottom: 0">
      watchEffect 看到的内容：<span class="mono" style="font-size: 16px">{{ effectText }}</span>
    </p>

    <p class="muted">
      注意代码里从来没有写过「监听 keyword」或「监听 city」，它只是把函数里用到的东西自动记成了依赖。
      这就是 watchEffect 和 watch 的最大区别：watch 要你点名，watchEffect 自己认人。
      另外它天生「先执行一次」，页面一打开这句就已经有值了（相当于自带 immediate）。
    </p>
  </div>

  <!-- ============================================================
       三者对比
       ============================================================ -->
  <h2>computed、watch、watchEffect 怎么选</h2>
  <table>
    <thead>
      <tr>
        <th>对比项</th>
        <th>computed</th>
        <th>watch</th>
        <th>watchEffect</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>它的目标</td>
        <td>算出一个值</td>
        <td>数据变了去执行动作</td>
        <td>数据变了去执行动作</td>
      </tr>
      <tr>
        <td>有返回值吗</td>
        <td>有，是个 ref</td>
        <td>没有</td>
        <td>没有</td>
      </tr>
      <tr>
        <td>有缓存吗</td>
        <td>有，依赖不变就不重算</td>
        <td>不涉及</td>
        <td>不涉及</td>
      </tr>
      <tr>
        <td>要指定监听谁吗</td>
        <td>不用，用到谁就是谁</td>
        <td>要，第 1 个参数点名</td>
        <td>不用，自动收集</td>
      </tr>
      <tr>
        <td>初次会执行吗</td>
        <td>被用到时才算一次</td>
        <td>默认不会，除非 immediate: true</td>
        <td>会，默认先执行一次</td>
      </tr>
      <tr>
        <td>本页的演示</td>
        <td>演示 1、演示 2</td>
        <td>演示 3</td>
        <td>演示 4</td>
      </tr>
    </tbody>
  </table>

  <div class="tip">
    <strong>选择口诀：算结果用 computed，做事情用 watch。</strong>
    要一件事产生「动作」（请求、存储、打日志），就别用 computed；
    要「一个值」，就别用 watch 再手动存一个 ref，那是绕远路。
  </div>

  <div class="card">
    <h3 style="margin-top: 0">动手试试</h3>
    <ol>
      <li>把演示 1 里 computed 内部那行「重算计数」注释掉，再把「computed 重算次数」换成一个普通函数去数，观察点无关按钮时次数的变化。</li>
      <li>给演示 3 的 watch 加上 <span class="mono">{ immediate: true }</span>（写在 watch 的第 3 个参数位置），刷新页面看看是不是一开始就多了一条日志。</li>
      <li>把演示 3 的 watch 改成 <span class="mono">watch(() => keyword.value, ...)</span>，跑起来效果是一样的，体会「监听谁」这件事。</li>
      <li>在演示 4 的 watchEffect 里多加一句用到 <span class="mono">totalCount.value</span> 的代码，然后去改商品数量，看看它是不是也自动开始响应商品变化了。</li>
      <li>思考题：演示 2 的 filteredNames 如果改用 watch 来写，要写几行？哪种更自然？</li>
    </ol>
  </div>
</template>

<style scoped>
/* 只是让演示更好看，逻辑部分不依赖这些样式 */

.cart-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 6px 10px;
  border: 1px solid #e3e6eb;
  border-radius: 8px;
  margin-bottom: 6px;
  font-size: 14px;
}

.tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  background: #e8f7f2;
  color: #10805f;
  font-size: 13px;
}

.log-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
}

.log-list li {
  display: flex;
  gap: 10px;
  padding: 5px 10px;
  border-left: 2px solid #10a37f;
  background: #f7f8fa;
  border-radius: 0 6px 6px 0;
  margin-bottom: 5px;
  font-size: 13px;
}
</style>
