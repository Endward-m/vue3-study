<!-- ============================================================
  Ch03TemplateSyntax.vue —— 第 3 章「模板语法」练习页
  这一页是一个「游乐场」，每个演示都对应一种模板语法。
  建议边点边按 F12 看 Elements 面板，亲眼看到 DOM 的变化。
  文件结构顺序：<script setup> → <template> → <style scoped>
============================================================= -->

<script setup>
// 使用模板里所有要用到的响应式数据，都必须先从 vue 里 import 进来
import { ref } from 'vue'

/* ------------------------------------------------------------
   演示 1：v-bind（简写 :）—— 让属性跟着数据走
   ------------------------------------------------------------ */
// 色块的颜色。为什么存颜色值？因为 :style 里可以直接用它来设置背景色
const blockColor = ref('#10a37f')
// 色块的边长（单位 px）。注意这是「数字」，模板里再拼上 px
const blockSize = ref(90)

// 可选颜色列表，用 v-for 渲染成按钮，避免手写重复的按钮
const colorOptions = ref(['#10a37f', '#e08a2e', '#3b82f6', '#8b5cf6'])

// 单独放一个开关，用来演示 :disabled 这种「真假值属性」
const locked = ref(false)

/* ------------------------------------------------------------
   演示 2：v-bind 绑定 class 的「对象写法」和「数组写法」
   ------------------------------------------------------------ */
// 这两个开关决定要不要给元素加上对应的类名
const isActive = ref(true)
const isError = ref(false)
// 这是一个已经算好的类名字符串，用于演示数组写法
const themeClass = ref('theme-blue')

/* ------------------------------------------------------------
   演示 3：v-on（简写 @）—— 绑定事件
   ------------------------------------------------------------ */
const clickCount = ref(0)

// 事件处理函数：因为 count 是 ref，所以要用 .value
function handleClick() {
  clickCount.value = clickCount.value + 1
}

// 需要自己传参数时，用 @click="addBy(5, $event)" 的写法
// $event 是 Vue 提供的「事件对象」，这里用它读取被点击按钮上的文字
function addBy(step, event) {
  clickCount.value = clickCount.value + step
  console.log('点击来源按钮的文字是：', event.target.textContent)
}

function resetClick() {
  clickCount.value = 0
}

/* ------------------------------------------------------------
   演示 4：v-if 与 v-show 的区别
   ------------------------------------------------------------ */
// 一个开关，同时控制下面 v-if 和 v-show 两个元素
const isVisible = ref(true)

// 用「模板引用」把真实的 DOM 元素抓在手里，用来验证它到底存不存在
// 为什么需要它？因为光看文字说明不够直观，这里要真的去检查 DOM
const ifElement = ref(null) // v-if 那个元素，被移除时会自动变回 null
const showElement = ref(null) // v-show 那个元素，永远都在，所以不会是 null

/* ------------------------------------------------------------
   演示 5：v-for —— 循环渲染 + 为什么必须有 key
   ------------------------------------------------------------ */
// 每个条目都带一个独一无二的 id。为什么需要？因为 :key 要的是一个稳定不重复的值
const fruits = ref([
  { id: 1, name: '苹果' },
  { id: 2, name: '香蕉' },
  { id: 3, name: '橙子' },
])

// 自增的编号，保证每次新增的 id 都不会和已有条目撞车
let nextId = 4
const newFruitName = ref('')

function addFruit() {
  // 用 v-model.trim 去掉首尾空格后，如果还是空的就什么都不做
  if (!newFruitName.value) return
  // push 是数组自带的方法，往末尾加一项
  fruits.value.push({ id: nextId, name: newFruitName.value })
  nextId = nextId + 1 // 编号用掉一个就往后挪，避免重复
  newFruitName.value = '' // 清空输入框，方便继续输入
}

// 删除时按 id 找，而不是按下标找。为什么？因为下标会随着删除而错位
function removeFruit(id) {
  fruits.value = fruits.value.filter((item) => item.id !== id)
}

/* ------------------------------------------------------------
   演示 6：v-model —— 表单双向绑定
   ------------------------------------------------------------ */
// 普通输入框：绑定的是字符串
const text = ref('')
// 单个复选框：绑定的是布尔值（勾了就是 true）
const agree = ref(false)
// 多个复选框绑同一个数组：勾了哪几个，数组里就有哪几个 value
const hobbies = ref(['读书'])
// 下拉框：绑定的是选中项的 value
const city = ref('')
// 多行文本
const remark = ref('')

// 一键把整份表单填满。为什么要写成函数而不是写在模板里？
// 因为模板里塞一长串多行语句会很难读，逻辑放 js 里更清爽
function fillForm() {
  text.value = '你好，Vue3'
  agree.value = true
  hobbies.value = ['读书', '游泳']
  city.value = 'beijing'
  remark.value = '这是一段自动填进去的留言'
}
</script>

<template>
  <h1 class="page-title">第 3 章 · 模板语法</h1>
  <p class="page-desc">模板就是「会跟着数据变的 HTML」：数据一改，页面自动跟着改。</p>

  <!-- ============================================================
       演示 1：v-bind 让属性跟着数据走
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 1：v-bind（简写 :）—— 用数据控制一张 CSS 画的色块的「颜色」和「大小」</div>

    <!-- 这个 div 没有任何图片资源，纯靠 CSS 画出来一个方块 -->
    <!-- :style 用对象写法，键是 CSS 属性名（要写成驼峰，如 backgroundColor），值是数据 -->
    <!-- 注意宽度要拼上 'px'，因为 CSS 的长度必须有单位，而数据里存的是纯数字 -->
    <div
      :style="{
        width: blockSize + 'px',
        height: blockSize + 'px',
        backgroundColor: blockColor,
        borderRadius: '10px',
      }"
    ></div>

    <div class="row" style="margin-top: 10px">
      <!-- 用 v-for 把可选颜色渲染成按钮 -->
      <!-- :key 用颜色值本身即可，因为每个颜色都是独一无二、且不会被重新排序 -->
      <button
        v-for="color in colorOptions"
        :key="color"
        class="btn btn-ghost"
        :style="{ backgroundColor: color, width: '40px', height: '26px', padding: 0 }"
        @click="blockColor = color"
      ></button>

      <!-- 用 v-model.number 绑定滑块：.number 修饰符会把输入内容自动转成数字 -->
      <!-- 为什么需要它？因为 input 默认给的是字符串，直接拼 px 容易出问题 -->
      <span class="muted">边长：{{ blockSize }}px</span>
      <input type="range" min="40" max="180" v-model.number="blockSize" />
    </div>

    <div class="row" style="margin-top: 10px">
      <!-- 这里演示「布尔属性」的绑定：locked 为 true 时按钮就不可点 -->
      <button class="btn" :disabled="locked" @click="blockColor = '#e08a2e'">把色块变橙</button>
      <label class="muted">
        <input type="checkbox" v-model="locked" />
        锁住上面的按钮（演示 :disabled）
      </label>
    </div>

    <p class="muted" style="margin-bottom: 0">
      注意看代码里的写法是 <span class="mono">:style</span> 和 <span class="mono">:disabled</span>，
      前面那个冒号就是 v-bind 的缩写；少了冒号，Vue 会把引号里的内容当成普通字符串。
    </p>
  </div>

  <!-- ============================================================
       演示 2：:class 的对象写法 / 数组写法
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 2：:class 的两种写法 —— 对象写法用开关控制类名，数组写法拼多个类名</div>

    <div class="row">
      <label class="muted"><input type="checkbox" v-model="isActive" /> isActive 开关</label>
      <label class="muted"><input type="checkbox" v-model="isError" /> isError 开关</label>
      <select v-model="themeClass">
        <option value="theme-blue">蓝色主题</option>
        <option value="theme-pink">粉色主题</option>
      </select>
    </div>

    <!-- 对象写法：{ 类名: 布尔值 }，值为 true 才加上这个类 -->
    <div class="class-box" :class="{ 'is-active': isActive, 'is-error': isError }">
      对象写法：{ 'is-active': isActive, 'is-error': isError }
    </div>

    <!-- 数组写法：数组里可以混放字符串和对象，Vue 会自动拼起来 -->
    <!-- 这里还额外写了一个固定的 class="class-box"，两者会自动合并，不会互相覆盖 -->
    <div class="class-box" :class="[themeClass, { 'is-active': isActive }]">
      数组写法：[themeClass, { 'is-active': isActive }]
    </div>

    <p class="muted" style="margin-bottom: 0">
      按 F12 看看这两个 div 的 class 属性都是什么，比看文字说明清楚得多。
    </p>
  </div>

  <!-- ============================================================
       演示 3：v-on 绑定事件 + $event
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 3：v-on（简写 @）—— 点击计数，顺便认识事件对象 $event</div>

    <p class="big" style="margin: 6px 0">{{ clickCount }}</p>

    <div class="row">
      <!-- 不需要传参数时，直接写函数名：Vue 会自动把事件对象传进去 -->
      <button class="btn" @click="handleClick">点我加 1</button>
      <!-- 需要传参数时，就写「函数名(参数)」的小括号形式 -->
      <button class="btn" @click="addBy(5, $event)">一次加 5</button>
      <button class="btn btn-ghost" @click="resetClick">归零</button>
    </div>

    <!-- .once 修饰符：这个事件只会触发一次，之后再点就没反应了 -->
    <div class="row" style="margin-top: 10px">
      <button class="btn btn-ghost" @click.once="clickCount = clickCount + 100">
        .once：只能加一次 100
      </button>
      <!-- .stop 修饰符：阻止事件冒泡，点里面不会触发外面 -->
      <div class="bubble-outer" @click="clickCount = clickCount + 1">
        <span class="muted">外层（点它会加 1）</span>
        <button class="btn btn-ghost" @click.stop="clickCount = clickCount - 1">
          .stop：点我只减 1，不会连带外层
        </button>
      </div>
    </div>

    <p class="muted" style="margin-bottom: 0">
      打开 F12 的 Console，点「一次加 5」时会打印出是哪个按钮触发的，这就是 $event 的用处。
    </p>
  </div>

  <!-- ============================================================
       演示 4：v-if 与 v-show 的区别
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 4：v-if 与 v-show —— 一个让元素「消失」，一个只是「藏起来」</div>

    <div class="row">
      <button class="btn" @click="isVisible = !isVisible">
        {{ isVisible ? '收起下面两个方块' : '显示下面两个方块' }}
      </button>
      <span class="muted">用 F12 的 Elements 面板对照着看</span>
    </div>

    <div class="row" style="margin-top: 12px; align-items: flex-start">
      <div>
        <div v-if="isVisible" class="box box-if" ref="ifElement">v-if 的方块</div>
        <div v-else class="box box-hidden">v-if 为 false，这里整个元素都不存在</div>
        <!-- 用模板引用检查 DOM 是否存在，null 就代表不存在 -->
        <p class="muted">
          v-if 的 DOM：
          <span class="mono">{{ ifElement ? '存在' : '不存在（被整块删掉了）' }}</span>
        </p>
      </div>

      <div>
        <!-- v-show 为 false 时元素还在页面上，只是多了 style="display: none" -->
        <div v-show="isVisible" class="box box-show" ref="showElement">v-show 的方块</div>
        <div v-show="!isVisible" class="box box-hidden">v-show 为 false，我只是被藏起来了</div>
        <p class="muted">
          v-show 的 DOM：
          <span class="mono">{{ showElement ? '存在（只是 display: none）' : '不存在' }}</span>
        </p>
      </div>
    </div>

    <div class="tip">
      <strong>怎么选？</strong>切换很频繁就用 v-show（只改样式，便宜）；很少切换、或者不该一开始就渲染出来，就用 v-if（真的创建和销毁元素，更彻底）。
      v-if 还有个特点：为 false 时里面的组件和子元素根本不会被创建，所以能省性能。
    </div>
  </div>

  <!-- ============================================================
       演示 5：v-for 循环 + key
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 5：v-for —— 可增删的列表，顺便看看 key 长什么样</div>

    <div class="row">
      <input v-model.trim="newFruitName" placeholder="输入水果名，比如 西瓜" @keyup.enter="addFruit" />
      <button class="btn" @click="addFruit">添加一项</button>
      <span class="muted">共 {{ fruits.length }} 项</span>
    </div>

    <ul class="fruit-list">
      <!-- v-for 里第一个变量是每一项，第二个变量是下标 -->
      <!-- :key 用 item.id 而不是 index：因为 id 是稳定的，下标会随着增删错位 -->
      <li v-for="(item, index) in fruits" :key="item.id">
        <span class="mono muted">index={{ index }}</span>
        <span class="mono muted">key={{ item.id }}</span>
        <span>{{ item.name }}</span>
        <button class="btn btn-ghost" @click="removeFruit(item.id)">删除</button>
      </li>
    </ul>

    <div class="warn">
      <strong>为什么必须写 :key？</strong>
      key 是每个元素的「身份证号」。列表增删时 Vue 靠它认出哪一项是哪一项，才能只更新变化的部分。
      用下标当 key 的话，删掉第一项后所有下标都会平移，Vue 就会认错元素，输入框内容串行之类的问题就是这么来的。
    </div>
  </div>

  <!-- ============================================================
       演示 6：v-model 双向绑定
       ============================================================ -->
  <div class="demo">
    <div class="demo-label">演示 6：v-model —— 表单双向绑定，你改它也改，它改你也变</div>

    <div class="row">
      <label class="muted" style="width: 90px">文本框</label>
      <input v-model="text" placeholder="随便打点字，看下面实时变化" />
      <span class="muted">实时值：<span class="mono">{{ text || '(空)' }}</span></span>
    </div>

    <div class="row" style="margin-top: 8px">
      <!-- .lazy 修饰符：输入过程中不同步，等到输入框失焦（或者按回车）才同步 -->
      <label class="muted" style="width: 90px">.lazy</label>
      <input v-model.lazy="text" placeholder="这个要失焦后才同步" />
    </div>

    <div class="row" style="margin-top: 8px">
      <label class="muted" style="width: 90px">单选框</label>
      <label class="muted"><input type="checkbox" v-model="agree" /> 我同意</label>
      <span class="muted">值是：<span class="mono">{{ agree }}</span>（布尔值）</span>
    </div>

    <div class="row" style="margin-top: 8px">
      <label class="muted" style="width: 90px">多选框</label>
      <!-- 多个复选框绑同一个数组，勾中哪个就把哪个的 value 加进数组 -->
      <label class="muted"><input type="checkbox" value="读书" v-model="hobbies" /> 读书</label>
      <label class="muted"><input type="checkbox" value="跑步" v-model="hobbies" /> 跑步</label>
      <label class="muted"><input type="checkbox" value="游泳" v-model="hobbies" /> 游泳</label>
      <span class="muted">数组：<span class="mono">{{ hobbies }}</span></span>
    </div>

    <div class="row" style="margin-top: 8px">
      <label class="muted" style="width: 90px">下拉框</label>
      <select v-model="city">
        <option value="" disabled>请选择城市</option>
        <option value="beijing">北京</option>
        <option value="shanghai">上海</option>
        <option value="guangzhou">广州</option>
      </select>
      <span class="muted">选中：<span class="mono">{{ city || '(还没选)' }}</span></span>
    </div>

    <div class="row" style="margin-top: 8px; align-items: flex-start">
      <label class="muted" style="width: 90px">多行文本</label>
      <div>
        <!-- textarea 里不要写 {{ }}，直接 v-model 就够了 -->
        <textarea v-model="remark" rows="3" placeholder="多行留言"></textarea>
        <p class="muted" style="margin: 4px 0 0">
          你写了 {{ remark.length }} 个字
        </p>
      </div>
    </div>

    <div class="tip">
      一键把表单填满（体会「数据变了，输入框也跟着变」这个反方向）：
      <button
        class="btn btn-ghost"
        style="margin-left: 8px"
        @click="fillForm"
      >
        自动填充
      </button>
    </div>
  </div>

  <!-- ============================================================
       指令对比总结表
       ============================================================ -->
  <h2>指令速查表</h2>
  <table>
    <thead>
      <tr>
        <th>指令</th>
        <th>简写</th>
        <th>干什么</th>
        <th>本页的演示</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="mono">&#123;&#123; &#125;&#125;</td>
        <td>无</td>
        <td>把数据显示成文字</td>
        <td>计数器上的数字</td>
      </tr>
      <tr>
        <td class="mono">v-bind</td>
        <td class="mono">:</td>
        <td>让 HTML 属性跟着数据走</td>
        <td>色块的颜色和大小</td>
      </tr>
      <tr>
        <td class="mono">v-on</td>
        <td class="mono">@</td>
        <td>绑定事件</td>
        <td>点击计数</td>
      </tr>
      <tr>
        <td class="mono">v-if / v-show</td>
        <td>无</td>
        <td>控制显示与隐藏（原理不同）</td>
        <td>演示 4</td>
      </tr>
      <tr>
        <td class="mono">v-for</td>
        <td>无</td>
        <td>循环渲染列表</td>
        <td>可增删的列表</td>
      </tr>
      <tr>
        <td class="mono">v-model</td>
        <td>无</td>
        <td>表单双向绑定</td>
        <td>演示 6</td>
      </tr>
    </tbody>
  </table>

  <div class="card">
    <h3 style="margin-top: 0">动手试试</h3>
    <ol>
      <li>把演示 5 里列表项的 :key 从 item.id 改成 index，然后删掉第一项，观察有没有奇怪的现象。</li>
      <li>把演示 4 的 isVisible 关掉，按 F12 看看两个方块在 DOM 上的差别。</li>
      <li>给演示 3 的「归零」按钮改成只按一次就永远失效（提示：想想 .once）。</li>
      <li>给演示 6 的文本框加上 .number 修饰符，试试输入数字，看类型变没变。</li>
    </ol>
  </div>
</template>

<style scoped>
/* 下面这些样式只是为了把演示展示得清楚一点，不影响逻辑 */

.class-box {
  padding: 10px 12px;
  margin-top: 8px;
  border: 1px solid #e3e6eb;
  border-radius: 8px;
  font-size: 13px;
}

/* 对象写法里 is-active 为 true 时会加上这个类 */
.is-active {
  border-color: #10a37f;
  background: #e8f7f2;
}

/* isError 为 true 时加上这个类 */
.is-error {
  color: #c0392b;
}

/* 数组写法里用的主题类 */
.theme-blue {
  background: #eef4ff;
}

.theme-pink {
  background: #fdeef6;
}

.box {
  width: 190px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 6px;
}

.box-if {
  background: #e8f7f2;
  border: 1px dashed #10a37f;
}

.box-show {
  background: #eef4ff;
  border: 1px dashed #3b82f6;
}

.box-hidden {
  background: #f2f4f7;
  border: 1px dashed #c9ced6;
  color: #767f8c;
}

.bubble-outer {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 12px;
  border: 1px dashed #c9ced6;
  border-radius: 8px;
}

.fruit-list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}

.fruit-list li {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 6px 10px;
  border: 1px solid #e3e6eb;
  border-radius: 8px;
  margin-bottom: 6px;
}
</style>
