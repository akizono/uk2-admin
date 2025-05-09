import type { NDataTable } from 'naive-ui'

import { useDraggable } from 'vue-draggable-plus'

export function useTableDrag<T = unknown>(params: {
  tableRef: Ref<InstanceType<typeof NDataTable> | undefined>
  data: Ref<T[]>
  onRowDrag: (rows: T[], newList: T[], draggedRow: T, newSort: number) => void
}) {
  // 計算表格元素的引用
  const tableEl = computed(() => params.tableRef?.value?.$el as HTMLElement)
  const tableBodyRef = ref<HTMLElement | undefined>(undefined)

  const { start } = useDraggable(tableBodyRef, params.data, {
    immediate: false,
    animation: 150,
    handle: '.drag-handle',
    onEnd: (event) => {
      const { oldIndex, newIndex } = event
      const start = Math.min(oldIndex!, newIndex!)
      const end = Math.max(oldIndex!, newIndex!) - start + 1
      const changedRows = [...params.data.value].splice(start, end)
      const draggedRow = params.data.value[newIndex!]

      /** 計算被拖動的行的新排序 */
      let newSort = 0
      const draggedRowIndex = params.data.value.findIndex(row => row === draggedRow)
      // 如果被拖動到最頭部
      if (draggedRowIndex === 0) {
        const secondRow = params.data.value[1]?.sort || 0
        newSort = secondRow - 1
      }
      // 如果被拖動到最底部
      else if (draggedRowIndex === params.data.value.length - 1) {
        const secondRow = params.data.value[draggedRowIndex - 1]?.sort || 0
        newSort = Number((secondRow + 10).toFixed(6))
      }
      // 如果被拖動到其他位置
      else {
        // 獲取被拖動行前後的行
        const prevRow = params.data.value[draggedRowIndex - 1]?.sort || 0
        const nextRow = params.data.value[draggedRowIndex + 1]?.sort || 0
        newSort = Number(((prevRow + nextRow) / 2).toFixed(6))
      }

      // console.log('變更的行:', changedRows)
      console.log('新的排序結果:', params.data.value)
      console.log('被拖動的行:', draggedRow)
      console.log('新的排序:', newSort)

      params.onRowDrag(unref([...changedRows]), params.data.value, draggedRow, newSort)
    },
  })

  const initDrag = async () => {
    while (!tableBodyRef.value) {
      tableBodyRef.value = tableEl.value?.querySelector('tbody') || undefined
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    if (tableBodyRef.value) {
      start()
    }
  }

  return {
    initDrag,
  }
}
