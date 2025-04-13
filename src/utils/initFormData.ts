/**
 * 將選項列表包裝成符合表單數據格式的 Promise
 * @param options 選項列表
 * @returns Promise 包裝的選項數據
 */
export function wrapOptionsToPromise<T>(options: Array<{ label: string, value: T }>) {
  return () => {
    return Promise.resolve({
      data: {
        list: options,
      },
    })
  }
}
