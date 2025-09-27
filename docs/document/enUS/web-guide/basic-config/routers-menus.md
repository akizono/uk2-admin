# Routing and Menu

Unlike Nova-admin's way of writing routes in code, UK2-admin has connected to the Nest.js backend, all routes, menus and permissions are passed.`/system/menu`The page is managed uniformly.

Manage routing and menus through a visual interface to make permission configuration more intuitive and efficient.

## Create a new route

1. Enter **System Management → Menu Management** (`/system/menu`)
2. Click the **Add Menu** button
3. Fill in the form information
4. Click **Submit** to complete the creation

### Field description

#### Basic information

| Column | Description |
| ------------ | -------------------------------------------- |
| **Parent menu** | Create a menu hierarchy relationship, and after selection, it will become a child of the menu |
| **Menu Title** | Name displayed in the page (supports to fill in multiple languages) |
| **Menu Code** | **Unique ID of the route**, must maintain global uniqueness |

#### Menu Type

Selecting a different type will affect subsequent configuration options:

- **Table of contents**

Used to organize menu structures, pages without actual functions

- **page**

Specific function operation page

- **Button**

Used for permission control, you need to configure permission identifier after selection

*For specific usage methods, please refer to Permission Management*

### Advanced configuration

| Configuration Items | Function Description |
| ------------------ | ---------------------------------------- |
| **Menu Illustration** | Select the icon displayed in the sidebar |
| **Outside link** | After filling in, click on the menu to jump to external link |
| **Cached or not** | After enabled, the page will be cached and will be automatically cleared when the tab is closed |
| **Show in the TAB column** | Controls whether it is displayed in the top tab bar |
| **Resident TAB column** | After setting it to resident, the tab page cannot be closed |
| **Show in the side directory** | Controls whether it is displayed in the side navigation bar |
| **Sort** | Set menu display order (the smaller the number, the higher the number) |
| **Remarks** | Instructions for adding menus |
| **Status** | Enable or disable this menu |

## Edit the route

1. Enter **System Management → Menu Management** (`/system/menu`)
2. Find the route you need to edit and click the **Edit** button
3. Fill in the form information
4. Click **Submit** to finish editing

## Recommendations for use

1. **Planning menu structure**: Create a directory first, then add pages and buttons under the directory
2. **Code Naming Specification**: Use meaningful English logos to maintain uniqueness
3. **Permission Control**: The button type menu must be used with the permission identifier
4. **Cached policy**: Enable cache for frequently used pages but infrequent data updates
