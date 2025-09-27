# Environment variables

The project provides three environment variables by default, namely`.env.dev`、`.env.test`、`.env.prod`, corresponding to the development environment, test environment and production environment respectively.

## General variables

General variables are variables that should be consistent in all environments, such as project name, project root directory, etc. Define these variables in the .env file for use throughout the project.

### VITE_APP_NAME

- **type:**`string`

Project name

### VITE_BASE_URL

- **type:**`string`

This is the basic address of the backend service, for example, the address of your backend service is`http://127.0.0.1:3000`, then you should set this value to`http://127.0.0.1:3000`。

### VITE_API_URL

- **type:**`string`

The basic path prefix used to uniformly manage all API requests.

For example, the API address of your backend service is`http://127.0.0.1:3000/admin-api`, then you should set this value to`/admin-api`。

### VITE_BASE_PATH

- **type:**`string`

The path to output of project package

### VITE_STORAGE_PREFIX

- **type:**`string`

Set globally stored prefixes, e.g.`VITE_STORAGE_PREFIX=uk2(dev)_`, then use`src\utils\storage.ts`exist`localStorage`and`sessionStorage`The data in it will be added`uk2(dev)_`Prefix, e.g.`uk2(dev)_token`。

### VITE_ROUTE_MODE

- **type:**`string`

There are two routing modes available in the project: dynamic and static

### VITE_HOME_PATH

- **type:**`string`

Set the jump address after login. Here you should configure the address that you jump immediately after login is completed. If the 404 returns to the homepage, you will also give priority to using this path.

### VITE_COPYRIGHT_INFO

- **type:**`string`

Copyright information at the bottom of the page

### VITE_DEFAULT_LANG

- **type:**`zhCN | enUS`

The language used in the project. Please refer to details[多語言配置](./i18n.md)

### VITE_LOGIN_DEFAULT_USERNAME

- **type:**`string`

The default account of the login interface is recommended to be set to empty in production environment

### VITE_LOGIN_DEFAULT_PASSWORD

- **type:**`string`

The default password for the login interface is recommended to be set to empty in production environment

### VITE_DEFAULT_PAGE_SIZE

- **type:**`number`

The amount of data displayed on each page in the paging list

### VITE_DEFAULT_CURRENT_PAGE

- **type:**`number`

Page number displayed by default in the paging list

## Development Environment
Development environment variables are variables that will only be switched during development. exist`.env.dev`Configuration in the file.

### VITE_TEST_SUPER_ADMIN_USERNAME

- **type:**`string`

The user name of the super administrator in the test environment is`/permission/permission`Quickly switch users to the permissions example page.

### VITE_TEST_SUPER_ADMIN_PASSWORD

- **type:**`string`

Test the password of the super administrator in the environment,`/permission/permission`Quickly switch users to the permissions example page.

### VITE_TEST_COMMON_USERNAME

- **type:**`string`

The user name of the general user in the test environment is`/permission/permission`Quickly switch users to the permissions example page.

### VITE_TEST_COMMON_PASSWORD

- **type:**`string`

The password of ordinary users in the test environment is`/permission/permission`Quickly switch users to the permissions example page.

## Production environment
Production environment variables are variables that are only needed when producing or building products, such as whether gzip compression is enabled, etc. exist`.env.prod`Configuration in the file.

### VITE_BUILD_COMPRESS

- **type:**`Y | N`

If your project needs to enable product compression, you can set it`VITE_BUILD_COMPRESS`and`VITE_COMPRESS_TYPE`Let's enable compression

### VITE_COMPRESS_TYPE

- **type:**`gzip | brotliCompress | deflate | deflateRaw`

Set up compression algorithm
