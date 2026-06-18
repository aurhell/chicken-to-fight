export default defineI18nConfig(() => ({
  missingWarn: false,
  fallbackWarn: false,
  missing: (_locale: string, key: string) => key,
}))
