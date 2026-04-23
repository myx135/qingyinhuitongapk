<template>
  <div class="page">
    <header class="app-header">
      <div class="status-bar">
        {{ currentTime }} · 实时巡检在线
      </div>
      <h1 class="app-title">青音慧瞳 智慧作物监测平台</h1>
      <p class="app-subtitle">无人机采集 / 多模态分析 / Agent建议 / 自动复检</p >
      <div class="header-tabs">
        <div class="tab-item" @click="showModal('voice')">声纹治疗在线</div>
        <div class="tab-item" @click="showModal('multi')">多模态回传正常</div>
        <div class="tab-item" @click="showModal('agent')">Agent待决策</div>
      </div>
    </header>

    <!-- 详情弹窗 - 仅弹窗、不跳转 -->
    <div class="modal-mask" v-if="showDetail" @click="showDetail = false">
      <div class="modal-box" @click.stop>
        <div class="modal-title">完整检测详情</div>
        <div class="modal-content">
          <p>植株ID：{{ diagnoseData?.plant_id || "--" }}</p >
          <p>检测时间：{{ diagnoseData?.timestamp || "--" }}</p >
          <p>状态描述：{{ diagnoseData?.description || "--" }}</p >
          <p>综合健康评分：{{ diagnoseData?.fused_score || "--" }}</p >
          <p>健康等级：{{ diagnoseData?.final_level || "--" }}</p >
          <p>多光谱分项评分：{{ diagnoseData?.ms_score || "--" }}</p >
          <p>声学分项评分：{{ diagnoseData?.ac_score || "--" }}</p >
          <p>叶绿素：{{ diagnoseData?.physiology?.chlorophyll || "--" }}</p >
          <p>含水量：{{ diagnoseData?.physiology?.fmc || "--" }}</p >
          <p>氮含量：{{ diagnoseData?.physiology?.nitrogen || "--" }}</p >
          <p>HI指数：{{ diagnoseData?.acoustic?.hi || "--" }}</p >
          <p>声学风险等级：{{ diagnoseData?.acoustic?.risk_level || "--" }}</p >
          <p>生长阶段：{{ diagnoseData?.growth?.stage || "--" }}</p >
          <p>生长说明：{{ diagnoseData?.growth?.description || "--" }}</p >
          <p>治理建议：{{ diagnoseData?.disease_advice?.treatment || "--" }}</p >
        </div>
        <div class="modal-close" @click="showDetail = false">关闭</div>
      </div>
    </div>

    <div class="modal-mask" v-if="modalShow" @click="closeModal">
      <div class="modal-box" @click.stop>
        <div class="modal-title">{{ modalTitle }}</div>
        <div class="modal-content">{{ modalDesc }}</div>
        <div class="modal-close" @click="closeModal">关闭</div>
      </div>
    </div>

    <main class="main-content">
      <div class="info-card">
        <div class="info-item">
          <div class="label">当前风险等级</div>
          <div class="value warn">{{ diagnoseData?.acoustic?.risk_level || "正常" }}</div>
        </div>
        <div class="info-item">
          <div class="label">当前巡检进度</div>
          <div class="value">59.34%</div>
        </div>
        <div class="info-item">
          <div class="label">预计剩余时间</div>
          <div class="value">16分钟</div>
        </div>
      </div>

      <button
        class="voice-toggle"
        :class="{ active: isVoiceActive }"
        @click="toggleVoice"
      >
        {{ isVoiceActive ? '停止声纹治疗' : '启动声纹治疗' }}
      </button>

      <div class="voice-tip" :class="{ active: isVoiceActive }">
        {{ isVoiceActive ? '声纹治疗已启动' : '声纹治疗已停止' }}
      </div>

      <div class="wave-card">
        <div class="wave-title">声纹监测数据</div>
        <canvas ref="waveCanvas" class="wave-canvas"></canvas>
        <div class="wave-row" v-if="isVoiceActive">
          <div>基础频率：41次</div>
          <div>AC态：声学监测中</div>
        </div>
      </div>

      <div class="img-tabs">
        <button
          class="img-tab"
          :class="{ active: activeImg === 'original' }"
          @click="activeImg = 'original'"
        >
          原始图
        </button>
        <button
          class="img-tab"
          :class="{ active: activeImg === 'nir' }"
          @click="activeImg = 'nir'"
        >
          多光谱近红外照片
        </button>
        <button
          class="img-tab"
          :class="{ active: activeImg === 'disease' }"
          @click="activeImg = 'disease'"
        >
          病害检测图
        </button>
      </div>

      <div class="img-box">
        <div v-if="!showImageAfterVideo" class="img-placeholder">巡检暂未开始</div>
        </div><!-- 原始图 = rgb_url -->
        <img v-if="diagnoseData?.images?.rgb_url" :src="baseHost + diagnoseData.images.rgb_url" class="plant-img">
        <!-- 多光谱 = mask_url -->
        <img v-if="diagnoseData?.images?.mask_url" :src="baseHost + diagnoseData.images.mask_url" class="plant-img">
        <!-- 病害图 = overlay_url -->
        <img v-if="diagnoseData?.images?.overlay_url" :src="baseHost + diagnoseData.images.overlay_url" class="plant-img">
      <div class="light-green-card param-card">
        <div class="param-grid">
          <div class="param-item">
            <div class="param-name">综合健康评分</div>
            <div class="param-value">{{ diagnoseData?.fused_score ?? "--" }}</div>
          </div>
          <div class="param-item">
            <div class="param-name">健康等级</div>
            <div class="param-value warn">{{ diagnoseData?.final_level ?? "--" }}</div>
          </div>
          <div class="param-item">
            <div class="param-name">多光谱分项评分</div>
            <div class="param-value">{{ diagnoseData?.ms_score ?? "--" }}</div>
          </div>
          <div class="param-item">
            <div class="param-name">HI</div>
            <div class="param-value">{{ diagnoseData?.acoustic?.hi ?? "--" }}</div>
          </div>
          <div class="param-item">
            <div class="param-name">叶绿素</div>
            <div class="param-value">{{ diagnoseData?.physiology?.chlorophyll ?? "--" }}</div>
          </div>
          <div class="param-item">
            <div class="param-name">含水量</div>
            <div class="param-value">{{ diagnoseData?.physiology?.fmc ?? "--" }}</div>
          </div>
          <div class="param-item">
            <div class="param-name">氮含量</div>
            <div class="param-value">{{ diagnoseData?.physiology?.nitrogen ?? "--" }}</div>
          </div>
          <div class="param-item">
            <div class="param-name">生长阶段</div>
            <div class="param-value">{{ diagnoseData?.growth?.stage ?? "--" }}</div>
          </div>
        </div>
      </div>

      <button v-if="!isRechecked" class="recheck-btn" @click="startRecheck">
        开始复检
      </button>

      <div v-else class="light-green-card recheck-card">
        <div class="card-header">
          <div class="card-title">本次复检结果</div>
          <!-- 查看详情：仅弹窗，不跳转 -->
          <button class="detail-btn" @click="showDetail = true">查看详情</button>
        </div>
        <div class="card-body">
          <div class="row">
            <span class="label">状态描述：</span>
            <span class="value">{{ diagnoseData?.description || "--" }}</span>
          </div>
          <div class="row">
            <span class="label">异常等级：</span>
            <span class="value">{{ diagnoseData?.final_level || "--" }}</span>
          </div>
          <div class="row">
            <span class="label">声学风险：</span>
            <span class="value">{{ diagnoseData?.acoustic?.risk_level || "--" }}</span>
          </div>
          <div class="row">
            <span class="label">生长阶段：</span>
            <span class="value">{{ diagnoseData?.growth?.stage || "--" }}</span>
          </div>
          <div class="row">
            <span class="label">养护建议：</span>
            <span class="value">{{ diagnoseData?.disease_advice?.treatment || "--" }}</span>
          </div>
          <div class="disease-section">
            <div class="disease-title">生长补充说明</div>
            <div class="disease-item">{{ diagnoseData?.growth?.description || "--" }}</div>
          </div>
        </div>
      </div>

      <div class="safe-area-bottom"></div>
    </main>

    <nav class="nav">
      <div class="nav-item" :class="{active: $route.path === '/home'}" @click="go('/home')">
        <span class="nav-text">首页</span>
      </div>
      <div class="nav-item" :class="{active: $route.path === '/evaluate'}" @click="go('/evaluate')">
        <span class="nav-text">功能中心</span>
      </div>
      <div class="nav-item" :class="{active: $route.path === '/diagnose'}" @click="go('/diagnose')">
        <span class="nav-text">历史数据</span>
      </div>
      <div class="nav-item" :class="{active: $route.path === '/drone'}" @click="go('/drone')">
        <span class="nav-text">无人机管理</span>
      </div>
      <div class="nav-item" :class="{active: $route.path === '/user-center'}" @click="go('/user-center')">
        <span class="nav-text">个人中心</span>
      </div>
    </nav>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const go = (path) => router.push(path)

const currentTime = ref('')
const activeImg = ref('original')
const showImageAfterVideo = ref(false)

const waveCanvas = ref(null)
const isRechecked = ref(false)
const isVoiceActive = ref(false)

const modalShow = ref(false)
const modalTitle = ref('')
const modalDesc = ref('')
const showDetail = ref(false)

// 数据
const diagnoseData = ref({
  physiology: {},
  acoustic: {},
  growth: {},
  disease_advice: {},
  images: {}
})

let timer = null
let anim = null
const baseHost = "http://127.0.0.1:9000"


const showModal = (type) => {
  modalShow.value = true
  if(type === 'voice'){
    modalTitle.value = '声纹治疗在线'
    modalDesc.value = '当前声纹治疗模块正常待机，支持低频声波物理抑菌、舒缓作物胁迫'
  }
  if(type === 'multi'){
    modalTitle.value = '多模态回传正常'
    modalDesc.value = '无人机影像、光谱、传感器数据稳定回传，解析正常'
  }
  if(type === 'agent'){
    modalTitle.value = 'Agent待决策'
    modalDesc.value = '系统已识别作物异常，治理方案已生成，等待确认'
  }
}
const closeModal = () => {
  modalShow.value = false
}

const fetchDiagnoseData = async () => {
  try {
    const formData = new FormData()
    formData.append("plant_id", "avocado_001")

    const res = await fetch(`${baseHost}/api/v1/multimodal/diagnose`, {
      method: "POST",
      body: formData
    })
    diagnoseData.value = await res.json()
  } catch (err) {
    console.error("请求错误：", err)
  }
}

function toggleVoice() {
  isVoiceActive.value = !isVoiceActive.value
  if (isVoiceActive.value) {
    draw()
    showImageAfterVideo.value = true
  } else {
    cancelAnimationFrame(anim)
    showImageAfterVideo.value = false
  }
}

function startRecheck() {
  isRechecked.value = true
}

function updateTime() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  currentTime.value = `${h}:${m}`
}

function draw() {
  const c = waveCanvas.value
  if (!c || !isVoiceActive.value) return
  const ctx = c.getContext('2d')
  const w = c.offsetWidth
  const h = c.height
  c.width = w
  c.height = h
  ctx.clearRect(0, 0, w, h)
  ctx.strokeStyle = '#1d9b67'
  ctx.lineWidth = 2
  ctx.beginPath()
  const t = Date.now() / 1000
  for (let x = 0; x < w; x++) {
    const k = x / w
    const y = h / 2 + Math.sin(k * 30 + t * 6) * 14 * Math.exp(-Math.pow((k - 0.5) * 5, 2))
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.stroke()
  anim = requestAnimationFrame(draw)
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 3000)
  fetchDiagnoseData()
})

onUnmounted(() => {
  clearInterval(timer)
  cancelAnimationFrame(anim)
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
  height: 100vh;
  background: #f5f9f7;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  background: #1d9b67;
  padding: 8px 16px 16px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  flex-shrink: 0;
}
.status-bar {
  color: #fff;
  font-size: 14px;
  padding: 4px 0;
}
.app-title {
  color: #fff;
  font-size: 20px;
  margin: 8px 0;
}
.app-subtitle {
  color: #fff;
  font-size: 14px;
  margin-bottom: 12px;
  opacity: 0.9;
}
.header-tabs {
  display: flex;
  gap: 8px;
}
.tab-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  text-align: center;
  padding: 8px 0;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.tab-item:hover{
  background: rgba(255,255,255,0.35);
}

.modal-mask{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-box{
  width: 80%;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
}
.modal-title{
  background: #1d9b67;
  color: #fff;
  font-size: 16px;
  padding: 12px;
  text-align: center;
}
.modal-content{
  padding: 16px;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  max-height: 60vh;
  overflow-y: auto;
}
.modal-close{
  text-align: center;
  padding: 10px;
  color: #1d9b67;
  border-top: 1px solid #eee;
  cursor: pointer;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 12px 100px 12px;
  -webkit-overflow-scrolling: touch;
}

.info-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.info-item {
  flex: 1;
  text-align: center;
}
.label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}
.value {
  font-size: 15px;
  font-weight: bold;
  color: #1d9b67;
}
.value.warn {
  color: #f53f3f;
}

.voice-toggle {
  width: 100%;
  background: #e5f5ee;
  color: #1d9b67;
  border: none;
  border-radius: 12px;
  padding: 12px 0;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
  transition: all 0.3s;
  cursor: pointer;
}
.voice-toggle.active {
  background: #1d9b67;
  color: #fff;
}

.voice-tip {
  background: #f5f9f7;
  color: #666;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 12px;
}
.voice-tip.active {
  background: #1d9b67;
  color: #fff;
}

.wave-card {
  background: #fff;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.wave-title {
  font-size: 14px;
  color: #1d9b67;
  margin-bottom: 8px;
  font-weight: 500;
}
.wave-canvas {
  width: 100%;
  height: 80px;
  background: #f8fdfa;
  border-radius: 12px;
}
.wave-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #333;
  margin-top: 6px;
}

.img-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.img-tab {
  flex: 1;
  background: #f0faf5;
  color: #333;
  border: none;
  border-radius: 10px;
  padding: 10px 0;
  font-size: 14px;
  transition: all 0.2s;
  cursor: pointer;
}
.img-tab.active {
  background: #1d9b67;
  color: #fff;
}

.img-box {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.plant-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.img-placeholder {
  font-size: 16px;
  color: #999;
}

.light-green-card {
  background: #e5f5ee;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #c8e6d9;
}

.param-card .param-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.param-card .param-item {
  padding: 8px 0;
  text-align: left;
  background:#fff;
  padding:10px;
  border-radius:10px;
}
.param-card .param-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  opacity: 0.8;
}
.param-card .param-value {
  font-size: 18px;
  font-weight: bold;
  color: #1d9b67;
}
.param-card .param-value.warn {
  color: #f53f3f;
}

.recheck-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #c8e6d9;
  padding-bottom: 8px;
}
.recheck-card .card-title {
  font-size: 15px;
  font-weight: bold;
  color: #1d9b67;
}
.detail-btn {
  background: #1d9b67;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
}
.recheck-card .card-body .row {
  display: flex;
  font-size: 14px;
  margin-bottom: 6px;
  line-height: 1.5;
}
.recheck-card .card-body .label {
  width: 80px;
  color: #666;
  flex-shrink: 0;
}
.recheck-card .card-body .value {
  color: #333;
  flex: 1;
}

.recheck-card .disease-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #c8e6d9;
}
.recheck-card .disease-title {
  font-size: 16px;
  font-weight: bold;
  color: #1d9b67;
  margin-bottom: 8px;
}
.recheck-card .disease-item {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 4px;
}

.recheck-btn {
  width: 100%;
  background: #1d9b67;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  cursor: pointer;
}

.safe-area-bottom {
  height: 70px;
}

.nav {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 99;
  padding: 0 4px;
}
.nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  border-radius: 12px;
  transition: all 0.2s;
  margin: 0 4px;
  justify-content: center;
  cursor: pointer;
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
