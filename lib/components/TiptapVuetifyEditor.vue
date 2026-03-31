<template>
  <div
    v-if="editor"
    :data-editor-instance-uid="editorInstanceUId"
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

import { VCard } from "vuetify/lib";

import { type Editor as CoreEditorType } from "@tiptap/core";
import { Editor, EditorContent } from "@tiptap/vue-2";
import { TextSelection } from "@tiptap/pm/state";

import Bubble from "@/components/Bubble.vue";
import Toolbar from "@/components/Toolbar.vue";
import { EVENTS, PROPS, EDITOR_TYPES_ENUM } from "@/const";

import EditorMixin from "@/mixins/EditorMixin";
import "./TiptapVuetifyEditor.scss";
import "./TiptapVuetifyContent.scss";

function isFirefox() {
  return (
    typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent)
  );
}

export default defineComponent({
  components: {
    Bubble,
    EditorContent,
    Toolbar,
    VCard,
  },
  mixins: [EditorMixin],
  props: {
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
    [PROPS.TYPE]: {
      type: String as PropType<EDITOR_TYPES_ENUM>,
      default: EDITOR_TYPES_ENUM.card,
    },
  },
  computed: {
    editorInstanceUId() {
      return this.$id("tiptap-vuetify-editor");
    },
    PROPS() {
      return PROPS;
    },
    EDITOR_TYPES_ENUM() {
      return EDITOR_TYPES_ENUM;
    },
  },
  methods: {
    createEditor() {
      this.editor = new Editor({
        editable: !this[PROPS.DISABLED],
        extensions: this.availableExtensions,
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
          handleDOMEvents: {
            ...(isFirefox()
              ? {
                  // workaround for firefox cursor placement bug when clicking in front of an element with contenteditable="false"
                  // see: https://github.com/ueberdosis/tiptap/issues/3320
                  mousedown: (view, event: MouseEvent) => {
                    const target = event.target as HTMLElement | null;
                    if (!target?.classList.contains("ProseMirror"))
                      return false;

                    const left = target.getBoundingClientRect().left + 1;
                    const top = event.clientY;

                    const posResult = view.posAtCoords({ left, top });
                    if (!posResult || typeof posResult.pos !== "number")
                      return false;

                    // Resolve the position and find the start of the nearest block (e.g., paragraph)
                    const $pos = view.state.doc.resolve(posResult.pos);
                    if ($pos.parent.type.name !== "paragraph") return false;
                    const blockStart = $pos.start($pos.depth);
                    if (view.state.selection.from === blockStart) return false;

                    const tr = view.state.tr.setSelection(
                      TextSelection.create(view.state.doc, blockStart),
                    );
                    tr.setMeta("addToHistory", false);
                    view.dispatch(tr);
                    view.focus();

                    event.preventDefault();
                    return true;
                  },
                }
              : {}),
          },
        },
        content: this[PROPS.VALUE],
        onUpdate: this.onUpdate.bind(this),
        onBlur: this.onBlur.bind(this),
        onFocus: this.onFocus.bind(this),
        // @ts-expect-error: editorInstanceUId is a custom option
        editorInstanceUId: this.editorInstanceUId,
      });
    },
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
  },
});
</script>
