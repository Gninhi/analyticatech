module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint', 'react-refresh'],
    rules: {
        // TypeScript
        '@typescript-eslint/no-explicit-any': 'warn',           // Avertit sur les `any`
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-non-null-assertion': 'warn',

        // React
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // General
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-debugger': 'error',
        'prefer-const': 'error',
        'no-var': 'error',
    },
    ignorePatterns: ['dist', 'node_modules', '*.cjs'],
};
