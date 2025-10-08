import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { defineConfig, LibraryFormats, type UserConfig } from "vite";
// Remove the legacy plugin, as we don't need suport for IE
// and it is does not support Vite Library Mode.
// import legacy from "@vitejs/plugin-legacy";
import vue2 from "@vitejs/plugin-vue2";
import dts from "vite-plugin-dts";
// import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const formats: LibraryFormats[] = ["es", "umd"];

  const config: UserConfig = {
    plugins: [
      vue2(),
      dts({
        outDir: "./dist/types",
        insertTypesEntry: true,
        tsconfigPath: "./tsconfig.build.json",
      }),
      // cssInjectedByJsPlugin(),
      //     legacy({
      //       targets: ["ie >= 11"],
      //       additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      //    }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./lib", import.meta.url)),
        src: fileURLToPath(new URL("./src", import.meta.url)),
        dist: fileURLToPath(new URL("./dist", import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        sass: {
          verbose: true,
          silenceDeprecations: ["global-builtin", "import", "slash-div"],
          api: "modern-compiler",
        },
      },
    },
    build: {
      copyPublicDir: false,
      lib: {
        //Here, we set the entry file
        entry: resolve(__dirname, "lib/main.ts"),
        //And the name of the library
        name: "tiptapVuetifyCustom",
        fileName: "bundle",
      },
      rollupOptions: {
        //Here, we are externalizing Vue to prevent it to be bundled
        //with our library
        external: [
          "vue",
          "vuetify",
          "vuetify/lib",

          "@tiptap/core",
          "@tiptap/extension-blockquote",
          "@tiptap/extension-bold",
          "@tiptap/extension-bubble-menu",
          "@tiptap/extension-code-block-lowlight",
          "@tiptap/extension-code-block",
          "@tiptap/extension-code",
          "@tiptap/extension-document",
          "@tiptap/extension-floating-menu",
          "@tiptap/extension-hard-break",
          "@tiptap/extension-heading",
          "@tiptap/extension-horizontal-rule",
          "@tiptap/extension-image",
          "@tiptap/extension-italic",
          "@tiptap/extension-link",
          "@tiptap/extension-list",
          "@tiptap/extension-mention",
          "@tiptap/extension-paragraph",
          "@tiptap/extension-strike",
          "@tiptap/extension-table",
          "@tiptap/extension-text",
          "@tiptap/extension-underline",
          "@tiptap/extensions",
          "@tiptap/pm",
          "@tiptap/suggestion",
          "@tiptap/vue-2",
          "@tiptap/vue-2/menus",

          "@floating-ui/core",
          "@floating-ui/dom",
          "@floating-ui/utils",

          "prosemirror-model",
          "prosemirror-state",
          "prosemirror-transform",

          "vue-unique-id",
        ],
        //Add this so the UMD build will recognize the global variables
        //of externalized dependencies
        output: formats.map((format) => ({
          format,
          name: "tiptapVuetifyCustom",
          globals: {
            vue: "Vue",
            vuetify: "Vuetify",
            "vuetify/lib": "Vuetify",

            "@tiptap/core": "tiptapCore",
            "@tiptap/extension-blockquote": "tiptapExtensionBlockquote",
            "@tiptap/extension-bold": "tiptapExtensionBold",
            "@tiptap/extension-bubble-menu": "tiptapExtensionBubbleMenu",
            "@tiptap/extension-code-block-lowlight":
              "tiptapExtensionCodeBlockLowlight",
            "@tiptap/extension-code-block": "tiptapExtensionCodeBlock",
            "@tiptap/extension-code": "tiptapExtensionCode",
            "@tiptap/extension-document": "tiptapExtensionDocument",
            "@tiptap/extension-floating-menu": "tiptapExtensionFloatingMenu",
            "@tiptap/extension-hard-break": "tiptapExtensionHardBreak",
            "@tiptap/extension-heading": "tiptapExtensionHeading",
            "@tiptap/extension-horizontal-rule":
              "tiptapExtensionHorizontalRule",
            "@tiptap/extension-image": "tiptapExtensionImage",
            "@tiptap/extension-italic": "tiptapExtensionItalic",
            "@tiptap/extension-link": "tiptapExtensionLink",
            "@tiptap/extension-list": "tiptapExtensionList",
            "@tiptap/extension-mention": "tiptapExtensionMention",
            "@tiptap/extension-paragraph": "tiptapExtensionParagraph",
            "@tiptap/extension-strike": "tiptapExtensionStrike",
            "@tiptap/extension-table": "tiptapExtensionTable",
            "@tiptap/extension-text": "tiptapExtensionText",
            "@tiptap/extension-underline": "tiptapExtensionUnderline",
            "@tiptap/extensions": "tiptapExtensions",
            "@tiptap/pm": "tiptapPm",
            "@tiptap/suggestion": "tiptapSuggestion",
            "@tiptap/vue-2": "tiptapVue2",
            "@tiptap/vue-2/menus": "tiptapVue2Menus",

            "@floating-ui/core": "floatingUICore",
            "@floating-ui/dom": "floatingUIDom",
            "@floating-ui/utils": "floatingUIUtils",

            "prosemirror-model": "ProseMirrorModel",
            "prosemirror-state": "ProseMirrorState",
            "prosemirror-transform": "ProseMirrorTransform",

            "vue-unique-id": "VueUniqueId",
          },
          exports: "named",
          plugins: [
            mode === "analyze" && format === "es"
              ? // rollup-plugin-visualizer
                // https://github.com/btd/rollup-plugin-visualizer
                visualizer({
                  open: true,
                  filename: `dist/stats-${format}.html`,
                  // gzipSize: true,
                  // brotliSize: true,
                })
              : undefined,
          ],
        })),
      },
    },
  };
  return config;
});
