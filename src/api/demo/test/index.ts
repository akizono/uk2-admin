import request from '@/utils/request'

/* get方法測試 */
export function fetchGet(params?: any) {
  return request.get({ url: 'https://mock.apifox.cn/m1/4071143-0-default/getAPI', params })
}

/* post方法測試 */
export function fetchPost(data?: any) {
  return request.post({ url: 'https://mock.apifox.cn/m1/4071143-0-default/postAPI', data })
}

/* formPost方法測試 */
export function fetchFormPost(params?: any) {
  return request.post({ url: 'https://mock.apifox.cn/m1/4071143-0-default/postFormAPI', params })
}

/* delete方法測試 */
export function fetchDelete() {
  return request.delete({ url: 'https://mock.apifox.cn/m1/4071143-0-default/deleteAPI' })
}

/* put方法測試 */
export function fetchPut(data?: any) {
  return request.put({ url: 'https://mock.apifox.cn/m1/4071143-0-default/putAPI', data })
}

/* 不攜帶token的介面 */
export function withoutToken() {
  return request.get({
    url: 'https://mock.apifox.cn/m1/4071143-0-default/getAPI',
    headers: {
      'skip-auth-token': true,
    },
  })
}

/* 模擬獲取二進制文件 */
export function getBlob(url: string) {
  return request.download({ url })
}

/* 帶進度的下載文件 */
export function downloadFile(url: string, onDownloadProgress?: (progressEvent: any) => void) {
  return request.download({
    url,
    onDownloadProgress,
  })
}

/* 測試狀態碼500失敗 */
export function FailedRequest() {
  return request.get({ url: 'https://mock.apifox.cn/m1/4071143-0-default/serverError' })
}

/* 測試業務碼500失敗 */
export function FailedResponse() {
  return request.post({ url: 'https://mock.apifox.cn/m1/4071143-0-default/businessError' })
}
