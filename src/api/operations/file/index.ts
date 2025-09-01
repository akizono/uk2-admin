import request from '@/utils/request'

export interface FileVO extends Api.BaseVO {
  id: string
  name: string
  path: string
  url: string
  type: string
  size: number
}

export const FileApi = {
  /** 獲取檔案分頁列表 */
  getFilePage: async (params: PageParams & Partial<FileVO>): PageRes<FileVO> => {
    return await request.get({ url: '/operations/file/page', params })
  },

  /** 上傳檔案 */
  uploadFile: async (data: { files: File[] }) => {
    return await request.post({ url: '/operations/file/upload', data })
  },

  /** 刪除檔案 */
  deleteFile: async (id: string) => {
    return await request.delete({ url: `/operations/file/delete/${id}` })
  },
}
