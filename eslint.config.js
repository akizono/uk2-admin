// eslint.config.js
import antfu from '@antfu/eslint-config'

// https://github.com/antfu/eslint-config
export default antfu(
  {
    typescript: {
      overrides: {
        'perfectionist/sort-exports': 'off',
        'perfectionist/sort-imports': ['error', {
          type: 'natural',
          order: 'asc',
          groups: [
            'type',
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
            'style',
            'object',
            'unknown',
          ],
        }],
        'ts/no-unused-expressions': ['error', { allowShortCircuit: true }],
        'no-console': 'off',
        'no-template-curly-in-string': 'off',
      },
    },
    vue: {
      overrides: {
        'vue/no-unused-refs': 'off', // 暫時關閉，等待vue-lint的分支合併
        'vue/no-reserved-component-names': 'off',
        'vue/component-definition-name-casing': 'off',
      },
    },
  },
)
