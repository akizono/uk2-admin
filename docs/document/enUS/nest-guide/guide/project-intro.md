# Project structure

UK2 Admin NestJS is a back-end management system developed based on the NestJS framework, providing complete user management, permission control, code generation, file management and other functions. The project adopts a modular architecture, supports multilingual columns, and integrates AI code generation functions.

## Technology stack

### Core framework
- **NestJS** - Enterprise-level application framework based on Node.js
- **TypeScript** - Typesafe JavaScript superset
- **Express** - Web Application Framework

### Database related
- **TypeORM** - TypeScript/JavaScript ORM
- **MySQL2** - MySQL library driver
- **@nestjs/typeorm** - NestJS TypeORM Integration

### Certification and security
- **@nestjs/jwt** - JWT token processing
- **class-validator** - Data Verification
- **class-transformer** - Data conversion
- **md5** - Password encryption

### API Files
- **@nestjs/swagger** - API file generation
- **swagger-ui-express** - Swagger UI interface

### AI Integration
- **openai** - OpenAI API User side

### File processing
- **multer** - File upload processing
- **@types/multer** - Multer type definition

### Tool library
- **uuid** - UUID generation
- **rxjs** - Responsive Programming
- **dotenv** - Environment variable management
- **reflect-metadata** - Metadata reflection

### Development Tools
- **@nestjs/cli** - NestJS command line tool
- **pop** - Code Generator
- **eslint** - Code Check
- **prettier** - Code formatting
- **jest** - Test framework

## Project structure

### Overall architecture
```
src/
├── common/                 # 公共模組
│   ├── decorators/        # 裝飾器
│   ├── dtos/             # 基礎 DTO
│   ├── entities/         # 基礎實體
│   ├── filters/          # 異常過濾器
│   ├── interceptors/     # 攔截器
│   ├── pipes/            # 管道
│   ├── services/         # 基礎服務
│   └── subscribers/      # 訂閱者
├── modules/              # 業務模組
│   └── platform-api/        # 管理後台 API
│       ├── system/       # 系統管理模組
│       └── operations/   # 運營管理模組
├── utils/                # 工具類
└── main.ts              # 應用入口
```

### Core features

1. **Modular design** - Adopt NestJS modular architecture, each function is independently formed into a module
2. **Permission Control** - JWT-based authentication and role-based permission control
3. **Multi-language support** - Support multi-language field storage and query
4. **Code Generation** - Integrate AI code generation functions, support automatic generation of entity and business codes
5. **File Management** - Complete file upload, storage and management functions
6. **Log System** - Complete operation logging
7. **Data Verification** - Request data verification based on class-validator

## Module details

### System Management Module (system/)

#### 1. User Management (user)
- **Function**: User account management, user information maintenance
- **entity**:`UserEntity`- Includes user name, password, nickname, mailbox, mobile phone and other columns
- **Features**: Support password encryption, user status management, and departmental association

#### 2. Authentication module (auth)
- **Function**: User login, registration, password recovery, Token management
- **characteristic**:
  - JWT dual token mechanism (Access Token + Refresh Token)
  - Support mailbox and mobile phone number verification code login/registration
  - Token Blacklist Management
  - Password recovery function

#### 3. Role Management (role)
- **Function**: Role definition and permission assignment
- **entity**:`RoleEntity`- Basic Role Information

#### 4. User Role Association (user-role)
- **Function**: Many-to-many association between users and roles
- **entity**:`UserRoleEntity`- User Role Association Table

#### 5. Menu Management (menu)
- **Function**: System menu structure management
- **entity**:`MenuEntity`- Supports tree structure menu management

#### 6. Role-menu
- **Function**: Relationship between roles and menu permissions
- **entity**:`RoleMenuEntity`- Role menu permissions association table

#### 7. Department Management (dept)
- **Function**: Organizational Structure Management
- **entity**:`DeptEntity`- Supports departmental management of tree structures

#### 8. Dictionary Management
- **dict-type**: Dictionary type management
- **dict-data**: Dictionary data management
- **Function**: System dictionary data maintenance

#### 9. Multilingual fields (multilingual-fields)
- **Function**: Multilingual content storage and management
- **entity**:`MultilingualFieldsEntity`- Multilingual column storage

#### 10. Verification code management (verify-code)
- **Function**: Verification code generation, verification and management
- **Support**: Mailbox verification code, mobile phone verification code

#### 11. Log Management (log)
- **Function**: System operation logging
- **entity**:`LogEntity`- Operation log storage

#### 12. Token blacklist (token-blacklist)
- **Function**: Blacklist management of invalid tokens
- **entity**:`TokenBlacklistEntity`- Token Blacklist Storage

### Operations management module (operations/)

#### 1. Code generation (code-generation)
- **Function**: Automatically generate AI-based code
- **characteristic**:
  - Entity code generation
  - Business code generation (Controller, Service, Module, DTO)
  - Supports preview and direct insertion of code
  - Integrated Plop Code Generator

#### 2. File Management (file)
- **Function**: File upload, storage and management
- **Feature**: Supports multiple file types and file metadata management

#### 3. Script execution log (script-execution-log)
- **Function**: Script execution record and monitoring
- **entity**:`ScriptExecutionLogEntity`- Script execution log

## Public module (common/)

### BaseEntity
```typescript
class BaseEntity {
  remark: string // 備註
  status: number // 狀態 (0:禁用 1:啟用)
  isDeleted: number // 軟刪除標記
  creator: string // 創辦人
  createTime: Date // 創建時間
  updater: string // 更新人
  updateTime: Date // 更新時間
}
```

### BaseService
Provides common CRUD operations:
- `create()`- Create data
- `find()`- Query data (supports pagination and multilingual column query)
- `findOne()`- Query a single piece of data
- `update()`- Update data
- `_delete()`- Soft delete data

### Decorators
- `@HasPermission()`- Permission Control Decorator
- `@Public()`- Public interface decorator
- `@Operation()`- Operation log decorator
- `@ResponseMessage()`- Response message decorator

### Interceptor
- `LogInterceptor`- Operation log interceptor
- `TransformInterceptor`- Response data conversion interceptor

### Filter
- `HttpExceptionFilter`- Global exception filter

## Tool class (utils/)

### AI Integration
- `chat-gpt.ts`- ChatGPT API Integration
- `deep-seek.ts`- DeepSeek API Integration

### Encryption tools
- `crypto.ts`- Password encryption tool

### Entity Tools
- `entity-utils.ts`- Entity operation tools

### Environment variables
- `env-helper.ts`- Environment variable management

### Request context
- `request-context.ts`- Request context management

### Response DTO
- `response-dto.ts`- Unified response format

### String generation
- `str-generator.ts`- Random string generation

### Token Tools
- `token-helper.ts`- JWT Token processing

### Verification code tool
- `verify-code-utils.ts`- Verification code generation and verification

## Configuration instructions

### Environment variables
The project supports multi-environment configuration, and the main environmental variables include:
- Database connection configuration
- JWT Key and Expiration Time
- CORS configuration
- File storage path
- AI API Key
- Mail Service Configuration

### Database configuration
- Using MySQL library
- Support connection pool configuration
- Automatically synchronize database structure (development environment)

## Startup Instructions

### Development Environment
```bash
pnpm start:dev
```

### Production environment
```bash
pnpm start:prod
```

### test
```bash
pnpm test
```

## Featured functions

1. **AI Code Generation** - Integrate OpenAI API to support smart code generation
2. **Multi-language support** - Complete multilingual column storage and query mechanism
3. **Permission Control** - Fine-grained permission control based on roles
4. **Code Generator** - Plop-based code template generation
5. **Complete logging system** - Operation logging and query
6. **File Management** - Complete file upload and management functions
7. **Verification Code System** - Support mailbox and mobile phone verification code

## Special project features

- **Type Safety**: Full use of TypeScript, providing complete type checking
- **Modification**: Clear module division for easy maintenance and expansion
- **Extensible**: Supports plug-in extensions, easy to add new features
- **Security**: Complete authentication and authorization mechanism and data verification
- **Maintainable**: Unified code specifications and complete files
