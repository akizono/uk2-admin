# 使用圖示

## vue文件

### 模板中本地圖標（離線有效）

本項目使用[unplugin-icons](https://github.com/unplugin/unplugin-icons#auto-importing)來自動引入`@iconify-json/icon-park-outline`圖示,推薦前往[icones](https://icones.js.org/collection/icon-park-outline)來尋找你需要的圖示

例如，你找到一個圖示`home`，必須使用`<{collection}-{icon} />`格式來引入它，否則無效。

```vue
// usage
<icon-park-outline-home />

<IconParkOutlineHome />

// modify style
<icon-park-outline-home style="font-size: 2em; color: red" />

// modify style by Unocss
<icon-park-outline-home class="text-red text-2em" />
```

::: tip
推薦使用[Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify)插件提高開發體驗
:::

### 模板中網路圖示（離線無效）

項目中也提供了自動載入網路圖示的功能，可以使用[icones](https://icones.js.org/)中的所有圖示，而不再局限於`icon-park-outline`系列，此功能是基於[@iconify/vue](https://iconify.design/docs/icon-components/vue/)和[n-icon](https://www.naiveui.com/zh-CN/light/components/icon)實現的。**該方式圖示不會被自動打包到項目中。離線無效**

例如，你找到一個圖示`icon-park-outline:user`

```vue
// usage
<nova-icon icon="icon-park-outline:user" />

// modify style
<nova-icon icon="icon-park-outline:user" :color="red" :size="22" />
```

::: details Props類型聲明
```ts
interface iconPorps {
  /* 圖示名稱 */
  icon?: string
  /* 圖示顏色 */
  color?: string
  /* 圖示大小 */
  size?: number
  /* 圖示深度 */
  depth?: 1 | 2 | 3 | 4 | 5
}
```
:::

## ts文件

### ts中本地圖標（離線有效）

些場景可能無法直接使用組件的方式來使用圖示，比如在ts文件或者vue文件的`script`中配合Naive組件添加一些圖示渲染, 這時需要透過手動引入的方式來使用圖示

```ts
import IconRedo from '~icons/icon-park-outline/redo'

const options = [
  {
    label: '刷新',
    key: 'reload',
    icon: () => h(IconRedo),
  }
]
```

### TS中網路圖示（離線無效）

與上面場景一樣，但是圖示透過網路載入

```ts
import { renderIcon } from '@/utils'

const options = [
  {
    label: '刷新',
    key: 'reload',
    icon: renderIcon('icon-park-outline:redo'),
  }
]
```

::: tip
`renderIcon`返回一個用 [h函數](https://cn.vuejs.org/api/render-function.html#h) 包裹的`@iconify/vue`，並不是直接返回`VNode`節點，根據需要,它的用法可能是`renderIcon('{collection}:{icon}')`或者`renderIcon('{collection}:{icon}')()`,後一種方法是直接返回`VNode`節點。
:::

## svg圖示

本項目使用[unplugin-icons](https://github.com/unplugin/unplugin-icons#auto-importing)來自動引入svg圖示，首先你需要在`src/assets/svg-icons`中加入svg圖示

例如，你添加了一個`logo.svg`,這樣在項目中使用,自定引入的名字需符合格式`svg-icons-{name}`

```vue
// usage
<svg-icons-logo />

// modify style by Unocss
<svg-icons-logo class="text-2em" />
```

::: tip

為了視覺美觀，svg圖示預設為1.2em大小，你可用通過修改`build\plugins.ts`來更改這個默認行為

```ts
// auto import iconify's icons
Icons({
  defaultStyle: 'display:inline-block',
  compiler: 'vue3',
  customCollections: {
    'svg-icons': FileSystemIconLoader(
      'src/assets/svg-icons',
      svg => svg.replace(/^<svg /, '<svg fill="currentColor" width="1.2em" height="1.2em"')
    ),
  },
})
```
:::

### 動態引入本地svg圖示

有時可能需要動態引入svg圖示，這時需要使用`renderIcon`函數，傳入的圖示名字必須以`local:`標識作為開頭

```ts
import { renderIcon } from '@/utils'

// 自動引入 `/src/assets/svg-icons/logo.svg`
renderIcon('local:logo', { size: 20 })
```

在模板中則使用`nova-icon`組件來引入

```vue
// usage
<nova-icon icon="local:cool" />

// modify style
<nova-icon icon="local:cool" :color="red" :size="22" />
```
