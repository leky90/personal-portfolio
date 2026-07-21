import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      // Chỉ 2 rule hooks kinh điển; bộ compiler-rules v7 (immutability…)
      // đối nghịch có chủ đích với house pattern mutable-state của repo.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // Registry/data module dùng non-null có chủ đích sau validate
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
);
