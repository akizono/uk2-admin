import type { DefaultTheme } from 'vitepress'

export const shared = {
  title: 'UK2-Admin',
  description: 'This is a management system',

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  } as DefaultTheme.Config,
}
