/**
 * 將給定的數組轉換為樹形結構。
 * @param arr - 原始數組，其中每個元素包含id和parentId屬性
 * @returns 返迴轉換後的樹形結構數組。
 */
export function arrayToTree(arr: any[]) {
  // 初始化結果數組
  const res: any[] = []
  // 使用Map儲存數組元素，以id為鍵，元素本身為值
  const map = new Map()

  // 遍歷數組，將每個元素以id為鍵儲存到Map中
  arr.forEach((item) => {
    map.set(item.id, item)
  })

  // 再次遍歷數組，根據parentId將元素組織成樹形結構
  arr.forEach((item) => {
    // 獲取當前元素的父級元素
    const parent = item.parentId && map.get(item.parentId)
    // 如果有父級元素
    if (parent) {
      // 如果父級元素已有子元素，則將當前元素追加到子元素數組中
      if (parent?.children)
        parent.children.push(item)
      // 如果父級元素沒有子元素，則創建子元素數組，並將當前元素作為第一個元素
      else
        parent.children = [item]
    }
    // 如果沒有父級元素，則將當前元素直接添加到結果數組中
    else {
      res.push(item)
    }
  })
  // 返回組織好的樹形結構數組
  return res
}

/**
 * 對傳入的數據進行排序，根據每個元素的 sort 屬性進行升序排列
 * @param data - 需要排序的數據
 * @returns 排序後的數據
 */
export function sortTreeData(data: any[]): any[] {
  const sortedData = data.sort((a, b) => a.sort - b.sort)

  // 遍歷排序後的數據，對每個節點的子節點進行遞迴排序
  sortedData.forEach((item) => {
    // 檢查當前元素是否有子節點，且子節點是一個數組且長度大於0
    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      // 對子節點進行遞迴調用 sortTreeData 函數進行排序
      item.children = sortTreeData(item.children)
    }
  })

  return sortedData
}
