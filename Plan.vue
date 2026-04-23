<template>
  <div class="page">
    <div class="top-bar">
      <button class="back-btn" @click="go('/evaluate')">返回</button>
      <h1 class="page-title">数据采集与监测</h1>
    </div>

    <div class="content-card">
      <!-- 无人机多光谱任务 -->
      <div class="card-wrap">
        <div class="menu-item" @click="showDrone = !showDrone">
          <div class="menu-left">
            <div class="menu-title">无人机多光谱任务</div>
            <div class. menu-subtitle>路径优化 / 地块覆盖率分析</div>
          </div>
          <span class="arrow-icon" :class="{ open: showDrone }">▼</span>
        </div>
        <div class="panel" v-show="showDrone">
          <div class="row">
            <span>当前任务</span>
            <span>{{ droneTaskName }}</span>
          </div>
          <div class="row">
            <span>任务状态</span>
            <span :class="droneStatusClass">{{ droneStatus }}</span>
          </div>
          <div class="row">
            <span>路径规划</span>
            <span>已智能优化</span>
          </div>
          <div class="row">
            <span>地块覆盖率</span>
            <span>96%</span>
          </div>
          <div class="row">
            <span>标准飞行高度</span>
            <span>2m</span>
          </div>
          <div class="row">
            <span>预计剩余时长</span>
            <span>{{ droneRemainingTime }} 分钟</span>
          </div>
          <div class="btn-row">
            <button class="mini-btn primary" @click="startDroneTask">开始任务</button>
            <button class="mini-btn default" @click="resetDroneTask">重新规划</button>
          </div>
        </div>
      </div>

      <!-- 声学实时频率 -->
      <div class="card-wrap">
        <div class="menu-item" @click="showSound = !showSound">
          <div class="menu-left">
            <div class="menu-title">声学实时频率调控</div>
            <div class="menu-subtitle">滑动调节作物声纹治疗频率</div>
          </div>
          <span class="arrow-icon" :class="{ open: showSound }">▼</span>
        </div>
        <div class="panel" v-show="showSound">
          <div class="row">
            <span>当前治疗频率</span>
            <span class="freq-num">{{ freq }} Hz</span>
          </div>
          <div class="slider-row">
            <input type="range" min="1000" max="4000" step="100" v-model="freq" class="green-slider" />
          </div>
          <div class="btn-row">
            <button class="mini-btn primary" @click="playSound">开启声纹播放</button>
            <button class="mini-btn default" @click="stopSound">停止声纹治疗</button>
          </div>
        </div>
      </div>

    </div>

    <!-- 底部导航 -->
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const go = (path) => router.push(path)

// 无人机模块
const showDrone = ref(true)
const droneTaskName = ref('七叶一枝花全域巡检')
const droneStatus = ref('运行正常')
const droneStatusClass = ref('text-normal')
const droneRemainingTime = ref(18)

// 声学模块
const showSound = ref(true)
const freq = ref(2200)

// 无人机方法
const startDroneTask = () => {
  droneStatus.value = '任务执行中'
  droneStatusClass.value = 'text-running'
  alert('无人机多光谱任务已启动')
}
const resetDroneTask = () => {
  alert('已重新生成最优巡检路径')
}

// 声学方法
const playSound = () => {
  alert(`已开启声纹治疗，当前频率：${freq.value}Hz`)
}
const stopSound = () => {
  alert('已关闭声纹治疗')
}
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
  color: #1d9b67;
}
.menu-left .menu-subtitle {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
.arrow-icon {
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
.freq-num {
  color: #1d9b67;
  font-weight: 600;
}
.slider-row {
  padding: 12px 0;
}
.green-slider {
  width: 100%;
  accent-color: #1d9b67;
}
.btn-row {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}
.mini-btn {
  flex: 1;
  padding: 9px 0;
  border-radius: 10px;
  border: none;
  font-size: 13px;
  cursor: pointer;
}
.mini-btn.primary {
  background: #1d9b67;
  color: #fff;
}
.mini-btn.default {
  background: #f0faf5;
  color: #1d9b67;
}
.text-normal {
  color: #1d9b67;
}
.text-running {
  color: #ff9f43;
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
}
.nav-item {
  flex: 1;
  text-align: center;
  font-size: 13px;
  color: #666;
}
.nav-item.active .nav-text {
  color: #1d9b67;
  font-weight: 600;
}
</style>