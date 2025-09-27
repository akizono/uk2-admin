# 模塊創建完整指南

本指南將教您如何從零開始創建一個完整的增刪改查模塊，遵循項目的代碼風格和最佳實踐。我們將以創建一個「產品管理」模塊為例。

## 目錄

1. [使用 Nest CLI 創建基礎結構](#1-使用-nest-cli-創建基礎結構)
2. [創建實體 (Entity)](#2-創建實體-entity)
3. [創建 DTO 文件](#3-創建-dto-文件)
4. [創建服務 (Service)](#4-創建服務-service)
5. [創建控制器 (Controller)](#5-創建控制器-controller)
6. [配置模塊 (Module)](#6-配置模塊-module)
7. [註冊到主模塊](#7-註冊到主模塊)
8. [測試模塊功能](#8-測試模塊功能)

## 1. 使用 Nest CLI 創建基礎結構

### 步驟 1: 創建模塊

```bash
# 在 src/modules/admin-api/system/ 目錄下創建新模塊
nest g module modules/admin-api/system/product
```

### 步驟 2: 創建控制器

```bash
nest g controller modules/admin-api/system/product
```

### 步驟 3: 創建服務

```bash
nest g service modules/admin-api/system/product
```

### 步驟 4: 創建目錄結構

```bash
# 創建必要的目錄
mkdir src/modules/admin-api/system/product/dto
mkdir src/modules/admin-api/system/product/entity
```

## 2. 創建實體 (Entity)

### 文件位置: `src/modules/admin-api/system/product/entity/product.entity.ts`

```typescript
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'
import { CategoryEntity } from '@/modules/admin-api/system/category/entity/category.entity'

@Entity('system_product')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主鍵ID' })
  id: string

  @Column({ length: 100, comment: '產品名稱' })
  name: string

  @Column({ length: 50, comment: '產品代碼' })
  code: string

  @Column({ type: 'text', comment: '產品描述', nullable: true })
  description: string

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '產品價格' })
  price: number

  @Column({ type: 'int', comment: '庫存數量', default: 0 })
  stock: number

  @Column({ name: 'category_id', type: 'bigint', comment: '分類ID' })
  categoryId: string

  @Column({ length: 255, comment: '產品圖片', nullable: true })
  image: string

  @Column({ type: 'int', comment: '排序', default: 0 })
  sort: number

  // 關聯關係
  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity
}
```

### 實體設計要點

1. **繼承 BaseEntity**: 所有實體都應該繼承 `BaseEntity` 以獲得基礎欄位
2. **主鍵設計**: 使用 `bigint` 類型的主鍵
3. **欄位註釋**: 每個欄位都應該有清晰的註釋
4. **關聯關係**: 使用 TypeORM 的關聯裝飾器
5. **數據類型**: 根據實際需求選擇合適的數據類型

## 3. 創建 DTO 文件

### 請求 DTO: `src/modules/admin-api/system/product/dto/product.req.dto.ts`

```typescript
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

import { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { EnvHelper } from '@/utils/env-helper'

class ProductReqDto extends BaseReqDto {
  @ApiProperty({ description: '主鍵ID', required: true })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  id: string

  @ApiProperty({ description: '產品名稱', required: true, example: 'iPhone 15' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: '產品代碼', required: true, example: 'IPHONE15' })
  @IsNotEmpty()
  @IsString()
  code: string

  @ApiProperty({ description: '產品描述', example: '最新款iPhone' })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({ description: '產品價格', example: 999.99 })
  @IsNotEmpty()
  @IsNumber()
  price: number

  @ApiProperty({ description: '庫存數量', example: 100 })
  @IsNotEmpty()
  @IsNumber()
  stock: number

  @ApiProperty({ description: '分類ID', example: '1' })
  @IsNotEmpty()
  @Transform(({ value }) => new ParseBigIntPipe().transform(value))
  categoryId: string

  @ApiProperty({ description: '產品圖片', example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  image: string

  @ApiProperty({ description: '排序', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  sort: number
}

// 創建產品 DTO
export class CreateProductReqDto extends PartialType(
  OmitType(ProductReqDto, ['id', 'multilingualFields', ...disableEditFields]),
) {}

// 查詢產品 DTO
export class FindProductReqDto extends PartialType(ProductReqDto) {
  @ApiProperty({ description: '分頁大小', example: 10, required: false })
  @IsNotEmpty()
  @Min(0)
  @Max(EnvHelper.getNumber('MAX_PAGE_SIZE'))
  pageSize?: number = 10

  @ApiProperty({ description: '分頁頁碼', example: 1, required: false })
  @IsNotEmpty()
  @Min(0)
  @Max(EnvHelper.getNumber('MAX_PAGE_NUMBER'))
  currentPage?: number = 1
}

// 更新產品 DTO
export class UpdateProductReqDto extends PartialType(
  OmitType(ProductReqDto, ['multilingualFields', ...disableEditFields]),
) {}
```

### 響應 DTO: `src/modules/admin-api/system/product/dto/product.res.dto.ts`

```typescript
import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

// 創建產品響應 DTO
export class CreateProductResDto extends SingleResponseDto({
  id: '100',
}) {}

// 產品數據結構（用於 Swagger 文檔）
const ProductResDtoReturn = {
  id: '1',
  name: 'iPhone 15',
  code: 'IPHONE15',
  description: '最新款iPhone',
  price: 999.99,
  stock: 100,
  categoryId: '1',
  image: 'https://example.com/iphone15.jpg',
  sort: 1,
  category: {
    id: '1',
    name: '手機',
    code: 'PHONE',
    // 其他分類欄位...
  },
  remark: '備註',
  status: 1,
  isDeleted: 0,
  creator: '1',
  createTime: '2025-01-01T00:00:00.000Z',
  updater: '1',
  updateTime: '2025-01-01T00:00:00.000Z',
}

// 查詢產品列表響應 DTO
export class FindProductResDto extends PaginatedResponseDto(ProductResDtoReturn) {}

// 查詢單一產品響應 DTO
export class FindOneProductResDto extends SingleResponseDto(ProductResDtoReturn) {}
```

### DTO 設計要點

1. **繼承 BaseReqDto**: 請求 DTO 應該繼承 `BaseReqDto`
2. **使用裝飾器**: 使用 `@ApiProperty`、`@IsNotEmpty` 等裝飾器
3. **數據轉換**: 使用 `@Transform` 和 `ParseBigIntPipe` 處理大整數
4. **分頁支持**: 查詢 DTO 包含分頁參數
5. **Swagger 文檔**: 提供完整的 API 文檔註釋

## 4. 創建服務 (Service)

### 文件位置: `src/modules/admin-api/system/product/product.service.ts`

```typescript
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { _delete, create, find, findOne, update } from '@/common/services/base.service'

import { CreateProductReqDto, FindProductReqDto, UpdateProductReqDto } from './dto/product.req.dto'
import { ProductEntity } from './entity/product.entity'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  // 新增產品
  async create(createProductReqDto: CreateProductReqDto) {
    const result = await create({
      dto: createProductReqDto,
      repository: this.productRepository,
      repeatCondition: ['code'], // 產品代碼不能重複
      modalName: '產品',
      foreignKeyChecks: [
        {
          field: 'categoryId',
          repository: this.productRepository.manager.getRepository('CategoryEntity'),
          modalName: '分類',
        },
      ],
    })

    return { id: result.id }
  }

  // 查詢產品
  async find(findProductReqDto: FindProductReqDto) {
    const { list, total } = await find({
      dto: findProductReqDto,
      repository: this.productRepository,
      relations: ['category'], // 關聯查詢分類信息
      where: {
        isDeleted: 0,
      },
    })

    // 處理敏感信息（如果有關聯用戶信息）
    list.forEach((item) => {
      if (item.category) {
        // 可以對分類信息進行處理
        delete item.category.remark // 移除備註等敏感信息
      }
    })

    return {
      total,
      list,
    }
  }

  // 查詢單一產品
  async findOne(id: string) {
    return await findOne({
      id,
      repository: this.productRepository,
      relations: ['category']
    })
  }

  // 更新產品
  async update(updateProductReqDto: UpdateProductReqDto) {
    await update({
      dto: updateProductReqDto,
      repository: this.productRepository,
      existenceCondition: ['id'],
      repeatCondition: ['code'], // 更新時檢查代碼重複
      modalName: '產品',
    })
  }

  // 刪除產品
  async delete(id: string) {
    await _delete({
      id,
      repository: this.productRepository,
      modalName: '產品',
    })
  }

  // 封鎖產品
  async block(id: string) {
    await update({
      dto: { id, status: 0 },
      repository: this.productRepository,
      existenceCondition: ['id'],
      modalName: '產品',
    })
  }

  // 解封鎖產品
  async unblock(id: string) {
    await update({
      dto: { id, status: 1 },
      repository: this.productRepository,
      existenceCondition: ['id'],
      modalName: '產品',
    })
  }
}
```

### 服務設計要點

1. **使用 BaseService**: 所有 CRUD 操作都使用 `BaseService` 的方法
2. **重複性檢查**: 使用 `repeatCondition` 檢查唯一性
3. **外鍵驗證**: 使用 `foreignKeyChecks` 驗證關聯數據
4. **關聯查詢**: 使用 `relations` 進行關聯查詢
5. **數據處理**: 在返回前處理敏感信息

## 5. 創建控制器 (Controller)

### 文件位置: `src/modules/admin-api/system/product/product.controller.ts`

```typescript
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { Operation, OperationType } from '@/common/decorators/operation.decorator'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { MsgResponseDto } from '@/utils/response-dto'

import { CreateProductReqDto, FindProductReqDto, UpdateProductReqDto } from './dto/product.req.dto'
import { CreateProductResDto, FindOneProductResDto, FindProductResDto } from './dto/product.res.dto'
import { ProductService } from './product.service'

@Controller('/admin-api/system/product')
@UseInterceptors(TransformInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @HasPermission('system:product:create')
  @Operation({ type: OperationType.CREATE, name: '建立產品', module: 'system-product' })
  @ApiOperation({ summary: '建立產品' })
  @ApiResponse({ type: CreateProductResDto })
  @ResponseMessage('建立產品成功')
  create(@Body() createProductReqDto: CreateProductReqDto) {
    return this.productService.create(createProductReqDto)
  }

  @Get('/list')
  @HasPermission('system:product:query')
  @Operation({ type: OperationType.READ, name: '取得產品分頁列表', module: 'system-product' })
  @ApiOperation({ summary: '取得產品分頁列表' })
  @ApiResponse({ type: FindProductResDto })
  @ResponseMessage('取得產品分頁列表成功')
  find(@Query() findProductReqDto: FindProductReqDto) {
    return this.productService.find(findProductReqDto)
  }

  @Get('/get/:id')
  @HasPermission('system:product:query')
  @Operation({ type: OperationType.READ, name: '獲取產品資料', module: 'system-product' })
  @ApiOperation({ summary: '獲取產品資料' })
  @ApiResponse({ type: FindOneProductResDto })
  @ResponseMessage('獲取產品資料成功')
  findOne(@Param('id', ParseBigIntPipe) id: string) {
    return this.productService.findOne(id)
  }

  @Put('/update')
  @HasPermission('system:product:update')
  @Operation({ type: OperationType.UPDATE, name: '更新產品', module: 'system-product' })
  @ApiOperation({ summary: '更新產品' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新產品成功')
  update(@Body() updateProductReqDto: UpdateProductReqDto) {
    return this.productService.update(updateProductReqDto)
  }

  @Delete('/delete/:id')
  @HasPermission('system:product:delete')
  @Operation({ type: OperationType.DELETE, name: '刪除產品', module: 'system-product' })
  @ApiOperation({ summary: '刪除產品' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除產品成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.productService.delete(id)
  }

  @Put('/block/:id')
  @HasPermission('system:product:block')
  @Operation({ type: OperationType.UPDATE, name: '封鎖產品', module: 'system-product' })
  @ApiOperation({ summary: '封鎖產品' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖產品成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.productService.block(id)
  }

  @Put('/unblock/:id')
  @HasPermission('system:product:unblock')
  @Operation({ type: OperationType.UPDATE, name: '解封鎖產品', module: 'system-product' })
  @ApiOperation({ summary: '解封鎖產品' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('解封鎖產品成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.productService.unblock(id)
  }
}
```

### 控制器設計要點

1. **路由設計**: 使用 RESTful 風格的路由
2. **權限控制**: 每個接口都使用 `@HasPermission` 裝飾器
3. **操作記錄**: 使用 `@Operation` 記錄操作日誌
4. **Swagger 文檔**: 使用 `@ApiOperation` 和 `@ApiResponse` 提供文檔
5. **參數驗證**: 使用 `ParseBigIntPipe` 處理大整數參數

## 6. 配置模塊 (Module)

### 文件位置: `src/modules/admin-api/system/product/product.module.ts`

```typescript
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductEntity } from './entity/product.entity'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService], // 如果其他模塊需要使用此服務
})
export class ProductModule {}
```

## 7. 註冊到主模塊

### 修改 `src/modules/admin-api/system/system.module.ts`

```typescript
import { Module } from '@nestjs/common'
// ... 其他導入

import { ProductModule } from './product/product.module'

@Module({
  imports: [
    // ... 其他模塊
    ProductModule, // 添加新模塊
  ],
  // ... 其他配置
})
export class SystemModule {}
```

## 8. 測試模塊功能

### 使用 Swagger 測試

1. 啟動應用程序
2. 訪問 `http://localhost:3000/api-docs`
3. 找到 Product 相關的 API
4. 測試各個接口功能

### 測試用例

```typescript
// 測試創建產品
POST /admin-api/system/product/create
{
  "name": "iPhone 15",
  "code": "IPHONE15",
  "description": "最新款iPhone",
  "price": 999.99,
  "stock": 100,
  "categoryId": "1",
  "image": "https://example.com/iphone15.jpg",
  "sort": 1
}

// 測試查詢產品列表
GET /admin-api/system/product/list?pageSize=10&currentPage=1

// 測試查詢單一產品
GET /admin-api/system/product/get/1

// 測試更新產品
PUT /admin-api/system/product/update
{
  "id": "1",
  "name": "iPhone 15 Pro",
  "price": 1099.99
}

// 測試刪除產品
DELETE /admin-api/system/product/delete/1
```

## 進階功能

### 1. 添加多語言支持

如果產品需要多語言支持，可以修改實體：

```typescript
// 在 ProductEntity 中添加多語言欄位
@Column({ length: 255, comment: '產品名稱（多語言）', nullable: true })
nameMultilingual: string

@Column({ length: 255, comment: '產品描述（多語言）', nullable: true })
descriptionMultilingual: string
```

### 2. 添加軟刪除檢查

在服務中添加軟刪除檢查：

```typescript
// 在查詢時過濾已刪除的記錄
const { list, total } = await find({
  dto: findProductReqDto,
  repository: this.productRepository,
  where: {
    isDeleted: 0, // 只查詢未刪除的記錄
  },
})
```

### 3. 添加業務邏輯

```typescript
// 添加庫存檢查
async checkStock(productId: string, quantity: number) {
  const product = await this.findOne(productId)
  if (product.stock < quantity) {
    throw new BadRequestException('庫存不足')
  }
  return true
}

// 添加庫存更新
async updateStock(productId: string, quantity: number) {
  await this.productRepository.update(
    { id: productId },
    { stock: () => `stock - ${quantity}` }
  )
}
```

## 常見問題

### 1. 權限配置

確保在權限系統中配置相應的權限：

```typescript
// 權限配置示例
const permissions = [
  'system:product:create',
  'system:product:query',
  'system:product:update',
  'system:product:delete',
  'system:product:block',
  'system:product:unblock',
]
```

### 2. 數據庫遷移

創建數據庫遷移文件：

```bash
# 生成遷移文件
npm run migration:generate -- -n CreateProductTable

# 執行遷移
npm run migration:run
```

### 3. 錯誤處理

確保所有可能的錯誤都被適當處理：

```typescript
try {
  const result = await this.productService.create(dto)
  return result
}
catch (error) {
  if (error instanceof ConflictException) {
    throw new BadRequestException('產品代碼已存在')
  }
  throw error
}
```

## 總結

通過以上步驟，您已經創建了一個完整的增刪改查模塊。記住以下要點：

1. **遵循項目風格**: 保持與現有代碼的一致性
2. **使用 BaseService**: 充分利用現有的基礎服務
3. **完整的文檔**: 提供清晰的 API 文檔
4. **權限控制**: 確保適當的權限控制
5. **錯誤處理**: 提供友好的錯誤信息
6. **測試**: 充分測試所有功能

這個模塊創建指南應該能幫助您快速創建符合項目標準的新模塊。
