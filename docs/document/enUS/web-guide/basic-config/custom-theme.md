# Custom theme

## Interface layout

Revise`src\store\app\index.ts`, modify the variables you need to customize

- `footerText`: Set the end of the page text, which is generally used to display copyright information, and is preset to`Copyright © 2024 chansee97`
- `theme`: Global component library topic variable coverage, please refer to the next section for details, preset as`themeConfig`
- `primaryColor`: Theme color configuration, preset to`#18a058`
- `collapsed`: Whether to expand or collapse, preset to`false`
- `grayMode`: Whether to enable gray mode, preset to`false`
- `colorWeak`: Whether to enable color blind mode, preset to`false`
- `loadFlag`: Page overload tags, no modification required
- `showLogo`: Whether to display the logo, preset to`true`
- `showTabs`: Whether to display the tab, preset to`true`
- `showFooter`: Whether to display the end of the page, preset to`true`
- `showProgress`: Whether to display the progress bar, preset to`true`
- `showBreadcrumb`: Whether to display breadcrumb navigation, preset to`true`
- `showBreadcrumbIcon`: Whether to display the breadcrumb navigation diagram, preset to`true`
- `showWatermark`: Whether to display a watermark, preset to`false`
- `showSetting`: Whether to display the display setting window, preset to`false`
- `transitionAnimation`: Transition animation type, preset to`'fade-slide'`
- `layoutMode`: Interface layout type, preset to`'vertical'`

## Component library styles

Revise`src\store\app\theme.json`, add the style variables you need, please refer to[Naive-UI](https://www.naiveui.com/zh-CN/light/docs/customize-theme)

```json
{
  "common": {
    "primaryColor": "#20a6b3",
    "primaryColorHover": "#24b4c1",
    "primaryColorPressed": "#1c929d",
    "primaryColorSuppl": "#20a6b3",

    "infoColor": "#2080f0",
    "infoColorHover": "#4098fc",
    "infoColorPressed": "#1060c9",
    "infoColorSuppl": "#4098fc",

    "successColor": "#18a058",
    "successColorHover": "#36ad6a",
    "successColorPressed": "#0c7a43",
    "successColorSuppl": "#36ad6a",

    "warningColor": "#f0a020",
    "warningColorHover": "#fcb040",
    "warningColorPressed": "#c97c10",
    "warningColorSuppl": "#fcb040",

    "errorColor": "#d03050",
    "errorColorHover": "#de576d",
    "errorColorPressed": "#ab1f3f",
    "errorColorSuppl": "#de576d"
  }
}
```
