import Vue from "vue";

import {
  type SuggestionProps,
  type SuggestionKeyDownProps,
} from "@tiptap/suggestion";
import { VueRenderer } from "@tiptap/vue-2";

import MentionWindow from "./MentionWindow.vue";
import { VueConstructor } from "vue/types/umd";

export default {
  render: () => {
    let component: VueRenderer | null = null;

    return {
      onStart(props: SuggestionProps) {
        // @ts-ignore
        component = new VueRenderer(MentionWindow, {
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
          // @ts-ignore
          return component.ref.onKeyDown(props);
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
