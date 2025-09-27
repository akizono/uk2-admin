# NodeJs

Node.js is an essential environment for modern front-end engineering development.

::: tip
Native installation is not recommended due to version management issues. It is advised to use package managers like nvm or volta to install Node.js.
:::

## Native Node Installation

[Official Node.js Download](https://nodejs.org/)

Verify if the installation is successful:

```
node -v
```

## Package Managers

npm is the default package manager for Node.js. However, npm has drawbacks such as slow download speeds and high disk space usage. Therefore, it is recommended to use alternative package managers like [pnpm](https://pnpm.io/).

```
npm install -g pnpm
```

常用命令

```
# Install production dependency
pnpm add package-name
# Install development dependency
pnpm add -D package-name
# Install a specific version
pnpm add package-name@version
# Install all project dependencies (alias: i)
pnpm install
# Remove a dependency (aliases: rm, uninstall, un)
pnpm remove package-name
# Update a dependency (aliases: up, upgrade)
pnpm update package-name
# Update all dependencies
pnpm update
# Remove unnecessary packages
pnpm prune
# Run a script defined in package (the 'run' keyword can be omitted)
pnpm run
```

## VOLTA

[VOLTA](https://volta.sh/) is also a version manager for Node.js, but it supports using different environments for different projects and automatically switches the Node version when switching projects. I highly recommend using Volta to manage Node versions.

- [Volta Installation](https://docs.volta.sh/guide/getting-started)

### Common VOLTA Commands

```
# Install the LTS version
volta install node
# Install a tool, such as 'node@20', 'yarn@latest', or 'your-package@^14.4.3'.
volta install <tool[@version]>
# Pin the runtime or package manager for a project, e.g., 'node@lts' or 'yarn@^1.14'.
volta pin <tool[@version]>
# Uninstall a specified tool
volta uninstall <tool>
# List all installed tools
volta list
# Help
volta help
```

## NVM

[NVM](https://github.com/nvm-sh/nvm) is a version manager for Node.js.

- [Mac Installation](https://github.com/nvm-sh/nvm#installing-and-updating)
- [Windows Installation](https://github.com/coreybutler/nvm-windows/releases)

### NVM Source Configuration

Locate the `settings.txt` file in your installation directory, open it, and add the following. Without these settings, you won't be able to install older Node.js versions.

```
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

You can also set these using nvm commands:

```
nvm node_mirror https://npmmirror.com/mirrors/node/
nvm npm_mirror https://npmmirror.com/mirrors/npm/
```

### Common NVM Commands

```
nvm list                  View installed versions
nvm list installed        View installed versions
nvm list available        View versions available for installation online
nvm version               Check the current version
nvm install               Install the latest version of nvm
nvm use <version>         Switch to use the specified Node.js version
nvm ls                    List all versions
nvm current               Display the current version
nvm alias <name> <version>  Assign an alias to a specific version number
nvm unalias <name>        Remove a defined alias
nvm reinstall-packages <version>  Reinstall global npm packages for the specified version in the current Node.js environment
nvm on                    Enable Node.js control
nvm off                   Disable Node.js control
nvm proxy                 View or set proxy settings
nvm node_mirror [url]     Set or view node_mirror in settings.txt (default is https://nodejs.org/dist/)
nvm npm_mirror [url]      Set or view npm_mirror in settings.txt (default is https://github.com/npm/npm/archive/)
nvm uninstall <version>   Uninstall the specified version
nvm use [version] [arch]  Switch to the specified Node.js version and architecture
nvm root [path]           Set and view the root path
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
