import type { DialogApi } from 'naive-ui'

import { h } from 'vue'

import { $t } from '@/utils'

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
    console.error($t('dialog.checkSettingError'))
    return
  }

  dialog.create({
    title,
    content: () => h('pre', null, content.replace(/<br \/>/g, '\n')),
    positiveText,
    negativeText,
    onNegativeClick: () => {
      navigator.clipboard.writeText(content.replace(/<br \/>/g, ' '))
      window.$message.success($t('dialog.copySuccess'))
      return false
    },
  })
}
