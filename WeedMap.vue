<template>
  <div class="page">
    <div class="top-bar">
      <button class="back-btn" @click="go('/evaluate')">返回</button>
      <h1 class="page-title">系统管理与扩展</h1>
    </div>

    <div class="content-card">
      <!-- 1. 设备在线状态 -->
      <div class="card-wrap">
        <div class="menu-item" @click="showDevice = !showDevice">
          <div class="menu-left">
            <div class="menu-title">设备在线状态</div>
            <div class="menu-subtitle">无人机、传感器、控制器状态</div>
          </div>
          <span class="arrow-icon" :class="{ open: showDevice }">▼</span>
        </div>
        <div class="panel" v-if="showDevice">
          <div class="row">
            <span>无人机</span>
            <span class="status-online">{{ deviceState.drone }}</span>
          </div>
          <div class="row">
            <span>声学设备</span>
            <span class="status-online">{{ deviceState.sound }}</span>
          </div>
          <div class="row">
            <span>温湿度传感器</span>
            <span class="status-online">{{ deviceState.sensor }}</span>
          </div>
          <div class="row">
            <span>灌溉控制器</span>
            <span class="status-offline">{{ deviceState.irrigation }}</span>
          </div>
        </div>
      </div>

      <!-- 2. 接口状态同步 -->
      <div class="card-wrap">
        <div class="menu-item" @click="syncApiStatus">
          <div class="menu-left">
            <div class="menu-title">接口状态同步</div>
            <div class="menu-subtitle">点击刷新后端接口状态</div>
          </div>
          <span class="refresh-icon"></span>
        </div>
        <div class="panel" v-if="showApi">
          <div class="row">
            <span>数据采集接口</span>
            <span>{{ apiState.collect }}</span>
          </div>
          <div class="row">
            <span>诊断分析接口</span>
            <span>{{ apiState.diagnose }}</span>
          </div>
          <div class="row">
            <span>设备控制接口</span>
            <span>{{ apiState.control }}</span>
          </div>
          <div class="row">
            <span>同步时间</span>
            <span>{{ syncTime }}</span>
          </div>
        </div>
      </div>

      <!-- 3. 运行日志监控 -->
      <div class="card-wrap">
        <div class="menu-item" @click="showLog = !showLog">
          <div class="menu-left">
            <div class="menu-title">运行日志监控</div>
            <div class="menu-subtitle">系统最近运行记录</div>
          </div>
          <span class="arrow-icon" :class="{ open: showLog }">▼</span>
        </div>
        <div class="panel log-panel" v-if="showLog">
          <div class="log-item" v-for="(item, index) in logList" :key="index">
            {{ item }}
          </div>
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
import { ref, onMounted } from 'vue'
const router = useRouter()
const go = (path) => router.push(path)

const showDevice = ref(false)
const showApi = ref(false)
const showLog = ref(false)
const syncTime = ref('')

const deviceState = ref({
  drone:'在线',
  sound:'在线',
  sensor:'在线',
  irrigation:'离线'
})

const apiState = ref({
  collect:'正常',
  diagnose:'正常',
  control:'正常'
})

const logList = ref([])
const mockLog = [
  '04-06 14:20  无人机任务启动成功',
  '04-06 14:25  多光谱数据上传完成',
  '04-06 14:30  声学频率调整为 2000Hz',
  '04-06 14:35  传感器数据同步成功',
  '04-06 14:40  系统诊断完成，无重大风险'
]

async function syncApiStatus() {
  try{
    const res = await fetch("http://127.0.0.1:9000/api/v1/system/status")
    const data = await res.json()
    if(data.api) apiState.value = data.api
    if(data.device) deviceState.value = data.device
    syncTime.value = new Date().toLocaleString()
  }catch(err){
    syncTime.value = new Date().toLocaleString()
  }
  showApi.value = true
}

async function fetchSystemLog() {
  try{
    const res = await fetch("http://127.0.0.1:9000/api/v1/system/log")
    const data = await res.json()
    logList.value = data.length ? data : mockLog
  }catch(err){
    logList.value = mockLog
  }
}

onMounted(() => {
  fetchSystemLog()
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
  padding: 0 20px;
}
.card-wrap {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 3px 12px rgba(0,55,33,.06);
  margin-bottom: 16px;
  overflow: hidden;
}
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  cursor: pointer;
}
.menu-left .menu-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.menu-left .menu-subtitle {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
.arrow-icon,
.refresh-icon {
  font-size: 14px;
  color: #666;
  transition: transform 0.3s;
}
.arrow-icon.open {
  transform: rotate(180deg);
}
.panel {
  padding: 0 20px 20px;
}
.log-panel {
  max-height: 220px;
  overflow-y: auto;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #f5f5f5;
}
.row:last-child {
  border-bottom: none;
}
.status-online {
  color: #1d9b67;
  font-weight: 500;
}
.status-offline {
  color: #ff6b6b;
  font-weight: 500;
}
.log-item {
  font-size: 13px;
  color: #555;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
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