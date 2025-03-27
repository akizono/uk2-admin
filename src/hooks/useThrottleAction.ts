interface ThrottleMap {
  [key: string]: {
    timer: NodeJS.Timeout | null
    lastTime: number
  }
}

const throttleMap: ThrottleMap = {}

/**
 * 節流 Hook
 * @param key 唯一標識符
 * @param delay 延遲時間（毫秒）
 * @param callback 回調函數
 */
export function useThrottleAction(key: string, delay: number, callback: () => void): void {
  const isProcessing = ref(false)

  // 如果這個 key 不存在於 map 中，初始化它
  if (!throttleMap[key]) {
    throttleMap[key] = {
      timer: null,
      lastTime: 0,
    }
  }

  const now = Date.now()
  const throttleItem = throttleMap[key]

  // 如果距離上次執行的時間小於延遲時間，則不執行
  if (now - throttleItem.lastTime < delay) {
    window.$message.warning('操作過於頻繁，請稍後再試')
    return
  }

  // 如果正在處理中，則不執行
  if (isProcessing.value) {
    window.$message.warning('操作過於頻繁，請稍後再試')
    return
  }

  // 更新最後執行時間
  throttleItem.lastTime = now
  isProcessing.value = true

  // 執行回調
  callback()

  // 設置定時器，delay 時間後重置狀態
  if (throttleItem.timer) {
    clearTimeout(throttleItem.timer)
  }

  throttleItem.timer = setTimeout(() => {
    isProcessing.value = false
  }, delay)
}
