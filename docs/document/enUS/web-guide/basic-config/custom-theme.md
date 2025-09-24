# 自訂主題

## 界面布局

修改`src\store\app\index.ts`,修改你需要自訂的變數

- `footerText`: 設置頁尾文本，一般用來顯示版權資訊，預設為 `Copyright © 2024 chansee97`
- `theme`: 全局組件庫主題變數覆蓋，具體可參考下一個小節，預設為 `themeConfig`
- `primaryColor`: 主題色配置，預設為 `#18a058`
- `collapsed`: 是否展開或摺疊，預設為 `false`
- `grayMode`: 是否啟用灰色模式，預設為 `false`
- `colorWeak`: 是否啟用色盲模式，預設為 `false`
- `loadFlag`: 頁面重載標記，無需修改
- `showLogo`: 是否顯示logo，預設為 `true`
- `showTabs`: 是否顯示選項卡，預設為 `true`
- `showFooter`: 是否顯示頁尾，預設為 `true`
- `showProgress`: 是否顯示進度條，預設為 `true`
- `showBreadcrumb`: 是否顯示麵包屑導航，預設為 `true`
- `showBreadcrumbIcon`: 是否顯示麵包屑導航圖示，預設為 `true`
- `showWatermark`: 是否顯示浮水印，預設為 `false`
- `showSetting`: 是否顯示顯示設置窗口，預設為 `false`
- `transitionAnimation`: 過渡動畫類型，預設為 `'fade-slide'`
- `layoutMode`: 界面布局類型，預設為 `'vertical'`

## 組件庫樣式

修改`src\store\app\theme.json`,添加你需要的樣式變數，具體可參考[Naive-UI](https://www.naiveui.com/zh-CN/light/docs/customize-theme)

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
