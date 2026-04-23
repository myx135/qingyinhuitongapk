<template>
  <div class="page">
    <div class="header-bar">
      <button class="back-btn" @click="go('/evaluate')">返回</button>
      <h1 class="app-title">无人机巡检</h1>
    </div>

    <div class="content-box">
      <div class="drone-cards">
        <div class="drone-card">
          <div class="card-title">大无人机</div>
          <div class="card-value">{{ droneData.large.battery.toFixed(2) }}%</div>
          <div class="card-progress">
            <div class="progress-bar" :style="{ width: droneData.large.battery + '%' }"></div>
          </div>
          <div class="card-delay">延迟 {{ droneData.small.latency }}ms</div>
          <button class="stream-btn" @click="openStreamModal('large')">
            查看实时画面
          </button>
        </div>

        <div class="drone-card">
          <div class="card-title">小无人机</div>
          <div class="card-value">{{ droneData.small.battery.toFixed(2) }}%</div>
          <div class="card-progress">
            <div class="progress-bar" :style="{ width: droneData.small.battery + '%' }"></div>
          </div>
          <div class="card-delay">延迟 {{ droneData.small.latency }}ms</div>
          <button class="stream-btn" @click="openStreamModal('small')">
            查看实时画面
          </button>
        </div>
      </div>

      <div class="history-section">
        <div class="history-header">
          <div class="history-title">巡检区域地图</div>
          <div class="history-desc">点击地块查看详情</div>
        </div>

        <div class="map-wrapper">
          <div id="map"></div>
        </div>

        <div
          v-for="item in plotList"
          :key="item.id"
          class="plot-item"
          :class="{ active: currentPlot?.id === item.id }"
          @click="handlePlotClick(item)"
        >
          <div class="plot-name">{{ item.name }}</div>
        </div>

        <div class="info-card" v-if="currentPlot" @click.stop>
          <div class="info-title">{{ currentPlot.name }}</div>
          <div class="info-content">
            <div>状态：{{ currentPlot.status }}</div>
            <div>作物：七叶一枝花</div>
            <div>温度：{{ currentPlot.temp }}℃</div>
            <div>湿度：{{ currentPlot.humidity }}%</div>
          </div>
          <button @click="closeInfo" class="close-info-btn">关闭</button>
        </div>
      </div>
    </div>

    <div class="stream-modal" v-if="showStreamModal" @click="closeStreamModal">
      <div class="detail-card" @click.stop>
        <div class="detail-header">
          <h2>实时画面</h2>
          <button class="close-modal-btn" @click="closeStreamModal">×</button>
        </div>

        <div class="stream-placeholder" v-if="!capturedImg">
          {{ activeDrone === 'large' ? '大无人机' : '小无人机' }} 实时视频流
        </div>
        <img v-else :src="capturedImg" class="captured-image" />

        <div class="stream-actions">
          <button class="action-btn capture" @click="handleCapture">抓拍</button>
          <button class="action-btn confirm" @click="handleAddRecheck">加入复检</button>
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
      <div class="nav-item active" @click="go('/drone')">
        <span class="nav-text">无人机管理</span>
      </div>
      <div class="nav-item" :class="{ active: $route.path === '/user-center' }" @click="go('/user-center')">
        <span class="nav-text">个人中心</span>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const go = (path) => router.push(path)

const baseApi = "http://127.0.0.1:9000"

const droneData = reactive({
  large: { battery: 86.00, latency: 28 },
  small: { battery: 86.00, latency: 35 }
})

const showStreamModal = ref(false)
const activeDrone = ref(null)
const capturedImg = ref(null)

const plotList = reactive([
  { 
    id: 1, 
    name: '山大威海植物园试验田', 
    status: '巡检中', 
    lat: 37.5313, 
    lng: 122.0566, 
    temp: 22, 
    humidity: 64, 
    imgLarge: `${baseApi}/api/v1/drone/plot1/large`,
    imgSmall: `${baseApi}/api/v1/drone/plot1/small`
  },
  { 
    id: 2, 
    name: '山大威海海洋学院试验田', 
    status: '巡检中', 
    lat: 37.5323, 
    lng: 122.0570, 
    temp: 24, 
    humidity: 58,
    imgLarge: `${baseApi}/api/v1/drone/plot2/large`,
    imgSmall: `${baseApi}/api/v1/drone/plot2/small`
  },
  { 
    id: 3, 
    name: '山大威海西北侧试验田', 
    status: '巡检中', 
    lat: 37.5327, 
    lng: 122.0561, 
    temp: 21, 
    humidity: 66,
    imgLarge: `${baseApi}/api/v1/drone/plot3/large`,
    imgSmall: `${baseApi}/api/v1/drone/plot3/small`
  },
  { 
    id: 4, 
    name: '山大威海生科院试验田', 
    status: '巡检中', 
    lat: 37.5332, 
    lng: 122.0589, 
    temp: 26, 
    humidity: 52,
    imgLarge: `${baseApi}/api/v1/drone/plot4/large`,
    imgSmall: `${baseApi}/api/v1/drone/plot4/small`
  }
])

const currentPlot = ref(null)

const openStreamModal = (type) => {
  activeDrone.value = type
  capturedImg.value = null
  showStreamModal.value = true
}

const closeStreamModal = () => {
  showStreamModal.value = false
}

const handleCapture = () => {
  if (!currentPlot.value) return
  const img = activeDrone.value === 'large'
    ? currentPlot.value.imgLarge
    : currentPlot.value.imgSmall
  capturedImg.value = ''
  setTimeout(() => {
    capturedImg.value = img
  }, 10)
}

const handleAddRecheck = () => {
  if (!capturedImg.value) {
    alert('请先抓拍')
    return
  }
  const now = new Date()
  const todayStr = now.toLocaleDateString()
  const timeStr = now.toLocaleString()

  const newRecord = {
    id: Date.now(),
    date: todayStr,
    block: currentPlot.value.name,
    timestamp: timeStr,
    fused_score: (35 + Math.random() * 20).toFixed(2),
    final_level: '中度异常',
    confidence: 0.85 + Math.random() * 0.1,
    primary_pest: '无人机巡检异常',
    physiology: {
      chlorophyll: (20 + Math.random() * 10).toFixed(2),
      fmc: (1.2 + Math.random() * 0.6).toFixed(2),
      nitrogen: (8 + Math.random() * 3).toFixed(2)
    },
    disease_advice: {
      treatment: '已通过无人机抓拍加入复检，请及时查看。'
    },
    recheckResult: '待复检',
    isRechecked: '是',
    imgOriginal: capturedImg.value,
    imgDisease: capturedImg.value
  }

  const existing = JSON.parse(localStorage.getItem('recheckHistory') || '[]')
  existing.unshift(newRecord)
  localStorage.setItem('recheckHistory', JSON.stringify(existing))
  alert('已加入复检，并同步到历史数据')
  closeStreamModal()
}

// 点击列表 + 地图标记 双向定位
const handlePlotClick = (item) => {
  currentPlot.value = item
  if(map){
    map.setView([item.lat, item.lng],19)
  }
}

const closeInfo = () => {
  currentPlot.value = null
}

let map = null
const loadScript = (url) => {
  return new Promise(resolve => {
    const script = document.createElement('script')
    script.src = url
    script.onload = resolve
    document.head.appendChild(script)
  })
}
const loadStyle = (url) => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
}
const initMap = () => {
  nextTick(() => {
    map = L.map('map').setView([37.5320, 122.0570], 18)
    L.tileLayer('https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}').addTo(map)
    
    plotList.forEach(p => {
      const marker = L.marker([p.lat, p.lng]).addTo(map)
      marker.on('click', () => handlePlotClick(p))
    })
    window.map = map
  })
}

async function getDroneRealData() {
  try{
    const res = await fetch(`${baseApi}/api/v1/drone`)
    const data = await res.json()
    if(data.large) droneData.large = data.large
    if(data.small) droneData.small = data.small
    if(data.plotList) {
      data.plotList.forEach((newItem,idx)=>{
        if(plotList[idx]) Object.assign(plotList[idx],newItem)
      })
    }
  }catch(err){}
}

onMounted(() => {
  getDroneRealData()
  setInterval(()=>{
    getDroneRealData()
  },10000)

  setInterval(() => {
    if (droneData.large.battery > 20) {
      droneData.large.battery -= 0.05
    }
    if (droneData.small.battery > 20) {
      droneData.small.battery -= 0.05
    }
  }, 5000)

  loadStyle('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css')
  loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js').then(() => {
    initMap()
  })
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

.drone-cards {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}
.drone-card {
  flex: 1;
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 3px 12px rgba(0,55,33,.06);
}
.card-title {
  font-size: 15px;
  color: #666;
  margin-bottom: 8px;
}
.card-value {
  font-size: 24px;
  font-weight: 600;
  color: #1d9b67;
  margin-bottom: 10px;
}
.card-progress {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}
.progress-bar {
  height: 100%;
  background: #1d9b67;
  transition: width 0.3s;
}
.card-delay {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}
.stream-btn {
  width: 100%;
  background: #f0faf5;
  color: #1d9b67;
  border: none;
  padding: 10px 0;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
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

.map-wrapper {
  width: 100%;
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
  background: #f0faf5;
}
#map {
  width: 100%;
  height: 100%;
}

.plot-item {
  background: #f0faf5;
  border-radius: 12px;
  padding: 14px;
  margin-top: 10px;
  cursor: pointer;
}
.plot-item.active {
  background: #d1f0e3;
  border: 1px solid #1d9b67;
}
.plot-name {
  font-size: 14px;
  color: #333;
}

.info-card {
  margin-top: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d9b67;
  margin-bottom: 10px;
}
.info-content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.close-info-btn {
  width: 100%;
  margin-top: 12px;
  background: #1d9b67;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}

.stream-modal {
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

.close-modal-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stream-placeholder {
  width: 100%;
  height: 220px;
  background: #1d9b67;
  opacity: 0.8;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  margin-bottom: 16px;
}
.captured-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
}
.stream-actions {
  display: flex;
  gap: 10px;
}
.action-btn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
.action-btn.capture {
  background: #f0faf5;
  color: #1d9b67;
}
.action-btn.confirm {
  background: #1d9b67;
  color: #fff;
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