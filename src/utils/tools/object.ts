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
