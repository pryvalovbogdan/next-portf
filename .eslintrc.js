module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir : __dirname,
		sourceType: 'module',
	},
	extends: [
		'plugin:prettier/recommended',
		"next/core-web-vitals",
	],
	plugins: [
		// e.g. "react" (must run `npm install eslint-plugin-react` first)
		"react",
		"prettier",
		"i18next",
		"unused-imports"
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',

		// 0 - turn the rule off
		// 1 - turn the rule on as a warning (doesn't affect exit code)
		// 2 - turn the rule on as an error (exit code will be 1)

		// Prettier configuration
		"prettier/prettier": ["error", {
			"bracketSameLine": false,     // Put the > of a multi-line JSX element at the end of the last line instead of being alone on the next line
			"jsxSingleQuote": true,       // Use single quotes instead of double quotes in JSX
			"printWidth": 120,            // Specify the line length that the printer will wrap on
			"semi": true,                 // Print semicolons at the ends of statements.
			"singleQuote": true,          // Use single quotes instead of double quotes.
			"tabWidth": 2,                // Specify the number of spaces per indentation-level.
			"trailingComma": "all",       // Print trailing commas wherever possible when multi-line.
			"useTabs": false,             // Indent lines with tabs instead of spaces.
			"endOfLine": "lf",            // Line Feed only (\n),
			"arrowParens": "avoid",        // Include parentheses around a sole arrow function parameter.
			"importOrder": ["<THIRD_PARTY_MODULES>", "^@", "^src/(.*)$",  "^[./]"],
			"importOrderSeparation": true,
			"importOrderSortSpecifiers": true,
			"plugins": ["@trivago/prettier-plugin-sort-imports"]
		}],

		"i18next/no-literal-string": 1,

		"padding-line-between-statements": [ "error",
			{ "blankLine": "always", "prev": ["const", "let", "var"], "next": "*"},
			{ "blankLine": "any", "prev": ["const", "let", "var"], "next": ["const", "let", "var"]},

			{ "blankLine": "always", "prev": "import", "next": "*" },
			{ "blankLine": "any", "prev": "import", "next": "import" },

			{ "blankLine": "always", "prev": "block-like", "next": "*" },

			{ "blankLine": "always", "prev": "*", "next": "if" },
			{ "blankLine": "always", "prev": "if", "next": "*" },

			{ "blankLine": "always", "prev": "*", "next": "multiline-expression" },
			{ "blankLine": "always", "prev": "multiline-expression", "next": "*" },

			{ "blankLine": "always", "prev": "*", "next": "for" },
			{ "blankLine": "always", "prev": "for", "next": "*" },

			{ "blankLine": "always", "prev": "*", "next": "function" },
			{ "blankLine": "always", "prev": "function", "next": "*" },

			{ "blankLine": "always", "prev": "*", "next": "return" },

			{ "blankLine": "always", "prev": ["case", "default"], "next": "*" }
		],

		"unused-imports/no-unused-imports": "error",
		"unused-imports/no-unused-vars": [
			"warn",
			{
				"vars": "all",
				"varsIgnorePattern": "^_",
				"args": "after-used",
				"argsIgnorePattern": "^_"
			}
		],
	},
};
