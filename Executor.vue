<template>
  <div class="page">
    <div class="top-bar">
      <button class="back-btn" @click="go('/evaluate')">返回</button>
      <h1 class="page-title">疗效评估</h1>
    </div>

    <div class="content-card">
      <div class="input-item">
        <label class="label">植株ID</label>
        <input v-model="plantId" type="text" class="input-box">
      </div>

      <div class="btn-row">
        <button class="btn before-btn" @click="handleBefore">治疗前基线采集</button>
        <button class="btn after-btn" @click="handleAfter">治疗后疗效评估</button>
      </div>

      <div class="loading" v-if="loading">请求中...</div>

      <div class="section" v-if="evalResult.plant_id">
        <div class="section-title">评估结果</div>
        <div class="result-row"><span>疗效等级：</span>{{ evalResult.efficacy_grade }}</div>
        <div class="result-row"><span>治疗前评分：</span>{{ evalResult.score_before }}</div>
        <div class="result-row"><span>治疗后评分：</span>{{ evalResult.score_after }}</div>
        <div class="result-row"><span>分数变化：</span>{{ evalResult.score_delta > 0 ? '+' : '' }}{{ evalResult.score_delta }}</div>
        <div class="result-row"><span>健康等级变化：</span>{{ evalResult.level_before }} → {{ evalResult.level_after }}</div>
        <div class="result-row"><span>HI指数对比：</span>{{ evalResult.hi_before }} → {{ evalResult.hi_after }}</div>
        <div class="result-row"><span>调理建议：</span>{{ evalResult.recommend }}</div>

        <div class="report-wrap" v-if="evalResult.report_fig_url">
          <div class="report-sub-title">疗效对比图表</div>
          <img :src="baseHost + evalResult.report_fig_url" class="report-img">
          <a :href="baseHost + evalResult.report_json_url" target="_blank" class="report-link">导出完整报告</a >
        </div>
      </div>

      <div class="section">
        <div class="section-title">历史记录</div>
        <button class="history-btn" @click="getHistory">刷新记录</button>
        <div class="empty-tip" v-if="historyList.length === 0">暂无记录</div>
        <div class="history-item" v-for="item in historyList" :key="item.timestamp">
          <div class="type-tag">{{ item.session_type === 'before' ? '治疗前' : '治疗后' }}</div>
          <div class="info-line">综合评分：{{ item.fused_score }}｜{{ item.final_level }}</div>
          <div class="time-line">{{ item.timestamp }}</div>
        </div>
      </div>
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
import { ref } from 'vue'

const router = useRouter()
const go = (path) => router.push(path)
const baseHost = "http://127.0.0.1:9000"

const plantId = ref("seven_one_flower_001")
const evalResult = ref({})
const historyList = ref([])
const loading = ref(false)

const getForm = () => {
  const form = new FormData()
  form.append("plant_id", plantId.value)
  return form
}

const handleBefore = async () => {
  loading.value = true
  const res = await fetch(`${baseHost}/api/v1/treatment/before`, {
    method: "POST",
    body: getForm()
  })
  const data = await res.json()
  alert(data.message || data.error)
  evalResult.value = {}
  getHistory()
  loading.value = false
}

const handleAfter = async () => {
  loading.value = true
  const res = await fetch(`${baseHost}/api/v1/treatment/after`, {
    method: "POST",
    body: getForm()
  })
  const data = await res.json()
  if(data.error) return alert(data.error)
  evalResult.value = data
  getHistory()
  loading.value = false
}

const getHistory = async () => {
  const res = await fetch(`${baseHost}/api/v1/treatment/history?plant_id=${plantId.value}`)
  const data = await res.json()
  historyList.value = data.records || []
}

getHistory()
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
  padding-bottom: 70px;
}
.top-bar {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  gap: 16px;
  background: #fff;
}
.back-btn {
  background: #1d9b67;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
}
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d9b67;
}
.content-card {
  padding: 20px;
}
.input-item {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}
.label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: block;
}
.input-box {
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 10px;
  font-size: 14px;
}
.btn-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.btn {
  flex: 1;
  border: none;
  padding: 12px 0;
  border-radius: 12px;
  font-size: 15px;
  color: #fff;
}
.before-btn {
  background: #34a873;
}
.after-btn {
  background: #1d9b67;
}
.loading {
  color: #1d9b67;
  text-align: center;
  margin: 10px 0;
}
.section {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}
.result-row {
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
}
.report-sub-title {
  font-size: 15px;
  margin: 14px 0 8px;
  color: #222;
}
.report-img {
  width: 100%;
  border-radius: 10px;
  margin: 8px 0;
}
.report-link {
  font-size: 14px;
  color: #1d9b67;
}
.history-btn {
  background: #e5f5ee;
  color: #1d9b67;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  margin-bottom: 10px;
}
.empty-tip {
  font-size: 14px;
  color: #999;
  text-align: center;
  padding: 10px 0;
}
.history-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.type-tag {
  font-size: 13px;
  background: #e5f5ee;
  color: #1d9b67;
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 4px;
}
.info-line {
  font-size: 14px;
  color: #444;
  margin: 4px 0;
}
.time-line {
  font-size: 12px;
  color: #999;
}
.bottom-nav {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 56px;
  background: #fff;
  display: flex;
  box-shadow: 0 -2px 10px rgba(0,0,0,.05);
  z-index: 99;
}
.nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 4px;
  border-radius: 12px;
}
.nav-item.active {
  background: #1d9b67;
}
.nav-text {
  font-size: 13px;
  color: #1d9b67;
}
.nav-item.active .nav-text {
  color: #fff;
}
</style>