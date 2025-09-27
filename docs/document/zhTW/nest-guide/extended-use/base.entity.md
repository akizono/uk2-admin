# BaseEntity 基礎實體類

`BaseEntity` 是一個基礎實體類，用於在整個應用程式中標準化資料庫實體的結構。它包含了常見的基礎欄位，這些欄位通常用於追蹤實體的狀態、創建和更新資訊，以及軟刪除功能。

## 欄位說明

| 欄位名稱 | 資料庫欄位 | 類型 | 描述 | 約束 | 預設值 |
| ------- | --------- | ---- | ---- | ---- | ------ |
| `remark` | `remark` | string | 備註資訊 | 長度255，可為空 | - |
| `status` | `status` | number | 狀態值 | tinyint | 1 |
| `isDeleted` | `is_deleted` | number | 是否刪除標記 | tinyint | 0 |
| `creator` | `creator` | string | 建立人ID | bigint，可為空 | - |
| `createTime` | `create_time` | Date | 建立時間 | datetime | CURRENT_TIMESTAMP |
| `updater` | `updater` | string | 更新人ID | bigint，可為空 | - |
| `updateTime` | `update_time` | Date | 更新時間 | datetime，可為空 | - |

## 狀態值說明

### status 欄位
- `0`: 禁用狀態
- `1`: 啟用狀態（預設值）

### isDeleted 欄位
- `0`: 未刪除（預設值）
- `1`: 已刪除

## 自動時間戳

### createTime
- 在實體創建時自動設置為當前時間戳
- 使用 `CURRENT_TIMESTAMP` 作為預設值
- 不可為空

### updateTime
- 在實體更新時自動更新為當前時間戳
- 使用 `onUpdate: 'CURRENT_TIMESTAMP'` 配置
- 可為空（初始創建時可能為空）

## 使用方式

### 繼承使用

其他實體類可以通過繼承 `BaseEntity` 來獲取這些基礎欄位：

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50, comment: '使用者名稱' })
  username: string

  // 其他特定欄位...
}
```

### 軟刪除功能

通過 `isDeleted` 欄位實現軟刪除功能：

```typescript
// 查詢未刪除的紀錄
const users = await userRepository.find({
  where: { isDeleted: 0 }
})

// 軟刪除記錄
await userRepository.update(id, { isDeleted: 1 })
```

### 狀態管理

通過 `status` 欄位管理實體的啟用/禁用狀態：

```typescript
// 查詢啟用的紀錄
const activeUsers = await userRepository.find({
  where: { status: 1, isDeleted: 0 }
})

// 禁用記錄
await userRepository.update(id, { status: 0 })
```

## 資料庫約束

- `remark`: 最大長度 255 字元，可為空
- `status`: tinyint 類型，預設值為 1
- `isDeleted`: tinyint 類型，預設值為 0
- `creator`: bigint 類型，可為空，用於儲存用戶ID
- `createTime`: datetime 類型，自動設置為當前時間
- `updater`: bigint 類型，可為空，用於儲存更新者ID
- `updateTime`: datetime 類型，可為空，自動更新

## 注意事項

1. **主鍵**: `BaseEntity` 不包含主鍵欄位，繼承的實體需要自行定義主鍵
2. **索引**: 建議在 `isDeleted` 和 `status` 欄位上建立索引以提高查詢性能
3. **時間戳**: `createTime` 和 `updateTime` 由資料庫自動管理，無需手動設置
4. **軟刪除**: 在查詢時記得過濾已刪除的紀錄（`isDeleted = 0`）
5. **狀態管理**: 在業務邏輯中需要考慮狀態的變更規則

## 與 BaseReqDto 的關係

`BaseEntity` 與 `BaseReqDto` 相對應，但有一些重要差異：

- `BaseEntity` 用於資料庫映射，包含資料庫約束和預設值
- `BaseReqDto` 用於請求驗證，包含驗證規則和轉換邏輯
- 兩者都包含相同的基礎欄位，但用途和配置不同
