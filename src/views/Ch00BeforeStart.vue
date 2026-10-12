<script setup>
// ============================================================
// 第 00 章的练习页
// 这一章还没有正经学 Vue，所以先只导入最基础的 ref，
// 目的是让你"看得见"两种做法的差别。
// ============================================================
import { ref } from 'vue'

// ------------------------------------------------------------
// 演示一：用"原生 JS"的思路做计数器
// ------------------------------------------------------------
// 注意这里用的是普通的 let，不是 ref。
// 普通变量改了以后，Vue 完全不知道，所以页面不会自动更新。
// 这正是我们要让你亲眼看到的"麻烦"。
let nativeCount = 0

function addNative() {
  nativeCount = nativeCount + 1

  // 手动去页面里找到那个元素（靠 id 找）
  const el = document.getElementById('native-score')
  // 为什么要判断 el 存不存在？因为找不到时它是 null，直接赋值会报错、整页崩掉，
  // 这就是原生写法最典型的坑
  if (el) {
    // 手动把文字换掉：数据变了以后，必须我们自己动手同步页面
    el.textContent = nativeCount
  }

  // 故意"忘记"更新第二个显示位置。
  // 现实中漏掉一行是常有的事，结果就是同一个数据在页面上显示两个不同的值。
}

// ------------------------------------------------------------
// 演示二：用 Vue 的思路做同一个计数器
// ------------------------------------------------------------
// ref(0) 的意思是：造一个 Vue 会持续"盯着"的数据盒子，初始值是 0。
// 只要盒子里的值变了，所有用到它的地方都会自动更新。
const vueCount = ref(0)

function addVue() {
  // 在 JS 里改 ref 的值必须写 .value（第 4 章会解释为什么）
  vueCount.value = vueCount.value + 1
  // 就到这里为止了。页面会自动变，不需要 getElementById，也不怕漏掉某处。
}
</script>

<template>
  <!-- 页面开头固定格式：标题 + 一句话说明 -->
  <h1 class="page-title">第 0 章 · 开始之前</h1>
  <p class="page-desc">在写第一行 Vue 代码之前，先搞清楚网页是怎么来的、为什么需要框架。</p>

  <!-- ---------- 第一部分：HTML / CSS / JS 的分工 ---------- -->
  <h2>1. 一个网页是怎么来的</h2>
  <p>
    把做网页想象成盖房子：HTML 是骨架，CSS 是装修，JavaScript 是水电电路。
    三样东西各管一摊，互不打架。
  </p>

  <table>
    <thead>
      <tr>
        <th>技术</th>
        <th>盖房子类比</th>
        <th>负责什么</th>
        <th>具体例子</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>HTML</td>
        <td>墙、门、窗</td>
        <td>内容和结构</td>
        <td>一个标题、一个按钮、一张图</td>
      </tr>
      <tr>
        <td>CSS</td>
        <td>刷漆、贴壁纸</td>
        <td>外观和样式</td>
        <td>按钮是绿色、字多大、间距多少</td>
      </tr>
      <tr>
        <td>JavaScript</td>
        <td>水电与电路</td>
        <td>行为和交互</td>
        <td>点按钮数字加一、输入时实时统计</td>
      </tr>
    </tbody>
  </table>

  <!-- ---------- 第二部分：本项目结构 ---------- -->
  <h2>2. 本项目长什么样</h2>
  <p>你只需要先记住一句话：notes 放"读"的笔记，project 放"写"的代码。</p>

  <table>
    <thead>
      <tr>
        <th>路径</th>
        <th>是什么</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="mono">notes\</td>
        <td>学习笔记，就是你现在读的这份内容的 Markdown 版本</td>
      </tr>
      <tr>
        <td class="mono">project\</td>
        <td>练习项目：一个能真正跑起来的 Vue 网站</td>
      </tr>
      <tr>
        <td class="mono">project\index.html</td>
        <td>网页入口，页面里有一个空的 &lt;div id="app"&gt; 等着 Vue 来画</td>
      </tr>
      <tr>
        <td class="mono">project\package.json</td>
        <td>项目清单：声明用了哪些依赖、有哪些命令</td>
      </tr>
      <tr>
        <td class="mono">project\src\main.js</td>
        <td>整个项目的 JS 入口，程序从这里开始跑</td>
      </tr>
      <tr>
        <td class="mono">project\src\App.vue</td>
        <td>根组件，也就是页面外壳：左边菜单 + 右边内容</td>
      </tr>
      <tr>
        <td class="mono">project\src\style.css</td>
        <td>全局样式，所有页面共用的一套基础样式</td>
      </tr>
      <tr>
        <td class="mono">project\src\router\</td>
        <td>路由配置：哪个网址显示哪个页面</td>
      </tr>
      <tr>
        <td class="mono">project\src\views\</td>
        <td>每一章对应的练习页面，你要动手改的就是这里</td>
      </tr>
    </tbody>
  </table>

  <div class="tip">
    想不起来怎么启动项目时，看下面这两条命令。第一次必须先 install，
    因为依赖的代码还没下载到 node_modules 里。
  </div>

  <pre><code>cd d:\Code\Vue3学习\project
npm install      # 照着 package.json 的清单下载依赖，第一次必须跑
npm run dev      # 启动开发服务器，改文件会自动刷新页面</code></pre>

  <!-- ---------- 第三部分：核心对比演示 ---------- -->
  <h2>3. 动手玩：手动改页面 vs Vue 自动改</h2>
  <p>
    下面两个演示做的事情完全一样（点一次加一分），但实现方式完全不同。
    请两边都点几下，重点观察每一侧"第二个数字"的表现。
  </p>

  <!-- 每张演示卡片都包一层 .demo，并配一句 .demo-label 说明它在证明什么 -->
  <div class="demo">
    <div class="demo-label">原生 JS 写法：改完数据，还得自己动手去改页面</div>

    <div class="row">
      <span class="muted">主显示（JS 里有手动同步它）：</span>
      <!-- 注意这里没有用 {{ }}，因为这段文字是交给原生 JS 去改的。
           它只是一个"普通的页面元素"，Vue 不管它。 -->
      <span id="native-score" class="big">0</span>
    </div>

    <div class="row" style="margin-top: 8px">
      <span class="muted">第二个显示位置（JS 里故意忘了同步）：</span>
      <!-- 这个数字写死成 0，永远不会变，用来展示"数据变了页面没变"的后果 -->
      <span class="mono">0</span>
    </div>

    <div class="row" style="margin-top: 10px">
      <button class="btn" @click="addNative">加一分（原生）</button>
      <span class="muted">
        代码做了三件事：改变量、getElementById 找元素、手动改文字。
        少写一步，页面就和数据对不上了。
      </span>
    </div>
  </div>

  <div class="demo">
    <div class="demo-label">Vue 写法：只改数据，页面自己跟着变</div>

    <div class="row">
      <span class="muted">主显示：</span>
      <!-- {{ }} 是插值语法。Vue 会盯着 vueCount，它一变就重新算这里 -->
      <span class="big">{{ vueCount }}</span>
    </div>

    <div class="row" style="margin-top: 8px">
      <span class="muted">第二个显示位置（没做任何额外同步）：</span>
      <!-- 注意：这里不需要任何额外代码，它也会自动跟着变 -->
      <span class="mono">{{ vueCount }}</span>
    </div>

    <div class="row" style="margin-top: 10px">
      <button class="btn" @click="addVue">加一分（Vue）</button>
      <span class="muted">
        代码只做了一件事：vueCount.value++ 。不管页面上有几处用到它，全都自动更新。
      </span>
    </div>
  </div>

  <div class="warn">
    小结一下这两张卡片的差别：原生写法里，"数据"和"页面"是两套需要你亲手对齐的东西；
    Vue 里页面只是数据的"投影"，你永远只改数据一处。
    这就是所谓「数据驱动视图」，也是后面每一章围绕的中心思想。
  </div>

  <!-- ---------- 第四部分：怎么用这套笔记 ---------- -->
  <h2>4. 怎么用这套笔记</h2>
  <ol>
    <li>先读 notes 文件夹里对应编号的笔记，把概念弄明白。</li>
    <li>再回到左边侧边栏点开同一章，动手改页面上的代码，看效果变化。</li>
    <li>最后一定要做笔记末尾的自测题，动手写一遍比看十遍有用。</li>
  </ol>

  <div class="tip">
    这个项目就是给你改坏的：改错了、页面白屏了，都不要紧，
    改回来或者重新照着笔记抄一遍就行。不动手，永远学不会。
  </div>
</template>
