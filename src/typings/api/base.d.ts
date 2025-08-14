/// <reference path="../global.d.ts"/>

namespace Api {
  interface MultilingualValue extends BaseVO {
    id: string
    fieldId: string
    language: string
    value: string
  }

  interface MultilingualFields {
    [key: string]: MultilingualValue[]
  }

  interface BaseVO {
    remark: string
    status: number
    isDeleted: number
    creator: string
    createTime: string
    updater: string
    updateTime: string

    multilingualFields?: MultilingualFields
  }
}
