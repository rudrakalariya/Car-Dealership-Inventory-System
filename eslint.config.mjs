import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'node_modules/**', 
      'dist/**', 
      'backend/dist/**', 
      'frontend/dist/**',
      'coverage/**',
      '.next/**',
      '.nuxt/**',
      'dist-ssr/**',
      '*.local',
      '**/*.config.js',
      '**/*.config.ts',
      '**/*.config.mjs'
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
);
