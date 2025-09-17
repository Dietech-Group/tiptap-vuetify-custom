import Vue, { PluginObject } from "vue";
import Vuetify from "vuetify";
import { VuetifyIconsGroups } from "../lib/configs/theme";

export interface PluginInterface<T> extends PluginObject<T> {
  vuetify: Vuetify;
  installed: boolean;
  vuetifyLang: Framework["lang"]["current"] | null;

  install(VueFuncConstructor: typeof Vue, options: T);
}

export interface OptionsInterface {
  vuetify: Vuetify;
  iconsGroup?: VuetifyIconsGroups;
}

export interface VuePrototypePluginInterface {
  iconsGroup: VuetifyIconsGroups;
}

declare module "vue/types/vue" {
  interface Vue {
    $tiptapVuetify: VuePrototypePluginInterface;
    tiptapVuetifyPlugin: PluginInterface<OptionsInterface>;
  }
}
