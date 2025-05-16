/**
 *後台服務的環境類型
 * - dev: 後台開發環境
 * - test: 後台測試環境
 * - prod: 後台生產環境
 */
 type ServiceEnvType = 'dev' | 'test' | 'prod'

interface ImportMetaEnv {
  /** 專案基本路徑 */
  readonly VITE_BASE_PATH: string
  /** 專案標題 */
  readonly VITE_APP_NAME: string
  /** 開啟請求代理 */
  readonly VITE_HTTP_PROXY?: 'Y' | 'N'
  /** 是否開啟打包壓縮 */
  readonly VITE_BUILD_COMPRESS?: 'Y' | 'N'
  /** 壓縮演算法類型 */
  readonly VITE_COMPRESS_TYPE?:
    | 'gzip'
    | 'brotliCompress'
    | 'deflate'
    | 'deflateRaw'
  /** 路由模式 */
  readonly VITE_ROUTE_MODE?: 'hash' | 'web'
  /** 首次載入頁面 */
  readonly VITE_HOME_PATH: string
  /** 版權資訊 */
  readonly VITE_COPYRIGHT_INFO: string
  /** 是否自動更新token */
  readonly VITE_AUTO_REFRESH_TOKEN: 'Y' | 'N'
  /** 預設語言 */
  readonly VITE_DEFAULT_LANG: App.lang
  /** 後端服務的環境類型 */
  readonly MODE: ServiceEnvType
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
