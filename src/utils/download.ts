import { $t } from '@/utils'

/**
 * 創建下載連結並觸發下載
 * @param url 下載檔案的URL
 * @param fileName 指定下載後的檔案名稱
 * 內部使用，不導出
 */
function createDownloadLink(url: string, fileName: string): void {
  // 創建一個隱藏的a標籤
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.style.display = 'none'

  // 將a標籤添加到body
  document.body.appendChild(link)

  // 模擬點擊
  link.click()

  // 移除a標籤
  setTimeout(() => {
    document.body.removeChild(link)
  }, 100)
}

/**
 * 通用檔案下載方法
 * @param url 下載檔案的URL
 * @param fileName 指定下載後的檔案名稱 (可選，如果不指定則使用URL中的檔案名)
 */
export function downloadFile(url: string, fileName?: string): void {
  // 確定檔案名稱
  let downloadFileName = fileName
  if (!downloadFileName) {
    // 從URL中提取檔案名稱
    const urlParts = url.split('/')
    downloadFileName = urlParts[urlParts.length - 1]
  }

  // 對於同源URL，我們需要先獲取Blob再下載，以確保瀏覽器不會直接打開檔案
  try {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'

    xhr.onload = function () {
      if (this.status === 200) {
        const blob = this.response
        const url = URL.createObjectURL(blob)
        createDownloadLink(url, downloadFileName)
        setTimeout(() => {
          URL.revokeObjectURL(url)
        }, 100)
      }
    }

    xhr.onerror = function () {
      console.error($t('download.downloadFailedTryTraditional'))
      // 如果XHR失敗，回退到傳統方法
      createDownloadLink(url, downloadFileName)
    }

    xhr.send()
  }
  catch (error) {
    console.error(`${$t('download.downloadFailed')}:`, error)
    // 如果出錯，回退到傳統方法
    createDownloadLink(url, downloadFileName)
  }
}
