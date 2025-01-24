import type { UserInfo } from '@/api/user/response.type'

/** 設定sessionStorage的類型 */
interface Session {
  dict: DictMap
}

/** 設定localStorage的類型 */
interface Local {
  /* 儲存使用者資訊 */
  userInfo: UserInfo
  /* 儲存角色 */
  role: string[]
  /* 儲存訪問token */
  accessToken: string
  /* 儲存刷新token */
  refreshToken: string
  /* 儲存登入帳號 */
  loginAccount: any
  /* 儲存當前語言 */
  lang: App.lang
}

/** 設定storage的前綴 */
const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX

interface StorageData<T> {
  value: T
  expire: number | null
}
/**
 * LocalStorage部分操作
 */
function createLocalStorage<T extends Local>() {
  // 默認快取期限為7天

  function set<K extends keyof T>(key: K, value: T[K], expire: number = 60 * 60 * 24 * 7) {
    const storageData: StorageData<T[K]> = {
      value,
      expire: new Date().getTime() + expire * 1000,
    }
    const json = JSON.stringify(storageData)
    window.localStorage.setItem(`${STORAGE_PREFIX}${String(key)}`, json)
  }

  function get<K extends keyof T>(key: K) {
    const json = window.localStorage.getItem(`${STORAGE_PREFIX}${String(key)}`)
    if (!json)
      return null

    const storageData: StorageData<T[K]> | null = JSON.parse(json)

    if (storageData) {
      const { value, expire } = storageData
      if (expire === null || expire >= Date.now())
        return value
    }
    remove(key)
    return null
  }

  function remove(key: keyof T) {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${String(key)}`)
  }

  const clear = window.localStorage.clear

  return {
    set,
    get,
    remove,
    clear,
  }
}
/**
 * sessionStorage部分操作
 */

function createSessionStorage<T extends Session>() {
  function set<K extends keyof T>(key: K, value: T[K]) {
    const json = JSON.stringify(value)
    window.sessionStorage.setItem(`${STORAGE_PREFIX}${String(key)}`, json)
  }
  function get<K extends keyof T>(key: K) {
    const json = sessionStorage.getItem(`${STORAGE_PREFIX}${String(key)}`)
    if (!json)
      return null

    const storageData: T[K] | null = JSON.parse(json)

    if (storageData)
      return storageData

    return null
  }
  function remove(key: keyof T) {
    window.sessionStorage.removeItem(`${STORAGE_PREFIX}${String(key)}`)
  }
  const clear = window.sessionStorage.clear

  return {
    set,
    get,
    remove,
    clear,
  }
}

export const local = createLocalStorage()
export const session = createSessionStorage()
