import type { DataTableColumns as NaiveDataTableColumns } from 'naive-ui'

declare module 'naive-ui' {
  export interface DataTableColumn {
    multilingual?: boolean
  }

  export type DataTableColumns<T = any> = Array<DataTableColumn & NaiveDataTableColumns<T>[number]>
}
