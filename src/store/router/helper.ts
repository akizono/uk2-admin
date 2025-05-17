import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'

import Layout from '@/layouts/index.vue'
import { arrayToTree, renderIcon } from '@/utils'
import { clone, min } from 'radash'
import { RouterLink } from 'vue-router'

function standardizedRoutes(route: AppRoute.RowRoute[]) {
  return clone(route).map((item: any) => {
    // 處理 MenuVO 類型
    const meta: AppRoute.RouteMeta = {
      title: item.title,
      icon: item.icon,
      requiresAuth: true,
      permission: item.permission,
      isCache: item.isCache,
      isShowSide: item.isShowSide,
      isShowTab: item.isShowTab,
      isPersistentTab: item.isPersistentTab,
      sort: item.sort,
      type: item.type,
    }

    if (item.link) {
      meta.href = item.link
    }

    const route = {
      name: item.name,
      path: item.path || '',
      redirect: undefined,
      component: item.component,
      id: item.id,
      parentId: item.parentId,
      meta,
    }

    return route
  }) as AppRoute.Route[]
}

export function createRoutes(routes: AppRoute.RowRoute[]) {
  // Structure the meta field
  let resultRouter = standardizedRoutes(routes)

  // Generate routes, no need to import files for those with redirect
  const modules = import.meta.glob('@/views/**/*.vue')
  resultRouter = resultRouter.map((item: AppRoute.Route) => {
    // 處理組件路徑
    const componentPath = (item as any).component
    if (componentPath && !item.redirect) {
      // 判斷組件路徑是否已經包含完整的路徑
      if (componentPath.startsWith('/'))
        item.component = modules[`/src/views${componentPath}`]
      else
        item.component = modules[`/src/views/${componentPath}`]
    }
    return item
  })

  // Generate route tree
  resultRouter = arrayToTree(resultRouter) as AppRoute.Route[]

  const appRootRoute: RouteRecordRaw = {
    path: '/appRoot',
    name: 'appRoot',
    redirect: import.meta.env.VITE_HOME_PATH,
    component: Layout,
    meta: {
      title: 'Home',
      icon: 'icon-park-outline:home',
    },
    children: [],
  }

  // Set the correct redirect path for the route
  setRedirect(resultRouter)

  // Insert the processed route into the root route
  appRootRoute.children = resultRouter as unknown as RouteRecordRaw[]
  return appRootRoute
}

// 生成需要快取的路由名稱列表
export function generateCacheRoutes(routes: AppRoute.RowRoute[]) {
  const cacheRoutes = routes
    .filter((item: any) => {
      return item.isCache === 1
    })
    .map((item: any) => {
      return item.name
    })

  // 輸出最終快取的路由名稱列表
  console.log('需要快取的路由列表:', cacheRoutes)
  return cacheRoutes
}

// 設置重定向
function setRedirect(routes: AppRoute.Route[]) {
  routes.forEach((route) => {
    if (route.children) {
      if (!route.redirect) {
        // 過濾掉不需要顯示的子元素
        const visibleChilds = route.children.filter(child => child.meta.isShowSide === 0)

        // 默認重定向到第一個子元素的路徑
        let target = visibleChilds[0]

        // 過濾掉沒有 sort 屬性的子元素
        const sortChilds = visibleChilds.filter(child => child.meta.sort)

        if (sortChilds.length > 0)
          target = min(sortChilds, i => i.meta.sort!) as AppRoute.Route

        if (target)
          route.redirect = target.path
      }

      setRedirect(route.children)
    }
  })
}

/* 生成側邊選單的數據 */
export function createMenus(userRoutes: AppRoute.RowRoute[]) {
  const resultMenus = standardizedRoutes(userRoutes)

  // 先找出所有被過濾掉的選單的 ID
  const filteredIds = new Set<number | string>()

  // 遞迴收集所有需要被過濾的 ID
  function collectFilteredIds(routes: any[]) {
    routes.forEach((route) => {
      // 如果當前項目不顯示，或者其父項已經被過濾，則過濾掉當前項目及其所有子項
      if (route.meta.isShowSide !== 1 || (route.parentId && filteredIds.has(route.parentId))) {
        filteredIds.add(route.id)
      }

      // 如果有子項，繼續遞迴
      if (route.children?.length) {
        collectFilteredIds(route.children)
      }
    })
  }

  // 第一次遍歷：收集所有需要被過濾的 ID
  collectFilteredIds(resultMenus)

  // 過濾不需要顯示的選單
  const visibleMenus = resultMenus.filter(route => !filteredIds.has(route.id))

  return arrayToTree(transformAuthRoutesToMenus(visibleMenus))
}

// 將返回的路由表渲染為側邊選單
function transformAuthRoutesToMenus(userRoutes: AppRoute.Route[]) {
  return userRoutes
    // 根據排序大小對選單進行排序
    .sort((a, b) => {
      if (a.meta && a.meta.sort && b.meta && b.meta.sort)
        return a.meta.sort - b.meta.sort
      else if (a.meta && a.meta.sort)
        return -1
      else if (b.meta && b.meta.sort)
        return 1
      else return 0
    })
    // 轉換為側邊選單的數據結構
    .map((item) => {
      const target: MenuOption = {
        id: item.id,
        parentId: item.parentId,
        label:
          (item.meta.type === 1)
            ? () =>
                h(
                  RouterLink,
                  {
                    to: {
                      path: item.path,
                    },
                  },
                  { default: () => item.meta.title },
                )
            : () => item.meta.title,
        key: item.path || `menu-${item.id}`, // 確保每個選單項都有唯一的 key
        icon: item.meta.icon ? renderIcon(item.meta.icon) : undefined,
      }
      return target
    })
}
