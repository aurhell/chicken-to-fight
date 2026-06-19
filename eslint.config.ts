import stylistic from "@stylistic/eslint-plugin"
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript"
import importPlugin from "eslint-plugin-import-x"
import tailwindcssPlugin from "eslint-plugin-tailwindcss"
import pluginVue from "eslint-plugin-vue"

const INDENT_LENGTH = 2

const config = defineConfigWithVueTs(
  {
    plugins: {
      "@stylistic": stylistic,
      tailwindcss: tailwindcssPlugin,
    },
    settings: {
      tailwindcss: {
        config: {
          content: ["./app/**/*.{vue,ts,js}"],
          theme: {
            extend: {
              fontFamily: {
                pixel: ["\"Press Start 2P\"", "monospace"],
                ui: ["\"Pixelify Sans\"", "sans-serif"],
              },
              colors: {
                pixel: {
                  black: "#181018",
                  white: "#f8f0e8",
                  sand: "#f0d080",
                  straw: "#c89828",
                  gold: "#f8b800",
                  brown: "#804818",
                  red: "#c02020",
                  "red-light": "#f04040",
                  green: "#188020",
                  "green-light": "#38c040",
                  blue: "#1840b8",
                  "blue-light": "#4878f0",
                  purple: "#781890",
                  gray: "#887878",
                  "gray-light": "#c8b8b8",
                },
              },
              animation: {
                "gold-float": "gold-float 2.2s ease-out forwards",
                "gold-sink": "gold-sink 2.2s ease-out forwards",
              },
              boxShadow: {
                pixel: "8px 8px 0 0 #181018",
                "pixel-sm": "4px 4px 0 0 #181018",
                "pixel-lg": "16px 16px 0 0 #181018",
                "pixel-nes": "inset 0 0 0 4px #181018, 8px 8px 0 0 #181018",
                "pixel-inset": "inset 4px 4px 0 0 #181018",
                "pixel-border": "-4px 0 0 0 #181018, 4px 0 0 0 #181018, 0 -4px 0 0 #181018, 0 4px 0 0 #181018",
              },
            },
          },
        },
        whitelist: [
          "pixel-border",
          "pixel-border-sm",
          "pixel-inset",
        ],
      },
      "import-x": {
        resolver: {
          typescript: true,
        },
      },
    },
  },

  {
    ignores: [
      ".nuxt/**",
      ".output/**",
      "node_modules/**",
      "eslint.config.ts",
      "tailwind.config.ts",
      "drizzle.config.ts",
      "types/**",
    ],
  },
  

  // Target files to lint
  {
    name: "rules/files-to-lint",
    files: [
      "app/**/*.{ts,js,vue}",
      "server/**/*.{ts,js}",
      "shared/**/*.ts",
    ],
  },


  // Vue & TS recommended configurations
  pluginVue.configs["flat/strongly-recommended"],
  vueTsConfigs.recommended,

  {
    name: "rules/vue",
    files: ["app/**/*.vue"],
    rules: {
      "vue/attributes-order": "warn",
      "vue/block-lang": "warn",
      "vue/component-name-in-template-casing": [
        "warn",
        "PascalCase",
        { registeredComponentsOnly: true },
      ],
      "vue/html-closing-bracket-newline": [
        "error",
        {
          singleline: "never",
          multiline: "always",
        },
      ],
      "vue/multi-word-component-names": [
        "warn",
        {
          ignores: [
            "dashboard",
            "game",
            "login",
            "register",
          ],
        },
      ],
      "vue/no-restricted-component-options": [
        "error",
        "mixins",
      ],
      "vue/no-undef-components": [
        "error",
        {
          ignorePatterns: [
            "router-view",
            "router-link",
            "Nuxt.*",
            "NuxtPage",
            "NuxtLayout",
          ],
        },
      ],
      "vue/no-restricted-syntax": [
        "error",
        {
          selector: "VElement > VExpressionContainer Literal[raw=/^'/]",
          message: "Use double quotes in Vue template mustache expressions.",
        },
      ],
    },
  },

  // Import plugin configurations
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript as never,

  {
    name: "rules/import",
    rules: {
      "import-x/no-duplicates": [
        "error",
        { "prefer-inline": true },
      ],
      "import-x/newline-after-import": [
        "error",
        { count: 1 },
      ],
      "import-x/no-unresolved": "off",
      "import-x/first": "error",
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "unknown",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          distinctGroup: false,
          alphabetize: {
            order: "asc",
            caseInsensitive: false,
          },
        },
      ],
    },
  },

  {
    name: "rules/typescript",
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
        requireConfigFile: false,
      },
    },
    rules: {
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "[iIgnored]",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/consistent-type-definitions": [
        "error",
        "type",
      ],
    },
  },

  {
    name: "rules/javascript",
    rules: {
      "array-element-newline": ["error"],
      "block-scoped-var": "error",
      camelCase: 0,
      "consistent-return": "error",
      "no-else-return": "error",
      "no-eval": "error",
      "no-extra-bind": "warn",
      "no-implied-eval": "error",
      "no-lonely-if": "error",
      "no-magic-numbers": [
        "warn",
        {
          ignore: [
            0,
            1,
          ],
          ignoreArrayIndexes: true,
          enforceConst: true,
        },
      ],
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxEOF: 1,
        },
      ],
      "no-restricted-imports": [
        "warn",
        {
          paths: [
            {
              name: "lodash",
              message:
                "Please use specific lodash imports to reduce bundle size, e.g., `import debounce from 'lodash/debounce'`.",
            },
            {
              name: "moment",
              message:
                "Consider using `date-fns` or `dayjs` for better performance and smaller bundle size.",
            },
          ],
          patterns: [],
        },
      ],
      "no-sequences": "error",
      "no-unused-vars": "off",
      "no-useless-call": "error",
      "no-useless-return": "error",
      "no-var": "error",
      "object-property-newline": ["error"],
      "prefer-arrow-callback": "warn",
      "prefer-const": [
        "warn",
        { destructuring: "all" },
      ],
      "prefer-rest-params": "warn",
      "prefer-spread": "warn",
      "prefer-template": "warn",
      eqeqeq: [
        "error",
        "always",
        { null: "ignore" },
      ],
    },
  },

  {
    name: "rules/stylistic",
    rules: {
      "@stylistic/semi": [
        "error",
        "never",
      ],
      "@stylistic/comma-dangle": [
        "error",
        "always-multiline",
      ],
      "@stylistic/quotes": [
        "error",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: "always",
        },
      ],
      "@stylistic/brace-style": [
        "error",
        "1tbs",
        { allowSingleLine: true },
      ],
      "@stylistic/indent": [
        "error",
        INDENT_LENGTH,
        { SwitchCase: 1 },
      ],
      "@stylistic/space-before-blocks": [
        "error",
        "always",
      ],
      "@stylistic/space-in-parens": [
        "error",
        "never",
      ],
      "@stylistic/space-infix-ops": "error",
      "@stylistic/space-before-function-paren": [
        "error",
        "never",
      ],
      "@stylistic/function-call-spacing": [
        "error",
        "never",
      ],
      "@stylistic/object-curly-newline": [
        "error",
        {
          multiline: true,
          consistent: true,
        },
      ],
      "@stylistic/object-curly-spacing": [
        "error",
        "always",
      ],
      "@stylistic/array-bracket-newline": [
        "error",
        {
          multiline: true,
          minItems: 2,
        },
      ],
      "@stylistic/array-element-newline": [
        "error",
        {
          multiline: true,
          minItems: 2,
        },
      ],
      "@stylistic/array-bracket-spacing": [
        "error",
        "never",
        { singleValue: false },
      ],
      "@stylistic/comma-spacing": [
        "error",
        {
          before: false,
          after: true,
        },
      ],
      "@stylistic/comma-style": [
        "error",
        "last",
      ],
      "@stylistic/linebreak-style": [
        "error",
        "unix",
      ],
      "@stylistic/keyword-spacing": [
        "error",
        {
          before: true,
          after: true,
        },
      ],
      "@stylistic/key-spacing": [
        "error",
        {
          beforeColon: false,
          afterColon: true,
        },
      ],
      "@stylistic/eol-last": [
        "error",
        "always",
      ],
      "@stylistic/no-multiple-empty-lines": [
        "error",
        { max: 1 },
      ],
    },
  },

  {
    name: "rules/spec-files",
    files: ["**/*.spec.ts"],
    rules: {
      "no-magic-numbers": "off",
    },
  },

  {
    name: "rules/tailwindcss",
    rules: {
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/enforces-negative-arbitrary-values": "warn",
      "tailwindcss/enforces-shorthand": "warn",
      "tailwindcss/no-arbitrary-value": "off",
      "tailwindcss/no-custom-classname": "warn",
      "tailwindcss/no-contradicting-classname": "error",
    },
  },
)

export default config as unknown[]
