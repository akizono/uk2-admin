import request from '@/utils/request'

export interface MenuVO {
  id: string
  parentId: string
  name: string
  path: string
  component: string
  permission: string
  type: number
  icon: string
  link: string
  isCache: number
  isShowTag: number
  isKeepAlive: number
  isShowSide: number
  sort: number

  remark: string
  status: number
  isDeleted: number
  creator: string
  createTime: string
  updater: string
  updateTime: string
}

export const MenuApi = {
  /** 獲取菜單分頁列表 */
  getMenuPage: async (params: PageParams): PageRes<MenuVO> => {
    return await request.get({ url: '/system/menu/page', params })
  },

  /** 新增菜單 */
  createMenu: async (data: MenuVO) => {
    return await request.post({ url: '/system/menu/create', data })
  },

  /** 修改菜單 */
  updateMenu: async (data: MenuVO) => {
    return await request.put({ url: '/system/menu/update', data })
  },

  /** 刪除菜單 */
  deleteMenu: async (id: string) => {
    return await request.delete({ url: `/system/menu/delete/${id}` })
  },

  /** 封鎖菜單 */
  blockMenu: async (id: string) => {
    return await request.put({ url: `/system/menu/block/${id}` })
  },

  /** 解封菜單 */
  unblockMenu: async (id: string) => {
    return await request.put({ url: `/system/menu/unblock/${id}` })
  },
}
