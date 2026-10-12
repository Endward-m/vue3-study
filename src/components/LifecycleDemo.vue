<!--
  LifecycleDemo.vue —— 把每一次生命周期触发都记录到页面上（第 8 章）
  父组件用 v-if 控制它的显示/隐藏，这样才能亲眼看到：
    显示 → onMounted，点按钮改数据 → onUpdated，隐藏 → onUnmounted
-->
<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

// 往上报日志用的事件。为什么需要它？
// 因为 onUnmounted 触发的那一刻，本组件马上就被销毁了，
// 它自己记的日志也随页面一起消失。只有把日志抛给父组件存起来，你才看得到那一行。
const emit = defineEmits(['lifecycle'])

const count = ref(0)

// 只用来存 mounted / unmounted 这种「只发生一次」的日志，不会和 onUpdated 打架
const logs = ref([])

// 为什么 onUpdated 的次数不用 ref 存，而用普通变量 + 直接改 DOM？
// 因为 onUpdated 里改响应式数据 → 触发重新渲染 → 又触发 onUpdated，会无限循环。
// 普通变量不是响应式的，改它不会引发渲染，所以这里用它做计数。
let updateCount = 0
const updateTipEl = ref(null)

function log(text) {
  const line = `${new Date().toLocaleTimeString()}  ${text}`
  logs.value.push(line)     // 自己显示一份
  emit('lifecycle', line)   // 再给父组件一份（父组件那份能保留到组件销毁之后）
}

onMounted(() => {
  // 组件第一次出现在页面上。真实项目里「进页面请求接口」就写在这里
  log('onMounted：挂载完成，DOM 已经存在，可以请求数据了')
})

onUpdated(() => {
  updateCount++
  // 直接写 DOM 文本，不经过 Vue 的响应式系统，所以不会再触发一次更新
  if (updateTipEl.value) updateTipEl.value.textContent = String(updateCount)
})

onUnmounted(() => {
  // 清理现场的时刻：定时器、事件监听、未完成的请求都在这里处理
  log('onUnmounted：即将卸载，定时器和事件监听必须在这里清掉')
})
</script>

<template>
  <div class="life">
    <p>
      我是子组件 LifecycleDemo，我自己的数据：<span class="big">{{ count }}</span>
    </p>

    <div class="row">
      <button class="btn" @click="count++">点我 +1（会触发 onUpdated）</button>
    </div>

    <p class="muted">
      onUpdated 已触发 <span ref="updateTipEl" class="mono">0</span> 次（用直接写 DOM 的方式显示，避免死循环）
    </p>

    <p class="muted">我在本组件内部记到的日志：</p>
    <ul class="mono life-log">
      <li v-for="(line, index) in logs" :key="index">{{ line }}</li>
    </ul>
  </div>
</template>

<style scoped>
.life {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.life-log {
  margin: 0;
  padding-left: 20px;
  font-size: 12px;
  color: var(--text-muted);
}
</style>
