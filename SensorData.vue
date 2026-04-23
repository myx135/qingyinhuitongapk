<template>
  <div class="page">
    <div class="header-bar">
      <button class="back-btn" @click="$router.go(-1)">返回</button>
      <div class="app-info">
        <h1 class="app-title">声波处方</h1>
        <p class="app-time">{{ nowTime }}</p >
      </div>
    </div>

    <div class="content-box">
      <div class="content-card">
        <div class="form-item">
          <label class="form-label">作物类型</label>
          <input v-model="form.crop_type" class="form-input" placeholder="例如：小麦/水稻/果蔬" />
        </div>
        <div class="form-item">
          <label class="form-label">生长阶段</label>
          <input v-model="form.growth_stage" class="form-input" placeholder="例如：幼苗/花期/成熟期" />
        </div>
        <div class="form-item">
          <label class="form-label">病害类型</label>
          <input v-model="form.disease_type" class="form-input" placeholder="填写检测出的病害名称" />
        </div>
        <div class="form-item">
          <label class="form-label">病害严重度(1-5)</label>
          <input v-model.number="form.disease_severity" class="form-input" type="number" min="1" max="5" />
        </div>
        <div class="form-item">
          <label class="form-label">声学HI值</label>
          <input v-model.number="form.hi_value" class="form-input" type="number" step="0.01" />
        </div>
        <div class="form-row">
          <div class="form-item flex-item">
            <label class="form-label">水分胁迫</label>
            <input v-model.number="form.water_stress" class="form-input" type="number" step="0.01" />
          </div>
          <div class="form-item flex-item">
            <label class="form-label">环境温度</label>
            <input v-model.number="form.temperature" class="form-input" type="number" step="0.1" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-item flex-item">
            <label class="form-label">环境湿度</label>
            <input v-model.number="form.humidity" class="form-input" type="number" step="0.1" />
          </div>
          <div class="form-item flex-item">
            <label class="form-label">光照强度</label>
            <input v-model.number="form.light" class="form-input" type="number" step="0.1" />
          </div>
        </div>

        <button class="submit-btn" @click="generatePrescription" :disabled="loading">
          {{ loading ? '生成中...' : '生成声波处方' }}
        </button>
      </div>

      <div class="result-card" v-if="result.prescription_id">
        <div class="result-title">处方信息</div>
        <div class="result-row"><span>处方ID：</span>{{ result.prescription_id }}</div>
        <div class="result-row"><span>状态：</span>{{ statusText }}</div>
        <div class="result-row"><span>频率范围：</span>{{ result.waveform_params?.freq_start_hz }} ~ {{ result.waveform_params?.freq_end_hz }} Hz</div>
        <div class="result-row"><span>时长：</span>{{ result.waveform_params?.duration_s }} 秒</div>
        <div class="result-row"><span>重复次数：</span>{{ result.waveform_params?.repeat_times }} 次</div>
        <div class="result-desc">{{ result.message }}</div>

        <div class="btn-group" v-if="result.status === 'ready'">
          <button class="play-btn" @click="playAudio">播放声波</button>
          <button class="down-btn" @click="downloadWav">下载WAV</button>
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
      <div class="nav-item" :class="{ active: $route.path === '/prescription' }" @click="go('/prescription')">
        <span class="nav-text">声波处方</span>
      </div>
    </nav>

    <div class="toast" v-if="toastShow">{{ toastText }}</div>
    <audio ref="audioRef" :src="audioUrl"/>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const go = (path) => router.push(path)

const nowTime = ref('')
let timer = null
const updateTime = () => {
  const date = new Date()
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const i = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  nowTime.value = `${y}/${m}/${d} ${h}:${i}:${s}`
}

const form = ref({
  crop_type: '',
  growth_stage: '',
  disease_type: '',
  disease_severity: 3,
  hi_value: 0,
  water_stress: 0,
  temperature: 25,
  humidity: 60,
  light: 3000
})

const loading = ref(false)
const result = ref({})
const prescriptionId = ref('')
let statusTimer = null

const audioRef = ref(null)
const audioUrl = ref('')

const toastShow = ref(false)
const toastText = ref('')
const showToast = (text) => {
  toastText.value = text
  toastShow.value = true
  setTimeout(() => toastShow.value = false, 1500)
}

const statusText = ref('')

const generatePrescription = async () => {
  if(!form.value.crop_type || !form.value.disease_type) {
    showToast('请填写必填参数')
    return
  }
  loading.value = true
  try {
    const res = await fetch('http://127.0.0.1:9000/api/v1/prescription/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const data = await res.json()
    if(res.ok) {
      result.value = data
      prescriptionId.value = data.prescription_id
      statusText.value = data.status === 'ready' ? '生成完成' : '仅配置保存'
      showToast('处方生成成功')
      pollStatus()
    } else {
      showToast(data.error || '生成失败')
    }
  } catch (err) {
    showToast('网络请求异常')
  }
  loading.value = false
}

const pollStatus = () => {
  clearInterval(statusTimer)
  statusTimer = setInterval(async () => {
    const res = await fetch(`http://127.0.0.1:9000/api/v1/prescription/${prescriptionId.value}/status`)
    const data = await res.json()
    result.value.status = data.status
    statusText.value = data.status === 'ready' ? '声波已就绪' : '处理中'
    if(data.status === 'ready') {
      result.value.wav_url = data.wav_url
      audioUrl.value = `http://127.0.0.1:9000${data.wav_url}`
      clearInterval(statusTimer)
    }
  }, 2000)
}

const playAudio = () => {
  audioRef.value?.play()
}

const downloadWav = () => {
  const a = document.createElement('a')
  a.href = audioUrl.value
  a.download = `${prescriptionId.value}.wav`
  a.click()
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
  clearInterval(statusTimer)
})
</script>

<style scoped>
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
  gap: 16px;
}
.back-btn {
  background: #1d9b67;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
}
.app-info { flex: 1; }
.app-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d9b67;
}
.app-time {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}
.content-box {
  padding: 0 20px;
}
.content-card, .result-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 3px 12px rgba(0,55,33,.06);
}
.form-item {
  margin-bottom: 14px;
}
.form-row {
  display: flex;
  gap: 12px;
}
.flex-item { flex: 1; }
.form-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
}
.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
}
.form-input:focus {
  border-color: #1d9b67;
}
.submit-btn {
  width: 100%;
  background: #1d9b67;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-size: 15px;
  margin-top: 10px;
}
.submit-btn:disabled {
  background: #77b99b;
}
.result-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d9b67;
  margin-bottom: 12px;
}
.result-row {
  font-size: 14px;
  color: #333;
  line-height: 1.8;
}
.result-desc {
  margin-top: 10px;
  font-size: 13px;
  color: #666;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
}
.btn-group {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}
.play-btn,.down-btn {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
}
.play-btn {
  background: #e6f4ef;
  color: #1d9b67;
}
.down-btn {
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
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 99;
}
.nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.65);
  color: #fff;
  padding: 7px 18px;
  border-radius: 30px;
  font-size: 13px;
  z-index: 999;
}
</style>