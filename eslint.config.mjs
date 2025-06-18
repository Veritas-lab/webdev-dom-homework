import globals from 'globals'
import pluginJson from '@eslint/js'
import config from 'eslint-config-prettier'
import plugin from 'eslint-plugin-prettier/recommended'

/** @type {import('eslint').Linter.Config[]} */
export default [
    { languageOptions: { globals: globals.browser } },
    pluginJson.configs.recommended,
    config,
    plugin,
]
