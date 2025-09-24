# 環境變數

項目中默認提供了三種環境變數 分別是 `.env.dev`、`.env.test`、`.env.prod`，分別對應開發環境、測試環境和生產環境。

## 通用變數

通用變數是所有環境都應該保持一致的變數，例如項目名稱、項目根目錄等。在 .env 文件中定義這些變數，以便在整個項目中使用。

### VITE_APP_NAME

- **類型：** `string`

項目名稱

### VITE_BASE_URL

- **類型：** `string`

這個是後端服務的基礎地址，比如你後端服務的地址是 `http://127.0.0.1:3000`，那麼你應該將這個值設置為 `http://127.0.0.1:3000`。

### VITE_API_URL

- **類型：** `string`

用於統一管理所有API請求的基礎路徑前綴。

比如你後端服務的API地址是 `http://127.0.0.1:3000/admin-api`，那麼你應該將這個值設置為 `/admin-api`。

### VITE_BASE_PATH

- **類型：** `string`

專案打包輸出的路徑

### VITE_STORAGE_PREFIX

- **類型：** `string`

設置全局儲存的前綴，例如`VITE_STORAGE_PREFIX=uk2(dev)_`，那麼使用`src\utils\storage.ts`在`localStorage`和`sessionStorage`中的數據都會加上`uk2(dev)_`前綴，例如`uk2(dev)_token`。

### VITE_ROUTE_MODE

- **類型：** `string`

項目中提供兩種路由模式：dynamic和static

### VITE_HOME_PATH

- **類型：** `string`

設置登陸後跳轉地址,這裡應當配置你登錄完成後立即跳轉的地址，404返回首頁的情況下也是優先使用該路徑

### VITE_COPYRIGHT_INFO

- **類型：** `string`

頁面底部版權資訊

### VITE_DEFAULT_LANG

- **類型：** `zhCN | enUS`

項目中預設使用的語言。詳情請參考[多語言配置](./i18n.md)

### VITE_LOGIN_DEFAULT_USERNAME

- **類型：** `string`

登入界面默認帳號, 在生產環境中建議設置為空

### VITE_LOGIN_DEFAULT_PASSWORD

- **類型：** `string`

登錄界面默認密碼, 在生產環境中建議設置為空

### VITE_DEFAULT_PAGE_SIZE

- **類型：** `number`

分頁列表中每頁顯示的數據量

### VITE_DEFAULT_CURRENT_PAGE

- **類型：** `number`

分頁列表中默認顯示的頁碼

## 開發環境
開發環境變數是只有在開發中才會切換的變數。在 `.env.dev` 文件中配置。

### VITE_TEST_SUPER_ADMIN_USERNAME

- **類型：** `string`

測試環境中超級管理員的使用者名稱，在 `/permission/permission` 權限範例頁面中進行快速切換用戶使用。

### VITE_TEST_SUPER_ADMIN_PASSWORD

- **類型：** `string`

測試環境中超級管理員的密碼，在 `/permission/permission` 權限範例頁面中進行快速切換用戶使用。

### VITE_TEST_COMMON_USERNAME

- **類型：** `string`

測試環境中一般使用者的使用者名稱，在 `/permission/permission` 權限範例頁面中進行快速切換用戶使用。

### VITE_TEST_COMMON_PASSWORD

- **類型：** `string`

測試環境中一般使用者的密碼，在 `/permission/permission` 權限範例頁面中進行快速切換用戶使用。

## 生產環境
生產環境變數是只有在生產或構建產物時才需要的變數，例如是否開啟gzip壓縮等。在 `.env.prod` 文件中配置。

### VITE_BUILD_COMPRESS

- **類型：** `Y | N`

如果你的項目需要開啟產物壓縮，你可以設置`VITE_BUILD_COMPRESS`和`VITE_COMPRESS_TYPE`來開啟壓縮

### VITE_COMPRESS_TYPE

- **類型：** `gzip | brotliCompress | deflate | deflateRaw`

設置壓縮算法
