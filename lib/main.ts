import TiptapVuetifyPlugin from "./TiptapVuetifyPlugin";
import TiptapVuetifyEditor from "./components/TiptapVuetifyEditor.vue";
import TiptapVuetifyContent from "./components/TiptapVuetifyContent.vue";

export * from "./extensions/nativeExtensions/index";
export { TiptapVuetifyEditor, TiptapVuetifyContent };
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
    globalScope.Vue.component("tiptap-vuetify-editor", TiptapVuetifyEditor);
    globalScope.Vue.component("tiptap-vuetify-content", TiptapVuetifyContent);
  }
})();
