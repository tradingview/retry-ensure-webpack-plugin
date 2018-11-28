This repo doesn't contain the compiled distribution, only the source.

There's a somewhat tangled mishmash of code generation and inlining. In the nutshell:

- Webpack generates bundles for you.

- Webpack MainTemplate generates the code for Webpack bundles that allows async chunk loading: `__webpack_require__.e`.

- _Optionally:_ css-whats-its-name-again-plugin hooks into MainTemplate and adds a few lines inside `__webpack_require__.e` implementation.

- **This is what is published on npm.** A plugin hooks into MainTemplate and adds some code that wraps `__webpack_require__.e` and retries it.

- **You are here.** TypeScript and some glue code around it generates the code of the plugin itself and the code that will be inserted.

# How to build

`npm run build`

The compiled distribution code ready for using and publishing will appear in the `dist` directory after the build process.

# Files

## `./package.json`

`package.json` in the project root has `private` flag set to `true` in order to prevent publishing this _source_ code instead of _built_ one. **Do not remove this flag manually!**

When building, `private`, `devDependencies` a `scripts` sections are omitted, the rest goes to the `dist/package.json`

## `./readme.md`

`readme.md` is copied as is into the `dist/readme.md`.

## `source/retry-ensure-webpack-plugin.ts`

The code of the plugin itself, it will be executed in Node environment.

This file is compiled using `tsconfig.json`, `target` ES version is 6, `module` is CommonJS.

A special variable `_TEMPLATE_PLACEHOLDER` will be replaced with the template code string. Inlining the template code has its benefits:

- It saves a few IO ops when required in Node.

- The template JS is useless as a standalone JS code, there's no point distributing stuff that cannot be used.

- I like it this way.

## `source/injected-template.ts`

The code that will be injected into the bundle, it will be executed in browsers.

This file is compiled using `tsconfig-injected.json`, `target` ES version is 5, `module` is None.
