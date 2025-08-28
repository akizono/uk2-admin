import type { UserVo } from '../user'

import request from '@/utils/request'

export interface LogVO extends Api.BaseVO {
  id: string
  path: string
  method: string
  params: Record<string, any>
  body: Record<string, any>
  query: Record<string, any>
  statusCode: number
  responseTime: number
  userId: string
  ip: string
  userAgent: string
  isSuccess: number
  errorMessage: string
  errorStack: string
  module: string
  actionType: string
  operationName: string
  resourceId: string

  user: UserVo
}

export const LogApi = {
  /** 獲取日誌分頁列表 */
  getLogPage: async (params: PageParams & Partial<LogVO>): PageRes<LogVO> => {
    return await request.get({ url: '/system/log/page', params })
  },

  /** 獲取「當前系統語言」版本的「日誌分頁列表」 */
  getLogPageByLang: async (params: PageParams & Partial<LogVO>): PageRes<LogVO> => {
    return await request.getByLang({ url: '/system/log/page', params })
  },
}
