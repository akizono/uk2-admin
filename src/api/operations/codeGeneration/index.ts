import type { BaseVO } from '@/typings/base'

import request from '@/utils/request'

export interface CodeGenerationVO extends BaseVO {
  id?: string
  name: string
  code: string
  isGenerateEntity: number
  isGenerateBackendCode: number
  isGenerateWebCode: number
  isImportMenuAndPermission: number
  sort: number
}

export interface CodeGenerateParamsVO {
  timestamp: string
  className: string
  fileName: string
  splitName: string[]
  tableName: string
  tableColumns: {
    columnNameUnderline: string
    jsDataType: 'number' | 'string' | 'boolean' | 'Date' | any // Can be more specific based on possible values
    columnName: string
    dataType: string
    length: number | null
    isNotNull: number // 0 or 1
    isAutoIncrement: number // 0 or 1
    isPrimaryKey: number // 0 or 1
    isUnique: number // 0 or 1
    defaultValue: string | number | null
    comment: string | null
  }[]
}

export interface TreeData {
  label: string
  key: string
  type: 'folder' | 'file'
  children?: Array<{
    label: string
    key: string
    type: 'folder' | 'file'
    children?: Array<{
      label: string
      key: string
      type: 'folder' | 'file'
      children?: Array<{
        label: string
        key: string
        type: 'folder' | 'file'
        children?: Array<{
          label: string
          key: string
          type: 'folder' | 'file'
          children?: Array<{
            label: string
            key: string
            type: 'folder' | 'file'
            code?: string
          }>
        }>
      }>
    }>
  }>
}

export const CodeGenerationApi = {
  /** 獲取模組分頁列表 */
  getCodeGenerationPage: async (params: PageParams): PageRes<CodeGenerationVO> => {
    return await request.get({ url: '/operations/code-generation/page', params })
  },

  /** 新增模組 */
  createCodeGeneration: async (data: CodeGenerationVO) => {
    return await request.post({ url: '/operations/code-generation/create', data })
  },

  /** 修改模組 */
  updateCodeGeneration: async (data: CodeGenerationVO) => {
    return await request.put({ url: '/operations/code-generation/update', data })
  },

  /** 刪除模組 */
  deleteCodeGeneration: async (id: string) => {
    return await request.delete({ url: `/operations/code-generation/delete/${id}` })
  },

  /** 封鎖模組 */
  blockCodeGeneration: async (id: string) => {
    return await request.put({ url: `/operations/code-generation/block/${id}` })
  },

  /** 解封模組 */
  unblockCodeGeneration: async (id: string) => {
    return await request.put({ url: `/operations/code-generation/unblock/${id}` })
  },

  /** 生成數據表的代碼返回前端進行預覽 */
  previewEntityCode: async (data: CodeGenerateParamsVO): ApiResponse<{ treeData: TreeData[] }> => {
    return await request.post({ url: `/operations/code-generation/preview-entity-code`, data })
  },

  /** 插入實體代碼 */
  insertEntityCode: async (data: CodeGenerateParamsVO) => {
    return await request.post({ url: `/operations/code-generation/insert-entity-code`, data })
  },
}
