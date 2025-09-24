# NodeJs

Node. js目前前端工程化開發必備的環境

::: tip
不推薦原生安裝，存在版本管理問題。推薦使用nvm、volta等包管理器來安裝node
:::

## 原生Node安裝

[Node官方下載](https://nodejs.org/)

檢驗安裝是否成功

```
node -v
```

## 包管理器

npm是node. js的包管理器，也是node. js的默認包管理器，但是npm下載包的速度慢，占用空間大，存在一定的問題，所以推薦使用[pnpm](https://pnpm.io/)等包管理器

```
npm install -g pnpm
```

常用命令

```
# 安裝生產依賴
pnpm add package-name
# 安裝開發依賴
pnpm add -D package-name
# 安裝指定版本
pnpm add package-name@version
# 安裝項目所有依賴 別名: i
pnpm install
# 刪除依賴 別名: rm, uninstall, un
pnpm remove package-name
# 更新依賴 別名： up, upgrade
pnpm update package-name
# 更新所有依賴
pnpm update
# 移除不需要的packages。
pnpm prune
# 運行一個在 package 定義的腳本，run可以省略
pnpm run
```

## VOLTA

[VOLTA](https://volta.sh/)同樣也是node. js的版本管理器，但是它可以支持不同項目使用不同環境，切換項目自動切換node版本。我更加推薦使用volta來管理node版本

- [volta安裝](https://docs.volta.sh/guide/getting-started)

### VOLTA常用命令

```
# 安裝 LTS 版本
volta install node
# 要安裝的工具，如'node@20'、'yarn@latest'或'you-pack@^14.4.3'。
volta install <tool[@version]>
# 固定項目的運行時或包管理器,如'node@lts'或'yarn@^1.14'。
volta pin <tool[@version]>
# 卸載指定工具
volta uninstall <tool>
# 列出所有已安裝的工具
volta list
# 幫助
volta help
```

## NVM

[NVM](https://github.com/nvm-sh/nvm)是node. js的版本管理器

- [Mac安裝](https://github.com/nvm-sh/nvm#installing-and-updating)
- [windows安裝](https://github.com/coreybutler/nvm-windows/releases)

### NVM源配置

在你安裝的目錄下找到settings.txt文件，打開後加上，不加上無法安裝低版本node

```
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

也可以使用nvm命令行來設置

```
nvm node_mirror https://npmmirror.com/mirrors/node/
nvm npm_mirror https://npmmirror.com/mirrors/npm/
```

### NVM常用命令

```
nvm list 查看已經安裝的版本
nvm list installed 查看已經安裝的版本
nvm list available 查看網路可以安裝的版本
nvm version 查看當前的版本
nvm install 安裝最新版本nvm
nvm use <version> ## 切換使用指定的版本node
nvm ls 列出所有版本
nvm current顯示當前版本
nvm alias <name> <version> ## 給不同的版本號添加別名
nvm unalias <name> ## 刪除已定義的別名
nvm reinstall-packages <version> ## 在當前版本node環境下，重新全局安裝指定版本號的npm包
nvm on 打開nodejs控制
nvm off 關閉nodejs控制
nvm proxy 查看設置與代理
nvm node_mirror [url] 設置或者查看setting.txt中的node_mirror，如果不設置的預設是 https://nodejs.org/dist/
nvm npm_mirror [url] 設置或者查看setting.txt中的npm_mirror,如果不設置的話預設的是： https://github.com/npm/npm/archive/.
nvm uninstall <version> 卸載制定的版本
nvm use [version] [arch] 切換制定的node版本和位數
nvm root [path] 設置和查看root路徑
```

### 切換版本範例

```
$ nvm use 16
Now using node v16.9.1 (npm v7.21.1)
$ node -v
v16.9.1
$ nvm use 14
Now using node v14.18.0 (npm v6.14.15)
$ node -v
v14.18.0
$ nvm install 12
Now using node v12.22.6 (npm v6.14.5)
$ node -v
v12.22.6
```
