module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["error"],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
  },
};