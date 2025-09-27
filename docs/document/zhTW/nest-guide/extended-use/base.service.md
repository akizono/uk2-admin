# BaseService 基礎服務類

`BaseService` 是整個項目的核心基礎服務類，提供了標準化的 CRUD 操作和業務邏輯處理。它封裝了常見的資料庫操作模式，包括創建、查詢、更新和刪除功能，聯集成了多語言支援、外鍵驗證、重複性檢查等進階功能。

## 核心功能

### 1. 創建操作 (`create`)

用於創建新的實體記錄，包含完整的前置驗證和錯誤處理。

#### 參數說明

| 參數 | 類型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| `dto` | `Record<string, any>` | 後端接收的參數 | ✅ |
| `repository` | `Repository<any>` | 資料庫操作的 Repository | ✅ |
| `repeatCondition` | `string[]` | 查詢是否有重複的數據的欄位 | ❌ |
| `modalName` | `string` | 模組名稱（用於錯誤訊息） | ✅ |
| `foreignKeyChecks` | `Array<{field, repository, modalName}>` | 外鍵檢查配置 | ❌ |

#### 使用範例

```typescript
// 基本創建
const user = await create({
  dto: { username: 'john', email: 'john@example.com' },
  repository: userRepository,
  modalName: '用戶'
})

// 帶重複檢查的創建
const user = await create({
  dto: { username: 'john', email: 'john@example.com' },
  repository: userRepository,
  repeatCondition: ['username', 'email'],
  modalName: '用戶'
})

// 帶外鍵檢查的創建
const order = await create({
  dto: { userId: 1, productId: 2, quantity: 1 },
  repository: orderRepository,
  modalName: '訂單',
  foreignKeyChecks: [
    { field: 'userId', repository: userRepository, modalName: '用戶' },
    { field: 'productId', repository: productRepository, modalName: '產品' }
  ]
})
```

### 2. 查詢操作 (`find`)

支援分頁查詢、關聯查詢和多語言查詢的複雜查詢功能。

#### 參數說明

| 參數 | 類型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| `dto` | `Record<string, any>` | 查詢參數 | ✅ |
| `repository` | `Repository<any>` | 資料庫操作的 Repository | ✅ |
| `relations` | `string[]` | 需要進行關聯查詢的欄位 | ❌ |
| `where` | `Record<string, any>` | 額外的查詢條件 | ❌ |

#### 特殊功能

- **分頁支援**: 自動處理 `pageSize` 和 `currentPage` 參數
- **多語言查詢**: 支援 `multilingualFields` 參數進行多語言內容查詢
- **關聯查詢**: 支援 TypeORM 的 relations 功能

#### 使用範例

```typescript
// 基本分頁查詢
const result = await find({
  dto: { pageSize: 10, currentPage: 1, status: 1 },
  repository: userRepository,
  modalName: '用戶'
})

// 關聯查詢
const result = await find({
  dto: { pageSize: 10, currentPage: 1 },
  repository: orderRepository,
  relations: ['user', 'product'],
  modalName: '訂單'
})

// 多語言查詢
const result = await find({
  dto: {
    pageSize: 10,
    currentPage: 1,
    multilingualFields: ['title', 'description'],
    title: '多語言標題'
  },
  repository: articleRepository,
  modalName: '文章'
})
```

### 3. 單一查詢 (`findOne`)

根據 ID 查詢單一記錄，支援關聯查詢和多語言內容。

#### 參數說明

| 參數 | 類型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| `id` | `string` | 記錄 ID | ✅ |
| `repository` | `Repository<any>` | 資料庫操作的 Repository | ✅ |
| `relations` | `string[]` | 需要進行關聯查詢的欄位 | ❌ |
| `where` | `Record<string, any>` | 額外的查詢條件 | ❌ |

#### 使用範例

```typescript
// 基本查詢
const user = await findOne({
  id: '1',
  repository: userRepository
})

// 關聯查詢
const order = await findOne({
  id: '1',
  repository: orderRepository,
  relations: ['user', 'product']
})
```

### 4. 更新操作 (`update`)

更新現有記錄，包含存在性檢查和重複性檢查。

#### 參數說明

| 參數 | 類型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| `dto` | `Record<string, any>` | 更新參數（必須包含 id） | ✅ |
| `repository` | `Repository<any>` | 資料庫操作的 Repository | ✅ |
| `existenceCondition` | `string[]` | 存在性檢查的欄位 | ❌ |
| `repeatCondition` | `string[]` | 重複性檢查的欄位 | ❌ |
| `modalName` | `string` | 模組名稱 | ✅ |

#### 使用範例

```typescript
// 基本更新
await update({
  dto: { id: 1, username: 'new_username' },
  repository: userRepository,
  modalName: '用戶'
})

// 帶重複檢查的更新
await update({
  dto: { id: 1, username: 'new_username', email: 'new@example.com' },
  repository: userRepository,
  repeatCondition: ['username', 'email'],
  modalName: '用戶'
})
```

### 5. 刪除操作 (`_delete`)

軟刪除記錄，包含存在性檢查和子項檢查。

#### 參數說明

| 參數 | 類型 | 描述 | 必填 |
| ---- | ---- | ---- | ---- |
| `id` | `string` | 記錄 ID | ✅ |
| `repository` | `Repository<any>` | 資料庫操作的 Repository | ✅ |
| `modalName` | `string` | 模組名稱 | ✅ |

#### 特殊功能

- **軟刪除**: 將 `isDeleted` 設為 1，而非物理刪除
- **子項檢查**: 自動檢查是否存在子項，防止誤刪

#### 使用範例

```typescript
// 基本刪除
await _delete({
  id: '1',
  repository: userRepository,
  modalName: '用戶'
})
```

## 多語言支援

BaseService 內建多語言支援功能，可以處理多語言內容的查詢和返回。

### 多語言查詢流程

1. 前端在查詢時指定 `multilingualFields` 參數
2. 系統根據查詢值在 `multilingual-fields` 表中尋找對應的 `fieldId`
3. 使用 `fieldId` 進行實際的資料庫查詢
4. 查詢結果自動附加多語言內容

### 多語言欄位識別

系統通過檢查欄位值是否以 `multilingual-` 開頭來識別多語言欄位：

```typescript
// 多語言欄位值格式
{
  title: 'multilingual-12345',  // 這是一個多語言欄位
  content: 'multilingual-67890' // 這也是多語言欄位
}
```

## 重要注意事項與避坑指南

### 1. 外鍵檢查配置

**問題**: 外鍵檢查是可選的，但建議總是配置，否則無法提供友好的錯誤訊息。

```typescript
// ❌ 不推薦：沒有外鍵檢查
const order = await create({
  dto: { userId: 999, productId: 888 },
  repository: orderRepository,
  modalName: '訂單'
  // 缺少 foreignKeyChecks，會導致資料庫錯誤而非友好訊息
})

// ✅ 推薦：配置外鍵檢查
const order = await create({
  dto: { userId: 999, productId: 888 },
  repository: orderRepository,
  modalName: '訂單',
  foreignKeyChecks: [
    { field: 'userId', repository: userRepository, modalName: '用戶' },
    { field: 'productId', repository: productRepository, modalName: '產品' }
  ]
})
```

### 2. 重複性檢查的時機

**問題**: 更新操作時的重複性檢查需要排除當前記錄本身。

```typescript
// ✅ 正確：更新時會自動排除當前記錄
await update({
  dto: { id: 1, username: 'new_username' },
  repository: userRepository,
  repeatCondition: ['username'],
  modalName: '用戶'
})
```

### 3. 分頁查詢的處理

**問題**: `pageSize` 為 0 時表示不分頁，需要特別注意。

```typescript
// pageSize = 0 時會返回所有記錄
const result = await find({
  dto: { pageSize: 0, currentPage: 1 },
  repository: userRepository
})
```

### 4. 多語言查詢的性能考慮

**問題**: 多語言查詢會產生笛卡兒積，可能導致性能問題。

```typescript
// ⚠️ 注意：多個多語言欄位會產生大量查詢組合
const result = await find({
  dto: {
    multilingualFields: ['title', 'description', 'content'],
    title: '標題',
    description: '描述',
    content: '內容'
  },
  repository: articleRepository
})
// 這會產生 3 個欄位的所有可能組合查詢
```

### 5. 軟刪除的處理

**問題**: 所有查詢都應該過濾已刪除的紀錄。

```typescript
// ❌ 錯誤：可能查詢到已刪除的紀錄
const user = await userRepository.findOne({ where: { id: 1 } })

// ✅ 正確：使用 BaseService 的查詢方法
const user = await findOne({
  id: '1',
  repository: userRepository
})
```

### 6. 父子關係的刪除檢查

**問題**: 刪除操作會自動檢查是否存在子項，但需要確保表有 `parentId` 欄位。

```typescript
// 系統會自動檢查以下條件：
// 1. 表是否有 parentId 欄位
// 2. 是否存在 parentId = 當前記錄 id 且 isDeleted = 0 的子項
```

### 7. 錯誤處理

**問題**: BaseService 會拋出標準的 HTTP 異常，需要適當處理。

```typescript
try {
  const user = await create({...})
} catch (error) {
  if (error instanceof ConflictException) {
    // 處理重複數據錯誤
  } else if (error instanceof NotFoundException) {
    // 處理不存在錯誤
  } else if (error instanceof BadRequestException) {
    // 處理請求參數錯誤
  }
}
```

## 最佳實踐

### 1. 統一使用 BaseService

```typescript
// ✅ 推薦：使用 BaseService 的方法
export class UserService {
  async createUser(dto: CreateUserDto) {
    return await create({
      dto,
      repository: this.userRepository,
      repeatCondition: ['username', 'email'],
      modalName: '用戶'
    })
  }
}

// ❌ 不推薦：直接使用 Repository
export class UserService {
  async createUser(dto: CreateUserDto) {
    const user = this.userRepository.create(dto)
    return await this.userRepository.save(user)
  }
}
```

### 2. 適當配置驗證條件

```typescript
// 根據業務需求配置適當的驗證條件
const user = await create({
  dto,
  repository: userRepository,
  repeatCondition: ['username'], // 使用者名稱不能重複
  modalName: '用戶',
  foreignKeyChecks: [
    { field: 'roleId', repository: roleRepository, modalName: '角色' }
  ]
})
```

### 3. 合理使用多語言功能

```typescript
// 只在需要時使用多語言查詢
const result = await find({
  dto: {
    multilingualFields: ['title'], // 只查詢需要的多語言欄位
    title: '標題'
  },
  repository: articleRepository
})
```

## 與其他基礎類的關係

- **BaseEntity**: 定義資料庫實體結構
- **BaseReqDto**: 定義請求驗證規則
- **BaseService**: 提供業務邏輯處理

這三個基礎類共同構成了項目的核心架構，確保了代碼的一致性和可維護性。
