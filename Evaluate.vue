<template>
  <div class="page">
    <div class="header-bar">
      <button class="back-btn" @click="router.back">返回</button>
      <div class="app-info">
        <h1 class="app-title">功能中心</h1>
        <p class="app-desc">核心工作台 · 一站式作业</p >
      </div>
    </div>

    <div class="content-box">
      <div class="work-grid">
        <div class="work-item" @click="go('/plot')">
          <div class="work-title">用户与地块管理</div>
          <div class="work-desc">账号、角色、GIS地块</div>
        </div>

        <div class="work-item" @click="go('/growth-cycle')">
          <div class="work-title">作物生命周期</div>
          <div class="work-desc">作物阶段跟踪</div>
        </div>

        <div class="work-item" @click="go('/plan')">
          <div class="work-title">数据采集与监测</div>
          <div class="work-desc">无人机、声学、传感器</div>
        </div>

        <div class="work-item" @click="go('/diagnose')">
          <div class="work-title">智能诊断与分析</div>
          <div class="work-desc">风险·融合诊断</div>
        </div>

        <div class="work-item" @click="go('/monitor')">
          <div class="work-title">可视化展示</div>
          <div class="work-desc">声波·处方</div>
        </div>

        <div class="work-item" @click="go('/executor')">
          <div class="work-title">疗效评估</div>
          <div class="work-desc">记录·报告·建议</div>
        </div>

        <div class="work-item" @click="go('/weedmap')">
          <div class="work-title">系统管理与扩展</div>
          <div class="work-desc">设备·接口·运行日志</div>
        </div>
      </div>
    </div>

    <nav class="bottom-nav">
      <div class="nav-item" :class="{ active: $route.path === '/home' }" @click="go('/home')">
        <span class="nav-text">首页</span>
      </div>
      <div class="nav-item active" @click="go('/evaluate')">
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
const router = useRouter()
const go = (path) => router.push(path)
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

.app-desc {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}

.content-box {
  padding: 20px;
}

.work-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.work-item {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 3px 12px rgba(0,55,33,.06);
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
}

.work-item:active {
  transform: scale(0.98);
}

.work-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.work-desc {
  font-size: 12px;
  color: #888;
}

/* 底部导航（全项目统一） */
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