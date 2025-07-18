import type { BaseVO } from '@/typings/base'

import request from '@/utils/request'

export interface CodeGenerationVO extends BaseVO {
  id?: string
  name: string
  code: string
  isGenerateTable: number
  isGenerateBackendCode: number
  isGenerateWebCode: number
  isImportMenuAndPermission: number
  sort: number
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
}
