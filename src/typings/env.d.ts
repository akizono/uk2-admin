/**
 *後台服務的環境類型
 * - dev: 後台開發環境
 * - test: 後台測試環境
 * - prod: 後台生產環境
 */
type ServiceEnvType = 'dev' | 'test' | 'prod'

interface ImportMetaEnv {
  /** 登錄界面 - 默認帳號 */
  readonly VITE_LOGIN_DEFAULT_USERNAME: string
  /** 登錄界面 - 默認密碼 */
  readonly VITE_LOGIN_DEFAULT_PASSWORD: string

  /** 測試環境超級管理員使用者名稱 */
  readonly VITE_TEST_SUPER_ADMIN_USERNAME: string
  /** 測試環境超級管理員密碼 */
  readonly VITE_TEST_SUPER_ADMIN_PASSWORD: string
  /** 測試環境普通管理員使用者名稱 */
  readonly VITE_TEST_COMMON_USERNAME: string
  /** 測試環境普通管理員密碼 */
  readonly VITE_TEST_COMMON_PASSWORD: string

  /** 專案標題 */
  readonly VITE_APP_NAME: string
  /** API 請求基礎路徑 */
  readonly VITE_BASE_URL: string
  /** API 端點路徑 */
  readonly VITE_API_URL: string
  /** 預設分頁大小 */
  readonly VITE_DEFAULT_PAGE_SIZE: number
  /** 預設當前頁 */
  readonly VITE_DEFAULT_CURRENT_PAGE: number
  /** 專案打包輸出路徑 */
  readonly VITE_BASE_PATH: string
  /** Local Storage 金鑰前綴 */
  readonly VITE_STORAGE_PREFIX: string
  /** 路由模式 */
  readonly VITE_ROUTE_MODE?: 'hash' | 'web'
  /** 首次載入頁面 */
  readonly VITE_HOME_PATH: string
  /** 版權資訊 */
  readonly VITE_COPYRIGHT_INFO: string
  /** 預設語言 */
  readonly VITE_DEFAULT_LANG: string
  /** 開啟請求代理 */
  readonly VITE_HTTP_PROXY?: 'Y' | 'N'
  /** 是否開啟打包壓縮 */
  readonly VITE_BUILD_COMPRESS?: 'Y' | 'N'
  /** 壓縮演算法類型 */
  readonly VITE_COMPRESS_TYPE?: 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
