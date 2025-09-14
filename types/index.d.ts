// !!! В этом файле не использовать алиасы в путях (e.g. "~")
import Vue, { PluginObject } from "vue";
import Vuetify from "vuetify";
import { VuetifyIconsGroups } from "../src/configs/theme";

// тут нужно все экспортировать (export), а не использовтаь namepsace

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
