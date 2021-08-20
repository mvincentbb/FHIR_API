module.exports = {
  parserOptions: {
    sourceType: 'module',
  },
  parser: '@babel/eslint-parser',
  env: {
    node: true,
  },
  extends: ['standard', 'prettier', 'prettier/standard'],
  plugins: ['prettier', '@babel'],
  rules: {
    'promise/catch-or-return': 'error',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
      },
    ],
  },
}
