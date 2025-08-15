module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Treat warnings as warnings, not errors
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'warn'
  }
};
