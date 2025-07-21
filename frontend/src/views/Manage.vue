<template>
  <div class="card">
    <h2>資料管理</h2>
    <nav style="text-align: right; margin-bottom: 12px;">
      <router-link to="/edit">
        <button>➕ 新增資料</button>
      </router-link>
    </nav>
    <table>
      <thead>
        <tr>
          <th>科別</th>
          <th>類別</th>
          <th>項目名稱</th>
          <th>金額</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.department }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.price }}</td>
          <td>
            <div class="button-group">
              <router-link :to="`/edit/${item.id}`">
                <button >編輯</button>
              </router-link>
              <button class="danger" @click="remove(item.id)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL;

const items = ref([])

async function loadData() {
  const res = await axios.get(`${apiUrl}/api/items`)
  items.value = res.data
}

async function deleteItem(id) {
  if (!confirm('確定要刪除這筆資料嗎？')) return
  await axios.delete(`${apiUrl}/api/items/${id}`)
  loadData()
}

onMounted(loadData)
</script>
