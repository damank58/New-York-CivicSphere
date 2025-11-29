module.exports = {
  root: true,
  env: {
    browser: true,
    es2023: true,
  },
  extends: ["standard-with-typescript", "plugin:react-hooks/recommended"],
  parserOptions: {
    project: ["./tsconfig.json"],
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
  },
};

