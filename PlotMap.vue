<template>
  <div class="page">
    <div class="top-bar">
      <button class="back-btn" @click="go('/evaluate')">返回</button>
      <h1 class="page-title">用户与地块管理</h1>
    </div>

    <div class="content-card">
      <div class="menu-item" @click="showAccountInfo = !showAccountInfo">
        <div class="menu-title">账号信息</div>
        <div class="menu-subtitle">查看与修改个人账号资料</div>
      </div>
      <div class="panel" v-if="showAccountInfo">
        <div class="row">
          <span>用户名：</span>
          <span>lovers rock</span>
        </div>
        <div class="row">
          <span>手机号：</span>
          <span>13576789990</span>
        </div>
        <div class="row">
          <span>职务：</span>
          <span>管理员</span>
        </div>
      </div>

      <div class="menu-item" @click="showRoleAssign = !showRoleAssign">
        <div class="menu-title">角色分配</div>
        <div class="menu-subtitle">农户 / 技术员 权限管理</div>
      </div>
      <div class="panel" v-if="showRoleAssign">
        <div class="role-item" v-for="item in roleList" :key="item.id">
          <span>{{ item.name }}</span>
          <span>{{ item.role }}</span>
          <div class="opt-group">
            <span class="opt-edit" @click="editRoleItem(item)">编辑</span>
            <span class="opt-del" @click="deleteRole(item.id)">删除</span>
          </div>
        </div>
        <button class="add-btn" @click="openAddRoleDialog">新增用户</button>
      </div>

      <div class="menu-item" @click="showPlotInfo = !showPlotInfo">
        <div class="menu-title">GIS地块管理</div>
        <div class="menu-subtitle">边界、坐标、面积管理</div>
      </div>
      <div class="panel" v-if="showPlotInfo">
        <div class="row">
          <span>地块名称：</span>
          <span>山大威海植物园试验田</span>
        </div>
        <div class="row">
          <span>面积：</span>
          <span>3.2 亩</span>
        </div>
        <div class="row">
          <span>坐标：</span>
          <span>122.083 / 37.542</span>
        </div>
        <div class="row">
          <span>边界：</span>
          <span>完全覆盖</span>
        </div>
      </div>

      <div class="menu-item" @click="go('/growth-cycle')">
        <div class="menu-title">作物生命周期</div>
        <div class="menu-subtitle">进入七叶一枝花阶段跟踪</div>
      </div>
    </div>

    <div class="mask" v-if="dialogVisible" @click.self="closeDialog">
      <div class="dialog">
        <div class="dialog-head">{{ dialogTitle }}</div>
        <div class="dialog-body">
          <div class="form-line">
            <label>姓名</label>
            <input v-model="editForm.name">
          </div>
          <div class="form-line">
            <label>角色</label>
            <input v-model="editForm.role">
          </div>
        </div>
        <div class="dialog-foot">
          <button class="cancel-btn" @click="closeDialog">取消</button>
          <button class="sure-btn" @click="saveDialog">保存</button>
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

const showAccountInfo = ref(false)
const showRoleAssign = ref(false)
const showPlotInfo = ref(false)

const roleList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const editForm = ref({})

const openAddRoleDialog = () => {
  dialogVisible.value = true
  dialogTitle.value = '新增用户'
  editForm.value = {id: Date.now(), name: '', role: ''}
}

const editRoleItem = (item) => {
  dialogVisible.value = true
  dialogTitle.value = '编辑用户'
  editForm.value = {...item}
}

const deleteRole = (id) => {
  roleList.value = roleList.value.filter(v => v.id !== id)
}

const closeDialog = () => {
  dialogVisible.value = false
}

const saveDialog = () => {
  const idx = roleList.value.findIndex(v => v.id === editForm.value.id)
  idx > -1 ? roleList.value[idx] = editForm.value : roleList.value.push(editForm.value)
  closeDialog()
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
.menu-item {
  background: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,55,33,.06);
}
.menu-title {
  font-size: 17px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}
.menu-subtitle {
  font-size: 13px;
  color: #888;
}
.panel {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 15px;
}
.role-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
}
.opt-group {
  display: flex;
  gap: 15px;
}
.opt-edit {
  color: #1d9b67;
  font-size: 14px;
  cursor: pointer;
}
.opt-del {
  color: #e53e3e;
  font-size: 14px;
  cursor: pointer;
}
.add-btn {
  width: 100%;
  margin-top: 12px;
  background: #1d9b67;
  color: #fff;
  border: none;
  padding: 10px 0;
  border-radius: 10px;
  cursor: pointer;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.dialog {
  width: 82%;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
}
.dialog-head {
  text-align: center;
  padding: 16px;
  font-size: 17px;
  font-weight: 600;
  color: #333;
}
.dialog-body {
  padding: 0 20px 10px;
}
.form-line {
  margin-bottom: 14px;
}
.form-line label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
}
.form-line input {
  width: 100%;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 14px;
}
.dialog-foot {
  display: flex;
  border-top: 1px solid #eee;
}
.cancel-btn,.sure-btn {
  width: 50%;
  border: none;
  padding: 13px 0;
  font-size: 15px;
  cursor: pointer;
}
.cancel-btn {
  background: #f6f6f6;
  color: #666;
}
.sure-btn {
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