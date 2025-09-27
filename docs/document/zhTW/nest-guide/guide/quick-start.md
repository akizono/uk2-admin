# 快速啟動

::: tip
在進行啟動項目前，請確保您的開發環境已經安裝了 [Node.js](../../dev/nodejs) 和 [MySQL](../../dev/mysql)

按以下步驟完成環境配置與專案啟動，確保開發環境快速就緒。
:::

## 初始化 [MySQL](../../dev/mysql)

### 1. MySQL 服務啟動

本專案採用 MySQL 作為數據儲存解決方案，請確保已正確安裝並啟動 [MySQL](../../dev/mysql) 資料庫服務。

### 2. 開發資料庫創建

在 MySQL 中創建一個專用於開發環境的資料庫，命名為`uk2_admin_dev`（可根據實際需求自訂名稱）。

### 3. 資料庫初始化腳本執行

執行專案提供的資料庫初始化腳本，完成基礎數據結構的創建與基礎數據的導入

- **腳本路徑**: sql/uk2_admin_dev.sql

- **注意事項**: 該腳本支持在不同資料庫名稱環境下執行，無需與配置中的資料庫名稱嚴格一致

### 4. **資料庫連接配置**

修改根目錄下的開發環境設定檔 `env.dev`，配置正確的資料庫連接參數。
```shell
# 資料庫類型，不需要修改
DB_TYPE = 'mysql'

# 資料庫地址
DB_HOST = '127.0.0.1'

# 資料庫埠
DB_PORT = 3306

# 資料庫名稱
DB_NAME = 'uk2_admin_dev'

# 資料庫使用者名稱
DB_USERNAME = 'root'

# 資料庫密碼
DB_PASSWORD = '123456'
```
::: tip
1. 參數 DB_TYPE為固定值，無需修改

2. 若在第2步中使用了非默認資料庫名稱，請確保 DB_NAME參數與實際創建的資料庫名稱完全一致

3. 生產環境部署時，請務必修改預設的資料庫憑據，採用更安全的認證方式
:::

## 啟動專案

### 複製專案

請至您欲安裝專案的目錄下，於終端機執行以下 Git 指令以取得專案原始碼：

```shell
git clone https://github.com/akizono/uk2-admin-nest.git
```

### 相依套件安裝
進入專案目錄後，推薦使用 pnpm 安裝相依套件（若未安裝 pnpm，亦可使用 npm 替代）

::: code-group
```shell[pnpm]
cd ./uk2-admin-nest
pnpm install
```
```shell[npm]
cd ./uk2-admin-nest
npm install
```
:::

### 專案啟動

1. 使用 [VSCode](https://code.visualstudio.com/) 開啟專案根目錄 uk2-admin-nest

2. 透過內建終端機執行開發啟動指令：
::: code-group
```shell[pnpm]
pnpm start:dev
```
```shell[npm]
npm run start:dev
```
:::
