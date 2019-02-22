module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'comma-dangle': 0,
    'no-tabs': 0,
    'no-param-reassign': 0,
    'no-mixed-spaces-and-tabs': 0,
    'prefer-promise-reject-errors': 0,
    'import/no-extraneous-dependencies': 0,
    'max-len': [1, 200],
    'vue/no-parsing-error': [2, {
      "x-invalid-end-tag": false
    }]
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
