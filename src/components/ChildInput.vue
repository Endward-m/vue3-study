<!--
  ChildInput.vue —— 演示「组件上的 v-model」（第 7 章）
  父组件两种等价写法：
    <ChildInput v-model="keyword" />
    <ChildInput :model-value="keyword" @update:model-value="keyword = $event" />
  本组件用 defineModel() 实现，它是上面那一堆写法的语法糖（Vue 3.4+ 稳定）。
-->
<script setup>
// defineModel() 不用 import，它和 defineProps 一样是编译器宏。
// 这一行大约等价于：
//   const props = defineProps({ modelValue: String })
//   const emit = defineEmits(['update:modelValue'])
//   读 model 就是读 props.modelValue，写 model 就是 emit('update:modelValue', 新值)
const model = defineModel({ type: String, default: '' })

// 想让默认绑定的名字从 modelValue 换成别的名字，可以写：const title = defineModel('title')
// 那样父组件就要写 v-model:title="xxx"。
</script>

<template>
  <div class="child-input">
    <!-- v-model="model"：读写都走 model，所以输入框一打字，父组件的变量立刻同步 -->
    <input v-model="model" placeholder="在这里打字，父组件会同步收到" />

    <!-- 把子组件内部的值显示出来，方便对照父组件那边的值是否一致 -->
    <span class="muted">子组件内部的值：{{ model === '' ? '（空）' : model }}</span>
  </div>
</template>

<style scoped>
.child-input {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
