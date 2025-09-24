import Vue, { VueConstructor } from "vue";

import {
  type SuggestionProps,
  type SuggestionKeyDownProps,
} from "@tiptap/suggestion";
import { VueRenderer } from "@tiptap/vue-2";

import MentionWindow from "./MentionWindow.vue";

export default {
  render: () => {
    let component: VueRenderer | null = null;

    return {
      onStart(props: SuggestionProps) {

        component = new VueRenderer(MentionWindow  as unknown as VueConstructor, {
          vuetify: Vue.prototype.tiptapVuetifyPlugin.vuetify,
          propsData: props,
        });

        document.querySelector("body")?.appendChild(component.element);
      },

      onUpdate(props: SuggestionProps) {
        component?.updateProps(props);
      },

      onKeyDown(props: SuggestionKeyDownProps): boolean {
        if (component?.ref) {
          return (component.ref as unknown as typeof MentionWindow).onKeyDown(props);
        }

        return false;
      },

      onExit() {
        component?.element?.parentNode?.removeChild(component.element);
        component?.destroy();
        component = null;
      },
    };
  },
};
