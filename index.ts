import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import Home from '../pages/home/Home.vue'
import Login from '../pages/login/Login.vue'
import UserCenter from '../pages/user/UserCenter.vue'
import GrowthCycle from '../pages/growth/GrowthCycle.vue'
import Evaluate from '../pages/evaluate/Evaluate.vue'
import Executor from '../pages/executor/Executor.vue'
import Diagnose from '../pages/diagnose/Diagnose.vue'
import DroneControl from '../pages/drone/DroneControl.vue'
import SensorData from '../pages/monitor/SensorData.vue'
import Plan from '../pages/plan/Plan.vue'
import PlotMap from '../pages/plot/PlotMap.vue'
import WeedMap from '../pages/weedmap/WeedMap.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/user-center',
    name: 'UserCenter',
    component: UserCenter
  },
  {
    path: '/growth-cycle',
    name: 'GrowthCycle',
    component: GrowthCycle
  },
  {
    path: '/evaluate',
    name: 'Evaluate',
    component: Evaluate
  },
  {
    path: '/executor',
    name: 'Executor',
    component: Executor
  },
  {
    path: '/diagnose',
    name: 'Diagnose',
    component: Diagnose
  },
  {
    path: '/drone',
    name: 'DroneControl',
    component: DroneControl
  },
  {
    path: '/monitor',
    name: 'SensorData',
    component: SensorData
  },
  {
    path: '/plan',
    name: 'Plan',
    component: Plan
  },
  {
    path: '/plot',
    name: 'PlotMap',
    component: PlotMap
  },
  {
    path: '/weedmap',
    name: 'WeedMap',
    component: WeedMap
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router