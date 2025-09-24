import type { DefaultTheme } from 'vitepress'

import { shared } from './shared'

export const enUSConfig = {
  ...shared,
  lang: 'en-US',

  themeConfig: {
    ...shared.themeConfig,

    nav: [
      { text: 'Home', link: '/enUS/' },
      { text: 'Web Guide', link: '/enUS/web-guide/guide/introduction' },
      { text: 'Development', link: '/enUS/dev/vc-plugins' },
    ],

    sidebar: {
      '/enUS/web-guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/enUS/web-guide/guide/introduction' },
          ],
        },
        {
          text: 'Basic Configuration',
          items: [
            { text: 'Service Configuration', link: '/enUS/web-guide/basic-config/service' },
            { text: 'Routers and Menus', link: '/enUS/web-guide/basic-config/routers-menus' },
            { text: 'Permission Control', link: '/enUS/web-guide/basic-config/permission-control' },
            { text: 'Custom Theme', link: '/enUS/web-guide/basic-config/custom-theme' },
            { text: 'Environment Variables', link: '/enUS/web-guide/basic-config/env-variable' },
          ],
        },
        {
          text: 'Extended Use',
          items: [
            { text: 'Using Icons', link: '/enUS/web-guide/extended-use/use-icons' },
            { text: 'Internationalization (i18n)', link: '/enUS/web-guide/extended-use/i18n' },
            { text: 'UnoCSS', link: '/enUS/web-guide/extended-use/unocss' },
          ],
        },
      ],
      '/enUS/dev/': [
        {
          text: 'Development Tools',
          items: [
            { text: 'VSCode Plugin Recommendations', link: '/enUS/dev/vc-plugins' },
          ],
        },
        {
          text: 'Development Environment',
          items: [
            { text: 'Git', link: '/enUS/dev/git' },
            { text: 'Node.js', link: '/enUS/dev/nodejs' },
            { text: 'MySQL', link: '/enUS/dev/mysql' },
          ],
        },
      ],
    },
  } as DefaultTheme.Config,
}
