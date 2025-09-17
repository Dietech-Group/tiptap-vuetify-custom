import TiptapVuetifyPlugin from "./TiptapVuetifyPlugin";
import TiptapVuetify from "./components/TiptapVuetify.vue";

export * from "./extensions/nativeExtensions/index";
export { TiptapVuetify };
export { TiptapVuetifyPlugin };
(function autoInstall() {
  let globalScope: any = null;

  if (typeof window !== "undefined") {
    globalScope = window;
  } else if (typeof global !== "undefined") {
    globalScope = global;
  }
  if (globalScope?.Vue) {
    // Automatic installation if Vue has been added to the global scope.
    globalScope.Vue.use(TiptapVuetifyPlugin, {
      vuetify: globalScope.vuetify,
      ...globalScope.tiptapVuetifyPluginOptions,
    });
    globalScope.Vue.component("tiptap-vuetify", TiptapVuetify);
  }
})();
