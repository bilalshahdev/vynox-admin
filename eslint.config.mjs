import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:storybook/recommended"
  ),
  {
    rules: {
      // ✅ Ignore all unused variable warnings
      "@typescript-eslint/no-unused-vars": "off",

      // Keep or adjust other useful rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "react-hooks/rules-of-hooks": "error",
      "@typescript-eslint/no-unused-expressions": [
        "warn",
        { allowShortCircuit: true, allowTernary: true },
      ],
      "@typescript-eslint/no-this-alias": "off",
    },
  },
];

export default config;
