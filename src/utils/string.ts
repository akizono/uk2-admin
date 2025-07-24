/**
 * 將字串中的所有橫杆(-)替換為下劃線(_)
 * @param {string} str - 要處理的字串
 * @returns {string} 處理後的字串
 */
export function replaceDashToUnderscore(str: string) {
  return str.replace(/-/g, '_')
}

/**
 * 將帶有橫槓的字串轉換為駝峰式命名
 * @param {string} str - 輸入字串，必須滿足以下條件：
 *                      1. 包含且僅包含一個橫槓(-)
 *                      2. 只包含小寫英文字母
 *                      3. 橫槓不出現在開頭或結尾
 * @returns {string} 轉換後的駝峰式命名字串，首字母大寫
 *
 * @example
 * // 返回 "DemoData"
 * hyphenToCamelCase("demo-data");
 */
export function hyphenToCamelCase(str: string) {
  // 將字串按橫槓分割成兩部分
  const parts = str.split('-')

  // 將每部分的首字母大寫，然後拼接起來
  return parts.map(part =>
    part.charAt(0).toUpperCase() + part.slice(1),
  ).join('')
}

/**
 * 將駝峰式命名字串轉換為下劃線式命名（snake_case）
 * @param {string} camelStr - 駝峰式命名字串（如：systemUser、systemAICode、HTTPStatus）
 * @returns {string} 轉換後的下劃線式命名字串（如：system_user、system_ai_code、http_status）
 *
 * @example
 * camelToSnakeCase("systemUser");      // "system_user"
 * camelToSnakeCase("systemUserAgeNo"); // "system_user_age_no"
 * camelToSnakeCase("systemAICode");    // "system_ai_code"
 * camelToSnakeCase("axiosHTTPPage");   // "axios_http_page"
 * camelToSnakeCase("apple");           // "apple"
 * camelToSnakeCase("HTTPStatus");      // "http_status"
 */
export function camelToSnakeCase(camelStr: string) {
  // 處理空字串的情況
  if (!camelStr)
    return camelStr

  // 處理全大寫單字（如HTTP）
  camelStr = camelStr.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')

  // 處理普通駝峰情況
  return camelStr
    .replace(/([a-z])([A-Z])/g, '$1_$2') // 在小寫和大寫字母之間插入下劃線
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2') // 處理連續大寫後跟小寫的情況
    .toLowerCase() // 全部轉換為小寫
}

/**
 * 將帶橫槓的字串轉換為駝峰命名
 * @param str 輸入字串（例如："hello-world" 或 "api-v1-user"）
 * @returns 駝峰命名字串（例如："helloWorld" 或 "apiV1User"）
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}
