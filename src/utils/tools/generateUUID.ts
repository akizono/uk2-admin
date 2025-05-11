/**
 * 生成多語言欄位專用的UUID
 * @returns 返回UUID
 */
export function generateUUID(): string {
  return `multilingual-${'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })}`
}
