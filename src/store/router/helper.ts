import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'

import { usePermission } from '@/hooks'
import Layout from '@/layouts/index.vue'
import { arrayToTree, renderIcon } from '@/utils'
import { clone, min } from 'radash'
import { RouterLink } from 'vue-router'

function standardizedRoutes(route: AppRoute.RowRoute[]) {
  return clone(route).map((item: any) => {
    // 處理 MenuVO 類型
    const meta: AppRoute.RouteMeta = {
      title: item.name,
      icon: item.icon,
      requiresAuth: true,
      permission: item.permission,
      cache: item.isCache === 1,
      hide: item.isShowSide === 0,
      order: item.sort,
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
  // 不使用這個變數，避免ESLint錯誤
  // const { hasPermission } = usePermission()

  // Structure the meta field
  let resultRouter = standardizedRoutes(routes)

  // Route permission filtering
  // resultRouter = resultRouter.filter((i) => {
  //   // 檢查是否有權限標識
  //   if (i.meta.permission) {
  //     console.log('333')
  //     return hasPermission(i.meta.permission)
  //   }
  //   return true
  // })

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
      title: '',
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

// Generate an array of route names that need to be kept alive
export function generateCacheRoutes(routes: AppRoute.RowRoute[]) {
  const cacheRoutes = routes
    .filter((item: any) => {
      return item.isCache === 1
    })
    .map((item: any) => {
      // 調試輸出
      console.log('緩存路由:', item.name, item)
      return item.name
    })

  // 輸出最終緩存的路由名稱列表
  console.log('最終緩存路由列表:', cacheRoutes)
  return cacheRoutes
}

function setRedirect(routes: AppRoute.Route[]) {
  routes.forEach((route) => {
    if (route.children) {
      if (!route.redirect) {
        // Filter out a collection of child elements that are not hidden
        const visibleChilds = route.children.filter(child => !child.meta.hide)

        // Redirect page to the path of the first child element by default
        let target = visibleChilds[0]

        // Filter out pages with the order attribute
        const orderChilds = visibleChilds.filter(child => child.meta.order)

        if (orderChilds.length > 0)
          target = min(orderChilds, i => i.meta.order!) as AppRoute.Route

        if (target)
          route.redirect = target.path
      }

      setRedirect(route.children)
    }
  })
}

/* 生成側邊菜單的數據 */
export function createMenus(userRoutes: AppRoute.RowRoute[]) {
  const resultMenus = standardizedRoutes(userRoutes)

  // filter menus that do not need to be displayed
  const visibleMenus = resultMenus.filter(route => !route.meta.hide)

  // generate side menu
  return arrayToTree(transformAuthRoutesToMenus(visibleMenus))
}

// render the returned routing table as a sidebar
function transformAuthRoutesToMenus(userRoutes: AppRoute.Route[]) {
  const { hasPermission } = usePermission()
  return userRoutes
    // Filter out side menus without permission
    .filter((i) => {
      // 檢查是否有角色權限
      if (i.meta.roles && i.meta.roles.length > 0) {
        return hasPermission(i.meta.roles)
      }
      // 檢查是否有權限標識
      if (i.meta.permission) {
        return hasPermission(i.meta.permission)
      }
      return true
    })
    //  Sort the menu according to the order size
    .sort((a, b) => {
      if (a.meta && a.meta.order && b.meta && b.meta.order)
        return a.meta.order - b.meta.order
      else if (a.meta && a.meta.order)
        return -1
      else if (b.meta && b.meta.order)
        return 1
      else return 0
    })
    // Convert to side menu data structure
    .map((item) => {
      console.log('item', item)
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
                  { default: () => item.name },
                )
            : () => item.name,
        key: item.path || `menu-${item.id}`, // 確保每個選單項都有唯一的 key
        icon: item.meta.icon ? renderIcon(item.meta.icon) : undefined,
      }
      return target
    })
}
