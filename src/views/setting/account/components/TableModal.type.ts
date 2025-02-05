import type { UserInfo } from '@/api/user/response.type'

export type ModalType = 'add' | 'view' | 'edit'

export interface Success extends UserInfo {
  type: ModalType
  password?: string
}
