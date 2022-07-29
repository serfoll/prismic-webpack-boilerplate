module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'prettier',
    './node_modules/@prettier/plugin-pug',
  ],
  plugins: ['prettier'],
  globals: {
    IS_DEVELOPMENT: 'readonly',
  },
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': ['error'],
  },
};
