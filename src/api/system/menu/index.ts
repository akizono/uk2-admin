import type { BaseVO } from '@/typings/base'

import request from '@/utils/request'

export interface MenuVO extends BaseVO {
  id: string
  parentId: string
  name: string
  title: string
  path: string
  component: string
  permission: string
  type: number
  icon: string
  link: string
  isCache: number
  isShowTab: number
  isPersistentTab: number
  isShowSide: number
  sort: number
}

export const MenuApi = {
  /** 獲取選單分頁列表 */
  getMenuPage: async (params: PageParams): PageRes<MenuVO> => {
    return await request.get({ url: '/system/menu/page', params })
  },

  /** 獲取使用者有權限的菜單 */
  getUserMenus: async (params: PageParams): PageRes<MenuVO[]> => {
    return await request.get({ url: '/system/menu/user-menus', params })
  },

  /** 新增選單 */
  createMenu: async (data: MenuVO) => {
    return await request.post({ url: '/system/menu/create', data })
  },

  /** 修改選單 */
  updateMenu: async (data: MenuVO) => {
    return await request.put({ url: '/system/menu/update', data, isFilterEmpty: false })
  },

  /** 刪除選單 */
  deleteMenu: async (id: string) => {
    return await request.delete({ url: `/system/menu/delete/${id}` })
  },

  /** 封鎖選單 */
  blockMenu: async (id: string) => {
    return await request.put({ url: `/system/menu/block/${id}` })
  },

  /** 解封選單 */
  unblockMenu: async (id: string) => {
    return await request.put({ url: `/system/menu/unblock/${id}` })
  },
}
