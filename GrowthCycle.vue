<template>
  <div class="page">
    <div class="top-bar">
      <button class="back-btn" @click="go('/evaluate')">返回</button>
      <h1 class="page-title">作物生命周期</h1>
    </div>

    <div class="content-card">
      <div class="section">
        <div class="section-title">七叶一枝花  当前生长阶段</div>
        <div class="stage-display">
          {{ currentStage }}
        </div>
        <div class="desc-text">{{ stageDesc }}</div>
        <div class="days-text">剩余成熟天数：{{ daysToMaturity }} 天</div>
      </div>

      <div class="section">
        <div class="section-title">阶段选择</div>
        <div class="stage-item"
             v-for="(item, index) in stageList"
             :key="index"
             :class="{ active: currentStage === item }"
             @click="selectStage(item)">
          {{ item }}
        </div>
      </div>

      <div class="section">
        <div class="section-title">阶段记录</div>
        <div class="record-item" v-for="(item, i) in recordList" :key="i">
          <div>{{ item.stage }}</div>
          <div class="time">{{ item.time }}</div>
        </div>
      </div>

      <button class="save-btn" @click="saveRecord">保存当前阶段记录</button>
    </div>

    <nav class="bottom-nav">
      <div class="nav-item" :class="{ active: $route.path === '/home' }" @click="go('/home')">
        <span class="nav-text">首页</span>
      </div>
      <div class="nav-item" :class="{ active: $route.path === '/evaluate' }" @click="go('/evaluate')">
        <span class="nav-text">功能中心</span>
      </div>
      <div class="nav-item" :class="{ active: $route.path === '/diagnose' }" @click="go('/diagnose')">
        <span class="nav-text">历史数据</span>
      </div>
      <div class="nav-item" :class="{ active: $route.path === '/drone' }" @click="go('/drone')">
        <span class="nav-text">无人机管理</span>
      </div>
      <div class="nav-item" :class="{ active: $route.path === '/user-center' }" @click="go('/user-center')">
        <span class="nav-text">个人中心</span>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
const router = useRouter()
const go = (path) => router.push(path)

const baseHost = "http://127.0.0.1:9000"

const currentStage = ref('')
const stageDesc = ref('')
const daysToMaturity = ref(0)

const stageList = ref([
  '萌发期',
  '营养生长期',
  '开花期',
  '结果期',
  '成熟期'
])

const recordList = ref([
  { stage: '萌发期', time: '2026-03-01' },
  { stage: '营养生长期', time: '2026-03-20' }
])

function selectStage(item) {
  currentStage.value = item
}

function saveRecord() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const timeStr = `${y}-${m}-${d}`
  recordList.value.push({
    stage: currentStage.value,
    time: timeStr
  })
}

async function getGrowthData() {
  try {
    const formData = new FormData()
    formData.append("crop_type", "七叶一枝花")

    const res = await fetch(`${baseHost}/api/v1/growth/predict`, {
      method: "POST",
      body: formData
    })

    const data = await res.json()

    if (data.error) {
      currentStage.value = "营养生长期"
      stageDesc.value = "茎叶快速生长，光合能力增强"
      daysToMaturity.value = 70
      return
    }

    currentStage.value = data.stage
    stageDesc.value = data.description
    daysToMaturity.value = data.days_to_maturity

  } catch (e) {
    console.error("生长接口请求失败：", e)
    currentStage.value = "营养生长期"
    stageDesc.value = "茎叶快速生长，光合能力增强"
    daysToMaturity.value = 70
  }
}

onMounted(() => {
  getGrowthData()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f7fbf9 0%, #eef8f4 100%);
  padding-top: env(safe-area-inset-top);
  padding-bottom: 70px;
}
.top-bar {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  gap: 16px;
}
.back-btn {
  background: #1d9b67;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
}
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d9b67;
}
.content-card {
  padding: 20px;
}
.section {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 3px 12px rgba(0,55,33,.06);
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}
.stage-display {
  font-size: 18px;
  font-weight: 600;
  color: #1d9b67;
  text-align: center;
  padding: 6px 0;
}
.desc-text {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 4px;
}
.days-text {
  font-size: 14px;
  color: #2d7957;
  text-align: center;
}
.stage-item {
  padding: 12px 14px;
  background: #f5f5f5;
  border-radius: 10px;
  margin-bottom: 8px;
  text-align: center;
  cursor: pointer;
}
.stage-item.active {
  background: #1d9b67;
  color: #fff;
}
.record-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
}
.time {
  color: #888;
}
.save-btn {
  width: 100%;
  background: #1d9b67;
  color: #fff;
  border: none;
  padding: 14px 0;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
}
.bottom-nav {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 99;
  padding: 0 4px;
}
.nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 0;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s;
  margin: 0 4px;
}
.nav-item.active {
  background: #1d9b67;
}
.nav-item.active .nav-text {
  color: #fff;
}
.nav-text {
  font-size: 13px;
  color: #1d9b67;
  font-weight: 500;
}
</style>