declare namespace AppRoute {

  type MenuType = 'dir' | 'page'
  /** 單個路由所攜帶的meta標識 */
  interface RouteMeta {
    /* 頁面標題，通常必選。 */
    title: string
    /* 圖示，一般配合菜單使用 */
    icon?: string
    /* 是否需要登錄權限。 */
    requiresAuth?: boolean
    /* 可以訪問的角色 */
    roles?: Entity.RoleType[]
    /* 權限標識 */
    permission?: string
    /* 是否開啟頁面快取 */
    isCache?: 0 | 1
    /* 有些路由我們並不想在菜單中顯示，比如某些編輯頁面。 */
    isShowSide?: 0 | 1
    /* 是否顯示與TAB欄 */
    isShowTab?: 0 | 1
    /* 菜單排序。 */
    sort?: number
    /* 嵌套外鏈  */
    href?: string
    /** 當前路由不在左側菜單顯示，但需要高亮某個菜單的情況 */
    activeMenu?: string
    /** 當前路由是否會被添加到Tab中 */
    withoutTab?: boolean
    /** 當前路由是否會被固定在Tab中,用於一些常駐頁面 */
    isPersistentTab?: boolean
    /** 當前路由在左側菜單是目錄還是頁面,不設置預設為page */
    menuType?: MenuType
    /** 菜單類型 0:目錄 1:菜單 */
    type?: number
    /** 多語言欄位 */
    multilingualFields?: {
      [field: string]: Array<{
        remark: string | null
        status: number
        isDeleted: number
        creator: string
        createTime: string
        updater: string | null
        updateTime: string | null
        id: string
        fieldId: string
        language: string
        value: string
      }>
    }
  }

  type MetaKeys = keyof RouteMeta

  interface baseRoute {
    /** 路由名稱(路由唯一標識) */
    name: string
    /** 路由路徑 */
    path: string
    /** 路由重定向 */
    redirect?: string
    /* 頁面組件地址 */
    componentPath?: string | null
    /* 路由id */
    id: number
    /* 父級路由id，頂級頁面為null */
    parentId: number | null
  }

  /** 單個路由的類型結構(動態路由模式：後端返回此類型結構的路由) */
  type RowRoute = RouteMeta & baseRoute | {
    id: string
    parentId: string | null
    name: string
    path: string | null
    component: string | null
    permission: string | null
    type: number
    icon: string | null
    link: string | null
    isCache: number
    isShowTab: number
    isPersistentTab: number
    isShowSide: number
    sort: number
    remark: string | null
    status: number
    isDeleted: number
    creator: string
    createTime: string
    updater: string | null
    updateTime: string | null
  }

  /**
   * 掛載到項目上的真實路由結構
   */
  interface Route extends baseRoute {
    /** 子路由 */
    children?: Route[]
    /* 頁面組件 */
    component: any
    /** 路由描述 */
    meta: RouteMeta
  }

}
