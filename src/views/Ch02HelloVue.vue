<script setup>
// ============================================================
// 第 02 章的练习页：亲手感受"数据驱动视图"
// 这一章只用两个东西：ref（会变化的数据）和插值语法（把数据画到页面上）
// ============================================================
import { ref } from 'vue'

// ------------------------------------------------------------
// 1. 计数器：Vue 世界里的"Hello World"
// ------------------------------------------------------------
// ref(0) 读作"造一个初始值为 0、并且会被 Vue 持续盯着的数据盒子"。
// 以后只要盒子里的值变了，页面上所有用到它的地方都会自动更新。
const count = ref(0)

// 为什么把加减单独写成函数，而不是直接把表达式塞进模板？
// 因为函数有名字，"increase" 一眼就知道干什么；逻辑复杂时也好改、好复用。
function increase() {
  // 记牢这条口诀：script 里写 .value，template 里不写
  count.value++
}

function decrease() {
  count.value--
}

function reset() {
  count.value = 0
}

// ------------------------------------------------------------
// 2. 演示插值里能写什么、不能写什么
// ------------------------------------------------------------
const name = ref('小明')

// 下面这一堆字符串，是"要展示给读者看的代码样子"。
// 为什么要把它们存在 script 里，而不是直接写在模板里？
// 因为模板里如果出现两个连续的大括号，Vue 会把它当成插值真去计算，
// 你不但看不到源码，还可能直接编译报错。存成普通字符串再输出，
// 它就是一串纯文字了。（这个坑很典型，见本页第 2 节末尾的提示）
const interpolationMark = '{{ }}'

const samples = {
  showCount: '{{ count }}',
  timesTwo: '{{ count * 2 }}',
  ternary: "{{ count > 5 ? '多' : '少' }}",
  property: '{{ name.length }}',
  templateLiteral: '{{ `共${count}次` }}',
  andOperator: "{{ count > 0 && '点过了' }}",
}

const badSamples = {
  ifStatement: '{{ if (count) { ... } }}',
  forLoop: '{{ for (x of list) {} }}',
  declaration: '{{ let a = 1 }}',
  increment: '{{ count++ }}',
}

// 这是 index.html 里那个"舞台"，Vue 会把界面画进它里面。
// 同样存成字符串，页面上才能原样显示这段标签文字
const codeIndexHtml = '<div id="app"></div>'
</script>

<template>
  <h1 class="page-title">第 2 章 · 认识 Vue3</h1>
  <p class="page-desc">理解 Vue 的核心：你只改数据，页面自动跟着变。</p>

  <!-- ==================== 演示一：计数器 ==================== -->
  <h2>1. 亲手点一点：计数器</h2>
  <p>
    下面这些数字都由同一个数据盒子 <span class="mono">count</span> 决定。
    点按钮时我们只改数据，从没写过"把页面上的字换掉"这种代码。
  </p>

  <div class="demo">
    <div class="demo-label">点按钮改数据，观察页面上用到 count 的三处是否一起变</div>

    <div class="row">
      <span class="muted">大号显示：</span>
      <span class="big">{{ count }}</span>
    </div>
    <div class="row" style="margin-top: 6px">
      <span class="muted">普通显示：</span>
      <span>{{ count }}</span>
    </div>
    <div class="row" style="margin-top: 6px">
      <span class="muted">插到句子里：</span>
      <span>你已经点了 {{ count }} 次了</span>
    </div>

    <div class="row" style="margin-top: 12px">
      <button class="btn" @click="increase">加一</button>
      <button class="btn btn-ghost" @click="decrease">减一</button>
      <button class="btn btn-ghost" @click="reset">归零</button>
      <span class="muted">三处显示的是同一份数据，永远不会不一致</span>
    </div>
  </div>

  <div class="tip">
    对比第 0 章"手动改 DOM"的做法：那边要先 getElementById 找到元素，
    再 textContent = 新值 手动改文字，页面上有几处显示就得写几遍。
    这里只写了 count.value++ 一句，三处全自动更新。
  </div>

  <h3>点一下按钮，Vue 在背后做了什么</h3>
  <ol>
    <li>你点按钮，浏览器产生一个点击事件。</li>
    <li>模板里的 <span class="mono">@click="increase"</span> 早就告诉过 Vue：这个按钮被点时要调用 increase。</li>
    <li><span class="mono">count.value++</span> 执行，盒子里的值从 0 变成 1。</li>
    <li>Vue 的"监视机制"立刻发现这个盒子变了，并查出页面上有三处用到了它。</li>
    <li>Vue 只把这三处重新算一遍、刷新到页面上，其余部分不动。</li>
    <li>结束。整个过程你一行 DOM 操作代码都没写。</li>
  </ol>

  <!-- ==================== 演示二：插值里能写什么 ==================== -->
  <h2>2. 插值语法里到底能写什么</h2>
  <p>
    把下面输入框里的数字直接改一改（删掉重打试试），右边每一行的结果都会立刻重算，
    上面计数器里的数字也会一起变，因为它们用的是同一个 count。
    <span class="muted">输入框用 v-model 和数据绑在一起，第 3 章会讲，现在先用着。</span>
  </p>

  <div class="demo">
    <div class="demo-label">同一个数据，用不同写法算出来的结果</div>

    <div class="row">
      <span class="muted">把 count 改成：</span>
      <input type="number" v-model.number="count" style="width: 90px" />
      <span class="muted">名字：</span>
      <input v-model="name" style="width: 140px" />
    </div>

    <table>
      <thead>
        <tr>
          <th>模板里的写法</th>
          <th>现在的显示结果</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="mono">{{ samples.showCount }}</td>
          <td>{{ count }}</td>
          <td>最常见的用法：直接显示一个变量</td>
        </tr>
        <tr>
          <td class="mono">{{ samples.timesTwo }}</td>
          <td>{{ count * 2 }}</td>
          <td>可以写数学运算</td>
        </tr>
        <tr>
          <td class="mono">{{ samples.ternary }}</td>
          <td>{{ count > 5 ? '多' : '少' }}</td>
          <td>三元表达式：模板里替代 if 的办法</td>
        </tr>
        <tr>
          <td class="mono">{{ samples.property }}</td>
          <td>{{ name.length }}</td>
          <td>可以取属性，比如名字有几个字</td>
        </tr>
        <tr>
          <td class="mono">{{ samples.templateLiteral }}</td>
          <td>{{ `共${count}次` }}</td>
          <td>模板字符串也能用，适合拼一句人话</td>
        </tr>
        <tr>
          <td class="mono">{{ samples.andOperator }}</td>
          <td>{{ count > 0 && '点过了' }}</td>
          <td>条件成立才有文字；不成立时会原样显示 false</td>
        </tr>
      </tbody>
    </table>

    <p class="muted" style="margin-bottom: 0">
      最后一行值得留意：count 变成 0 或负数时，右边会显示 "false"。
      因为 && 是个表达式，它必须算出一个值。想让整块内容"消失"，
      要用第 3 章的条件渲染 v-if，那是另一回事。
    </p>
  </div>

  <h3>插值里不能放的东西</h3>
  <p>
    记住一句话：<b>{{ interpolationMark }} 里只能放"一个能算出值的东西"（表达式），
    不能放"一串命令"（语句）。</b>
  </p>

  <table>
    <thead>
      <tr>
        <th>不能这样写</th>
        <th>为什么</th>
        <th>应该怎么做</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="mono">{{ badSamples.ifStatement }}</td>
        <td>if 是语句，不是表达式，算不出一个值</td>
        <td>用三元：<span class="mono">{{ samples.ternary }}</span></td>
      </tr>
      <tr>
        <td class="mono">{{ badSamples.forLoop }}</td>
        <td>for 也是语句，而且是要"做好几件事"</td>
        <td>用 <span class="mono">v-for</span> 指令（第 3 章）</td>
      </tr>
      <tr>
        <td class="mono">{{ badSamples.declaration }}</td>
        <td>声明变量属于语句，写在模板里没有意义</td>
        <td>变量声明放在 script setup 里</td>
      </tr>
      <tr>
        <td class="mono">{{ badSamples.increment }}</td>
        <td>语法能过，但它是"改数据"，等于一边显示一边改，容易死循环</td>
        <td>改数据写在事件函数里，插值只负责"读"</td>
      </tr>
    </tbody>
  </table>

  <div class="warn">
    这一页的源码里你会发现一个现象：所有要"显示成代码"的文字，我都先在
    script 里存成字符串，再用插值输出。原因就是上面那个坑——模板里只要出现
    两个连续的大括号，Vue 就会去真算它，你不但看不到源码，还可能直接编译报错。
    你自己以后想展示代码时，记得也用这个办法。
  </div>

  <!-- ==================== 演示三：SFC 三块 ==================== -->
  <h2>3. 一个 .vue 文件里写了什么</h2>
  <p>
    .vue 文件叫"单文件组件"，意思是"写一个组件需要的东西都放在同一个文件里"。
    它固定由三块组成，顺序和三明治一样清楚：
    <span class="mono">script setup</span>（逻辑）、
    <span class="mono">template</span>（结构）、
    <span class="mono">style scoped</span>（样式，可省略）。
  </p>

  <table>
    <thead>
      <tr>
        <th>块</th>
        <th>对应第 0 章的类比</th>
        <th>作用</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="mono">script setup</td>
        <td>JavaScript（行为）</td>
        <td>有哪些数据、有哪些函数。必须带 setup 这个关键字</td>
      </tr>
      <tr>
        <td class="mono">template</td>
        <td>HTML（骨架）</td>
        <td>这个组件长什么样，里面写插值和 @click 这类 Vue 语法</td>
      </tr>
      <tr>
        <td class="mono">style scoped</td>
        <td>CSS（长相）</td>
        <td>这个组件自己的样式；scoped 表示只影响自己，不污染别的组件</td>
      </tr>
    </tbody>
  </table>

  <p>
    本页最上面的 <span class="mono">script setup</span> 里，就是刚才那个计数器的逻辑：
    <span class="mono">count</span>、<span class="mono">increase</span>、
    <span class="mono">decrease</span>、<span class="mono">reset</span>。
    它们没有任何"注册"动作，模板里就能直接写名字用——这就是 script setup 的好处：
    少写一堆模板代码。
  </p>

  <!-- ==================== 演示四：启动过程 ==================== -->
  <h2>4. 整个网站是怎么启动的</h2>
  <p>
    你在浏览器里看到的这一整页，起点只有一句话，它在
    <span class="mono">project/src/main.js</span> 里：
  </p>

  <pre><code>createApp(App).mount('#app')</code></pre>

  <table>
    <thead>
      <tr>
        <th>片段</th>
        <th>大白话解释</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="mono">createApp</td>
        <td>创建一个 Vue 应用，它是从 vue 包里 import 进来的函数</td>
      </tr>
      <tr>
        <td class="mono">(App)</td>
        <td>传入"根组件"，也就是整个页面的外壳，本项目里是 App.vue</td>
      </tr>
      <tr>
        <td class="mono">.mount</td>
        <td>"挂载"：把这个应用真正画到浏览器页面上</td>
      </tr>
      <tr>
        <td class="mono">('#app')</td>
        <td>画到哪去？画到页面里 id 为 app 的那个元素里面</td>
      </tr>
    </tbody>
  </table>

  <p>
    这个 "app" 藏在 <span class="mono">project/index.html</span> 里，
    它就是一个空盒子，等着 Vue 往里画东西（紧跟着还有一行 script 标签，
    负责把 main.js 引进来）：
  </p>

  <pre><code>{{ codeIndexHtml }}</code></pre>

  <p>所以整个启动链条是这样的：</p>
  <ol>
    <li>浏览器打开 index.html。</li>
    <li>页面加载 main.js，main.js 里又 import 了 App.vue 和 router。</li>
    <li>执行 createApp(App).use(router).mount('#app')。</li>
    <li>Vue 把 App.vue 的内容渲染到 id 为 app 的 div 里面。</li>
    <li>你看到左边菜单 + 右边章节内容。</li>
  </ol>

  <div class="warn">
    如果 mount('#app') 里的名字和 index.html 里的 id="app" 对不上，页面就会一片空白。
    这是新手最常见的"白屏"原因，遇到时先回来检查这两个名字。
  </div>

  <!-- ==================== 自测 ==================== -->
  <h2>5. 该你了</h2>
  <ul>
    <li>给计数器加一个"乘二"按钮，点一下让 count 变成两倍。</li>
    <li>在页面上加一处显示："当前是奇数还是偶数"（提示：用三元表达式和取余 %）。</li>
    <li>在下面的表格里再加一行，用 <span class="mono">name</span> 和 <span class="mono">count</span>
      拼一句 <span class="mono">某某某点了 5 次</span>。</li>
    <li>故意把 <span class="mono">main.js</span> 里的 <span class="mono">mount('#app')</span>
      改成别的名字，保存后看看页面变成什么样；看完记得改回来。</li>
  </ul>
</template>
