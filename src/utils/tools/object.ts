/**
 * 過濾物件中的空值（空字串、undefined、null）
 * @param obj 要過濾的物件
 * @returns 過濾後的物件，不包含空值的屬性
 * @example
 * const obj = { name: '', age: 18, address: null, phone: undefined }
 * filterObjEmptyValues(obj) // { age: 18 }
 */
export function filterObjEmptyValues<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== '' && value !== null && value !== undefined),
  ) as Partial<T>
}

/**
 * 將物件中的所有 undefined 值轉換為 null
 * @param obj 要處理的物件
 * @returns 處理後的物件，所有 undefined 值都被替換為 null
 * @example
 * const obj = { name: '', age: 18, address: null, phone: undefined }
 * convertUndefinedToNull(obj) // { name: '', age: 18, address: null, phone: null }
 */
export function convertUndefinedToNull<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value === undefined ? null : value]),
  ) as T
}
