# 專案結構

UK2 Admin NestJS 是一個基於 NestJS 框架開發的後端管理系統，提供完整的用戶管理、權限控制、代碼生成、文件管理等功能。專案採用模組化架構，支持多語言欄位，集成了 AI 代碼生成功能。

## 技術棧

### 核心框架
- **NestJS** - 基於 Node.js 的企業級應用框架
- **TypeScript** - 類型安全的 JavaScript 超集
- **Express** - Web 應用框架

### 資料庫相關
- **TypeORM** - TypeScript/JavaScript ORM
- **MySQL2** - MySQL 資料庫驅動
- **@nestjs/typeorm** - NestJS TypeORM 集成

### 認證與安全
- **@nestjs/jwt** - JWT 令牌處理
- **class-validator** - 數據驗證
- **class-transformer** - 數據轉換
- **md5** - 密碼加密

### API 文件
- **@nestjs/swagger** - API 文件生成
- **swagger-ui-express** - Swagger UI 界面

### AI 集成
- **openai** - OpenAI API 用戶端

### 文件處理
- **multer** - 文件上傳處理
- **@types/multer** - Multer 類型定義

### 工具庫
- **uuid** - UUID 生成
- **rxjs** - 響應式編程
- **dotenv** - 環境變數管理
- **reflect-metadata** - 元數據反射

### 開發工具
- **@nestjs/cli** - NestJS 命令行工具
- **plop** - 代碼生成器
- **eslint** - 代碼檢查
- **prettier** - 代碼格式化
- **jest** - 測試框架

## 專案架構

### 整體架構
```
src/
├── common/                 # 公共模組
│   ├── decorators/        # 裝飾器
│   ├── dtos/             # 基礎 DTO
│   ├── entities/         # 基礎實體
│   ├── filters/          # 異常過濾器
│   ├── interceptors/     # 攔截器
│   ├── pipes/            # 管道
│   ├── services/         # 基礎服務
│   └── subscribers/      # 訂閱者
├── modules/              # 業務模組
│   └── platform-api/        # 管理後台 API
│       ├── system/       # 系統管理模組
│       └── operations/   # 運營管理模組
├── utils/                # 工具類
└── main.ts              # 應用入口
```

### 核心特性

1. **模組化設計** - 採用 NestJS 模組化架構，每個功能獨立成模組
2. **權限控制** - 基於 JWT 的認證和基於角色的權限控制
3. **多語言支持** - 支持多語言欄位儲存和查詢
4. **代碼生成** - 集成 AI 代碼生成功能，支持實體和業務代碼自動生成
5. **文件管理** - 完整的文件上傳、儲存和管理功能
6. **日誌系統** - 完整的操作日誌記錄
7. **數據驗證** - 基於 class-validator 的請求數據驗證

## 模組詳細說明

### 系統管理模組 (system/)

#### 1. 用戶管理 (user)
- **功能**: 用戶帳號管理、用戶資訊維護
- **實體**: `UserEntity` - 包含使用者名稱、密碼、暱稱、信箱、手機等欄位
- **特性**: 支持密碼加密、用戶狀態管理、部門關聯

#### 2. 認證模組 (auth)
- **功能**: 用戶登錄、註冊、密碼找回、Token 管理
- **特性**:
  - JWT 雙 Token 機制（Access Token + Refresh Token）
  - 支持信箱和手機號碼驗證碼登入/註冊
  - Token 黑名單管理
  - 密碼找回功能

#### 3. 角色管理 (role)
- **功能**: 角色定義和權限分配
- **實體**: `RoleEntity` - 角色基本資訊

#### 4. 用戶角色關聯 (user-role)
- **功能**: 用戶與角色的多對多關聯
- **實體**: `UserRoleEntity` - 用戶角色關聯表

#### 5. 菜單管理 (menu)
- **功能**: 系統菜單結構管理
- **實體**: `MenuEntity` - 支持樹形結構的菜單管理

#### 6. 角色菜單關聯 (role-menu)
- **功能**: 角色與菜單權限的關聯
- **實體**: `RoleMenuEntity` - 角色菜單權限關聯表

#### 7. 部門管理 (dept)
- **功能**: 組織架構管理
- **實體**: `DeptEntity` - 支持樹形結構的部門管理

#### 8. 字典管理
- **dict-type**: 字典類型管理
- **dict-data**: 字典數據管理
- **功能**: 系統字典數據維護

#### 9. 多語言欄位 (multilingual-fields)
- **功能**: 多語言內容儲存和管理
- **實體**: `MultilingualFieldsEntity` - 多語言欄位儲存

#### 10. 驗證碼管理 (verify-code)
- **功能**: 驗證碼生成、驗證和管理
- **支持**: 信箱驗證碼、手機驗證碼

#### 11. 日誌管理 (log)
- **功能**: 系統操作日誌記錄
- **實體**: `LogEntity` - 操作日誌儲存

#### 12. Token 黑名單 (token-blacklist)
- **功能**: 已失效 Token 的黑名單管理
- **實體**: `TokenBlacklistEntity` - Token 黑名單儲存

### 運營管理模組 (operations/)

#### 1. 代碼生成 (code-generation)
- **功能**: 基於 AI 的代碼自動生成
- **特性**:
  - 實體代碼生成
  - 業務代碼生成（Controller、Service、Module、DTO）
  - 支持預覽和直接插入代碼
  - 集成 Plop 代碼生成器

#### 2. 文件管理 (file)
- **功能**: 文件上傳、儲存和管理
- **特性**: 支持多種文件類型、文件元數據管理

#### 3. 腳本執行日誌 (script-execution-log)
- **功能**: 腳本執行記錄和監控
- **實體**: `ScriptExecutionLogEntity` - 腳本執行日誌

## 公共模組 (common/)

### 基礎實體 (BaseEntity)
```typescript
class BaseEntity {
  remark: string // 備註
  status: number // 狀態 (0:禁用 1:啟用)
  isDeleted: number // 軟刪除標記
  creator: string // 創辦人
  createTime: Date // 創建時間
  updater: string // 更新人
  updateTime: Date // 更新時間
}
```

### 基礎服務 (BaseService)
提供通用的 CRUD 操作：
- `create()` - 創建數據
- `find()` - 查詢數據（支持分頁、多語言欄位查詢）
- `findOne()` - 查詢單條數據
- `update()` - 更新數據
- `_delete()` - 軟刪除數據

### 裝飾器
- `@HasPermission()` - 權限控制裝飾器
- `@Public()` - 公開介面裝飾器
- `@Operation()` - 操作日誌裝飾器
- `@ResponseMessage()` - 響應消息裝飾器

### 攔截器
- `LogInterceptor` - 操作日誌攔截器
- `TransformInterceptor` - 響應數據轉換攔截器

### 過濾器
- `HttpExceptionFilter` - 全局異常過濾器

## 工具類 (utils/)

### AI 集成
- `chat-gpt.ts` - ChatGPT API 集成
- `deep-seek.ts` - DeepSeek API 集成

### 加密工具
- `crypto.ts` - 密碼加密工具

### 實體工具
- `entity-utils.ts` - 實體操作工具

### 環境變數
- `env-helper.ts` - 環境變數管理

### 請求上下文
- `request-context.ts` - 請求上下文管理

### 響應 DTO
- `response-dto.ts` - 統一響應格式

### 字串生成
- `str-generator.ts` - 隨機字串生成

### Token 工具
- `token-helper.ts` - JWT Token 處理

### 驗證碼工具
- `verify-code-utils.ts` - 驗證碼生成和驗證

## 配置說明

### 環境變數
專案支持多環境配置，主要環境變數包括：
- 資料庫連接配置
- JWT 金鑰和過期時間
- CORS 配置
- 文件儲存路徑
- AI API 金鑰
- 郵件服務配置

### 資料庫配置
- 使用 MySQL 資料庫
- 支持連接池配置
- 自動同步資料庫結構（開發環境）

## 啟動說明

### 開發環境
```bash
pnpm start:dev
```

### 生產環境
```bash
pnpm start:prod
```

### 測試
```bash
pnpm test
```

## 特色功能

1. **AI 代碼生成** - 集成 OpenAI API，支持智慧代碼生成
2. **多語言支持** - 完整的多語言欄位儲存和查詢機制
3. **權限控制** - 基於角色的細粒度權限控制
4. **代碼生成器** - 基於 Plop 的代碼模板生成
5. **完整的日誌系統** - 操作日誌記錄和查詢
6. **文件管理** - 完整的文件上傳和管理功能
7. **驗證碼系統** - 支持信箱和手機驗證碼

## 專案特點

- **類型安全**: 全面使用 TypeScript，提供完整的類型檢查
- **模組化**: 清晰的模組劃分，便於維護和擴展
- **可擴展**: 支持插件式擴展，易於添加新功能
- **安全性**: 完善的認證授權機制和數據驗證
- **可維護**: 統一的代碼規範和完整的文件
