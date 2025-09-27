# introduce

## Project Introduction

based on`Nest.js` + `TypeScript` + `TypeORM` + `MySQL`A modern Node.js management system backend built to provide API support for UK2-admin (front-end project).

Integrate Swagger file automatic generation, operation log tracking, and supports dynamic column multilingual configuration, ready for use out of the box.

## Project description

This project is the backend part of UK2-admin.

Current development progress:

| Development Status | Functions | Description |
| ------ | -------- | ------------------------------------------------------------ |
| ✅ | User Management | The user is the system operator, and this function mainly completes the system user configuration |
| ✅ | Department Management | Configure the system organization (company, department, group), and the tree structure displays support data permissions |
| ✅ | Dictionary Management | Maintain some more fixed data that is often used in the system |
| ✅ | Operation log | System normal operation log recording and query, integrated Swagger to generate log content |
| ✅ | Menu Management | Configure system menus, operation permissions, button permissions identification, etc., local cache provides performance |
| ✅ | Role Management | Role menu permission allocation, setting roles to divide data scope permissions by institution |
| ✅ | Column internationalization | Any column of a data table can be internationalized |
| ✅ | Swagger | Integrated Swagger Generate API Files |
| ❌ | Code generation | Generate corresponding addition, deletion, modification and search code according to the database table structure, and generate the front-end page |
| ❌ | Redis | Integrated Redis Cache Data |
| ❌ | Notices and Announcements | System Notices and Announcements Information Release and Maintenance |
| ❌ | Site message | Message notifications within the system, providing in-site message templates and in-site message messages |

## Quick Start

:::tip
Before starting the project, make sure your development environment is installed[Node.js](../../dev/nodejs)and[MySQL](../../dev/mysql)
:::
