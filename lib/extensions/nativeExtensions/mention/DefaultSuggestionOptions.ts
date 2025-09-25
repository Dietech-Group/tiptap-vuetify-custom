import Vue, { VueConstructor } from "vue";

import {
  type SuggestionProps,
  type SuggestionKeyDownProps,
} from "@tiptap/suggestion";
import { VueRenderer } from "@tiptap/vue-2";

import SuggestionList from "./SuggestionList.vue";
import {
  createSuggestionMenu,
  MenuContentComponentType,
} from "./SuggestionMenuFactory";

export default function createDefaultSuggestionOptions(
  menuContent: {
    component: any;
    listeners: Record<string, (...args: unknown[]) => unknown> | null;
  } | null = null,
) {
  return {
    render: () => {
      let renderer: VueRenderer | null = null;

      return {
        onStart(sugestionProps: SuggestionProps) {
          const suggestionMenuComponent = createSuggestionMenu(
            menuContent?.component || (SuggestionList as any),
            menuContent?.listeners,
          );

          renderer = new VueRenderer(
            suggestionMenuComponent as unknown as VueConstructor,
            {
              vuetify: Vue.prototype.tiptapVuetifyPlugin.vuetify,
              propsData: sugestionProps,
            },
          );

          document.querySelector("body")?.appendChild(renderer.element);
        },

        onUpdate(props: SuggestionProps) {
          renderer?.updateProps(props);
        },

        onKeyDown(props: SuggestionKeyDownProps): boolean {
          if (renderer?.ref) {
            return (
              renderer.ref as unknown as MenuContentComponentType
            ).onKeyDown(props);
          }

          return false;
        },

        onExit() {
          renderer?.element?.parentNode?.removeChild(renderer.element);
          renderer?.destroy();
          renderer = null;
        },
      };
    },
  };
}
