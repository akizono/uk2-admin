# 權限控制

## 概述

本系統提供了三種權限控制方式，用於在不同場景下控制用戶的訪問權限：

1. **`usePermi`** - 基於權限字串的權限控制
2. **`v-hasPermi`** - 基於權限字串的指令式權限控制
3. **`useHasRole`** - 基於用戶角色的權限控制

## 權限控制方式對比

| 方式 | 用途 | 數據來源 | 適用場景 | 空值處理 |
|------|------|----------|----------|----------|
| `usePermi` | 函數式權限判斷 | 路由權限列表 | 組件內邏輯判斷 | 空值返回 `true` |
| `v-hasPermi` | 指令式權限控制 | 路由權限列表 | 模板中元素顯示/隱藏 | 空值拋出錯誤 |
| `useHasRole` | 角色權限判斷 | 用戶角色資訊 | 基於角色的權限控制 | 空值返回 `false` |

## 詳細說明

### 1. usePermi - 權限字串控制

#### 設計原理
- 基於後端返回的權限字串列表進行權限判斷
- 權限數據來源於用戶登入後從菜單介面獲取的 `permission` 欄位
- 支持單個權限字串或權限字串數組的判斷

#### 使用方法
```vue
<script setup lang="ts">
import { usePermi } from '@/hooks'

const { hasPermi } = usePermi()

// 單個權限判斷
const canEdit = hasPermi('system:user:edit')

// 多個權限判斷（任一滿足即可）
const canManage = hasPermi(['system:user:edit', 'system:user:delete'])
</script>

<template>
  <div>
    <!-- 基於權限顯示內容 -->
    <n-button v-if="hasPermi('system:user:edit')">
      編輯用戶
    </n-button>

    <n-button v-if="hasPermi(['system:user:edit', 'system:user:delete'])">
      管理用戶
    </n-button>
  </div>
</template>
```

#### 空值處理
- **`permission` 為 `undefined` 或 `null`**：返回 `true`（允許訪問）
- **`routePermissions` 為空**：返回 `false`（拒絕訪問）
- **`permission` 為空數組**：返回 `false`（拒絕訪問）

### 2. v-hasPermi - 指令式權限控制

#### 設計原理
- 基於 Vue 指令實現的權限控制
- 在模板中直接使用，會直接移除不符合權限的 DOM 元素
- 權限數據來源與 `usePermi` 相同

#### 使用方法
```vue
<template>
  <div>
    <!-- 指令式權限控制 -->
    <n-button v-hasPermi="['system:user:edit']">
      編輯用戶
    </n-button>

    <n-button v-hasPermi="['system:user:delete']">
      刪除用戶
    </n-button>
  </div>
</template>
```

#### 空值處理
- **`value` 為空或非數組**：拋出錯誤 `"v-hasPermi Directive with no explicit role attached"`
- **`value` 為空數組**：拋出錯誤
- **權限不匹配**：直接移除 DOM 元素

### 3. useHasRole - 角色權限控制

#### 設計原理
- 基於用戶角色進行權限判斷
- 支持超級管理員特殊權限（`super_admin` 擁有所有權限）
- 角色數據來源於用戶登入資訊中的 `role` 欄位

#### 使用方法
```vue
<script setup lang="ts">
import { useHasRole } from '@/hooks'

const { hasRole } = useHasRole()

// 單個角色判斷
const isAdmin = hasRole(['admin'])

// 多個角色判斷（任一滿足即可）
const canAccess = hasRole(['admin', 'manager'])
</script>

<template>
  <div>
    <!-- 基於角色顯示內容 -->
    <n-button v-if="hasRole(['super_admin'])">
      超級管理員功能
    </n-button>

    <n-button v-if="hasRole(['admin', 'manager'])">
      管理員功能
    </n-button>
  </div>
</template>
```

#### 空值處理
- **`permission` 為空或非數組**：返回 `false`
- **`authStore.user?.role` 為空**：返回 `false`
- **`permission` 為空數組**：返回 `false`

## 實際使用範例

### 完整範例
```vue
<script setup lang="ts">
import { useHasRole, usePermi } from '@/hooks'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()
const { hasRole } = useHasRole()
const { hasPermi } = usePermi()

// 獲取當前用戶角色
const userRoles = authStore.user?.role || []
</script>

<template>
  <n-card title="權限控制範例">
    <!-- 當前用戶角色顯示 -->
    <n-h1>當前角色：{{ userRoles.join('、 ') }}</n-h1>

    <!-- 使用 v-hasPermi 指令 -->
    <n-h2>指令式權限控制</n-h2>
    <n-space>
      <n-button v-hasPermi="['system:dept:page']">
        部門管理（需要 system:dept:page 權限）
      </n-button>
    </n-space>

    <!-- 使用 usePermi 函數 -->
    <n-h2>函數式權限控制</n-h2>
    <n-space>
      <n-button v-if="hasPermi(['system:dept:page'])">
        部門管理（函數判斷）
      </n-button>
    </n-space>

    <!-- 使用 useHasRole 函數 -->
    <n-h2>角色權限控制</n-h2>
    <n-space>
      <n-button v-if="hasRole(['super_admin'])">
        超級管理員功能
      </n-button>
      <n-button v-if="hasRole(['admin'])">
        管理員功能
      </n-button>
      <n-button v-if="hasRole(['admin', 'manager'])">
        管理員或經理功能
      </n-button>
    </n-space>
  </n-card>
</template>
```

## 踩坑注意事項

### 1. 空值處理差異
- **`usePermi`**：空值返回 `true`，可能導致權限控制失效
- **`v-hasPermi`**：空值拋出錯誤，會中斷程序執行
- **`useHasRole`**：空值返回 `false`，較為安全

### 2. 數據來源不同
- **`usePermi` 和 `v-hasPermi`**：使用 `routeStore.permissions`（來自菜單介面）
- **`useHasRole`**：使用 `authStore.user.role`（來自用戶資訊）

### 3. 權限更新時機
- 權限數據在用戶登入時初始化
- 切換用戶角色後需要重新登入才能更新權限
- 權限變更需要重新調用 `initAuthRoute()` 方法

### 4. 超級管理員特殊處理
- `useHasRole` 中 `super_admin` 角色擁有所有權限
- 其他權限控制方式不包含此特殊邏輯

### 5. 性能考慮
- `v-hasPermi` 會直接操作 DOM，性能較好但無法動態更新
- `usePermi` 和 `useHasRole` 支持響應式更新，但需要重新渲染

## 最佳實踐

### 1. 權限控制選擇
- **頁面級權限**：使用 `usePermi` 或 `useHasRole`
- **組件級權限**：使用 `v-hasPermi` 指令
- **功能級權限**：使用 `usePermi` 函數

### 2. 錯誤處理
```vue
<script setup lang="ts">
import { usePermi } from '@/hooks'

const { hasPermi } = usePermi()

// 安全的權限判斷
function safeHasPermi(permission: string | string[]) {
  try {
    return hasPermi(permission)
  }
  catch (error) {
    console.warn('權限判斷錯誤:', error)
    return false
  }
}
</script>
```

### 3. 權限檢查
```vue
<script setup lang="ts">
import { usePermi } from '@/hooks'

const { hasPermi } = usePermi()

// 檢查權限是否存在
const canEdit = hasPermi('system:user:edit')
const canDelete = hasPermi('system:user:delete')

// 組合權限判斷
const canManage = canEdit && canDelete
</script>
```

## 常見問題

### Q: 為什麼 `usePermi` 空值返回 `true`？
A: 這是為了向後相容，避免在權限數據未載入時阻斷用戶操作。建議在生產環境中明確檢查權限數據是否已載入。

### Q: `v-hasPermi` 和 `usePermi` 有什麼區別？
A: `v-hasPermi` 是指令，會直接操作 DOM；`usePermi` 是函數，返回布林值用於條件渲染。指令性能更好，函數更靈活。

### Q: 如何處理權限數據非同步載入？
A: 可以在權限數據載入完成前顯示載入狀態，或使用 `v-if` 配合權限檢查來控制組件渲染時機。

### Q: 超級管理員權限如何實現？
A: 在 `useHasRole` 中，如果用戶角色包含 `super_admin`，則直接返回 `true`，繞過具體的權限檢查。
