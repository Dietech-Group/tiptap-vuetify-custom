import _Vue from "vue";
import theme from "@/configs/theme";
import { OptionsInterface, PluginInterface } from "../types/index";
import Vuetify from "vuetify/types";

const TiptapVuetifyPlugin = new (class Plugin
  implements PluginInterface<OptionsInterface>
{
  vuetify!: Vuetify;
  installed = false;

  get vuetifyLang() {
    return this.vuetify.framework.lang.current;
  }

  install(VueFuncConstructor: typeof _Vue, options?: OptionsInterface) {
    if (!options || !options.vuetify) {
      console.error(
        'Please, specify in options the Vuetify Object ("vuetify" property)'
      );

      return;
    }

    const { vuetify: vuetifyInstance, iconsGroup = theme.defaultIconsGroup } =
      options;

    VueFuncConstructor.prototype.tiptapVuetifyPlugin = TiptapVuetifyPlugin;
    VueFuncConstructor.prototype.$tiptapVuetify = {
      iconsGroup,
    };
    this.vuetify = vuetifyInstance;
    this.installed = true;
  }
})();

export default TiptapVuetifyPlugin;
