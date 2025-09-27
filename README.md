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

  English |  [Traditional Chinese](./README.zh-TW.md)
</div>

## introduce

UK2-admin is a full-stack background management system based on Nest.js, Vue3, Vite6, Typescript, and Naive UI. It implements complete functions in a simple way and considers code specifications as much as possible. It is easy to read, understand, and does not over-encapsulate, making it convenient for secondary development.

It should be noted that most of the functions of this project come from my personal development needs, and may have a certain subjective tendency and are not "universal", but for this reason, it may just fit your usage scenario. If you are also looking for a direct, non-complex and convenient management template that is convenient for secondary development, you might as well give this project a try. So I decided to open source and look forward to meeting developers with similar needs.

## Special project description

UK2-admin is based on Nova-admin for lightweight secondary development, integrating the author's own writing.[Nest.js 後端](https://github.com/akizono/uk2-admin-nest). It continues the clear and concise structural design and easy-to-understand code style, without over-encapsulation, making it easy to get started and customize.

It should be noted that most of the functions of this project come from my personal development needs, and may have a certain subjective tendency and are not "universal", but for this reason, it may just fit your usage scenario. If you are also looking for a direct, non-complex and convenient management template that is convenient for secondary development, you might as well give this project a try. So I decided to open source and look forward to meeting developers with similar needs.

### The evolution of this version mainly includes the following

- Replaced Alova with Axios
- Complete front-end and back-end code, such as menus, permissions, users, roles, departments, dictionaries, logs, file management, etc.
- Based on personal usage scenarios, a general DataTable component is encapsulated.

## Project Preview

![preview-1.png](https://s2.loli.net/2025/09/27/j6UuvLYSVHEcq8X.png)
![preview-2.jpg](https://s2.loli.net/2025/09/27/3IMqzjLOEWhVHy5.png)
![preview-3.png](https://s2.loli.net/2025/09/27/dUiL3mgnDy4tRzp.png)
![preview-4.png](https://s2.loli.net/2025/09/27/IniYhGKx6AvZ9kq.png)

## Code Repository

- [Github](https://github.com/akizono/uk2-admin)

## Install and use

It is recommended to use pnpm 8.x and Node.js. It is necessary to use 20.x in local development environment.

Recommended to download directly[Releases](https://github.com/chansee97/nova-admin/releases)Compressed package

```bash
# install dependencies
pnpm i

# Run
pnpm dev

# Build product
pnpm build

```

## Related projects

- [UK2-admin-nest](https://github.com/akizono/uk2-admin-nest)UK2-Admin supporting backend project based on TS, NestJs, typeorm

## contribute

If you find any issues or have suggestions for improvement, please create one[issue](uk2-admin/issues/new)Or submit a PR. We welcome your contribution!

## protocol

[MIT](LICENSE)
