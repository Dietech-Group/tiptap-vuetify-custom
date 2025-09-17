import _Vue from "vue";

import type Vuetify from "vuetify";

import type { OptionsInterface, PluginInterface } from "../types";

import theme from "@/configs/theme";
import ConsoleLogger from "@/logging/ConsoleLogger";

const TiptapVuetifyPlugin = new (class Plugin
  implements PluginInterface<OptionsInterface>
{
  vuetify!: Vuetify;
  installed = false;

  get vuetifyLang() {
    return this.vuetify.framework.lang.current;
  }

  install(VueFuncConstructor: typeof _Vue, options?: OptionsInterface) {
    if (!options?.vuetify) {
      ConsoleLogger.error(
        'Please, specify in options the Vuetify Object ("vuetify" property)',
      );

      return;
    }

    const { vuetify: vuetifyFramework, iconsGroup = theme.defaultIconsGroup } =
      options;

    VueFuncConstructor.prototype.tiptapVuetifyPlugin = TiptapVuetifyPlugin;
    VueFuncConstructor.prototype.$tiptapVuetify = {
      iconsGroup,
    };
    this.vuetify = vuetifyFramework;
    this.installed = true;
  }
})();

export default TiptapVuetifyPlugin;
