# BaseEntity Base Entity Class

`BaseEntity`is a basic entity class that is used to standardize the structure of database entities throughout the application. It contains common basic fields that are often used to track the status of an entity, create and update information, and soft delete functions.

## Field description

| Column Name | Library Field | Type | Description | Constraints | Preset Values ​​|
| ------- | --------- | ---- | ---- | ---- | ------ |
| `remark` | `remark`| string | Notes | Length 255, available | - |
| `status` | `status`| number | status value | tinyint | 1 |
| `isDeleted` | `is_deleted`| number | Whether to delete the tag | tinyint | 0 |
| `creator` | `creator`| string | Create a person ID | bigint, can be empty | - |
| `createTime` | `create_time`| Date | Settlement time | datetime | CURRENT_TIMESTAMP |
| `updater` | `updater`| string | update person ID | bigint, can be empty | - |
| `updateTime` | `update_time`| Date | Update time | datetime, available | - |

## State value description

### status column
- `0`: Disabled status
- `1`: Enabled status (preset value)

### isDeleted column
- `0`: Not deleted (preset value)
- `1`: Deleted

## Automatic timestamp

### createTime
- Automatically set to the current time stamp when entity is created
- use`CURRENT_TIMESTAMP`As a preset value
- Not empty

### updateTime
- Automatically update to the current time stamp when the entity is updated
- use`onUpdate: 'CURRENT_TIMESTAMP'`Configuration
- Can be null (maybe empty when initially created)

## How to use

### Inherited use

Other entity classes can be inherited`BaseEntity`To get these basic fields:

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50, comment: '使用者名稱' })
  username: string

  // 其他特定欄位...
}
```

### Soft Delete Function

pass`isDeleted`The column implements soft deletion function:

```typescript
// 查詢未刪除的紀錄
const users = await userRepository.find({
  where: { isDeleted: 0 }
})

// 軟刪除記錄
await userRepository.update(id, { isDeleted: 1 })
```

### Status Management

pass`status`Enable/disabled status of field management entities:

```typescript
// 查詢啟用的紀錄
const activeUsers = await userRepository.find({
  where: { status: 1, isDeleted: 0 }
})

// 禁用記錄
await userRepository.update(id, { status: 0 })
```

## Database constraints

- `remark`: Maximum length 255 characters, can be empty
- `status`: tinyint type, with a preset value of 1
- `isDeleted`: tinyint type, the default value is 0
- `creator`: bigint type, can be empty, used to store user ID
- `createTime`: datetime type, automatically set to the current time
- `updater`: bigint type, can be empty, used to store updater ID
- `updateTime`: datetime type, can be empty, automatically updated

## Things to note

1. **Primary key**:`BaseEntity`The primary key column does not include, inherited entities need to define the primary key by themselves
2. **Index**: It is recommended to`isDeleted`and`status`Create indexes on columns to improve query performance
3. **Timestamp**:`createTime`and`updateTime`Automatically managed by the database without manual settings
4. **Soft Deletion**: Remember to filter deleted records when querying (`isDeleted = 0`）
5. **Status Management**: State change rules that need to be considered in business logic

## Relationship with BaseReqDto

`BaseEntity`and`BaseReqDto`Correspondingly, but there are some important differences:

- `BaseEntity`Used for library mapping, including library constraints and preset values
- `BaseReqDto`Used to request verification, including verification rules and transformation logic
- Both contain the same basic field, but have different uses and configurations.
