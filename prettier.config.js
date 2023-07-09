/** @type {import('prettier').Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  pluginSearchDirs: false,
  plugins: [require('prettier-plugin-tailwindcss')],
  importOrder: ['^@', '^[a-zA-Z0-9-]+', '^[./]'],
}