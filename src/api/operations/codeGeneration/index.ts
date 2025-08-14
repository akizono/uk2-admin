import request from '@/utils/request'

export interface CodeGenerationVO extends Api.BaseVO {
  id?: string
  name: string
  code: string
  isGenerateEntity: number
  isGenerateBackendCode: number
  isGenerateWebCode: number
  isImportMenuAndPermission: number
  sort: number
}

// 「代碼生成」後的「預覽樹」的結構
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

// 生成「實體」代碼的參數
export interface CodeGenerateEntityParamsVO {
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

// 生成「後端代碼」的參數
export interface CodeGenerateBackendParamsVO {
  fileName: string
  camelName: string
  timestamp: string
  splitName: string[]
  classNamePrefix: string
  exampleData: Record<string, any>
  unitName: string
  columns: Record<string, { label: string, type: string, nullable: boolean }>
}

export type EntityAllFieldsVO = Record<string, { label: string, type: string, nullable: boolean }>

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
  previewEntityCode: async (data: CodeGenerateEntityParamsVO): ApiResponse<{ treeData: TreeData[] }> => {
    return await request.post({ url: `/operations/code-generation/preview-entity-code`, data })
  },

  /** 插入實體代碼 */
  insertEntityCode: async (data: CodeGenerateEntityParamsVO) => {
    return await request.post({ url: `/operations/code-generation/insert-entity-code`, data })
  },

  /** 獲取 Entity 中的所有自訂欄位 */
  getEntityCustomFields: async (params: { splitName: string }) => {
    return await request.get({ url: '/operations/code-generation/get-entity-custom-fields', params })
  },

  /** 預覽後端代碼 */
  previewBackendCode: async (data: CodeGenerateBackendParamsVO): ApiResponse<{ treeData: TreeData[] }> => {
    return await request.post({ url: '/operations/code-generation/preview-backend-code', data })
  },

  /** 插入後端代碼 */
  insertBackendCode: async (data: CodeGenerateBackendParamsVO) => {
    return await request.post({ url: '/operations/code-generation/insert-backend-code', data })
  },

  // 獲取指定的Entity 中 所有欄位
  getEntityAllFields: async (params: { splitName: string }): ApiResponse<EntityAllFieldsVO> => {
    return await request.get({ url: '/operations/code-generation/get-entity-all-fields', params })
  },

}
