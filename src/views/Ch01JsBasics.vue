<script setup>
// ============================================================
// 第 01 章的练习页：把第 1 章的 JS 重点做成可以动手玩的小工具
// 这里刻意只用最基础的 Vue 能力（ref / computed），
// 让你把注意力放在 JS 语法本身，而不是框架上。
// ============================================================
import { ref, computed } from 'vue'

// ------------------------------------------------------------
// 演示一：数组方法（map / filter / find / reduce）
// ------------------------------------------------------------
// 用字符串接收用户输入，而不是数组。
// 为什么？因为输入框只能给你"文本"，把它变成数组是我们自己的活儿。
const rawInput = ref('1, 2, 3, 4, 5, 6, 7')

// computed 的意思是"根据别的数据算出来的数据"。
// 好处：rawInput 一变，nums 自动重算，页面上所有用到 nums 的地方也跟着变。
const nums = computed(() => {
  // 一步步拆开写，方便你看清每个方法在干什么
  return rawInput.value
    .split(',')                      // 按逗号切成字符串数组
    .map((s) => s.trim())            // 去掉每段两边的空格，否则 Number(' 3 ') 也有风险
    .filter((s) => s !== '')         // 丢掉空字符串，比如结尾多打了一个逗号
    .map(Number)                     // 把字符串转成真正的数字
    .filter((n) => !Number.isNaN(n)) // 丢掉转不动的（比如用户输了字母）
})

// map：一对一"变形"。这里把每个数字变成它的平方，长度不变
const squared = computed(() => nums.value.map((n) => n * n))

// filter：筛选。这里挑出偶数（能用 2 整除的数）
const evens = computed(() => nums.value.filter((n) => n % 2 === 0))

// find：只找"第一个"满足条件的元素，找不到返回 undefined
const firstBig = computed(() => nums.value.find((n) => n > 3))

// reduce：把整个数组"压成一个值"。第二个参数 0 是起始值，
// 不传它的话第一次计算会拿数组第一个元素当起始值，很容易算错
const total = computed(() => nums.value.reduce((sum, n) => sum + n, 0))

// 页面上显示数组时，用 join 拼成一句话更清爽；
// 直接显示数组变量的话，Vue 会把整个结构打印出来，很难看
const squaredText = computed(() => squared.value.join('、'))
const evensText = computed(() => (evens.value.length ? evens.value.join('、') : '（一个都没有）'))

// ------------------------------------------------------------
// 演示二：箭头函数 + 解构 + 展开运算符
// ------------------------------------------------------------
const yourName = ref('小明')

// 造一个"用户对象"。用 computed 是因为它依赖 yourName，
// 名字一改，这个对象就跟着重造
const user = computed(() => ({
  name: yourName.value,
  age: 18,
  city: '北京',
}))

// 解构赋值：从对象里按名字把字段取出来。
// 为什么要再包一层 computed？如果直接写 const { name } = user，
// 取到的是一个"死"的值，以后 user 变了它不会跟着变（第 4 章会讲原因）。
// 在计算函数内部解构，就既能演示解构语法，又不影响自动更新。
const intro = computed(() => {
  const { name, age, city } = user.value
  // 模板字符串：用反引号把变量直接嵌进句子里，比用加号拼接好读
  return `${name}，${age} 岁，来自${city}`
})

// 展开运算符：复制出一份新对象，只改 age，原来的 user 不受影响。
// 在 Vue 里"造新对象"比"改老对象"更安全，这个习惯请从现在开始养成
const olderUser = computed(() => {
  return { ...user.value, age: user.value.age + 1 }
})

// 箭头函数：只有一个参数时括号可以省，函数体只有一句时可以连 return 都省
const makeGreeting = (n) => `你好，${n}！`

// 把箭头函数的"源码样子"和"运行结果"都显示出来，方便对照
const greeting = computed(() => makeGreeting(yourName.value))

// ------------------------------------------------------------
// 演示三：异步（Promise + async / await）
// ------------------------------------------------------------
const loading = ref(false)   // 是否正在加载，用来控制界面显示"加载中"
const userData = ref(null)   // 请求成功后拿到的数据，一开始还没有，所以是 null
const errorMsg = ref('')     // 出错时的提示文字
const shouldFail = ref(false) // 勾上它，就模拟一次"请求失败"

// 用一个 Promise 模拟"网络请求"：1.2 秒后才会给出结果。
// 为什么不用真的请求接口？因为现在还没有后端，setTimeout 足以演示"等待"这件事
function fakeRequest() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail.value) {
        // reject 表示"失败了"，失败原因会传给外面的 catch
        reject(new Error('网络开小差了'))
      } else {
        // resolve 表示"成功了，结果在这里"
        resolve({ name: '小明', age: 18, city: '北京' })
      }
    }, 1200)
  })
}

// async 关键字：函数里才能用 await。
// await 的意思是"在这里等结果回来"，但等待期间页面不会卡死，按钮还能点
async function loadUser() {
  loading.value = true
  userData.value = null
  errorMsg.value = ''

  try {
    const data = await fakeRequest()
    userData.value = data
  } catch (err) {
    // 请求失败会跑到这里。不写 catch 的话，页面会报一大堆红字
    errorMsg.value = err.message
  } finally {
    // finally 里的代码"无论成功失败都会执行"，
    // 把"结束加载"放这里，就不用两边各写一次
    loading.value = false
  }
}

// 第 1 章讲过的 Object.entries：把对象变成 [键, 值] 的数组，再拼成一行行文字。
// 用它在页面上展示对象，比直接把对象丢进模板里清楚得多
const dataLines = computed(() => {
  if (!userData.value) return []
  return Object.entries(userData.value).map(([key, value]) => `${key}：${value}`)
})

// 再包一层，是为了让模板里只写一个变量名，不写判断。
// 顺手复习三元运算符：有数据就拼起来，没数据就给一句提示
const dataText = computed(() =>
  dataLines.value.length ? dataLines.value.join(' ｜ ') : '（还没有数据）',
)
</script>

<template>
  <h1 class="page-title">第 1 章 · JS 前置知识</h1>
  <p class="page-desc">只讲 Vue 里天天用到的 JS：数组方法、箭头函数、解构、异步。</p>

  <!-- ==================== 演示一：数组方法 ==================== -->
  <h2>1. 数组方法：map / filter / find / reduce</h2>
  <p>
    在下面输入一串数字（用逗号隔开），下面四行结果会实时更新。
    这个页面本身就在用它们：你改输入框，结果自动跟着变。
  </p>

  <div class="demo">
    <div class="demo-label">改一改输入框里的数字，观察四种方法各自算出了什么</div>

    <div class="row">
      <!-- v-model 是 Vue 的"双向绑定"：输入框里的字会写进 rawInput，
           rawInput 变了输入框也会跟着变。第 3 章会详细讲，现在先照抄 -->
      <input v-model="rawInput" style="min-width: 320px" placeholder="例如：1, 2, 3" />
      <span class="muted">解析出的数组长度：{{ nums.length }}</span>
    </div>

    <div class="result">
      <!-- 每一行都是"方法名 + 结果"，方便你一眼对照 -->
      <div class="result-line">
        <span class="mono tag">map((n) =&gt; n * n)</span>
        <span>每个数变成自己的平方：{{ squaredText }}</span>
      </div>
      <div class="result-line">
        <span class="mono tag">filter((n) =&gt; n % 2 === 0)</span>
        <span>只留下偶数：{{ evensText }}</span>
      </div>
      <div class="result-line">
        <span class="mono tag">find((n) =&gt; n &gt; 3)</span>
        <!-- find 找不到时是 undefined，用 ?? 给一个兜底文字，避免页面显示 undefined -->
        <span>第一个大于 3 的数：{{ firstBig ?? '没找到' }}</span>
      </div>
      <div class="result-line">
        <span class="mono tag">reduce((sum, n) =&gt; sum + n, 0)</span>
        <span>全部加起来：{{ total }}</span>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>方法</th>
        <th>返回什么</th>
        <th>长度会变吗</th>
        <th>什么时候用</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="mono">map</td>
        <td>新数组</td>
        <td>一样长</td>
        <td>把每一项变成另一种样子（取字段、算平方）</td>
      </tr>
      <tr>
        <td class="mono">filter</td>
        <td>新数组</td>
        <td>可能变短</td>
        <td>按条件挑出一部分</td>
      </tr>
      <tr>
        <td class="mono">find</td>
        <td>单个元素或 undefined</td>
        <td>不适用</td>
        <td>只找第一个匹配的</td>
      </tr>
      <tr>
        <td class="mono">reduce</td>
        <td>一个值</td>
        <td>不适用</td>
        <td>把整个数组算成一个结果（求和、统计）</td>
      </tr>
    </tbody>
  </table>

  <div class="warn">
    重要习惯：map / filter / reduce 都<b>不会修改原数组</b>，而是返回一个新东西。
    所以一定要把返回值接住（比如写进 computed），否则等于白算。
  </div>

  <!-- ==================== 演示二：箭头函数 + 解构 ==================== -->
  <h2>2. 箭头函数、解构赋值、展开运算符</h2>
  <p>改一下名字，看看三样东西是怎么联动的。</p>

  <div class="demo">
    <div class="demo-label">一个输入框，同时驱动"解构"和"箭头函数"的结果</div>

    <div class="row">
      <input v-model="yourName" placeholder="输入名字" />
      <span class="muted">你输入的每个字，都会让下面三处立刻重算</span>
    </div>

    <div class="result">
      <div class="result-line">
        <span class="mono tag">const { name, age, city } = user</span>
        <span>解构出来的内容：{{ intro }}</span>
      </div>
      <div class="result-line">
        <span class="mono tag">{ ...user, age: user.age + 1 }</span>
        <span>
          展开运算符复制一份并改掉年龄：{{ olderUser.name }}，{{ olderUser.age }} 岁
        </span>
      </div>
      <div class="result-line">
        <span class="mono tag">const f = (n) =&gt; `你好，$&#123;n&#125;！`</span>
        <span>箭头函数算出来的结果：{{ greeting }}</span>
      </div>
    </div>

    <p class="muted" style="margin-bottom: 0">
      注意"展开运算符"那一行：原来的 user 的年龄还是 18，我们只是造了一个新对象。
      这种"复制出新对象再改"的写法，在 Vue 里比直接改原对象安全得多。
    </p>
  </div>

  <div class="tip">
    看上面那几个 <span class="mono">tag</span> 的写法：它们就是真实的 JS 语法。
    你以后在项目里看到 <span class="mono">(n) =&gt; ...</span>，就念成"一个待会儿才被调用的动作"，
    它现在并没有执行，只有等到遍历到某一项、或者有人点击时才会执行。
  </div>

  <!-- ==================== 演示三：异步 ==================== -->
  <h2>3. 异步：先去做别的事，结果回来了再通知我</h2>
  <p>
    点下面的按钮，代码会"等"1.2 秒。请留意：等待期间按钮会变成"加载中"，
    但页面并没有死掉，你照样能滚动、能点别的。
  </p>

  <div class="demo">
    <div class="demo-label">用 setTimeout 模拟一次网络请求：加载中 → 成功或失败</div>

    <div class="row">
      <!-- disabled 绑定 loading：加载中时按钮点不动，防止用户狂点发起多次请求 -->
      <button class="btn" :disabled="loading" @click="loadUser">
        {{ loading ? '加载中…' : '加载用户数据' }}
      </button>

      <!-- v-model 帮我们做了"双向绑定"：勾选框一改，shouldFail 就变（第 3 章细讲） -->
      <label class="row" style="gap: 6px">
        <input type="checkbox" v-model="shouldFail" />
        <span class="muted">勾上它，模拟请求失败</span>
      </label>
    </div>

    <div class="result">
      <div class="result-line">
        <span class="mono tag">loading</span>
        <span>{{ loading }}</span>
      </div>
      <div class="result-line">
        <span class="mono tag">拿到数据</span>
        <!-- 这里只显示一个已经算好的字符串，判断逻辑都放在 script 里 -->
        <span>{{ dataText }}</span>
      </div>
      <div class="result-line">
        <span class="mono tag">catch 到的错误</span>
        <span>{{ errorMsg || '（没有错误）' }}</span>
      </div>
    </div>
  </div>

  <pre><code>async function loadUser() {
  loading.value = true
  try {
    // await 会在这里等结果，但等待期间不卡住整个页面
    const data = await fakeRequest()
    userData.value = data
  } catch (err) {
    errorMsg.value = err.message      // 失败走这条路
  } finally {
    loading.value = false             // 不管成功失败都要收尾
  }
}</code></pre>

  <div class="tip">
    三件事记住就够了：函数前面加 <span class="mono">async</span>，里面才能用
    <span class="mono">await</span>；<span class="mono">await</span> 的结果就是 Promise
    成功时的值；给慢操作配一个 <span class="mono">try / catch</span>，程序才不会崩。
  </div>

  <!-- ==================== 自测提示 ==================== -->
  <h2>4. 该你了</h2>
  <ul>
    <li>把第一个演示里的 <span class="mono">n * n</span> 改成 <span class="mono">n + 100</span>，保存后看结果变化。</li>
    <li>把 <span class="mono">filter</span> 的条件改成"大于 2"，再改成"是奇数"（提示：<span class="mono">n % 2 === 1</span>）。</li>
    <li>给第一个演示再加一行：用 <span class="mono">find</span> 找出"第一个偶数"。</li>
    <li>把 <span class="mono">fakeRequest</span> 里的 1200 改成 3000，感受一下"加载中"状态的存在感。</li>
  </ul>
</template>

<style scoped>
/* 这一小块样式只属于本组件（scoped 的作用，第 2 章会讲）。
   为什么自己不写按钮和表格样式？因为 style.css 里已经有全局的了，重复写是浪费。 */
.result {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.result-line {
  display: flex;
  gap: 10px;
  align-items: baseline;
  flex-wrap: wrap;
  font-size: 14px;
}

/* 固定宽度，让每一行的代码标签左对齐排成一列，方便对照 */
.tag {
  flex: 0 0 260px;
  font-size: 12.5px;
  color: #c0392b;
  background: var(--code-bg);
  padding: 2px 6px;
  border-radius: 5px;
}
</style>
