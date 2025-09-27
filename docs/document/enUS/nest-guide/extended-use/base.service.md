# BaseService Basic Service Class

`BaseService`It is the core basic service category of the entire project, providing standardized CRUD operations and business logic processing. It encapsulates common database operation modes, including creation, query, update and delete functions, and integrates advanced functions such as multilingual support, foreign key verification, and repeatability checking.

## Core functions

### 1. Create an operation (`create`)

Used to create new entity records, including complete pre-verification and error handling.

#### Parameter description

| Parameters | Type | Description | Required |
| ---- | ---- | ---- | ---- |
| `dto` | `Record<string, any>`| Parameters received by the backend | ✅ |
| `repository` | `Repository<any>`| Repository for database operation | ✅ |
| `repeatCondition` | `string[]`| Fields that query whether there are duplicate data | ❌ |
| `modalName` | `string`| Module name (for error message) | ✅ |
| `foreignKeyChecks` | `Array<{field, repository, modalName}>`| Foreign key check configuration | ❌ |

#### Usage example

```typescript
// 基本創建
const user = await create({
  dto: { username: 'john', email: 'john@example.com' },
  repository: userRepository,
  modalName: '用戶'
})

// 帶重複檢查的創建
const user = await create({
  dto: { username: 'john', email: 'john@example.com' },
  repository: userRepository,
  repeatCondition: ['username', 'email'],
  modalName: '用戶'
})

// 帶外鍵檢查的創建
const order = await create({
  dto: { userId: 1, productId: 2, quantity: 1 },
  repository: orderRepository,
  modalName: '訂單',
  foreignKeyChecks: [
    { field: 'userId', repository: userRepository, modalName: '用戶' },
    { field: 'productId', repository: productRepository, modalName: '產品' }
  ]
})
```

### 2. Query operation (`find`)

Supports complex query functions such as pagination query, association query and multilingual query.

#### Parameter description

| Parameters | Type | Description | Required |
| ---- | ---- | ---- | ---- |
| `dto` | `Record<string, any>`| Query parameters | ✅ |
| `repository` | `Repository<any>`| Repository for database operation | ✅ |
| `relations` | `string[]`| Fields that require association query | ❌ |
| `where` | `Record<string, any>`| Extra Query Conditions | ❌ |

#### Special features

- **Pagination support**: Automatic processing`pageSize`and`currentPage`parameter
- **Multi-language query**: Support`multilingualFields`Parameters for multilingual content query
- **Association query**: Supports the relationships function of TypeORM

#### Usage example

```typescript
// 基本分頁查詢
const result = await find({
  dto: { pageSize: 10, currentPage: 1, status: 1 },
  repository: userRepository,
  modalName: '用戶'
})

// 關聯查詢
const result = await find({
  dto: { pageSize: 10, currentPage: 1 },
  repository: orderRepository,
  relations: ['user', 'product'],
  modalName: '訂單'
})

// 多語言查詢
const result = await find({
  dto: {
    pageSize: 10,
    currentPage: 1,
    multilingualFields: ['title', 'description'],
    title: '多語言標題'
  },
  repository: articleRepository,
  modalName: '文章'
})
```

### 3. Single query (`findOne`)

Query a single record by ID, supporting associated queries and multilingual content.

#### Parameter description

| Parameters | Type | Description | Required |
| ---- | ---- | ---- | ---- |
| `id` | `string`| Record ID | ✅ |
| `repository` | `Repository<any>`| Repository for database operation | ✅ |
| `relations` | `string[]`| Fields that require association query | ❌ |
| `where` | `Record<string, any>`| Extra Query Conditions | ❌ |

#### Usage example

```typescript
// 基本查詢
const user = await findOne({
  id: '1',
  repository: userRepository
})

// 關聯查詢
const order = await findOne({
  id: '1',
  repository: orderRepository,
  relations: ['user', 'product']
})
```

### 4. Update operation (`update`)

Update existing records, including presence checks and repetitive checks.

#### Parameter description

| Parameters | Type | Description | Required |
| ---- | ---- | ---- | ---- |
| `dto` | `Record<string, any>`| Update parameters (must include id) | ✅ |
| `repository` | `Repository<any>`| Repository for database operation | ✅ |
| `existenceCondition` | `string[]`| Existence check field | ❌ |
| `repeatCondition` | `string[]`| Repeat check field | ❌ |
| `modalName` | `string`| Module name | ✅ |

#### Usage example

```typescript
// 基本更新
await update({
  dto: { id: 1, username: 'new_username' },
  repository: userRepository,
  modalName: '用戶'
})

// 帶重複檢查的更新
await update({
  dto: { id: 1, username: 'new_username', email: 'new@example.com' },
  repository: userRepository,
  repeatCondition: ['username', 'email'],
  modalName: '用戶'
})
```

### 5. Delete operation (`_delete`)

Soft delete records, including existence checks and subkey checks.

#### Parameter description

| Parameters | Type | Description | Required |
| ---- | ---- | ---- | ---- |
| `id` | `string`| Record ID | ✅ |
| `repository` | `Repository<any>`| Repository for database operation | ✅ |
| `modalName` | `string`| Module name | ✅ |

#### Special features

- **Soft Delete**:`isDeleted`Set to 1, not physically deleted
- **Sub-item check**: Automatically check whether there are children to prevent mistaken deletion

#### Usage example

```typescript
// 基本刪除
await _delete({
  id: '1',
  repository: userRepository,
  modalName: '用戶'
})
```

## Multilingual support

BaseService has built-in multi-language support functions, which can handle query and return of multi-language content.

### Multilingual query process

1. The front-end specifies when querying`multilingualFields`parameter
2. The system is based on the query value`multilingual-fields`Find the corresponding one in the table`fieldId`
3. use`fieldId`Perform actual database query
4. Automatically attach multilingual content to query results

### Multilingual field recognition

The system checks whether the column value is`multilingual-`To identify multilingual fields at the beginning:

```typescript
// 多語言欄位值格式
{
  title: 'multilingual-12345',  // 這是一個多語言欄位
  content: 'multilingual-67890' // 這也是多語言欄位
}
```

## Important precautions and pit avoidance guide

### 1. Foreign keys check configuration

**Problem**: Foreign key checking is optional, but it is recommended to always configure it, otherwise friendly error messages cannot be provided.

```typescript
// ❌ 不推薦：沒有外鍵檢查
const order = await create({
  dto: { userId: 999, productId: 888 },
  repository: orderRepository,
  modalName: '訂單'
  // 缺少 foreignKeyChecks，會導致資料庫錯誤而非友好訊息
})

// ✅ 推薦：配置外鍵檢查
const order = await create({
  dto: { userId: 999, productId: 888 },
  repository: orderRepository,
  modalName: '訂單',
  foreignKeyChecks: [
    { field: 'userId', repository: userRepository, modalName: '用戶' },
    { field: 'productId', repository: productRepository, modalName: '產品' }
  ]
})
```

### 2. The timing of repetitive checks

**Problem**: Repeatability checks during update operations need to exclude the current record itself.

```typescript
// ✅ 正確：更新時會自動排除當前記錄
await update({
  dto: { id: 1, username: 'new_username' },
  repository: userRepository,
  repeatCondition: ['username'],
  modalName: '用戶'
})
```

### 3. Processing of pagination query

**question**:`pageSize`When it is 0, it means that there is no page, and special attention is required.

```typescript
// pageSize = 0 時會返回所有記錄
const result = await find({
  dto: { pageSize: 0, currentPage: 1 },
  repository: userRepository
})
```

### 4. Performance considerations for multilingual query

**Problem**: Multilingual queries can generate Cartesian products, which may cause performance problems.

```typescript
// ⚠️ 注意：多個多語言欄位會產生大量查詢組合
const result = await find({
  dto: {
    multilingualFields: ['title', 'description', 'content'],
    title: '標題',
    description: '描述',
    content: '內容'
  },
  repository: articleRepository
})
// 這會產生 3 個欄位的所有可能組合查詢
```

### 5. Soft deletion processing

**Problem**: All queries should filter deleted records.

```typescript
// ❌ 錯誤：可能查詢到已刪除的紀錄
const user = await userRepository.findOne({ where: { id: 1 } })

// ✅ 正確：使用 BaseService 的查詢方法
const user = await findOne({
  id: '1',
  repository: userRepository
})
```

### 6. Deletion check of father-son relationship

**Problem**: The deletion operation will automatically check whether there are children, but you need to make sure that the table has`parentId`field.

```typescript
// 系統會自動檢查以下條件：
// 1. 表是否有 parentId 欄位
// 2. 是否存在 parentId = 當前記錄 id 且 isDeleted = 0 的子項
```

### 7. Error handling

**Problem**: BaseService will throw a standard HTTP exception and need to be handled appropriately.

```typescript
try {
  const user = await create({...})
} catch (error) {
  if (error instanceof ConflictException) {
    // 處理重複數據錯誤
  } else if (error instanceof NotFoundException) {
    // 處理不存在錯誤
  } else if (error instanceof BadRequestException) {
    // 處理請求參數錯誤
  }
}
```

## Best Practices

### 1. Unified use of BaseService

```typescript
// ✅ 推薦：使用 BaseService 的方法
export class UserService {
  async createUser(dto: CreateUserDto) {
    return await create({
      dto,
      repository: this.userRepository,
      repeatCondition: ['username', 'email'],
      modalName: '用戶'
    })
  }
}

// ❌ 不推薦：直接使用 Repository
export class UserService {
  async createUser(dto: CreateUserDto) {
    const user = this.userRepository.create(dto)
    return await this.userRepository.save(user)
  }
}
```

### 2. Configure the verification conditions appropriately

```typescript
// 根據業務需求配置適當的驗證條件
const user = await create({
  dto,
  repository: userRepository,
  repeatCondition: ['username'], // 使用者名稱不能重複
  modalName: '用戶',
  foreignKeyChecks: [
    { field: 'roleId', repository: roleRepository, modalName: '角色' }
  ]
})
```

### 3. Rationally use multilingual functions

```typescript
// 只在需要時使用多語言查詢
const result = await find({
  dto: {
    multilingualFields: ['title'], // 只查詢需要的多語言欄位
    title: '標題'
  },
  repository: articleRepository
})
```

## Relationship with other basic classes

- **BaseEntity**: Define database entity structure
- **BaseReqDto**: Define request verification rules
- **BaseService**: Provide business logic processing

These three basic classes together constitute the core architecture of the project, ensuring the consistency and maintainability of the code.
