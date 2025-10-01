# tiptap-vuetify-custom

A customized tiptap ui based [tiptap-vuetify](https://github.com/iliyaZelenko/tiptap-vuetify). It depends on vue 2 and vuetify 2.  

## Customized versions of tiptap packages

This project uses a customized version for some tiptap editor packages: [https://github.com/Dietech-Group/tiptap/](https://github.com/Dietech-Group/tiptap/). For every new version a release with `*.tgz` archives for all tiptap packages is created. It's important to use the same package version for all tiptap packages.

Example:
```
"@tiptap/core": "3.6.2",
"@tiptap/suggestion": "https://github.com/Dietech-Group/tiptap/releases/download/v3.6.2-dietech.0/tiptap-suggestion-3.6.2.tgz"
```

## Releases

To release a new version with a `*.tgz` archive you need to trigger the github release workflow ([release.yml](.github/workflows/release.yml)) with creating a new tag (starting with `v`) and push it.

```
git tag <tagname>
git push origin <tagname>
```
The `<tagname>` should be `v<package version>` (ex. `v1.1.2`).

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
