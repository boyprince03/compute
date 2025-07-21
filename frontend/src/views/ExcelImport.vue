<template>
  <div class="card">
    <h3>匯入 Excel 檔案</h3>
    <input type="file" @change="onFileChange" accept=".xlsx,.xls" />
    <button v-if="parsedData.length" @click="uploadToServer">批次匯入資料庫</button>
    <table v-if="parsedData.length" border="1" style="margin-top:1rem;">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in parsedData" :key="row.id">
          <td v-for="col in columns" :key="col">{{ row[col] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import * as XLSX from 'xlsx'
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL;
import { ref } from 'vue'

const parsedData = ref([])
const columns = ref([])

// 1. 解析 Excel
function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })
    parsedData.value = json
    columns.value = json.length ? Object.keys(json[0]) : []
  }
  reader.readAsArrayBuffer(file)
}

// 2. 批次查重 API
async function checkDuplicates(items) {
  const res = await fetch(`${apiUrl}/api/items/check-duplicates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  return (await res.json()).duplicates
}

// 3. 批次上傳
async function uploadItems(items) {
  for (const item of items) {
    await axios.post(`${apiUrl}/api/items`, {
      department: item.department,
      category: item.category,
      name: item.name,
      price: Number(item.price)
    })
  }
}

// 4. 主流程（按下批次匯入）
async function uploadToServer() {
  if (!parsedData.value.length) return

  // 準備查重欄位資料
  const checkItems = parsedData.value.map(row => ({
    department: row.department,
    category: row.category,
    name: row.name
  }))
  const duplicates = await checkDuplicates(checkItems)

  if (duplicates.length > 0) {
    const skip = confirm(
      `發現 ${duplicates.length} 筆重複資料，是否略過這些重複資料？（確定=略過，取消=全部上傳）`
    )
    let uploadList = []
    if (skip) {
      // 略過重複
      uploadList = parsedData.value.filter(
        item =>
          !duplicates.some(
            d =>
              d.department === item.department &&
              d.category === item.category &&
              d.name === item.name
          )
      )
    } else {
      // 全部都上傳（如要覆蓋，後端應支援更新）
      uploadList = parsedData.value
    }
    await uploadItems(uploadList)
    alert('匯入完成！')
    parsedData.value = []
  } else {
    // 無重複直接上傳
    await uploadItems(parsedData.value)
    alert('匯入完成！')
    parsedData.value = []
  }
}
</script>
