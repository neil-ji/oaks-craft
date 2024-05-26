import js from "@eslint/js";

export default [
  // Ignore node_modules and dist folders
  {
    ignores: ["node_modules/", "dist/"],
  },

  // Use recommended rules
  js.configs.recommended,

  // Use recommended rules for TypeScript
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
];
