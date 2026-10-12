<!--
  ChildCounter.vue —— 演示「props 往下传 + emit 往上报」（第 7 章）
  父组件：<ChildCounter :initial="10" @change="onChange" />
  - :initial 是父组件递下来的起始值（子组件只能读，不能改）
  - @change 是子组件往上报的通道（子组件用 emit 抛出去）
-->
<script setup>
import { ref } from 'vue'

const props = defineProps({
  // default 只在父组件完全不传这个 prop 时生效
  initial: { type: Number, default: 0 },
})

// 声明本组件会抛出哪些事件。
// 为什么要声明？一是让使用者一眼看到这个组件有哪些「对外接口」，
// 二是声明之后写错事件名时 Vue 会在控制台提醒你。
const emit = defineEmits(['change'])

// 为什么不直接用 props.initial 当计数器？
// 因为 props 是只读的，子组件直接改会报 "target is readonly"。
// 正确做法：把初始值复制一份到本地 ref，以后改这份自己的数据。
const count = ref(props.initial)

function plus() {
  count.value++
  // 关键一行：把最新值「抛」给父组件，让数据的主人（父组件）决定怎么用
  emit('change', count.value)
}

function reset() {
  count.value = props.initial
  // 重置也算一次变化，同样要通知父组件，否则父组件那边显示的还是旧值
  emit('change', count.value)
}
</script>

<template>
  <div class="counter">
    <div class="row">
      <span class="big">{{ count }}</span>
      <button class="btn" @click="plus">子组件内 +1</button>
      <button class="btn btn-ghost" @click="reset">重置为 {{ initial }}</button>
    </div>
    <p class="muted">
      这个数字存在子组件自己的 ref 里；每次点击都会 emit('change', 最新值) 通知父组件。
    </p>
  </div>
</template>

<style scoped>
.counter {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
