import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js, reactPlugin },
    extends: ['js/recommended'],
    languageOptions: {
      // ...reactPlugin.configs.recommended.parserOptions,
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
  tseslint.configs.recommended,
  globalIgnores(['node_modules', 'dist', '*.config.cjs']),
]);
