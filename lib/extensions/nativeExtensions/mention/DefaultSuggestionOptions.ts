import Vue from "vue";
import { DefaultProps } from "vue/types/options";

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
  menu: {
    getProps: () => DefaultProps;
    content: {
      component: any;
      listeners: Record<string, (...args: unknown[]) => unknown> | null;
      getProps: () => DefaultProps;
    };
  } | null = null,
) {
  return {
    render: () => {
      let renderer: VueRenderer | null = null;

      return {
        onStart(sugestionProps: SuggestionProps) {
          const suggestionMenuComponent = createSuggestionMenu(
            menu?.content.component || (SuggestionList as any),
            menu?.content.listeners,
          );

          const vue =
            (sugestionProps.editor as any).contentComponent?.$options._base ??
            Vue;
          renderer = new VueRenderer(vue.extend(suggestionMenuComponent), {
            vuetify: Vue.prototype.tiptapVuetifyPlugin.vuetify,
            parent: (sugestionProps.editor as any).contentComponent,
            propsData: {
              ...sugestionProps,
              menuProps: menu?.getProps?.(),
              contentProps: menu?.content.getProps?.(),
            },
          });

          document.querySelector("body")?.appendChild(renderer.element);
        },

        onUpdate(sugestionProps: SuggestionProps) {
          renderer?.updateProps({
            ...sugestionProps,
            menuProps: menu?.getProps?.(),
            contentProps: menu?.content.getProps?.(),
          });
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
          if (renderer) {
            renderer.element?.parentNode?.removeChild(renderer.element);
            renderer.destroy();
            renderer = null;
          }
        },
      };
    },
  };
}
