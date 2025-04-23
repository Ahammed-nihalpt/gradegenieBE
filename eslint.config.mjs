import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  // JavaScript and TypeScript file linting
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js, prettier },
    extends: [
      'js/recommended',
      'plugin:prettier/recommended', // Enable Prettier integration
      eslintConfigPrettier, // Disable any formatting rules conflicting with Prettier
    ],
  },

  // Globals for browser (if working in browser environment as well)
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.browser, // Enable browser globals like window, document, etc.
    },
  },

  // Recommended TypeScript rules
  tseslint.configs.recommended,

  // Optional: TypeScript support for Prettier (if you want prettier to format TypeScript too)
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { prettier },
    extends: [
      'plugin:prettier/recommended', // Prettier formatting
      'eslint:recommended', // Add recommended ESLint rules
      'plugin:@typescript-eslint/recommended', // Add recommended rules from TypeScript plugin
    ],
    rules: {
      'prettier/prettier': 'error', // Ensure Prettier errors are thrown as ESLint errors
    },
  },
]);
