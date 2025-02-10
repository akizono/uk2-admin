import type * as USER_RESPONSE from '@/api/user/response.type'

export type ModalType = 'add' | 'view' | 'edit'

export interface Success extends USER_RESPONSE.UserInfo {
  type: ModalType
  password?: string
}
