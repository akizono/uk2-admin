import type { ApiResponse } from '@/utils/request/types'
import type * as DTO from './dto.type'
import type * as RESPONSE from './response.type'
import request from '@/utils/request'

/** 獲取用戶列表 */
export function getUserList(params: DTO.UserListDTO): ApiResponse<RESPONSE.UserList> {
  return request.get({ url: '/user', params })
}

/** 新增使用者 */
export function createUser(data: DTO.CreateUserDTO): ApiResponse<RESPONSE.CreateUserResponse> {
  return request.post({ url: '/user/create', data })
}

/** 修改使用者個人資訊 */
export function updateUser(data: DTO.UpdateUserDTO) {
  return request.put({ url: '/user/update', data })
}

/** 刪除使用者 */
export function deleteUser(id: string) {
  return request.delete({ url: `/user/delete/${id}` })
}

/** 封鎖使用者 */
export function blockUser(id: string) {
  return request.put({ url: `/user/block/${id}` })
}

/** 解封使用者 */
export function unblockUser(id: string) {
  return request.put({ url: `/user/unblock/${id}` })
}
