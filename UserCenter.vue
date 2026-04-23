<template>
  <div class="page">
    <div class="header-bar">
      <button class="back-btn" @click="router.go(-1)">返回</button>
      <div class="app-info">
        <h1 class="app-title">个人中心</h1>
        <p class="app-time">{{ nowTime }}</p >
      </div>
    </div>

    <div class="content-box">
      <div class="content-card">
        <div class="menu-list">
          <div class="menu-item">
            <span class="menu-text">消息通知</span>
            <label class="switch">
              <input type="checkbox" v-model="msgNotify" @change="getTip('消息通知')" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="menu-item">
            <span class="menu-text">高危自动弹窗</span>
            <label class="switch">
              <input type="checkbox" v-model="highRiskPopup" @change="getTip('高危自动弹窗')" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="menu-item">
            <span class="menu-text">自动启动复检</span>
            <label class="switch">
              <input type="checkbox" v-model="autoRecheck" @change="getTip('自动启动复检')" />
              <span class="slider"></span>
            </label>
          </div>

          <div v-if="showDeviceManage" class="device-group">
            <div class="menu-item">
              <span class="menu-text">账号</span>
              <span class="menu-value">admin_2025</span>
            </div>
            <div class="menu-item">
              <span class="menu-text">手机号</span>
              <span class="menu-value">138****6789</span>
            </div>
            <div class="menu-item">
              <span class="menu-text">修改密码</span>
              <span class="menu-arrow">></span>
            </div>

            <div class="device-title">已绑定设备</div>
            <div class="menu-item" v-for="(dev, idx) in deviceList" :key="idx">
              <div style="display:flex;align-items:center;gap:10px;">
                <span class="menu-text">{{ dev.name }}</span>
                <span class="device-status" :class="dev.status">{{ dev.status === 'online' ? '在线' : '离线' }}</span>
              </div>
              <button class="unbind" @click="unbind(idx)">解绑</button>
            </div>
            <div class="menu-item">
              <span class="menu-text">绑定新设备</span>
              <span class="menu-arrow">></span>
            </div>
          </div>

          <div class="menu-item" @click="showDeviceManage = !showDeviceManage">
            <span class="menu-text">账号与设备管理</span>
            <span class="menu-arrow">{{ showDeviceManage ? '∧' : '>' }}</span>
          </div>

          <div class="menu-item" @click="handleLogout">
            <span class="menu-text">退出登录</span>
            <span class="menu-arrow">></span>
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
      <div class="nav-item active" @click="go('/user-center')">
        <span class="nav-text">个人中心</span>
      </div>
    </nav>

    <!-- 文字提示 必加 -->
    <div class="toast" v-if="tipShow">{{ tipMsg }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const go = (path) => router.push(path)

const msgNotify = ref(true)
const highRiskPopup = ref(true)
const autoRecheck = ref(true)

const nowTime = ref('')
let timer = null
const showDeviceManage = ref(false)

const deviceList = ref([])
const mockDevice = [
  { name: '无人机主机 UAV-01', status: 'online' },
  { name: '多光谱相机 MS-02', status: 'offline' }
]

// 提示变量
const tipShow = ref(false)
const tipMsg = ref('')
let tipTimer = null

// 核心：修复提示反向
const getTip = async (name) => {
  await nextTick()
  let flag = false
  if(name === '消息通知') flag = msgNotify.value
  if(name === '高危自动弹窗') flag = highRiskPopup.value
  if(name === '自动启动复检') flag = autoRecheck.value

  tipMsg.value = flag ? `${name}已开启` : `${name}已关闭`
  tipShow.value = true
  clearTimeout(tipTimer)
  tipTimer = setTimeout(() => tipShow.value = false, 1500)
}

const unbind = (index) => {
  deviceList.value.splice(index, 1)
  tipMsg.value = '设备解绑成功'
  tipShow.value = true
  clearTimeout(tipTimer)
  tipTimer = setTimeout(() => tipShow.value = false, 1500)
}

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

const handleLogout = () => {
  router.push('/login')
}

async function fetchUserCenterData() {
  try{
    const res = await fetch("http://127.0.0.1:9000/api/v1/user/info")
    const data = await res.json()
    msgNotify.value = !!data.msgNotify
    highRiskPopup.value = !!data.highRiskPopup
    autoRecheck.value = !!data.autoRecheck
    deviceList.value = data.deviceList?.length ? data.deviceList : mockDevice
  }catch(err){
    msgNotify.value = true
    highRiskPopup.value = true
    autoRecheck.value = true
    deviceList.value = mockDevice
  }
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  fetchUserCenterData()
})

onUnmounted(() => {
  clearInterval(timer)
  clearTimeout(tipTimer)
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

.app-info {
  flex: 1;
}

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

.content-card {
  margin-top: 20px;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  background: #fff;
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 3px 12px rgba(0,55,33,.06);
}

.menu-text {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.menu-value {
  font-size: 15px;
  color: #666;
}

.menu-arrow {
  font-size: 16px;
  color: #999;
}

.device-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 8px;
}

.device-title {
  font-size: 14px;
  color: #1d9b67;
  font-weight: 500;
  padding: 0 4px;
}

.device-status {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}
.device-status.online {
  color: #1d9b67;
  background: #e6f4ef;
}
.device-status.offline {
  color: #ff5757;
  background: #ffeaea;
}

.unbind {
  background: #ff5757;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}

.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
}
.switch input {
  opacity: 0;
}
.slider {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #1d9b67;
}
input:checked + .slider:before {
  transform: translateX(22px);
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

/* 文字提示样式 保留 */
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