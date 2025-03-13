import type { DialogApi } from 'naive-ui'

import { h } from 'vue'

let dialog: DialogApi | null = null

export function setdialog(instance: DialogApi) {
  dialog = instance
}

export function createCopyableDialog(params: {
  title: string
  content: string
  positiveText: string
  negativeText: string
}) {
  const { title, content, positiveText, negativeText } = params

  if (!dialog) {
    console.error('Dialog 尚未初始化，請檢查設置')
    return
  }

  dialog.create({
    title,
    content: () => h('pre', null, content.replace(/<br \/>/g, '\n')),
    positiveText,
    negativeText,
    onNegativeClick: () => {
      navigator.clipboard.writeText(content.replace(/<br \/>/g, ' '))
      window.$message.success('複製成功')
      return false
    },
  })
}
