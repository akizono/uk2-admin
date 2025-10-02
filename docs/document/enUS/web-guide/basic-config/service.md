# Request service configuration

## Modify the background address

There are three request environments provided by default in the project. If you need to modify it, you can modify it.`src\typings\env.d.ts`File, add`ServiceEnvType`type

:::code-group

```ts [src\typings\env.d.ts]
type ServiceEnvType = 'dev' | 'test' | 'prod'
```
:::

Different background addresses can be configured in the .env file in the root directory. The following example is: dev is the development environment, test is the test environment, and prod is the production environment, and different background addresses are configured for each environment.

:::code-group

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

## Basic API usage

In UK2-admin, we adopt a clear and standardized API request method to make front-end and back-end interactions more type-safe and easy to maintain.

1. Create API file

exist`src/api/`Create independent API files for each module in the directory, such as the role management API:

:::code-group
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
    return await request.get({ url: `/system/role/get/${id}` })
  },
}

```
:::

Then introduce and use the defined API on the page or elsewhere

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

Type system description

In the above case, two core types appear to regulate front-end and back-end interactions

- Api.BaseVO: Basic data type, all VOs should inherit this type
- ApiResponse\<T\>: Respond to the wrapper type to ensure type safety

You can refer to the above code example to use these types directly without caring about implementation details. If you need to have an in-depth understanding, you can view the relevant files:[api/base.d.ts](../api/base.d.ts)and[api/response.d.ts](../api/response.d.ts) 。

## Complete API examples

The following examples will show how to create a complete add-on, delete, modify, and check API, which will help you quickly get started with the use of UK2-admin's API.

exist`src/api/system/role/index.ts`In the file, we created a complete add, delete, modify and search API, covering most cases.

:::code-group

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
    return await request.get({ url: '/system/role/list', params })
  },

  /** 獲取角色資料 */
  getRole: async (id: string): ApiResponse<RoleVO> => {
    return await request.get({ url: `/system/role/get/${id}` })
  },

  /** 新增角色 */
  createRole: async (data: RoleVO) => {
    return await request.post({ url: '/system/role/create', data })
  },

  /** 修改角色 */
  updateRole: async (data: RoleVO) => {
    return await request.put({ url: '/system/role/update', data })
  },

  /** 刪除角色 */
  deleteRole: async (id: string) => {
    return await request.delete({ url: `/system/role/delete/${id}` })
  },

  /** 封鎖角色 */
  blockRole: async (id: string) => {
    return await request.put({ url: `/system/role/block/${id}` })
  },

  /** 解封角色 */
  unblockRole: async (id: string) => {
    return await request.put({ url: `/system/role/unblock/${id}` })
  },
}
```
:::

:::code-group
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

Type system description

In the above case, multiple core types appear to regulate front-end and back-end interactions

- Api.BaseVO: Basic data type, all VOs should inherit this type
- PageParams: Pagination parameter type
- PageRes\<T\>: Pagination response type
- ApiResponse\<T\>: Response wrapper type (exclusive for querying non-paging data)

You can refer to the above code example to use these types directly without caring about implementation details. If you need to have an in-depth understanding, you can view the relevant files:[api/base.d.ts](../api/base.d.ts) 、[api/response.d.ts](../api/response.d.ts) 、[api/page.d.ts](../api/page.d.ts) 、[api/page-params.d.ts](../api/page-params.d.ts) 。

## Get all data

We provide a convenient way to obtain full data for the paging interface, allowing you to flexibly select data acquisition strategies based on actual needs.

### General paging requests

By default, the paging parameters of the list interface are as follows:

CurrentPage: Preset to 1 (first page)

pageSize: Preset to 10 (10 items per page)

### Get all data

When you need to get all the data at once, just set the pageSize parameter to 0:

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

## No need to carry a token interface

By default, all requests will carry tokens. If some interfaces do not need to carry tokens, you can define them like this

```ts
export const RoleApi = {
  /** 獲取角色資料 */
  getRole: async (id: string): ApiResponse<RoleVO> => {
    return await request.get({
      url: `/system/role/get/${id}`,
      headers: {
        'skip-auth-token': true, // 跳過 Token 驗證
      },
    })
  },
}
```

## Custom error prompt processing

Usually, the system will automatically process common HTTP error status codes and prompt them on the page (such as 400 means the request format is erroneous, 409 means the request conflict, etc.). But in certain business scenarios, you may need to customize more friendly error message.

When a specific error message needs to be returned for a specific interface, the request header can be used`specify-error-message`To define:

```ts
export function sendRegisterEmail(data: { email: string }) {
  return request.post({
    url: '/system/auth/send-register-email',
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

## Automatically convert the interface's value to the current language

In the system, when creating data through the DataTable component, you can specify the values ​​for the display of certain fields in various languages.

### Issues with standard GET requests

When using the regular request.get method, the multilingual field returns the original multilingual ID and complete language pack data. The interface does not convert multilingual fields to the current language. This method requires developers to manually handle language conversion, which increases development complexity.

:::code-group
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
       url: `/system/dict-type/get/${id}`
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

But the good news is that we provide the getByLang method to automatically complete the conversion of multilingual fields.

:::code-group
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
       url: `/system/dict-type/get/${id}`
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
