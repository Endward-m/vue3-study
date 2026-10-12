<!--
  SlotDemo.vue —— 一个「留了坑位」的面板组件（第 8 章）
  它自己只负责排版（框框、间距、列表循环），具体每个位置显示什么由父组件决定。
  三种坑位：
    <slot />                      默认插槽：父组件直接写的内容都进这里
    <slot name="header" />        具名插槽：父组件用 <template #header> 往里填
    <slot name="row" :item="..." /> 作用域插槽：把数据「递出去」给父组件自己渲染
-->
<script setup>
// items 是列表数据；数组/对象类型的默认值必须写成函数，否则多个实例会共用同一个数组
defineProps({
  items: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="panel">
    <!-- 具名插槽：标签之间的文字是「后备内容」，父组件不填这个坑位时才显示 -->
    <div class="panel-head">
      <slot name="header">默认标题（父组件没填 header 坑位）</slot>
    </div>

    <!-- 默认插槽：没有 name 的那个坑位 -->
    <div class="panel-body">
      <slot>默认正文（父组件没填默认坑位）</slot>
    </div>

    <!-- 作用域插槽：子组件决定「循环哪一个数组」，父组件决定「每一行长什么样」 -->
    <ul class="panel-list">
      <li v-for="(item, index) in items" :key="item.id">
        <!-- :item 和 :index 就是「递出去」的数据，父组件用 #row="{ item, index }" 接 -->
        <slot name="row" :item="item" :index="index">{{ item.name }}</slot>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.panel {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  overflow: hidden;
}

.panel-head {
  padding: 10px 14px;
  background: var(--brand-soft);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
  color: var(--heading);
}

.panel-body {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}

.panel-list {
  list-style: none;
  margin: 0;
  padding: 6px 14px 12px;
}

.panel-list li {
  padding: 5px 0;
  border-bottom: 1px dashed var(--border);
}

.panel-list li:last-child {
  border-bottom: none;
}
</style>
