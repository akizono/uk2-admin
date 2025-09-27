# Quick Start

:::tip
Before starting the project, please make sure that your development environment has installed [Node.js](../../dev/nodejs) and [MySQL](../../dev/mysql)

Follow the steps below to complete the environment configuration and project launch to ensure that the development environment is fast and ready.
:::

## initialization[MySQL](../../dev/mysql)

### 1. MySQL service starts

This project uses MySQL as a data storage solution, please make sure it is installed and started correctly[MySQL](../../dev/mysql)Database services.

### 2. Development database creation

Create a library dedicated to the development environment in MySQL, named`uk2_admin_dev`(The name can be customized according to actual needs).

### 3. Database initialization script execution

Execute the database initialization script provided by the project to complete the creation of basic data structures and import of basic data

- **Script Path**: sql/uk2_admin_dev.sql

- **Precautions**: This script supports execution in different database name environments and does not need to be strictly consistent with the database name in the configuration.

### 4. **Database connection configuration**

Modify the development environment settings file in the root directory`env.dev`, configure the correct database connection parameters.
```shell
# 資料庫類型，不需要修改
DB_TYPE = 'mysql'

# 資料庫地址
DB_HOST = '127.0.0.1'

# 資料庫埠
DB_PORT = 3306

# 資料庫名稱
DB_NAME = 'uk2_admin_dev'

# 資料庫使用者名稱
DB_USERNAME = 'root'

# 資料庫密碼
DB_PASSWORD = '123456'
```
:::tip
1. Parameter DB_TYPE is a fixed value, no modification is required

2. If you use a non-default database name in step 2, make sure that the DB_NAME parameter is exactly the same as the database name you actually created.

3. When deploying a production environment, be sure to modify the preset database credentials to adopt a safer authentication method.
:::

## Start a special project

### Copy project

Please go to the directory where you want to install the project and execute the following Git command on the terminal to obtain the project original code:

```shell
git clone https://github.com/akizono/uk2-admin-nest.git
```

### Dependency kit installation
After entering the project directory, it is recommended to use pnpm to install the dependency kit (if pnpm is not installed, you can also use npm instead)

:::code-group
```shell[pnpm]
cd ./uk2-admin-nest
pnpm install
```
```shell[npm]
cd ./uk2-admin-nest
npm install
```
:::

### Project launch

1. use[VSCode](https://code.visualstudio.com/)Open the project root directory uk2-admin-nest

2. Execute the development startup command through the built-in terminal:
:::code-group
```shell[pnpm]
pnpm start:dev
```
```shell[npm]
npm run start:dev
```
:::
