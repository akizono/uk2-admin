<script setup lang="ts">
import { FileApi, type FileVO } from '@/api/operations/file'
import { useBoolean } from '@/hooks'
import { useThrottleAction } from '@/hooks/useThrottleAction'
import { $t } from '@/utils'

const props = withDefaults(defineProps<{
  modelValue?: FileVO[]
  maxFileCount: number
  maxFileSize: number // 單位：MB
  filetype: 'img' | 'list'
  fileExtension?: string[]
  autoUpload: boolean
  disabled?: boolean
  hideDeleteButton?: boolean
  showPreview?: boolean
}>(), {
  modelValue: () => [],
  fileExtension: () => [],
  hideDeleteButton: false,
  showPreview: false,
})

const emit = defineEmits(['update:modelValue'])

// 文件列表狀態
interface FileItem {
  file?: File
  fileVO?: FileVO
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

// 文件列表
const fileList = ref<FileItem[]>([])

// 檔案輸入參考
const fileInputRef = ref<HTMLInputElement | null>(null)

// 是否顯示除錯資訊
const showDebugInfo = ref(false)

// 上傳中狀態
const { bool: isUploading, setTrue: startUploading, setFalse: stopUploading } = useBoolean(false)

// 儲存創建的臨時URL，以便在組件銷毀時釋放
const objectURLs = ref<string[]>([])

// 節流處理的上傳操作
function throttledUpload() {
  useThrottleAction('file-upload', 500, uploadFiles)
}

// 初始化文件列表
function initFileList() {
  // props.modelValue 已經有預設值，不需要再檢查
  fileList.value = props.modelValue.map(fileVO => ({
    fileVO,
    status: 'success',
    progress: 100,
  }))
}

// 監聽 modelValue 變化
watch(() => props.modelValue, (newValue, oldValue) => {
  // 只在初始化時或者當外部強制更新時才重新初始化
  if (!oldValue || !oldValue.length || newValue.length === 0) {
    initFileList()
  }
}, { immediate: true })

// 觸發文件選擇
function triggerFileSelect() {
  // console.log('triggerFileSelect 函數被調用')
  if (fileInputRef.value) {
    // console.log('觸發文件選擇對話框')
    fileInputRef.value.click()
  }
  else {
    // console.log('fileInputRef 為空')
  }
}

// 檢查文件是否符合要求
function validateFile(file: File): { valid: boolean, message?: string } {
  // 檢查檔案大小
  if (file.size > props.maxFileSize * 1024 * 1024) {
    return { valid: false, message: `${$t('fileUpload.fileSizeError1')} ${props.maxFileSize} ${$t('fileUpload.fileSizeError2')}` }
  }

  // 檢查文件類型
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  if (props.fileExtension && props.fileExtension.length > 0 && !props.fileExtension.includes(extension)) {
    return { valid: false, message: `${$t('fileUpload.fileExtensionError1')} ${props.fileExtension.join(', ')} ${$t('fileUpload.fileExtensionError2')}` }
  }

  return { valid: true }
}

// 處理文件選擇
function handleFileSelect(event: Event) {
  // console.log('handleFileSelect 函數被調用')
  const input = event.target as HTMLInputElement
  // console.log('input.files:', input.files)

  if (!input.files || input.files.length === 0) {
    // console.log('沒有選擇文件，返回')
    return
  }

  // 檢查是否超過最大文件數
  if (fileList.value.length + input.files.length > props.maxFileCount) {
    window.$message.error(`${$t('fileUpload.maxFileCountError1')} ${props.maxFileCount} ${$t('fileUpload.maxFileCountError1')}`)
    // console.log('超過最大文件數，返回')
    return
  }

  // console.log('開始添加文件到列表...')
  // 添加文件到列表
  Array.from(input.files).forEach((file) => {
    // console.log('處理文件:', file.name)
    const validation = validateFile(file)
    if (!validation.valid) {
      window.$message.error(validation.message || $t('fileUpload.fileValidationFailed'))
      // console.log('文件驗證失敗:', validation.message)
      return
    }

    // console.log('添加文件到列表:', file.name)
    fileList.value.push({
      file,
      status: 'pending',
      progress: 0,
    })
  })

  // console.log('更新後的文件列表:', fileList.value)

  // 重設輸入框
  if (input)
    input.value = ''

  // 如果設置為自動上傳，則立即上傳文件
  if (props.autoUpload) {
    // console.log('自動上傳模式，立即上傳')
    throttledUpload()
  }
  else {
    // console.log('非自動上傳模式，等待用戶點擊提交')
  }
}

// 上傳文件
async function uploadFiles() {
  // console.log('uploadFiles 函數被調用')
  // console.log('當前文件列表:', fileList.value)

  // 收集待上傳和上傳失敗的文件
  const filesToUpload = fileList.value.filter(item => (item.status === 'pending' || item.status === 'error') && item.file)
  // console.log('待上傳文件:', filesToUpload)

  if (filesToUpload.length === 0) {
    // console.log('沒有待上傳文件，返回')
    return
  }

  // console.log('開始上傳...')
  startUploading()

  try {
    // 更新狀態為上傳中
    filesToUpload.forEach((item) => {
      item.status = 'uploading'
    })

    // 收集要上傳的文件
    const files = filesToUpload.map(item => item.file!).filter(Boolean)

    // console.log('準備上傳文件:', files.map(f => ({ name: f.name, size: f.size, type: f.type })))

    // 檢查文件是否有效
    files.forEach((file) => {
      if (!(file instanceof File)) {
        // console.error('無效的文件對象:', file)
      }
    })

    // 上傳文件
    const response = await FileApi.uploadFile({ files })
    // console.log('上傳文件響應:', response)

    // 檢查響應格式並提取文件數據
    let fileVOs: FileVO[] = []

    // 檢查響應格式
    if (response && typeof response === 'object') {
      const responseData = response.data as any

      if (responseData && Array.isArray(responseData)) {
        // 如果直接是數組
        fileVOs = responseData as FileVO[]
      }
      else if (responseData && typeof responseData === 'object' && responseData.files && Array.isArray(responseData.files)) {
        // 如果是 { data: { files: [...] } } 格式
        fileVOs = responseData.files as FileVO[]
      }
      else {
        // console.error('無法解析上傳響應:', response)
        throw new Error($t('fileUpload.uploadResponseFormatError'))
      }
    }

    // 更新文件狀態
    fileVOs.forEach((fileVO: FileVO, index: number) => {
      const fileItem = filesToUpload[index]
      if (fileItem) {
        fileItem.fileVO = fileVO
        fileItem.status = 'success'
        fileItem.progress = 100
      }
    })

    // 更新 modelValue
    updateModelValue()

    window.$message.success($t('fileUpload.fileUploadSuccess'))
  }
  catch {
    // console.error('文件上傳錯誤:', error)
    filesToUpload.forEach((item) => {
      item.status = 'error'
      item.error = $t('fileUpload.uploadFailed')
    })
    window.$message.error($t('fileUpload.fileUploadFailed'))
  }
  finally {
    stopUploading()
  }
}

// 更新 modelValue
function updateModelValue() {
  const successFiles = fileList.value
    .filter(item => item.status === 'success' && item.fileVO)
    .map(item => item.fileVO!)

  // 只在有變化時才觸發更新
  if (JSON.stringify(successFiles) !== JSON.stringify(props.modelValue)) {
    emit('update:modelValue', successFiles)
  }
}

// 重試上傳
function retryUpload(index: number) {
  const item = fileList.value[index]

  // 只有上傳失敗的文件才能重試
  if (item.status !== 'error') {
    return
  }

  // 將狀態設為待上傳
  item.status = 'pending'

  // 如果是自動上傳模式，立即上傳
  if (props.autoUpload) {
    throttledUpload()
  }
}

// 移除文件
function removeFile(index: number) {
  const item = fileList.value[index]

  // 如果是本地文件，釋放臨時URL
  if (item.file && !item.fileVO) {
    // 嘗試尋找並釋放對應的臨時URL
    const url = objectURLs.value.find(url => url.includes(item.file!.name))
    if (url) {
      URL.revokeObjectURL(url)
      objectURLs.value = objectURLs.value.filter(u => u !== url)
    }
  }

  fileList.value.splice(index, 1)
  updateModelValue()
}

// 暴露方法
defineExpose({
  // 獲取已上傳成功的文件
  getUploadedFiles: () => {
    return fileList.value
      .filter(item => item.status === 'success' && item.fileVO)
      .map(item => item.fileVO!)
  },
  // 手動觸發上傳
  upload: uploadFiles,
})

// 檢查是否為圖片
function isImage(fileExtension: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
  return imageExtensions.includes(fileExtension.toLowerCase())
}

// 獲取文件副檔名
function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

// 獲取圖片源
function getImageSrc(item: FileItem): string {
  // 如果已上傳成功，使用伺服器URL
  if (item.fileVO?.url) {
    return item.fileVO.url
  }

  // 如果是本地文件且是圖片，創建臨時URL
  if (item.file && isImage(getFileExtension(item.file.name))) {
    const url = URL.createObjectURL(item.file)
    objectURLs.value.push(url)
    return url
  }

  // 默認返回空字串
  return ''
}

// 組件銷毀時釋放所有臨時URL
onBeforeUnmount(() => {
  objectURLs.value.forEach((url) => {
    URL.revokeObjectURL(url)
  })
  objectURLs.value = []
})
</script>

<template>
  <div class="file-upload">
    <!-- 隱藏的文件輸入框 -->
    <input
      ref="fileInputRef"
      type="file"
      :accept="fileExtension && fileExtension.length > 0 ? fileExtension.map(ext => `.${ext}`).join(',') : '*/*'"
      :multiple="maxFileCount > 1"
      class="hidden"
      @change="handleFileSelect"
    >

    <!-- 圖片模式 -->
    <div v-if="filetype === 'img'" class="image-upload-container">
      <div v-for="(item, index) in fileList" :key="index" class="image-item">
        <div class="image-preview" :class="{ 'with-overlay': item.status === 'pending' }">
          <!-- 已上傳或上傳中的圖片 -->
          <template v-if="item.fileVO?.url || (item.file && isImage(getFileExtension(item.file.name)))">
            <n-image
              :src="getImageSrc(item)"
              object-fit="cover"
              :preview-disabled="!showPreview"
            />
          </template>
          <!-- 非圖片文件 -->
          <template v-else>
            <div class="file-icon-container">
              <div class="file-name">
                {{ item.fileVO?.name || item.file?.name }}
              </div>
            </div>
          </template>

          <!-- 上傳中遮罩 -->
          <div v-if="item.status === 'uploading'" class="upload-overlay">
            <div class="upload-status">
              {{ $t('fileUpload.uploading') }}
            </div>
          </div>

          <!-- 待上傳遮罩 -->
          <div v-else-if="item.status === 'pending'" class="pending-overlay">
            <div class="pending-status">
              {{ $t('fileUpload.pending') }}
            </div>
          </div>

          <!-- 上傳失敗遮罩 -->
          <div v-else-if="item.status === 'error'" class="error-overlay">
            <div class="error-status">
              {{ $t('fileUpload.uploadFailed') }}
            </div>
            <!-- 重新上傳按鈕 -->
            <div class="retry-button" @click.stop="retryUpload(index)">
              <icon-park-outline-refresh />
              <span>{{ $t('fileUpload.retry') }}</span>
            </div>
          </div>

          <!-- 刪除按鈕 -->
          <div v-if="!hideDeleteButton" class="delete-button" @click="removeFile(index)">
            <icon-park-outline-close />
          </div>
        </div>
      </div>

      <!-- 添加按鈕 -->
      <div v-if="fileList.length < maxFileCount && !disabled" class="add-image-button" @click="triggerFileSelect">
        <icon-park-outline-plus />
      </div>
    </div>

    <!-- 列表模式 -->
    <div v-else-if="filetype === 'list'" class="list-upload-container">
      <div v-for="(item, index) in fileList" :key="index" class="file-item" :class="{ pending: item.status === 'pending' }">
        <div class="file-info">
          <div class="file-status-icon">
            <span v-if="item.status === 'success'" class="status-icon success">✅</span>
            <span v-else-if="item.status === 'error'" class="status-icon error">❌</span>
            <span v-else-if="item.status === 'uploading'" class="status-icon uploading">⏳</span>
            <span v-else-if="item.status === 'pending'" class="status-icon pending">⌛</span>
          </div>
          <div class="file-name">
            {{ item.fileVO?.name || item.file?.name }}
          </div>
          <div v-if="item.status === 'uploading'" class="file-status uploading">
            {{ $t('fileUpload.uploading') }}
          </div>
          <div v-else-if="item.status === 'error'" class="file-status error">
            {{ $t('fileUpload.uploadFailed') }}
            <n-button text type="primary" size="small" class="retry-text-button" @click="retryUpload(index)">
              {{ $t('fileUpload.reupload') }}
            </n-button>
          </div>
        </div>
        <div v-if="!disabled && !hideDeleteButton" class="file-actions">
          <n-button quaternary circle size="small" @click="removeFile(index)">
            <template #icon>
              <icon-park-outline-close />
            </template>
          </n-button>
        </div>
      </div>

      <!-- 上傳按鈕 -->
      <div
        v-if="fileList.length < maxFileCount && !disabled" class="upload-button" @click="() => {
          // console.log('點擊上傳文件按鈕');
          triggerFileSelect();
        }"
      >
        <div class="i-mdi-upload mr-2" />
        <span>{{ $t('fileUpload.clickUploadFile') }}</span>
      </div>
    </div>

    <!-- 手動上傳按鈕 -->
    <div v-if="!autoUpload && !disabled && (fileList.some(item => item.status === 'pending') || fileList.some(item => item.status === 'error'))" class="manual-upload-button">
      <div v-if="showDebugInfo">
        <div>自動上傳: {{ autoUpload ? '是' : '否' }}</div>
        <div>禁用狀態: {{ disabled ? '是' : '否' }}</div>
        <div>有待上傳文件: {{ fileList.some(item => item.status === 'pending') ? '是' : '否' }}</div>
        <div>有上傳失敗文件: {{ fileList.some(item => item.status === 'error') ? '是' : '否' }}</div>
        <div>文件數量: {{ fileList.length }}</div>
      </div>
      <n-button
        type="primary" :loading="isUploading" @click="() => {
          throttledUpload();
        }"
      >
        {{ $t('fileUpload.startUpload') }}
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.file-upload {
  width: 100%;
}

.hidden {
  display: none;
}

/* 圖片模式樣式 */
.image-upload-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.image-item {
  position: relative;
  width: 100px;
  height: 100px;
}

.image-preview {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  position: relative;
}

.image-preview :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.with-overlay {
  opacity: 0.7;
}

.upload-overlay, .pending-overlay, .error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

.pending-overlay {
  background-color: rgba(0, 0, 0, 0.3);
}

.error-overlay {
  background-color: rgba(255, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.retry-button {
  background-color: rgba(255, 255, 255, 0.7);
  color: #409eff;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.retry-button:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.retry-text-button {
  margin-left: 8px;
  padding: 0 4px;
}

.delete-button {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-image-button {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-image-button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.file-icon-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.file-icon-container .file-name {
  font-size: 12px;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* 列表模式樣式 */
.list-upload-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.file-item.pending {
  color: #909399;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.file-status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.status-icon {
  font-size: 16px;
  line-height: 1;
}

.status-icon.success {
  color: #67c23a;
}

.status-icon.error {
  color: #f56c6c;
}

.status-icon.uploading {
  color: #409eff;
}

.status-icon.pending {
  color: #909399;
}

.file-icon {
  font-size: 24px;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-status {
  margin-left: 8px;
  font-size: 12px;
}

.file-status.uploading {
  color: #409eff;
}

.file-status.error {
  color: #f56c6c;
}

.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
}

.upload-button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.manual-upload-button {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
}
</style>
