import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  vue: true,
  typescript: true,
  javascript: true,
  yaml: true,
  jsonc: true,
  markdown: true,
  pnpm: true,
  rules: {
    'no-console': 'off',
  },
})
