export interface TableRow {
  id: string
  [key: string]: any
}

export interface InitQueryParams {
  name: string
  value: any
  label?: string
  class?: string
  placeholder?: string
  inputType: string
  dict?: string
}

export interface InitFormData {
  name: string
  value: any
  hidden?: boolean
  span?: number
  label?: string
  type?: string
  disableEdit?: boolean
}
