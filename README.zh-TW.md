<div align="center">
<img src="https://s2.loli.net/2025/09/27/rN84dp3uh1TWBlJ.png" style="width:150px"/>
    <h1>UK2 Admin</h1>
</div>
<div align="center">
    <img src="https://img.shields.io/github/license/akizono/uk2-admin"/>
    <img src="https://badgen.net/github/stars/akizono/uk2-admin?icon=github"/>
    <img src="https://img.shields.io/github/forks/akizono/uk2-admin"/>
</div>

<div align='center'>
  [English](./README.md) | 中文
</div>

## 介紹

UK2-admin 是一個基於Nest.js、Vue3、Vite6、Typescript、Naive UI 的全棧後台管理系統，用簡單的方式實現完整功能，並盡可能的考慮代碼規範，易讀易理解無過度封裝，方便二次開發。

需要注意的是，這個專案的功能大多來源於我個人的開發需求，可能帶有一定的主觀傾向，算不上“通用”，但也正因如此，或許恰好能契合你的使用場景。如果你也在找一個直接、不複雜、又方便二次開發的管理模板，不妨試一試這個專案。於是我決定開源出來，期待能遇到有相似需求的開發者。

## 專案說明

UK2-admin 基於 Nova-admin 進行輕量二次開發，整合了作者自己編寫的 [Nest.js 後端](https://github.com/akizono/uk2-admin-nest)。它延續了清晰簡潔的結構設計與易於理解的代碼風格，沒有過度封裝，便於快速上手和訂製擴展。

需要注意的是，這個專案的功能大多來源於我個人的開發需求，可能帶有一定的主觀傾向，算不上“通用”，但也正因如此，或許恰好能契合你的使用場景。如果你也在找一個直接、不複雜、又方便二次開發的管理模板，不妨試一試這個專案。於是我決定開源出來，期待能遇到有相似需求的開發者。

### 這個版本的演變主要包括以下內容

- 使用 Axios 替換了 Alova
- 完善的前後端代碼，例如菜單、權限、用戶、角色、部門、字典、日誌、文件管理等。
- 基於個人的使用場景，封裝了通用的 DataTable組件。

## 專案預覽

![preview-1.png](https://s2.loli.net/2025/09/27/j6UuvLYSVHEcq8X.png)
![preview-2.jpg](https://s2.loli.net/2025/09/27/3IMqzjLOEWhVHy5.png)
![preview-3.png](https://s2.loli.net/2025/09/27/dUiL3mgnDy4tRzp.png)
![preview-4.png](https://s2.loli.net/2025/09/27/IniYhGKx6AvZ9kq.png)

## 代碼倉庫

- [Github](https://github.com/akizono/uk2-admin)

## 安裝使用

本地開發環境建議使用 pnpm 8.x 、Node.js 必須 20.x

推薦直接下載[Releases](https://github.com/chansee97/nova-admin/releases)壓縮包

```bash
# install dependencies
pnpm i

# Run
pnpm dev

# Build product
pnpm build

```

## 相關專案

- [UK2-admin-nest](https://github.com/akizono/uk2-admin-nest) 基於TS, NestJs, typeorm的UK2-Admin配套後台專案

## 貢獻

如果您發現了任何問題或有改進建議，請創建一個[issue](uk2-admin/issues/new)或提交一個PR。我們歡迎您的貢獻！

## 協議

[MIT](LICENSE)
