import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { defineConfig } from "vite";
// Remove the legacy plugin, as we don't need suport for IE
// and it is does not support Vite Library Mode.
// import legacy from "@vitejs/plugin-legacy";
import vue2 from "@vitejs/plugin-vue2";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
    dts(),
    cssInjectedByJsPlugin(),
    //     legacy({
    //       targets: ["ie >= 11"],
    //       additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    //    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    lib: {
      //Here, we set the entry file
      entry: resolve(__dirname, "src/index.ts"),
      //And the name of the library
      name: "component-lib",
    },
    rollupOptions: {
      //Here, we are externalizing Vue to prevent it to be bundled
      //with our library
      external: ["vue"],
      //Add this so the UMD build will recognize the global variables
      //of externalized dependencies
      output: {
        globals: {
          vue: "Vue",
        },
        exports: "named",
      },
    },
  },
});
