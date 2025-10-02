# 請求服務配置

## 修改後台地址

項目中默認提供了三種請求環境，如果需要修改，可以修改`src\typings\env.d.ts`文件，增加`ServiceEnvType`類型

::: code-group

```ts [src\typings\env.d.ts]
type ServiceEnvType = 'dev' | 'test' | 'prod'
```
:::

在根目錄中的 .env 文件中可以配置不同的後臺地址。如下例子，dev為開發環境，test為測試環境，prod為生產環境，為每個環境下配置了不同的後台地址

::: code-group

```shell[.env.dev]
# API 請求基礎路徑
VITE_BASE_URL = 'http://127.0.0.1:3022'

# API 端點路徑
VITE_API_URL = '/platform-api'
```
```shell[.env.prod]
# API 請求基礎路徑
VITE_BASE_URL = 'http://127.0.0.1:3033'

# API 端點路徑
VITE_API_URL = '/platform-api'
```
```shell[.env.test]
# API 請求基礎路徑
VITE_BASE_URL = 'http://127.0.0.1:3044'

# API 端點路徑
VITE_API_URL = '/platform-api'
```
:::

## API 基本使用方式

在 UK2-admin 中，我們採用了一套清晰規範的 API 請求方式，讓前後端交互更加類型安全和易於維護。

1. 創建 API 文件

   在 `src/api/`目錄下為每個模組創建獨立的 API 文件，例如角色管理的 API：

::: code-group
```ts[src/api/role.ts]
import request from '@/utils/request'

export interface RoleVO extends Api.BaseVO {
  id: string
  code: string
  name: string
  description: string
}

export const RoleApi = {
  /** 獲取角色資料 */
  getRole: async (id: string): ApiResponse<RoleVO> => {
    return await request.get({ url: `/platform-api/system/role/get/${id}` })
  },
}

```
:::

然後在頁面或其他地方中引入並使用定義好的 API

```ts
import type { RoleVO } from '@/api/system/role'

import { RoleApi } from '@/api/system/role'

const roleData = ref({} as RoleVO)

async function getRoleData() {
  const { data: result } = await RoleApi.getRole('1')
  roleData.value = result
}

onMounted(() => {
  getRoleData()
})
```

類型系統說明

在上面的案例中出現了兩個核心類型來規範前後端交互

- Api.BaseVO: 基礎數據類型，所有VO都應繼承此類型
- ApiResponse\<T\>: 響應包裝類型，確保類型安全

您可以參照上面的代碼範例直接使用這些類型而無需關心實現細節，如需深入了解可查看相關文件: [api/base.d.ts](../api/base.d.ts) 和 [api/response.d.ts](../api/response.d.ts) 。

## 完整的增刪改查 API 範例

接下來的範例將展示如何創建一個完整的增刪改查 API，這將幫助您快速上手 UK2-admin 的 API 使用。

在`src/api/system/role/index.ts`文件中，我們創建了一個完整的增刪改查 API，覆蓋了大多數情況。

::: code-group

```ts[src/api/system/role/index.ts]
import request from '@/utils/request'

export interface RoleVO extends Api.BaseVO {
  id: string
  code: string
  name: string
  description: string
}

export const RoleApi = {
  /** 獲取角色分頁列表 */
  getRoleList: async (params: PageParams & Partial<RoleVO>): PageRes<RoleVO> => {
    return await request.get({ url: '/platform-api/system/role/list', params })
  },

  /** 獲取角色資料 */
  getRole: async (id: string): ApiResponse<RoleVO> => {
    return await request.get({ url: `/platform-api/system/role/get/${id}` })
  },

  /** 新增角色 */
  createRole: async (data: RoleVO) => {
    return await request.post({ url: '/platform-api/system/role/create', data })
  },

  /** 修改角色 */
  updateRole: async (data: RoleVO) => {
    return await request.put({ url: '/platform-api/system/role/update', data })
  },

  /** 刪除角色 */
  deleteRole: async (id: string) => {
    return await request.delete({ url: `/platform-api/system/role/delete/${id}` })
  },

  /** 封鎖角色 */
  blockRole: async (id: string) => {
    return await request.put({ url: `/platform-api/system/role/block/${id}` })
  },

  /** 解封角色 */
  unblockRole: async (id: string) => {
    return await request.put({ url: `/platform-api/system/role/unblock/${id}` })
  },
}
```
:::

::: code-group
```ts[獲取角色分頁列表]
import type { RoleVO } from '@/api/system/role'

import { RoleApi } from '@/api/system/role'

const roleList = ref({} as RoleVO[])

const queryParams = ref<PageParams & Partial<RoleVO>>({
  pageSize: 10, // 每頁顯示的數據量
  currentPage: 1, // 當前頁
  status: 1, // 獲取所有狀態為1的數據
} )

async function getRoleList() {
  const { data: result } = await RoleApi.getRoleList(queryParams.value)
  roleList.value = result.list
}

onMounted(() => {
  getRoleList()
})
```

```ts[獲取單個角色的資料]
import type { RoleVO } from '@/api/system/role'

import { RoleApi } from '@/api/system/role'

const roleData = ref({} as RoleVO)

async function getRoleData() {
  const { data: result } = await RoleApi.getRole('1')
  roleData.value = result
}

onMounted(() => {
  getRoleData()
})
```

```vue[新增角色]
<template>
  <n-form :model="formData" :rules="rules" ref="formRef">
    <n-form-item label="角色名稱" prop="name">
      <n-input v-model:value="formData.name" />
    </n-form-item>
    <n-form-item label="角色代碼" prop="code">
      <n-input v-model:value="formData.code" />
    </n-form-item>
    <n-form-item>
      <n-button :loading="loading" @click="createRole">創建角色</n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import type { RoleVO } from '@/api/system/role'
import type { FormRules } from 'naive-ui'

import { RoleApi } from '@/api/system/role'

const formRef = ref()
const formData = ref({} as RoleVO)

const rules: FormRules = {
  code: {
    required: true,
    message: '角色代碼不能為空',
    trigger: ['blur', 'input'],
  },
}

const loading = ref(false)
async function createRole() {
  try{
    loading.value = true
    await RoleApi.createRole(formData.value)
    window.$message.success('創建角色成功')
  }finally{
    loading.value = false
  }
}
</script>
```

```vue[修改角色]
<template>
  <n-form :model="formData" :rules="rules" ref="formRef">
    <n-form-item label="角色名稱" prop="name">
      <n-input v-model:value="formData.name" />
    </n-form-item>
    <n-form-item label="角色代碼" prop="code">
      <n-input v-model:value="formData.code" />
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import type { RoleVO } from '@/api/system/role'
import type { FormRules } from 'naive-ui'

import { RoleApi } from '@/api/system/role'

const formRef = ref()
const formData = ref({} as RoleVO)

const rules: FormRules = {
  code: {
    required: true,
    message: '角色代碼不能為空',
    trigger: ['blur', 'input'],
  },
}

const loading = ref(false)
async function updateRole() {
  try{
    loading.value = true
    await RoleApi.updateRole(formData.value)
    window.$message.success('修改角色成功')
  }finally{
    loading.value = false
  }
}

const getRoleData = async () => {
  const { data: result } = await RoleApi.getRole('1')
  formData.value = result
}

onMounted(() => {
  getRoleData()
})

</script>

```

```vue[刪除角色(封鎖和解封鎖同理)]
<template>
  <n-button :loading="loading" @click="deleteRole('1')">刪除角色1</n-button>
</template>

<script setup lang="ts">
import { RoleApi } from '@/api/system/role'

const loading = ref(false)
async function deleteRole(id: string) {
  try{
    loading.value = true
    await RoleApi.deleteRole(id)
    window.$message.success('刪除角色成功')
  }finally{
    loading.value = false
  }
}
</script>
```
:::

類型系統說明

在上面的案例中出現了多個核心類型來規範前後端交互

- Api.BaseVO: 基礎數據類型，所有VO都應繼承此類型
- PageParams: 分頁參數類型
- PageRes\<T\>: 分頁響應類型
- ApiResponse\<T\>: 響應包裝類型（查詢非分頁數據專用）

您可以參照上面的代碼範例直接使用這些類型而無需關心實現細節，如需深入了解可查看相關文件: [api/base.d.ts](../api/base.d.ts) 、[api/response.d.ts](../api/response.d.ts) 、[api/page.d.ts](../api/page.d.ts) 、[api/page-params.d.ts](../api/page-params.d.ts) 。

## 獲取全量數據

我們為分頁接口提供了便捷的全量數據獲取方式，讓您可以根據實際需求靈活選擇數據獲取策略.

### 常規分頁請求

默認情況下，列表介面的分頁參數如下：

currentPage: 預設為 1（第一頁）

pageSize: 預設為 10（每頁10條）

### 獲取全部數據

當您需要一次性獲取所有數據時，只需將 pageSize參數設置為 0：

```ts
import type { RoleVO } from '@/api/system/role'

import { RoleApi } from '@/api/system/role'

const roleList = ref({} as RoleVO[])

async function getRoleList() {
  const { data: result } = await RoleApi.getRoleList({ pageSize: 0 })
  roleList.value = result.list
}

onMounted(() => {
  getRoleList()
})
```

## 不需要攜帶token的介面

默認情況下，所有請求都會攜帶token，如果某些介面不需要攜帶token，你可以像這樣定義

```ts
export const RoleApi = {
  /** 獲取角色資料 */
  getRole: async (id: string): ApiResponse<RoleVO> => {
    return await request.get({
      url: `/platform-api/system/role/get/${id}`,
      headers: {
        'skip-auth-token': true, // 跳過 Token 驗證
      },
    })
  },
}
```

## 自訂錯誤提示處理

通常系統會自動處理常見的 HTTP 錯誤狀態碼並在頁面上提示（如 400 表示請求格式錯誤，409 表示請求衝突等）。但在某些特定業務場景下，您可能需要自訂更友好的錯誤提示資訊。

當需要針對特定介面返回特定的錯誤提示時，可以通過請求頭 `specify-error-message` 來定義：

```ts
export function sendRegisterEmail(data: { email: string }) {
  return request.post({
    url: '/platform-api/system/auth/send-register-email',
    data,
    headers: {
      // 指定錯誤訊息
      'specify-error-message': [
        { code: 400, message: '操作過於頻繁，請稍後再試' }, // 狀態碼400時的錯誤提示
        { code: 409, message: '手機號碼已被綁定' }, // 狀態碼409時的錯誤提示
      ],
    },
  })
}
```

## 自動將介面的值轉換為當前的語言

在系統中，通過 DataTable 組件創建數據時，可以指定某些欄位在各種語言下的展示的值。

### 標準 GET 請求的問題

當使用常規的 request.get 方法時，多語言欄位會返回原始的多語言 ID 和完整的語言包數據。介面並不會將多語言欄位轉換為當前的語言，這種方式需要開發者手動處理語言轉換，增加了開發複雜度。

::: code-group
```ts[get請求]
// 以下是字典類型請求中搬運過來的代碼
import request from '@/utils/request'

export interface DictTypeVO extends Api.BaseVO {
  id: string
  name: string
  type: string
  sort: number
}

export const DictTypeApi = {
  /** 獲取字典類型資料 */
  getDictType: async (id: string): ApiResponse<DictTypeVO> => {
    return await request.get({ // 注意這裡是get方法
       url: `/platform-api/system/dict-type/get/${id}`
    })
  },
}
```
```ts[返回值]
/**
 * 以下是 DictTypeApi.getDictType('2') 的返回值
 * 我們可以看到name的值是一串multilingual開頭的id
 * name對應的資料則在multilingualFields中，
 * 這意味這我們需要手動寫程式碼先獲取當前系統語言再將name映射為當前語言的值，略為繁瑣。
*/
{
  "data": {
    "remark": "內建",
    "status": 1,
    "isDeleted": 0,
    "creator": "-1",
    "createTime": "2025-03-29T02:58:38.000Z",
    "updater": "1",
    "updateTime": "2025-08-19T17:10:59.000Z",
    "id": "2",
    "name": "multilingual-ba6d3b43-9f71-4cfe-961e-034b6250c63a",
    "type": "system_user_sex",
    "sort": 20,
    "multilingualFields": {
      "name": [
        {
          "language": "zhTW",
          "value": "系統使用者的性別"
        },
        {
          "language": "zhCN",
          "value": "系統用戶的性別"
        },
        {
          "language": "enUS",
          "value": "Gender of system user"
        }
      ]
    }
  },
  "message": "獲取字典類型資料成功"
}
```
:::

但是好消息是，我們提供了 getByLang方法來自動完成多語言欄位的轉換。

::: code-group
```ts[get請求]
// 以下是字典類型請求中搬運過來的代碼
import request from '@/utils/request'

export interface DictTypeVO extends Api.BaseVO {
  id: string
  name: string
  type: string
  sort: number
}

export const DictTypeApi = {
  /** 獲取字典類型資料 */
  getDictType: async (id: string): ApiResponse<DictTypeVO> => {
    return await request.getByLang({ // 注意這裡是getByLang方法
       url: `/platform-api/system/dict-type/get/${id}`
    })
  },
}
```
```ts[返回值]
/**
 * 以下是 DictTypeApi.getDictType('2') 的返回值
 * 我們可以看到name的值已經被自動轉換為當前語言的值
*/
{
  "data": {
    "remark": "內建",
    "status": 1,
    "isDeleted": 0,
    "creator": "-1",
    "createTime": "2025-03-29T02:58:38.000Z",
    "updater": "1",
    "updateTime": "2025-08-19T17:10:59.000Z",
    "id": "2",
    "name": "系統使用者的性別", // 這裡已經被自動轉換為當前語言的值
    "type": "system_user_sex",
    "sort": 20,
    "multilingualFields": {
      "name": [
        {
          "language": "zhTW",
          "value": "系統使用者的性別"
        },
        {
          "language": "zhCN",
          "value": "系統用戶的性別"
        },
        {
          "language": "enUS",
          "value": "Gender of system user"
        }
      ]
    }
  },
  "message": "獲取字典類型資料成功"
}
```
:::
