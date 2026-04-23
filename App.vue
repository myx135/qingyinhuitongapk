<template>
  <div id="app">
    <router-view />
    <div class="risk-overlay" v-if="showRiskDialog" @click="closeRisk">
      <div class="risk-dialog" @click.stop>
        <div class="risk-title">⚠️ 高风险操作提醒</div>
        <div class="risk-content">{{ riskConfig.content }}</div>
        <div class="risk-actions">
          <button class="risk-btn-cancel" @click="closeRisk">取消</button>
          <button class="risk-btn-confirm" @click="confirmRisk">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const showRiskDialog = ref(false)
const riskCallback = ref<(() => void) | null>(null)
const riskConfig = reactive({ content: '' })

const openRisk = (content: string, callback: () => void) => {
  riskConfig.content = content
  riskCallback.value = callback
  showRiskDialog.value = true
}

const closeRisk = () => {
  showRiskDialog.value = false
  riskCallback.value = null
}

const confirmRisk = () => {
  riskCallback.value?.()
  closeRisk()
}

defineExpose({ openRisk })
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f3f8f4;
}

#app {
  height: 100%;
}

.risk-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.risk-dialog {
  width: 90%;
  max-width: 400px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.risk-title {
  font-size: 18px;
  font-weight: 600;
  color: #d32f2f;
  margin-bottom: 12px;
}

.risk-content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 20px;
}

.risk-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.risk-btn-cancel {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #f5f5f5;
  color: #666;
  cursor: pointer;
}

.risk-btn-confirm {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #d32f2f;
  color: #fff;
  cursor: pointer;
}
</style>