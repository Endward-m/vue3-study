// ============================================================
// src/composables/useCounter.js —— 一个可复用的「组合式函数」
//
// 组合式函数（Composable）到底是什么？
//   就是「把一段逻辑打包成一个函数，用的时候调用它，它把需要的东西还给你」。
//   好比把「一套厨具 + 做菜步骤」打包成一个料理包：
//   谁想做饭，拆一包就行，不用自己重新买锅、重新写步骤。
//
// 命名约定：名字以 use 开头。这不是语法要求，而是行业默契，
//   让人一眼看出「这是个组合式函数，里面大概率有响应式数据」。
//
// 注意：它和 Pinia 的 store 不一样——
//   store 是「全局唯一的一份数据」（公共储物柜）；
//   组合式函数是「一次调用 = 一份全新的独立数据」（各买各的料理包）。
// ============================================================

// 组合式函数内部用的还是最普通的 Vue 工具，随机导入即可
import { ref, computed } from 'vue'

/**
 * 一个计数器逻辑包
 * @param {number} initial 初始值，默认 0。每次调用都可以传不同的值
 * @returns {object} 里面有 count / double 两个响应式数据和 3 个方法
 */
export function useCounter(initial = 0) {
  // ref(...) 写在函数体里面 → 每次调用都会新建一个独立的 ref
  // 这就是「两次调用互不干扰」的根本原因
  const count = ref(initial)

  // 派生数据：两倍值，count 变了它就自动重算
  const double = computed(() => count.value * 2)

  // 是不是偶数：用取余判断，% 2 === 0 就是偶数
  const isEven = computed(() => count.value % 2 === 0)

  function increment(step = 1) {
    // 允许传步长，默认加 1，这样同一个函数能应付更多场景
    count.value += step
  }

  function decrement(step = 1) {
    count.value -= step
  }

  function reset() {
    // 复位用的是闭包里的 initial，所以它会回到「当初传进来的初始值」
    count.value = initial
  }

  // 把外面需要用到的东西打包返回
  // 注意：返回的是 ref 对象本身（不是 count.value），
  //       这样外面拿到后依然能保持响应式
  return {
    count,
    double,
    isEven,
    increment,
    decrement,
    reset,
  }
}
