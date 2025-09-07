<script setup lang="ts">
import { $t } from '@/utils'

const value = ref()

const cbValue = ref()
const cbOption = ref()
const cbPathValues = ref()
function handleUpdateValue(value: string, option: any, pathValues: any[]) {
  cbValue.value = value
  cbOption.value = { code: option.code, name: option.name }
  cbPathValues.value = pathValues.map(i => ({ code: i.code, name: i.name }))
}

const formRef = ref()
const formValue = ref({
  region: null,
})

function handleValidateClick() {
  formRef.value?.validate((errors: any) => {
    if (!errors)
      window.$message.success('Valid')

    else
      window.$message.error('Invalid')
  })
}
</script>

<template>
  <n-card :title="$t('cascader.title')">
    <n-h2>{{ $t('cascader.currentSelectedRegion') }}{{ value }}</n-h2>
    <PcaCascader v-model:value="value" @update:value="handleUpdateValue" />

    <div>
      <n-h2>{{ $t('cascader.callbackValue') }}</n-h2>
      <pre class="bg-#eee:30">
      {{ cbValue }}
    </pre>
    </div>
    <div>
      <n-h2>{{ $t('cascader.callbackOption') }}</n-h2>
      <pre class="bg-#eee:30">
      {{ cbOption }}
    </pre>
    </div>
    <div>
      <n-h2>{{ $t('cascader.callbackPathValues') }}</n-h2>
      <pre class="bg-#eee:30">
      {{ cbPathValues }}
    </pre>
    </div>

    <n-h2>{{ $t('cascader.formValidation') }}</n-h2>
    <n-form
      ref="formRef"
      inline
      :label-width="80"
      :model="formValue"
    >
      <n-form-item :label="$t('cascader.region')" path="region" :rule="[{ required: true, message: $t('cascader.regionRequired') }]">
        <PcaCascader v-model:value="formValue.region" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="handleValidateClick">
          {{ $t('cascader.validate') }}
        </n-button>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<style scoped></style>
