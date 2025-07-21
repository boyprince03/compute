import { createRouter, createWebHistory } from 'vue-router'
import Calculator from '../views/Calculator.vue'
import Edit from '../views/Edit.vue'
import ExcelImport from '../views/ExcelImport.vue'
import Manage from '../views/Manage.vue'

const routes = [
  { path: '/', component: Calculator },
  { path: '/manage', component: Manage },
  { path: '/import', component: ExcelImport },
  { path: '/edit', component: Edit },
  { path: '/edit/:id', component: Edit }, // 編輯用
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
