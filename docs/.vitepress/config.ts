import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'document',

  title: 'UK2-Admin',
  description: 'This is a management system',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '前端指南', link: '/web-guide/guide/introduction' },
      { text: '開發配置', link: '/dev/vc-plugins' },
    ],

    sidebar: {
      // '/': [
      //   {
      //     text: 'Examples',
      //     items: [
      //       { text: 'Markdown Examples', link: '/markdown-examples' },
      //       { text: 'Runtime API Examples', link: '/api-examples' },
      //     ],
      //   },
      // ],
      '/web-guide/': [
        {
          text: '指南',
          items: [
            { text: '介紹', link: '/web-guide/guide/introduction' },
          ],
        },
        {
          text: '基本配置',
          items: [
            { text: '請求服務配置', link: '/web-guide/basic-config/service' },
            { text: '路由和選單', link: '/web-guide/basic-config/routers-menus' },
            { text: '權限控制', link: '/web-guide/basic-config/permission-control' },
            { text: '自訂主題', link: '/web-guide/basic-config/custom-theme' },
            { text: '環境變數', link: '/web-guide/basic-config/env-variable' },
          ],
        },
        {
          text: '擴展使用',
          items: [
            { text: '使用圖示', link: '/web-guide/extended-use/use-icons' },
            { text: '國際化(i18n)', link: '/web-guide/extended-use/i18n' },
            { text: 'UnoCSS', link: '/web-guide/extended-use/unocss' },
          ],
        },
      ],
      '/dev/': [
        {
          text: '開發工具',
          items: [
            { text: 'VSCode 插件推薦', link: '/dev/vc-plugins' },
          ],
        },
        {
          text: '開發環境',
          items: [
            { text: 'Git', link: '/dev/git' },
            { text: 'Node.js', link: '/dev/nodejs' },
            { text: 'MySQl', link: '/dev/mysql' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})
