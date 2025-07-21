<template>
  <div class="card">
    <h2>項目快速計算</h2>
    <button @click="goEdit">➕ 新增資料</button>


    <div class="filters">
      <select v-model="selectedDept">
        <option value="">全部科別</option>
        <option v-for="dept in departments" :key="dept">{{ dept }}</option>
      </select>
      <select v-model="selectedCategory">
        <option value="">全部類別</option>
        <option v-for="cat in categories" :key="cat">{{ cat }}</option>
      </select>
    </div>
    <div>
      <select v-model="selectedItemId">
        <option disabled value="">請選擇項目</option>
        <option v-for="item in filteredItems" :value="item.id" :key="item.id">
          {{ item.name }}（${{ item.price }}元）
        </option>
      </select>
      <input type="number" v-model.number="itemCount" min="1" style="width:60px;" />
      <button @click="addItem">加入</button>
    </div>

    <table v-if="selectedList.length" style="margin-top:16px;">
      <thead><tr><th>項目名稱</th><th>金額</th><th>數量</th><th>小計</th><th>刪除</th></tr></thead>
      <tbody>
        <tr v-for="(row, idx) in selectedList" :key="row.id">
          <td>{{ row.name }}</td>
          <td>{{ row.price }}</td>
          <td>{{ row.count }}</td>
          <td>{{ row.price * row.count }}</td>
          <td><button @click="removeItem(idx)">移除</button></td>
        </tr>
      </tbody>
    </table>
    <h3 v-if="selectedList.length">總金額：{{ totalAmount }} 元</h3>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'



const items = ref([])
const selectedDept = ref('')
const selectedCategory = ref('')
const selectedItemId = ref('')
const itemCount = ref(1)
const selectedList = ref([])

const departments = computed(() => [...new Set(items.value.map(i => i.department))])
const categories = computed(() => [...new Set(items.value.filter(i => !selectedDept.value || i.department === selectedDept.value).map(i => i.category))])
const filteredItems = computed(() =>
  items.value.filter(i =>
    (!selectedDept.value || i.department === selectedDept.value) &&
    (!selectedCategory.value || i.category === selectedCategory.value)
  )
)

const addItem = () => {
  const item = items.value.find(i => i.id === selectedItemId.value)
  if (!item) return
  selectedList.value.push({ ...item, count: itemCount.value })
}

const removeItem = idx => selectedList.value.splice(idx, 1)

const totalAmount = computed(() =>
  selectedList.value.reduce((sum, row) => sum + row.price * row.count, 0)
)

onMounted(async () => {
  const res = await axios.get('http://localhost:3001/api/items')
  items.value = res.data
})

import { useRouter } from 'vue-router'
const router = useRouter()
const goEdit = () => router.push('/edit')
</script>
