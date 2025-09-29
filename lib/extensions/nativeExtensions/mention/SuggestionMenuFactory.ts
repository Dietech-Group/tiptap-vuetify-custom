import {
  PropType,
  defineComponent,
  DefineComponent,
  CreateElement,
  VNode,
} from "vue";

import {
  type SuggestionProps,
  type SuggestionKeyDownProps,
} from "@tiptap/suggestion";

import { VMenu } from "vuetify/lib";

import "./SuggestionMenu.scss";

export type MenuContentComponentType = DefineComponent<
  {
    items: Array<any>;
    command: PropType<SuggestionProps["command"]>;
    query: PropType<SuggestionProps["query"]>;
  },
  unknown,
  unknown,
  any,
  {
    onKeyDown: (props: SuggestionKeyDownProps) => boolean;
  }
>;

export function createSuggestionMenu(
  component: MenuContentComponentType,
  listeners: Record<string, (...args: unknown[]) => unknown> | null = null,
) {
  return defineComponent({
    components: { VMenu },
    props: {
      clientRect: {
        type: Function as PropType<SuggestionProps["clientRect"]>,
        default: (): SuggestionProps["clientRect"] => undefined,
      },
      editor: {
        type: Object as PropType<SuggestionProps["editor"]>,
        required: true,
      },
      items: {
        type: Array,
        required: true,
      },
      command: {
        type: Function as PropType<SuggestionProps["command"]>,
        required: true,
      },
      query: {
        type: String as PropType<SuggestionProps["query"]>,
        default: "",
      },
      menuProps: {
        type: Object,
        default: undefined,
      },
      contentProps: {
        type: Object,
        default: undefined,
      },
    },
    computed: {
      editorParentElement() {
        return this.editor.options.element?.closest(".tiptap-vuetify-editor");
      },
      attachedHTMLElement() {
        if (this.menuProps?.attach) {
          let attach = this.menuProps?.attach;
          if (typeof attach === "function") {
            attach = attach();
          }
          if (typeof this.menuProps.attach === "string") {
            return document.querySelector(this.menuProps.attach);
          } else if (attach instanceof HTMLElement) {
            return attach;
          } else if (attach.$el) {
            return attach.$el;
          }
        }

        return this.editorParentElement;
      },
      margin() {
        return 25;
      },
      top(): number {
        const attachedElementRect =
          this.attachedHTMLElement?.getBoundingClientRect();
        const nodeRect = (this.clientRect ?? (() => new DOMRect()))();
        return (
          (nodeRect?.top || 0) +
          (nodeRect?.height || 0) -
          (attachedElementRect?.top || 0) +
          8
        );
      },
      width(): number {
        return (
          ((this.attachedHTMLElement as HTMLElement | undefined)?.offsetWidth ||
            0) -
          this.margin * 2
        );
      },
    },
    methods: {
      onKeyDown(props: SuggestionKeyDownProps): boolean {
        return (
          (
            this.$refs.suggestionMenuContent as
              | InstanceType<MenuContentComponentType>
              | undefined
          )?.onKeyDown(props) ?? false
        );
      },
    },
    render: function (createElement: CreateElement): VNode {
      return createElement(
        VMenu,
        {
          props: {
            value: true,
            positionX: this.margin,
            positionY: this.top,
            absolute: true,
            attach: this.attachedHTMLElement,
            minWidth: this.width,
            maxWidth: this.width,
            transition: "slide-y-transition",
            contentClass: "suggestion-menu",
          },
        },
        [
          createElement(component, {
            ref: "suggestionMenuContent",
            props: {
              items: this.items,
              command: this.command,
              query: this.query,
              customProps: this.contentProps,
            },
            on: listeners || {},
          }),
        ],
      );
    },
  });
}
