# FileUpload 組件使用說明

## 概述

FileUpload 是一個功能完整的檔案上傳組件，支援圖片和一般檔案的上傳，提供兩種顯示模式（圖片模式和列表模式），並具備自動上傳和手動上傳功能。

## 基本用法

### 1. 引入組件

```vue
<script setup>
import FileUpload from '@/components/common/FileUpload/index.vue'
</script>
```

### 2. 基本使用

```vue
<script setup>
import FileUpload from '@/components/common/FileUpload/index.vue'
import { ref } from 'vue'

const fileList = ref([])
</script>

<template>
  <FileUpload
    v-model="fileList"
    :max-file-count="5"
    :max-file-size="10"
    filetype="img"
    :file-extension="['jpg', 'png', 'gif']"
    :auto-upload="true"
  />
</template>
```

## Props 參數說明

| 參數 | 類型 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| `modelValue` | `FileVO[]` | 否 | `[]` | 已上傳的檔案列表，使用 v-model 綁定 |
| `maxFileCount` | `number` | 是 | - | 最大檔案數量限制 |
| `maxFileSize` | `number` | 是 | - | 單個檔案最大大小（單位：MB） |
| `filetype` | `'img' \| 'list'` | 是 | - | 顯示模式：'img' 為圖片模式，'list' 為列表模式 |
| `fileExtension` | `string[]` | 是 | - | 允許的檔案副檔名陣列 |
| `autoUpload` | `boolean` | 是 | - | 是否自動上傳（true：選擇後立即上傳，false：手動上傳） |
| `disabled` | `boolean` | 否 | `false` | 是否禁用組件 |

## 事件說明

| 事件名 | 參數 | 說明 |
|--------|------|------|
| `update:modelValue` | `FileVO[]` | 檔案列表更新時觸發 |

## 暴露的方法

| 方法名 | 參數 | 返回值 | 說明 |
|--------|------|--------|------|
| `getUploadedFiles` | - | `FileVO[]` | 獲取已上傳成功的檔案列表 |
| `upload` | - | `Promise<void>` | 手動觸發上傳 |

## 使用範例

### 1. 圖片上傳（自動上傳）

```vue
<script setup>
import FileUpload from '@/components/common/FileUpload/index.vue'
import { ref } from 'vue'

const imageList = ref([])
</script>

<template>
  <div>
    <h3>圖片上傳</h3>
    <FileUpload
      v-model="imageList"
      :max-file-count="3"
      :max-file-size="5"
      filetype="img"
      :file-extension="['jpg', 'jpeg', 'png', 'gif', 'webp']"
      :auto-upload="true"
    />

    <div v-if="imageList.length > 0" class="mt-4">
      <h4>已上傳的圖片：</h4>
      <ul>
        <li v-for="file in imageList" :key="file.id">
          {{ file.name }} - {{ file.url }}
        </li>
      </ul>
    </div>
  </div>
</template>
```

### 2. 文件上傳（手動上傳）

```vue
<script setup>
import FileUpload from '@/components/common/FileUpload/index.vue'
import { ref } from 'vue'

const fileUploadRef = ref()
const documentList = ref([])
const isUploading = ref(false)

async function handleUpload() {
  isUploading.value = true
  try {
    await fileUploadRef.value.upload()
    console.log('上傳完成')
  }
  catch (error) {
    console.error('上傳失敗:', error)
  }
  finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div>
    <h3>文件上傳</h3>
    <FileUpload
      ref="fileUploadRef"
      v-model="documentList"
      :max-file-count="10"
      :max-file-size="20"
      filetype="list"
      :file-extension="['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt']"
      :auto-upload="false"
    />

    <div class="mt-4">
      <n-button :loading="isUploading" @click="handleUpload">
        上傳所有文件
      </n-button>
    </div>
  </div>
</template>
```

### 3. 在表單中使用

```vue
<script setup>
import FileUpload from '@/components/common/FileUpload/index.vue'
import { reactive, ref } from 'vue'

const formData = reactive({
  avatar: [],
  attachments: []
})

const rules = {
  avatar: [
    { required: true, message: '請上傳頭像', trigger: 'change' }
  ]
}
</script>

<template>
  <n-form ref="formRef" :model="formData" :rules="rules">
    <n-form-item label="頭像" path="avatar">
      <FileUpload
        v-model="formData.avatar"
        :max-file-count="1"
        :max-file-size="2"
        filetype="img"
        :file-extension="['jpg', 'png']"
        :auto-upload="true"
      />
    </n-form-item>

    <n-form-item label="附件" path="attachments">
      <FileUpload
        v-model="formData.attachments"
        :max-file-count="5"
        :max-file-size="10"
        filetype="list"
        :file-extension="['pdf', 'doc', 'docx']"
        :auto-upload="false"
      />
    </n-form-item>
  </n-form>
</template>
```

## 檔案狀態說明

組件內部會追蹤每個檔案的狀態：

- `pending`: 待上傳
- `uploading`: 上傳中
- `success`: 上傳成功
- `error`: 上傳失敗

## 重要注意事項

### 1. 檔案大小限制
- `maxFileSize` 參數的單位是 **MB**
- 超過限制的檔案會被拒絕並顯示錯誤訊息

### 2. 檔案類型限制
- `fileExtension` 陣列中的副檔名不需要包含點號（如：`['jpg', 'png']` 而不是 `['.jpg', '.png']`）
- 副檔名比較時會自動轉為小寫

### 3. 自動上傳 vs 手動上傳
- **自動上傳** (`autoUpload: true`)：選擇檔案後立即上傳
- **手動上傳** (`autoUpload: false`)：需要點擊「提交上傳」按鈕才會上傳

### 4. 顯示模式差異
- **圖片模式** (`filetype: 'img'`)：以縮圖形式顯示，適合圖片檔案
- **列表模式** (`filetype: 'list'`)：以列表形式顯示，適合各種檔案類型

### 5. 檔案驗證
組件會在以下情況進行驗證：
- 檔案大小是否超過限制
- 檔案副檔名是否在允許範圍內
- 檔案數量是否超過最大限制

### 6. 錯誤處理
- 上傳失敗的檔案會顯示重試按鈕
- 可以單獨重試失敗的檔案
- 所有錯誤都會通過 `window.$message` 顯示

## 常見問題與解決方案

### Q1: 為什麼選擇檔案後沒有立即上傳？
**A:** 檢查 `autoUpload` 參數是否設為 `true`。如果設為 `false`，需要手動點擊「提交上傳」按鈕。

### Q2: 上傳失敗怎麼辦？
**A:** 上傳失敗的檔案會顯示重試按鈕，點擊即可重新上傳。也可以檢查：
- 網路連線是否正常
- 檔案大小是否超過限制
- 檔案格式是否被允許

### Q3: 如何獲取已上傳的檔案列表？
**A:** 使用 `v-model` 綁定的變數，或調用組件的 `getUploadedFiles()` 方法。

### Q4: 為什麼圖片沒有顯示預覽？
**A:** 確保：
- 檔案副檔名在 `fileExtension` 中
- 檔案大小沒有超過 `maxFileSize` 限制
- 使用 `filetype="img"` 模式

### Q5: 如何限制只能上傳圖片？
**A:** 設定 `fileExtension` 為圖片格式，例如：
`：file-extension="['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']"`

### Q6: 如何在上傳前進行額外驗證？
**A:** 目前組件只提供基本的檔案大小和格式驗證。如需額外驗證，建議在父組件中處理。

## 技術細節

### 檔案上傳流程
1. 用戶選擇檔案
2. 組件驗證檔案（大小、格式、數量）
3. 將檔案加入內部列表
4. 根據 `autoUpload` 設定決定是否立即上傳
5. 上傳成功後更新 `modelValue`

### 記憶體管理
- 組件會自動管理臨時 URL 的創建和釋放
- 組件銷毀時會自動清理所有臨時 URL，避免記憶體洩漏

### API 依賴
- 依賴 `@/api/operations/file` 中的 `FileApi.uploadFile` 方法
- 上傳成功後會收到 `FileVO[]` 格式的回應

## 更新日誌

- 支援圖片和列表兩種顯示模式
- 支援自動和手動上傳模式
- 完整的檔案驗證機制
- 自動記憶體管理
- 錯誤重試功能
