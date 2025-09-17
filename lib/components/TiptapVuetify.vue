<template>
  <div
    v-if="editor"
    :class="{
      'tiptap-vuetify-editor--disabled': $props[PROPS.DISABLED],
    }"
    class="tiptap-vuetify-editor"
  >
    <bubble
      v-if="availableActions.bubbleMenu.length && editor.options.editable"
      :editor="editor"
      :actions="availableActions.bubbleMenu"
    />

    <VCard
      v-if="$props[PROPS.TYPE] === EDITOR_TYPES_ENUM.card"
      v-bind="$props[PROPS.CARD_PROPS]"
    >
      <slot name="toolbar-before" />

      <toolbar
        v-if="availableActions.toolbar.length"
        :editor="editor"
        :actions="availableActions.toolbar"
        :toolbar-attributes="$props[PROPS.TOOLBAR_ATTRIBUTES]"
        :disabled="$props[PROPS.DISABLED]"
      >
        <!-- Allows the user to show their toolbar -->
        <template v-if="$scopedSlots.toolbar">
          <slot name="toolbar" />
        </template>
      </toolbar>

      <slot name="toolbar-after" />

      <editor-content
        :editor="editor"
        :style="contentDynamicStyles"
        :class="{
          'tiptap-vuetify-editor__content--disabled': $props[PROPS.DISABLED],
        }"
        class="tiptap-vuetify-editor__content"
      />

      <slot name="footer" />
    </VCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { type Editor as CoreEditorType } from "@tiptap/core";
import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Placeholder } from "@tiptap/extensions";
import { type Editor as EditorType, Editor, EditorContent, type Content } from "@tiptap/vue-2";

import { VCard } from "vuetify/lib";

import type AbstractExtensionInterface from "@/extensions/AbstractExtensionInterface";
import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";
import type { Fragment } from "@tiptap/pm/model";

import Bubble from "@/components/Bubble.vue";
import Toolbar from "@/components/Toolbar.vue";
import { EVENTS, PROPS, EDITOR_TYPES_ENUM } from "@/const";
import { ExtensionActionRenderInEnum } from "@/extensions/actions/ExtensionActionRenderInEnum";

export default defineComponent({
  components: {
    Bubble,
    EditorContent,
    Toolbar,
    VCard,
  },
  props: {
    [PROPS.DISABLED]: {
      type: Boolean,
      default: false,
    },
    [PROPS.VALUE]: {
      type: [String, Object],
      default: "",
    },
    [PROPS.EXTENSIONS]: {
      type: Array,
      default: (): any[] => [],
    },
    [PROPS.PLACEHOLDER]: {
      type: String,
      default: undefined,
    },
    [PROPS.CARD_PROPS]: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    [PROPS.OUTPUT_FORMAT]: {
      type: String,
      default: "html",
    },
    [PROPS.TOOLBAR_ATTRIBUTES]: {
      type: [Array, Object] as PropType<Record<string, any>>,
      default: () => ({}),
    },
    [PROPS.EDITOR_PROPERTIES]: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    [PROPS.NATIVE_EXTENSIONS]: {
      type: Array,
      default: (): any[] => [],
    },
    [PROPS.TYPE]: {
      type: String as PropType<EDITOR_TYPES_ENUM>,
      default: EDITOR_TYPES_ENUM.card,
    },
    [PROPS.MIN_HEIGHT]: {
      type: [String, Number],
      default: undefined,
    },
    [PROPS.MAX_HEIGHT]: {
      type: [String, Number],
      default: undefined,
    },
  },
  data(): {
    editor: any | null;
    availableActions: {
      toolbar: ExtensionActionInterface[];
      bubbleMenu: ExtensionActionInterface[];
    };
    emitAfterOnUpdate: boolean;
  } {
    return {
      editor: null,
      availableActions: {
        toolbar: [],
        bubbleMenu: [],
      },
      emitAfterOnUpdate: false,
    };
  },
  computed: {
    PROPS() {
      return PROPS;
    },
    EDITOR_TYPES_ENUM() {
      return EDITOR_TYPES_ENUM;
    },
    contentDynamicStyles() {
      // if no unit of measurement is specified (e.g. 60, 25), it will be as px. That is 60em, 25% will remain so.
      const getUnitWithPxAsDefault = (str: string | number) => {
        if (!str) return str;

        let num: number;
        let unit: string | undefined;

        if (typeof str === "number") {
          num = str;
        } else {
          num = parseInt(str, 10);
          unit = str.slice(num.toString().length);
        }

        return num + (unit ?? "px");
      };

      return {
        minHeight: getUnitWithPxAsDefault(this[PROPS.MIN_HEIGHT]),
        maxHeight: getUnitWithPxAsDefault(this[PROPS.MAX_HEIGHT]),
      };
    },
  },
  watch: {
    disabled: function (val: boolean) {
      if (this.editor) this.editor.setOptions({ editable: !val });
    },
    value: function (val: Content | Fragment | Node) {
      if (this.emitAfterOnUpdate) {
        this.emitAfterOnUpdate = false;

        return;
      }

      if (this.editor)
        this.editor.commands.setContent(val, { emitUpdate: false });
    },
  },
  mounted() {
    const nativeExtensionsInstances: any = [];
    const extensionsInstances: AbstractExtensionInterface[] = [];
    // default extension options
    const paramsDefault = {
      renderIn: ExtensionActionRenderInEnum.toolbar,
      options: {},
    };

    (this[PROPS.EXTENSIONS] as any[]).forEach((extensionDefinition) => {
      let ExtensionClass;
      let params;

      // Getting the extension and its options
      if (Array.isArray(extensionDefinition)) {
        [ExtensionClass, params] = extensionDefinition;
        //TODO improve the check, but for some reason it doesn't work: http://bit.ly/2ALqFJB
      } else if (extensionDefinition.prototype.availableActions) {
        // Если extends от AbstractExtension
        ExtensionClass = extensionDefinition;
      } else {
        throw new Error(
          'Incorrect extension declaration passed to "extensions" prop (array). ' +
            "It looks like the array's element is in the wrong format.",
        );
      }

      // parameters with default values
      // Todo: deep merge
      const paramsFinal = { ...paramsDefault, ...params };
      const extension: AbstractExtensionInterface = new ExtensionClass(
        paramsFinal.options,
      );
      // const renderInVariants = Object.values(ExtensionActionRenderInEnum)
      //
      // if (!renderInVariants.includes(options.renderIn)) {
      //   throw new Error('Please, set the "renderIn" option to one of following values: ' + renderInVariants)
      // }

      // replenishing available actions for a specific renderIn
      this.availableActions[
        paramsFinal.renderIn as ExtensionActionRenderInEnum
      ].push(...extension.availableActions);

      // Collection of native extensions
      if (extension.nativeExtensionInstance) {
        nativeExtensionsInstances.push(extension.nativeExtensionInstance);
      }
      // Collection of extensions
      extensionsInstances.push(extension);
    });
    const extensions = [
      Document,
      Paragraph,
      Text,
      ...this[PROPS.NATIVE_EXTENSIONS],
      ...nativeExtensionsInstances,
    ];

    if (this[PROPS.PLACEHOLDER]) {
      // !!!!!!!!!!!!!!!!! TODO ONLY FOR TEST (update: I don't remember what this is, maybe there's no need to remove the code below)
      extensions.push(
        Placeholder.configure({
          emptyNodeClass: "tiptap-vuetify-editor__paragraph--is-empty",
          placeholder: this[PROPS.PLACEHOLDER],
          showOnlyWhenEditable: true,
        }),
      );
    }

    this.editor = new Editor({
      editable: !this[PROPS.DISABLED],
      extensions,
      ...this[PROPS.EDITOR_PROPERTIES],
      editorProps: {
        ...this[PROPS.EDITOR_PROPERTIES].editorProps,
        handleKeyDown: (view, event) => {
          if (this[PROPS.EDITOR_PROPERTIES].editorProps?.handleKeyDown) {
            this[PROPS.EDITOR_PROPERTIES].editorProps.handleKeyDown(
              view,
              event,
            );
          }

          this.$emit("keydown", event, view);
        },
      },
      content: this[PROPS.VALUE],
      onUpdate: this.onUpdate.bind(this),
      onBlur: this.onBlur.bind(this),
      onFocus: this.onFocus.bind(this),
    });

    this.$emit(EVENTS.INIT, {
      editor: this.editor,
    });
    extensionsInstances.forEach(
      (ext) => ext.onEditorInit && ext.onEditorInit(this.editor as Editor),
    );
  },
  methods: {
    onUpdate(info: any) {
      this.emitAfterOnUpdate = true;
      let output: any;

      if (this[PROPS.OUTPUT_FORMAT] === "html") {
        output = info.editor.getHTML();
      } else {
        output = info.editor.getJSON();
      }

      this.$emit(EVENTS.INPUT, output, info);
    },
    onBlur({ editor, event }: { editor: CoreEditorType; event: FocusEvent }) {
      this.$emit(EVENTS.BLUR, event, editor.view);
    },
    onFocus({ editor, event }: { editor: CoreEditorType; event: FocusEvent }) {
      this.$emit(EVENTS.FOCUS, event, editor.view);
    },
    beforeDestroy() {
      if (this.editor) this.editor.destroy();
    },
  },
});
</script>

<style lang="scss">
.tiptap-vuetify-editor {
  position: relative;

  .ProseMirror {
    outline: none !important;
    margin: 20px !important;
  }

  &--disabled {
    cursor: not-allowed;
  }
}

/* The element does not necessarily contain .tiptap-vuetify-editor, it can be used to display the result of the editor in a non-editor */
.tiptap-vuetify-editor__content {
  transition: all 2s;
  overflow: auto !important;
  padding: 5px;

  :first-child {
    margin-top: 0 !important;
  }

  a {
    pointer-events: none;
  }

  h1,
  h2,
  h3,
  h4 {
    margin: 10px 0 20px !important;
  }

  blockquote {
    border-left: 0.25em solid #dfe2e5;
    color: #6a737d;
    padding-left: 1em;
    margin: 20px 0 !important;
  }

  code {
    padding: 0 4px !important;
    margin: 0 5px !important;
  }

  pre code {
    padding: 8px !important;
    margin: 0 5px !important;
  }

  code:before,
  code:after {
    content: none !important;
    letter-spacing: initial !important;
  }

  p {
    margin-top: 16px !important;
    margin-bottom: 16px !important;
    /* Without this, the empty <p> in the preview will not take up space (so that it looks like an empty line) as it does in the editor */
    min-height: 1rem;

    // placeholder
    &.tiptap-vuetify-editor__paragraph--is-empty {
      &:first-child::before {
        content: attr(data-empty-text);
        float: left;
        color: #aaa;
        pointer-events: none;
        height: 0;
        font-style: italic;
      }
    }
  }

  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid gray;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: 0;
      width: 4px;
      z-index: 20;
      background-color: #adf;
      pointer-events: none;
    }
  }

  .tableWrapper {
    margin: 1em 0;
    overflow-x: auto;
  }

  .resize-cursor {
    cursor: col-resize;
  }

  &--disabled {
    // same color for disabled text as default light vuetify theme: vuetify/src/styles/settings/_light.scss#L30
    color: rgba(0, 0, 0, 0.38);
    &:after {
      // same as background as for filled v-text-input: vuetify/src/styles/settings/_light.scss#L87
      background-color: rgba(0, 0, 0, 0.06);
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em !important;
      margin-bottom: 0.25em !important;
    }
  }

  ul[data-type="taskList"] {
    list-style: none;
    margin-left: 0;
    padding: 0;

    li {
      align-items: flex-start;
      display: flex;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }

    input[type="checkbox"] {
      cursor: pointer;
    }

    ul[data-type="taskList"] {
      margin: 0;
    }
  }
}
</style>
