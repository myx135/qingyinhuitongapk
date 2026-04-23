<template>
  <div class="page">
    <div class="header-bar">
      <button class="back-btn" @click="goBack">返回</button>
      <h1 class="app-title">历史问题记录</h1>
    </div>

    <div class="content-box">
      <div class="history-section">
        <div class="history-header">
          <h2 class="history-title">历史问题区域</h2>
          <p class="history-desc">查看地块问题</p >
        </div>

        <div class="history-list">
          <div
            class="history-item"
            v-for="item in historyList"
            :key="item.id"
            @click="showDetail(item)"
          >
            <div class="history-item-header">
              <span class="history-date">{{ item.date }}</span>
              <span class="history-block">{{ item.block }}</span>
            </div>
            <div class="history-item-body">
              <h3 class="history-disease">{{ item.plant_name }}</h3>
              <p class="history-score">健康评分：{{ item.fused_score }} | 等级：{{ item.final_level }}</p >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-modal" v-if="showDetailModal" @click="closeDetail">
      <div class="detail-card" @click.stop>
        <div class="detail-header">
          <h2>诊断详细数据</h2>
          <button class="close-btn" @click="closeDetail">×</button>
        </div>

        <div class="detail-body" v-if="currentItem">
          <div class="detail-row">
            <span>植株ID：</span>
            <span>{{ currentItem.plant_id }}</span>
          </div>
          <div class="detail-row">
            <span>检测时间：</span>
            <span>{{ currentItem.timestamp }}</span>
          </div>
          <div class="detail-row">
            <span>所属地块：</span>
            <span>{{ currentItem.block }}</span>
          </div>
          <div class="detail-row">
            <span>状态描述：</span>
            <span>{{ currentItem.status_desc }}</span>
          </div>
          <div class="detail-row">
            <span>综合健康评分：</span>
            <span>{{ currentItem.fused_score }}</span>
          </div>
          <div class="detail-row">
            <span>健康等级：</span>
            <span class="level">{{ currentItem.final_level }}</span>
          </div>
          <div class="detail-row">
            <span>多光谱分项评分：</span>
            <span>{{ currentItem.spectral_score }}</span>
          </div>
          <div class="detail-row">
            <span>声学分项评分：</span>
            <span>{{ currentItem.acoustic_score }}</span>
          </div>
          <div class="detail-row">
            <span>叶绿素：</span>
            <span>{{ currentItem.chlorophyll }}</span>
          </div>
          <div class="detail-row">
            <span>含水率：</span>
            <span>{{ currentItem.moisture }}</span>
          </div>
          <div class="detail-row">
            <span>氮含量：</span>
            <span>{{ currentItem.nitrogen }}</span>
          </div>
          <div class="detail-row">
            <span>HI指数：</span>
            <span>{{ currentItem.hi_index }}</span>
          </div>
          <div class="detail-row">
            <span>声学风险等级：</span>
            <span>{{ currentItem.acoustic_risk_level }}</span>
          </div>
          <div class="detail-row">
            <span>生长阶段：</span>
            <span>{{ currentItem.growth_stage }}</span>
          </div>
          <div class="detail-row">
            <span>阶段说明：</span>
            <span>{{ currentItem.growth_desc }}</span>
          </div>

          <div class="divider"></div>

          <div class="advice-box">
            <div class="advice-title">养护治理建议</div>
            <div class="advice-content">{{ currentItem.treatment_advice }}</div>
          </div>

          <button class="recheck-plan-btn" @click="addRecheckPlan">
            加入再次复检计划
          </button>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.back()
const go = (path) => router.push(path)

const baseApi = "http://127.0.0.1:9000"

const showDetailModal = ref(false)
const currentItem = ref(null)
const historyList = ref([])

const showDetail = (item) => {
  currentItem.value = { ...item }
  showDetailModal.value = true
}

const closeDetail = () => {
  showDetailModal.value = false
}

const addRecheckPlan = () => {
  alert('已加入复检计划：' + currentItem.value.plant_id)
  closeDetail()
}

const mockHistoryData = [
  {
    id: 3,
    date: '2026-03-31',
    block: '山大威海西北侧试验田',
    timestamp: '2026-03-31 09:40:15',
    plant_id: 'seven_one_003',
    plant_name: '七叶一枝花',
    status_desc: '轻度长势偏弱',
    fused_score: 62.35,
    final_level: '轻度异常',
    spectral_score: 64.20,
    acoustic_score: 60.15,
    chlorophyll: 23.56,
    moisture: 58.2,
    nitrogen: 12.36,
    hi_index: 0.32,
    acoustic_risk_level: '低风险',
    growth_stage: '展叶期',
    growth_desc: '叶片发育正常，长势轻微放缓',
    treatment_advice: '适度补水，补充缓释氮肥，定期监测声学胁迫指标。'
  },
  {
    id: 2,
    date: '2026-03-28',
    block: '山大威海海洋学院试验田',
    timestamp: '2026-03-28 10:15:22',
    plant_id: 'seven_one_002',
    plant_name: '七叶一枝花',
    status_desc: '生理指标平稳',
    fused_score: 71.42,
    final_level: '正常',
    spectral_score: 73.11,
    acoustic_score: 69.85,
    chlorophyll: 26.12,
    moisture: 61.5,
    nitrogen: 13.12,
    hi_index: 0.25,
    acoustic_risk_level: '无风险',
    growth_stage: '展叶旺盛期',
    growth_desc: '整体长势良好，各项生理指标稳定',
    treatment_advice: '维持现有水肥管理，保持通风环境，常规周期监测即可。'
  },
  {
    id: 1,
    date: '2026-03-25',
    block: '山大威海植物园试验田',
    timestamp: '2026-03-25 14:22:11',
    plant_id: 'seven_one_001',
    plant_name: '七叶一枝花',
    status_desc: '根系活性一般',
    fused_score: 54.68,
    final_level: '中度异常',
    spectral_score: 52.36,
    acoustic_score: 56.91,
    chlorophyll: 21.33,
    moisture: 54.8,
    nitrogen: 10.85,
    hi_index: 0.41,
    acoustic_risk_level: '中风险',
    growth_stage: '缓苗期',
    growth_desc: '刚完成缓苗，根系恢复速度较慢',
    treatment_advice: '减少大水漫灌，增施生根类肥料，降低环境胁迫。'
  },
  {
    id: 4,
    date: new Date().toISOString().split('T')[0],
    block: '山大威海植物园试验田',
    plant_name: '七叶一枝花',
    timestamp: new Date().toLocaleString(),
    plant_id: 'seven_one_latest',
    status_desc: '实时检测数据',
    fused_score: '',
    final_level: '',
    spectral_score: '',
    acoustic_score: '',
    chlorophyll: '',
    moisture: '',
    nitrogen: '',
    hi_index: '',
    acoustic_risk_level: '',
    growth_stage: '',
    growth_desc: '',
    treatment_advice: ''
  }
]

const fetchHistoryList = async () => {
  try {
    const res = await fetch(`${baseApi}/api/v1/treatment/history`)
    const data = await res.json()
    historyList.value = data.length ? data : mockHistoryData
  } catch (err) {
    historyList.value = mockHistoryData
  }
}

onMounted(() => {
  fetchHistoryList()
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
  background: #f7fbf9;
  padding-top: env(safe-area-inset-top);
  padding-bottom: 70px;
}

.header-bar {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: transparent;
  gap: 16px;
}

.back-btn {
  background: #1d9b67;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
}

.app-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d9b67;
}

.content-box {
  padding: 0 20px;
}

.history-section {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 3px 12px rgba(0,55,33,.06);
  margin-top: 20px;
}

.history-header {
  margin-bottom: 16px;
}

.history-title {
  font-size: 18px;
  font-weight: 600;
  color: #1d9b67;
}

.history-desc {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: #f0faf5;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: 0.2s;
}
.history-item:active {
  transform: scale(0.98);
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.history-date {
  font-size: 14px;
  color: #666;
}

.history-block {
  font-size: 14px;
  color: #666;
}

.history-disease {
  font-size: 16px;
  font-weight: 600;
  color: #2d7957;
  margin-bottom: 4px;
}

.history-score {
  font-size: 14px;
  color: #666;
}

.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.detail-card {
  width: 100%;
  max-width: 500px;
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  max-height: 85vh;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-header h2 {
  font-size: 19px;
  color: #1d9b67;
  font-weight: 600;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #333;
  align-items: center;
}

.level {
  color: #ff6b35;
  font-weight: 600;
}

.divider {
  height: 1px;
  background: #eee;
  margin: 8px 0;
}

.advice-box {
  background: #f0faf5;
  padding: 12px;
  border-radius: 12px;
  margin-top: 8px;
}

.advice-title {
  font-size: 15px;
  font-weight: 600;
  color: #1d9b67;
  margin-bottom: 6px;
}

.advice-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.recheck-plan-btn {
  width: 100%;
  background: #1d9b67;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 0;
  font-size: 15px;
  font-weight: 500;
  margin-top: 12px;
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