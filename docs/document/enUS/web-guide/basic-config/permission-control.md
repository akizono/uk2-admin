# Permission control

## Overview

This system provides three permission control methods for controlling user access rights in different scenarios:

1. **`usePermi`** - Permission control based on permission strings
2. **`v-hasPermi`** - Instructive permission control based on permission strings
3. **`useHasRole`** - Permission control based on user role

## Comparison of permission control methods

| Method | Purpose | Data Source | Applicable Scenarios | NULL value processing |
|------|------|----------|----------|----------|
| `usePermi`| Functional permission judgment | Routing permission list | Logical judgment within the component | null value return`true` |
| `v-hasPermi`| Instructive permission control | Routing permission list | Show/hide elements in templates | Empty value throws error |
| `useHasRole`| Role permission judgment | User role information | Role-based permission control | NULL value return`false` |

## Detailed description

### 1. usePermi - permission string control

#### Design Principles
- Permission judgment is made based on the permission string list returned by the backend
- The permission data comes from the user's login after logging in.`permission`Column
- Supports judgment of a single permission string or permission string array

#### How to use
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

#### Null value processing
- **`permission`for`undefined`or`null`**:return`true`(Access allowed)
- **`routePermissions`Empty**: Return`false`(access denied)
- **`permission`Empty array**: Return`false`(access denied)

### 2. v-hasPermi - Instructional permission control

#### Design Principles
- Permission control based on Vue instruction
- Use it directly in a template and removes DOM elements that do not meet permissions.
- Authorization data source and`usePermi`same

#### How to use
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

#### Null value processing
- **`value`Empty or non-array**: Throw an error`"v-hasPermi Directive with no explicit role attached"`
- **`value`Empty array**: Throw an error
- **Permission mismatch**: Remove DOM elements directly

### 3. useHasRole - Role permission control

#### Design Principles
- Permission judgment based on user role
- Supports special permissions for super administrators (`super_admin`Have all permissions)
- Role data comes from user login information`role`Column

#### How to use
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

#### Null value processing
- **`permission`Empty or non-array**: Return`false`
- **`authStore.user?.role`Empty**: Return`false`
- **`permission`Empty array**: Return`false`

## Practical usage examples

### Complete example
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

## Things to note when stepping on a pit

### 1. Null value processing difference
- **`usePermi`**: Return empty value`true`, may cause permission control to be invalid
- **`v-hasPermi`**: An error thrown by an empty value will interrupt the program execution
- **`useHasRole`**: Return empty value`false`, relatively safe

### 2. Different sources of data
- **`usePermi`and`v-hasPermi`**:use`routeStore.permissions`(From the menu interface)
- **`useHasRole`**:use`authStore.user.role`(From user information)

### 3. Permission update timing
- Permission data is initialized when the user logs in
- After switching user roles, you need to log in again to update permissions
- The permission change needs to be re-called`initAuthRoute()`method

### 4. Super Administrator special handling
- `useHasRole`middle`super_admin`Roles have all permissions
- Other permission control methods do not include this special logic

### 5. Performance considerations
- `v-hasPermi`Will operate the DOM directly, with good performance but cannot be updated dynamically
- `usePermi`and`useHasRole`Supports responsive updates, but re-rendering is required

## Best Practices

### 1. Permission control selection
- **Page-level permissions**: Use`usePermi`or`useHasRole`
- **Component-level permissions**: Use`v-hasPermi`instruction
- **Functional Level Permissions**: Use`usePermi`function

### 2. Error handling
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

### 3. Permission Check
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

## Frequently Asked Questions

### Q: Why`usePermi`Return empty value`true`？
A: This is for backward compatibility and avoid blocking user operations when permission data is not loaded. It is recommended to clearly check whether the permission data has been loaded in the production environment.

### Q:`v-hasPermi`and`usePermi`What's the difference?
A:`v-hasPermi`It is a command that will directly operate the DOM;`usePermi`is a function, returning a Bollinger value for conditional rendering. The instructions have better performance and more flexible functions.

### Q: How to deal with asynchronous loading of permission data?
A: You can display the load status before the permission data is loaded, or use`v-if`Cooperate with permission checks to control component rendering timing.

### Q: How to implement super administrator permissions?
A: In`useHasRole`If the user role contains`super_admin`, then return directly`true`, bypass specific permission checks.
