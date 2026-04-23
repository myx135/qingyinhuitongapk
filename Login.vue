<template>
  <div class="login-container">
    <div class="bg-gradient"></div>
    <div class="auth-card" :class="{ 'register-active': isRegister, 'find-pwd-active': isFindPwd }">
      <div class="brand-section">
        <img 
          src="@/assets/logo.png" 
          alt="青音慧瞳Logo" 
          class="project-logo"
        />
        <h1 class="project-title">青音慧瞳</h1>
        <p class="project-desc">智慧作物监测平台</p >
      </div>

      <div class="auth-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: !isRegister && !isFindPwd }"
          @click="switchAuth('login')"
          :disabled="!isRegister && !isFindPwd"
        >
          登录
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: isRegister }"
          @click="switchAuth('register')"
          :disabled="isRegister"
        >
          注册
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: isFindPwd }"
          @click="switchAuth('findPwd')"
          :disabled="isFindPwd"
        >
          找回密码
        </button>
      </div>

      <div class="auth-form">
        <!-- 登录表单：允许记住密码、自动填充 -->
        <div class="form-panel" v-if="!isRegister && !isFindPwd">
          <div class="input-group">
            <input 
              v-model="form.phone" 
              type="tel" 
              placeholder="请输入手机号" 
              class="input-field"
              maxlength="11"
              @input="handlePhoneInput"
              autocomplete="username"
              name="login-phone"
            />
          </div>
          <div class="input-group">
            <input 
              v-model="form.pwd" 
              type="password" 
              placeholder="请输入密码" 
              class="input-field"
              autocomplete="current-password"
              name="login-pwd"
            />
          </div>
          <button @click="handleLogin" class="auth-btn">登录</button>
          <div class="link-area">
            <a @click="switchAuth('findPwd')" class="auth-link">忘记密码？</a >
          </div>
        </div>

        <!-- 注册表单：禁止自动填充、禁止记住 -->
        <div class="form-panel" v-if="isRegister">
          <div class="input-group">
            <input 
              v-model="registerForm.phone" 
              type="tel" 
              placeholder="请输入手机号" 
              class="input-field"
              maxlength="11"
              @input="handlePhoneInput"
              autocomplete="off"
              name="reg-phone"
            />
          </div>
          <div class="input-group">
            <input 
              v-model="registerForm.code" 
              type="text" 
              placeholder="请输入验证码" 
              class="input-field"
              autocomplete="off"
              name="reg-code"
            />
            <button @click="sendCode" class="code-btn" :disabled="codeCountdown > 0">
              {{ codeCountdown ? `${codeCountdown}s` : '获取验证码' }}
            </button>
          </div>
          <div class="input-group">
            <input 
              v-model="registerForm.pwd" 
              type="password" 
              placeholder="请设置密码" 
              class="input-field"
              autocomplete="new-password"
              name="reg-pwd"
            />
          </div>
          <div class="input-group">
            <input 
              v-model="registerForm.confirmPwd" 
              type="password" 
              placeholder="请确认密码" 
              class="input-field"
              autocomplete="new-password"
              name="reg-confirm-pwd"
            />
          </div>
          <button @click="handleRegister" class="auth-btn">注册</button>
        </div>

        <!-- 找回密码表单：禁止自动填充、禁止记住 -->
        <div class="form-panel" v-if="isFindPwd">
          <div class="input-group">
            <input 
              v-model="findPwdForm.phone" 
              type="tel" 
              placeholder="请输入绑定手机号" 
              class="input-field"
              maxlength="11"
              @input="handlePhoneInput"
              autocomplete="off"
              name="find-pwd-phone"
            />
          </div>
          <div class="input-group">
            <input 
              v-model="findPwdForm.code" 
              type="text" 
              placeholder="请输入验证码" 
              class="input-field"
              autocomplete="off"
              name="find-pwd-code"
            />
            <button @click="sendCode" class="code-btn" :disabled="codeCountdown > 0">
              {{ codeCountdown ? `${codeCountdown}s` : '获取验证码' }}
            </button>
          </div>
          <div class="input-group">
            <input 
              v-model="findPwdForm.newPwd" 
              type="password" 
              placeholder="请设置新密码" 
              class="input-field"
              autocomplete="new-password"
              name="find-pwd-new"
            />
          </div>
          <button @click="handleFindPwd" class="auth-btn">确认重置</button>
        </div>
      </div>

      <div class="back-login" v-if="isRegister || isFindPwd">
        <a @click="switchAuth('login')" class="back-link">返回登录</a >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isRegister = ref(false)
const isFindPwd = ref(false)
const codeCountdown = ref(0)

const form = reactive({ phone: '', pwd: '' })
const registerForm = reactive({ phone: '', code: '', pwd: '', confirmPwd: '' })
const findPwdForm = reactive({ phone: '', code: '', newPwd: '' })

const switchAuth = (type: 'login' | 'register' | 'findPwd') => {
  isRegister.value = type === 'register'
  isFindPwd.value = type === 'findPwd'
  
  if (type === 'login') {
    registerForm.phone = ''
    registerForm.code = ''
    registerForm.pwd = ''
    registerForm.confirmPwd = ''
    findPwdForm.phone = ''
    findPwdForm.code = ''
    findPwdForm.newPwd = ''
  } else if (type === 'register') {
    form.phone = ''
    form.pwd = ''
    findPwdForm.phone = ''
    findPwdForm.code = ''
    findPwdForm.newPwd = ''
  } else {
    form.phone = ''
    form.pwd = ''
    registerForm.phone = ''
    registerForm.code = ''
    registerForm.pwd = ''
    registerForm.confirmPwd = ''
  }
  codeCountdown.value = 0
}

const handlePhoneInput = () => {
  if (isRegister.value) {
    registerForm.phone = registerForm.phone.replace(/\D/g, '')
  } else if (isFindPwd.value) {
    findPwdForm.phone = findPwdForm.phone.replace(/\D/g, '')
  } else {
    form.phone = form.phone.replace(/\D/g, '')
  }
}

const sendCode = () => {
  if (codeCountdown.value > 0) return
  
  const targetPhone = isRegister.value ? registerForm.phone : findPwdForm.phone
  if (!/^1[3-9]\d{9}$/.test(targetPhone)) {
    alert('请输入正确的手机号')
    return
  }

  codeCountdown.value = 60
  const timer = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) clearInterval(timer)
  }, 1000)
}

const handleLogin = () => {
  if (!form.phone || !form.pwd) {
    alert('请输入手机号和密码')
    return
  }
  router.push('/home')
}

const handleRegister = () => {
  if (!registerForm.phone || !registerForm.code || !registerForm.pwd || !registerForm.confirmPwd) {
    alert('请填写完整注册信息')
    return
  }
  if (registerForm.pwd !== registerForm.confirmPwd) {
    alert('两次密码输入不一致')
    return
  }
  alert('注册成功，请登录')
  switchAuth('login')
}

const handleFindPwd = () => {
  if (!findPwdForm.phone || !findPwdForm.code || !findPwdForm.newPwd) {
    alert('请填写完整重置信息')
    return
  }
  alert('密码重置成功，请登录')
  switchAuth('login')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  padding-top: env(safe-area-inset-top);
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1A5F22 0%, #4CAF50 100%);
  z-index: -1;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.brand-section {
  text-align: center;
  margin-bottom: 32px;
}

.project-logo {
  width: 120px;
  height: auto;
  object-fit: contain;
  margin-bottom: 16px;
}

.project-title {
  font-size: 28px;
  font-weight: 700;
  color: #222;
  margin: 0;
  letter-spacing: 1px;
}

.project-desc {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0;
}

.auth-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: #2E7D32;
  color: #fff;
  font-weight: 600;
}

.tab-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.auth-form {
  min-height: 240px;
}

.form-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  padding: 14px 18px;
  background: #f9f9f9;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-group:focus-within {
  border-color: #2E7D32;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

.input-field {
  flex: 1;
  min-width: 0;
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background: transparent;
  padding: 2px;
  box-sizing: border-box;
}

.input-field::placeholder {
  color: #999;
}

.code-btn {
  padding: 8px 12px;
  background: #2E7D32;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  margin-left: 12px;
  transition: all 0.2s ease;
}

.code-btn:disabled {
  background: #9ccc9c;
  cursor: not-allowed;
}

.auth-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  box-shadow: 0 8px 20px rgba(46, 125, 50, 0.2);
}

.auth-btn:active {
  transform: scale(0.98);
}

.link-area {
  text-align: right;
  margin-top: 12px;
}

.auth-link {
  font-size: 14px;
  color: #2E7D32;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.auth-link:hover {
  color: #1A5F22;
  text-decoration: underline;
}

.back-login {
  text-align: center;
  margin-top: 24px;
}

.back-link {
  font-size: 14px;
  color: #666;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #2E7D32;
}
</style>