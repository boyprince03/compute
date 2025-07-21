<template>
  <div class="card">
    <h2>{{ isEdit ? '編輯資料' : '新增資料' }}</h2>
    <form @submit.prevent="handleSubmit">
      <label>科別</label>
      <input v-model="form.department" required /><br />
      <label>類別</label>
      <input v-model="form.category" required /><br />
      <label>項目名稱</label>
      <input v-model="form.name" required /><br />
      <label>金額</label>
      <input v-model.number="form.price" type="number" required /><br />
      <button type="submit">{{ isEdit ? '更新' : '新增' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL;

const route = useRoute()
const router = useRouter()
const form = ref({
  department: '',
  category: '',
  name: '',
  price: 0,
})
const isEdit = ref(false)

onMounted(async () => {
  if (route.params.id) {
    isEdit.value = true
    // 取得單筆資料
    const { data } = await axios.get(`${apiUrl}/api/items/${route.params.id}`)
    form.value = data
  }
})

const handleSubmit = async () => {
  if (isEdit.value) {
    // 更新資料
    await axios.put(`${apiUrl}/api/items/${route.params.id}`, form.value)
  } else {
    // 新增資料
    await axios.post(`${apiUrl}/api/items`, form.value)
  }
  router.push('/')
}
</script>
