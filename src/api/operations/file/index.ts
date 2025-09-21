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
  getFileList: async (params: PageParams & Partial<FileVO>): PageRes<FileVO> => {
    return await request.get({ url: '/operations/file/list', params })
  },

  /** 上傳檔案 */
  uploadFile: async (data: { files: File[] }): ApiResponse<FileVO[]> => {
    try {
      // 創建 FormData 對象
      const formData = new FormData()
      // console.log('上傳文件數量:', data.files.length)

      // 將文件添加到 FormData 中
      data.files.forEach((file, _index) => {
        // console.log(`添加文件 ${index + 1}:`, file.name, file.size, file.type)
        formData.append('files', file, file.name)
      })

      // 檢查 FormData 內容
      // console.log('FormData 已創建，但無法直接查看內容')

      // 使用自訂請求系統進行上傳，保持所有攔截器功能
      const response = await request.post({
        url: '/operations/file/upload',
        data: formData,
      })

      // console.log('上傳響應:', response)

      return response
    }
    catch (error) {
      console.error('error:', error)
      throw error
    }
  },

  /** 刪除檔案 */
  deleteFile: async (id: string) => {
    return await request.delete({ url: `/operations/file/delete/${id}` })
  },
}
