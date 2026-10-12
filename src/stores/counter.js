// ============================================================
// src/stores/counter.js —— 一个最基础的 Pinia 仓库（store）
//
// 把 store 想象成一个「公共储物柜」：
//   - 里面放的东西（count、history），整栋楼（所有组件）都能拿出来看和改
//   - 谁改了，所有用到它的组件都会自动跟着变（因为里面还是响应式数据）
//
// 本项目用的是 Pinia 的「组合式写法」（setup store）：
//   第二个参数传一个函数，函数里写法和你在组件 <script setup> 里几乎一样，
//   最后 return 出去什么，外面就能用什么。
// ============================================================

// ref / computed 依然要从 vue 里导入，因为 store 里用的还是 Vue 的响应式工具
import { ref, computed } from 'vue'
// defineStore 是 Pinia 提供的「定义仓库」函数
import { defineStore } from 'pinia'

// 第一个参数 'counter' 是这个仓库的唯一名字（身份证号）
//   -> 它会出现在调试工具的列表里，也用于避免重复定义，所以别重名
// 第二个参数是一个函数，这种写法叫 setup store（组合式写法的 store）
export const useCounterStore = defineStore('counter', () => {
  // ------------------------------------------------------------
  // 一、state：仓库里的数据
  // 在组合式写法里，state 就是一堆 ref
  // ------------------------------------------------------------

  // 当前计数：初始值 0
  const count = ref(0)

  // 操作历史：每点一次按钮就记一条，方便在页面上直观看到「都发生了什么」
  // 用数组的原因是：历史记录天然是一条一条往后追加的
  const history = ref([])

  // ------------------------------------------------------------
  // 二、getters：由 state 算出来的「派生数据」
  // 在组合式写法里，getters 就是 computed——注意这里不用再写 .value，
  // 因为在模板/其他 store 里访问时会自动解包
  // ------------------------------------------------------------

  // 两倍值：count 一变，它自己就会重新算
  const double = computed(() => count.value * 2)

  // 是否为正数：给页面做个状态提示用
  const isPositive = computed(() => count.value > 0)

  // ------------------------------------------------------------
  // 三、actions：能做的事（改 state 的逻辑都写在这里）
  // 为什么要把修改逻辑收进 store，而不是在组件里直接 count++ ？
  //   -> 因为多个组件都要改同一份数据时，规则写在一处才不会改乱
  // ------------------------------------------------------------

  // 内部小工具：往历史里追加一条记录（带时间，方便看懂先后顺序）
  // 这里故意不导出（不在 return 里），因为它是仓库自己的私事
  function record(text) {
    // toLocaleTimeString() 只取「时:分:秒」，比完整日期更清爽
    const time = new Date().toLocaleTimeString()
    history.value.push(`${time}  ${text}`)
    // 最多只留最近 20 条，防止点太多次把数组撑得太大
    if (history.value.length > 20) {
      history.value.shift()
    }
  }

  // 加一
  function increment() {
    count.value += 1
    record(`加一 → ${count.value}`)
  }

  // 减一
  function decrement() {
    count.value -= 1
    record(`减一 → ${count.value}`)
  }

  // 复位：回到 0，同时清空历史（复位就该回到「干干净净」的状态）
  function reset() {
    count.value = 0
    history.value = []
    record('已复位')
  }

  // ------------------------------------------------------------
  // 四、必须把想让外面用的东西 return 出去
  // 没 return 的（比如上面的 record）就是仓库的私有函数，外面用不了
  // ------------------------------------------------------------
  return {
    // state
    count,
    history,
    // getters
    double,
    isPositive,
    // actions
    increment,
    decrement,
    reset,
  }
})
