import type { UserInfoVO } from './vos'
import request from '@/utils/request'

/** 修改使用者個人資訊 */
export function updateUserInfo(data: UserInfoVO) {
  return request.put({ url: '/user/update', data })
}
