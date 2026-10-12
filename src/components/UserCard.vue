<!--
  UserCard.vue —— 「用户卡片」组件（第 6 章）
  为什么要有它？
  一个用户卡片的结构（头像 + 名字 + 职位 + 邮箱）是固定不变的，
  只有「数据」会变。所以把它做成一个零件：数据由父组件传进来，结构只写一份。
-->
<script setup>
import { computed } from 'vue'

// props 是「父 → 子」的数据通道（第 7 章会详细讲，这里先会用）
// required: true 表示父组件必须传 user，不传 Vue 会在控制台提醒，方便早点发现 bug
const props = defineProps({
  user: { type: Object, required: true },
})

// 头像里显示名字的第一个字。
// 为什么用 computed 而不是普通变量？因为父组件换了 user 之后，这里要能自动跟着变，
// 普通变量只在组件第一次创建时算一次，后面就不会更新了。
const initial = computed(() => props.user.name.slice(0, 1))

// 每个用户有自己的主题色，用内联样式画一个圆形色块（不引用任何外部图片）
const avatarStyle = computed(() => ({ background: props.user.color }))
</script>

<template>
  <!-- 单根元素：父组件写在 <UserCard class="..."/> 上的属性会继承到这个 div 上 -->
  <div class="user-card">
    <!-- 头像：一个圆形色块 + 名字首字 -->
    <div class="avatar" :style="avatarStyle">{{ initial }}</div>

    <div class="info">
      <div class="name">{{ user.name }}</div>
      <div class="role">{{ user.role }}</div>
      <div class="email mono">{{ user.email }}</div>
    </div>
  </div>
</template>

<style scoped>
/* scoped：这些样式只作用于本组件内部的标签，不会影响别的页面 */
.user-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 236px;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.avatar {
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info {
  min-width: 0;
}

.name {
  font-weight: 600;
  color: var(--heading);
}

.role {
  font-size: 13px;
  color: var(--brand);
  margin: 2px 0 4px;
}

.email {
  font-size: 12px;
  color: var(--text-muted);
  word-break: break-all;
}
</style>
