# Use diagram

## vue file

### Local icon in the template (effective offline)

This project uses[unplugin-icons](https://github.com/unplugin/unplugin-icons#auto-importing)Automatically introduce`@iconify-json/icon-park-outline`Illustration, recommended to go[icones](https://icones.js.org/collection/icon-park-outline)Find the illustration you need

For example, you found a diagram`home`, Must use`<{collection}-{icon} />`format to introduce it, otherwise it is invalid.

```vue
// usage
<icon-park-outline-home />

<IconParkOutlineHome />

// modify style
<icon-park-outline-home style="font-size: 2em; color: red" />

// modify style by Unocss
<icon-park-outline-home class="text-red text-2em" />
```

:::tip
Recommended use[Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify)Plugins improve development experience
:::

### Internet diagram in the template (offline is invalid)

The project also provides the function of automatically loading network diagrams, which can be used[icones](https://icones.js.org/)All illustrations in`icon-park-outline`Series, this function is based on[@iconify/vue](https://iconify.design/docs/icon-components/vue/)and[n-icon](https://www.naiveui.com/zh-CN/light/components/icon)Achieved. **This method illustration will not be automatically packaged into the project. Offline invalid**

For example, you found a diagram`icon-park-outline:user`

```vue
// usage
<nova-icon icon="icon-park-outline:user" />

// modify style
<nova-icon icon="icon-park-outline:user" :color="red" :size="22" />
```

::: details Props type declaration
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

## ts file

### Local icon in ts (effective offline)

Some scenarios may not be able to use components directly to use the illustration, such as in the ts file or vue file.`script`Add some graphic renderings with Naive components, and you need to use the graphic through manual introduction.

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

### TS network circuit diagram (offline invalid)

The same as the above scene, but the illustration is loaded through the network

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

:::tip
`renderIcon`Return one[h函數](https://cn.vuejs.org/api/render-function.html#h)Packed`@iconify/vue`, not to return directly`VNode`Node, as needed, its usage may be`renderIcon('{collection}:{icon}')`or`renderIcon('{collection}:{icon}')()`The latter method is to return directly`VNode`node.
:::

## svg diagram

This project uses[unplugin-icons](https://github.com/unplugin/unplugin-icons#auto-importing)To automatically introduce svg illustration, first you need to`src/assets/svg-icons`Add svg diagram

For example, you added a`logo.svg`, In this way, the name you introduced in the project must conform to the format`svg-icons-{name}`

```vue
// usage
<svg-icons-logo />

// modify style by Unocss
<svg-icons-logo class="text-2em" />
```

:::tip

For visual aesthetics, the svg image is preset to 1.2em size, which you can modify by`build\plugins.ts`To change this default behavior

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

### Dynamically introduce local svg diagrams

Sometimes it may be necessary to dynamically introduce svg illustrations, which need to be used at this time.`renderIcon`The function, the name of the incoming diagram must be`local:`The logo starts with

```ts
import { renderIcon } from '@/utils'

// 自動引入 `/src/assets/svg-icons/logo.svg`
renderIcon('local:logo', { size: 20 })
```

Use in templates`nova-icon`Components to introduce

```vue
// usage
<nova-icon icon="local:cool" />

// modify style
<nova-icon icon="local:cool" :color="red" :size="22" />
```
