# BaseReqDto Basic Request Data Transfer Object

`BaseReqDto`is a basic request data transfer object (DTO) used to standardize the structure of request objects throughout the application. It contains common basic fields that are often used to track the status of an entity, create and update information.

## Field description

| Column Name | Type | Description | Verification | Notes |
| ------- | ---- | ---- | ---- | ---- |
| `remark`| string | Notes | Optional, string | Additional instructions for storing entities |
| `status`| number | Status value | Optional, number | Indicates the current status of the entity |
| `isDeleted`| number | Whether to delete the tag | Optional, number | Used for soft deletion function, 0 means not deleted, 1 means deleted |
| `creator`| string | Create person ID | Optional, convert through BigInt | Record the user ID that created the entity |
| `createTime`| Date | Create time | Optional, date string | Recording the timestamp created by the entity |
| `updater`| string | Updater ID | Optional, convert through BigInt | Record the user ID that was last updated on the entity |
| `updateTime`| Date | Update time | Optional, date string | Record the last updated time stamp of the entity |
| `multilingualFields`| string[] | Multilingual column list | Optional, array | Only used when front-end query enables multilingual function |

## Disable the editing bar

The system defines a set of columns that prohibit direct editing, which are usually automatically managed by the system:

```typescript
export const disableEditFields = ['isDeleted', 'creator', 'createTime', 'updater', 'updateTime'] as const
```

These fields should not be modified in general update operations, but should be automatically maintained by the system.

## How to use

### Inherited use

Other DTO classes can be inherited`BaseReqDto`To get these basic fields:

```typescript
import { BaseReqDto } from '@/common/dtos/base.req.dto'

export class UserDto extends BaseReqDto {
  @ApiProperty({ description: '使用者名稱' })
  @IsString()
  username: string

  // 其他特定欄位...
}
```

### Multilingual support

When the current query requires multilingual support, it can be included in the request.`multilingualFields`Columns, specify which columns require multilingual processing:

```json
// 前端請求範例
{
  "status": 1,
  "multilingualFields": ["title", "description"]
}
```

## Data Verification

`BaseReqDto`use`class-validator`and`class-transformer`Perform data verification and conversion:

- All fields are marked as`@IsOptional()`, means that it can be omitted in the request
- A specific type of field uses the corresponding verification decorator, such as`@IsString()`、`@IsNumber()`、`@IsDateString()`
- `creator`and`updater`Use custom fields`ParseBigIntPipe`Convert to support large integer IDs

## Swagger Files

All fields are used`@ApiProperty()`The decorator has added a description to display relevant information in the Swagger API file.
