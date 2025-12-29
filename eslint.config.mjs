import globals from "globals";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // JavaScript files
  {
    files: ["**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        ...globals.commonjs,
        ...globals.node,
      },
    },
    plugins: {
      js,
    },
    rules: {
      "no-unused-vars": "warn",
      "comma-dangle": ["error", "always-multiline"],
    },
    ignores: [
      'node_modules',
      'node_modules/**/*.js',
      'dist',
      'lib',
      'tmp',
    ]
  },
  {
    files: ["test/fixtures/*.js"],
    rules: {
      "no-unused-vars": "off",
    },
  },
]);
