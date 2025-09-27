import type { DefaultTheme } from 'vitepress'

import { shared } from './shared'

export const zhTWConfig = {
  ...shared,
  lang: 'zh-TW',

  themeConfig: {
    ...shared.themeConfig,

    nav: [
      { text: '首頁', link: '/zhTW/' },
      { text: '前端指南', link: '/zhTW/web-guide/guide/introduction' },
      { text: '後端指南', link: '/zhTW/nest-guide/guide/introduction' },
      { text: '開發配置', link: '/zhTW/dev/vc-plugins' },
    ],

    sidebar: {
      '/zhTW/web-guide/': [
        {
          text: '指南',
          items: [
            { text: '介紹', link: '/zhTW/web-guide/guide/introduction' },
          ],
        },
        {
          text: '基本配置',
          items: [
            { text: '請求服務配置', link: '/zhTW/web-guide/basic-config/service' },
            { text: '路由和選單', link: '/zhTW/web-guide/basic-config/routers-menus' },
            { text: '權限控制', link: '/zhTW/web-guide/basic-config/permission-control' },
            { text: '自訂主題', link: '/zhTW/web-guide/basic-config/custom-theme' },
            { text: '環境變數', link: '/zhTW/web-guide/basic-config/env-variable' },
          ],
        },
        {
          text: '擴展使用',
          items: [
            { text: '使用圖示', link: '/zhTW/web-guide/extended-use/use-icons' },
            { text: '國際化(i18n)', link: '/zhTW/web-guide/extended-use/i18n' },
            { text: 'UnoCSS', link: '/zhTW/web-guide/extended-use/unocss' },
          ],
        },
        {
          text: '元件',
          items: [
            { text: 'DataTable', link: '/zhTW/web-guide/components/data-table' },
          ],
        },
      ],

      '/zhTW/nest-guide/': [
        {
          text: '指南',
          items: [
            { text: '介紹', link: '/zhTW/nest-guide/guide/introduction' },
            { text: '快速啟動', link: '/zhTW/nest-guide/guide/quick-start' },
            { text: '介面文件', link: '/zhTW/nest-guide/guide/api-docs' },
            { text: '專案結構', link: '/zhTW/nest-guide/guide/project-intro' },
          ],
        },
        {
          text: '擴展使用',
          items: [
            { text: '基礎實體（base.entity）', link: '/zhTW/nest-guide/extended-use/base.entity' },
            { text: '基礎請求 DTO（base.req.dto）', link: '/zhTW/nest-guide/extended-use/base.req.dto' },
            { text: '基礎服務（base.service）', link: '/zhTW/nest-guide/extended-use/base.service' },
            { text: '多語言欄位', link: '/zhTW/nest-guide/extended-use/multilingual-fields' },
            { text: '驗證碼發送服務集成指南', link: '/zhTW/nest-guide/extended-use/verify-code-integration' },
          ],
        },
        {
          text: '基礎用法',
          items: [
            { text: '模組創建指南', link: '/zhTW/nest-guide/basic-usage/module-creation-guide' },
          ],
        },
      ],

      '/zhTW/dev/': [
        {
          text: '開發工具',
          items: [
            { text: 'VSCode 插件推薦', link: '/zhTW/dev/vc-plugins' },
          ],
        },
        {
          text: '開發環境',
          items: [
            { text: 'Git', link: '/zhTW/dev/git' },
            { text: 'Node.js', link: '/zhTW/dev/nodejs' },
            { text: 'MySQL', link: '/zhTW/dev/mysql' },
          ],
        },
      ],
    },
  } as DefaultTheme.Config,
}
