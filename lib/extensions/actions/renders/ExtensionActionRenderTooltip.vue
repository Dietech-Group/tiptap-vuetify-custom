<template>
  <v-tooltip top :disabled="!tooltipText" :activator="activator">
    <span>{{ tooltipText }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Editor } from "@tiptap/vue-2";

import { VTooltip } from "vuetify/lib";

import { type ExtensionActionRenderBtnOptionsInterface } from "./btn/ExtensionActionRenderBtnOptionsInterface";

export default defineComponent({
  components: { VTooltip },
  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    options: {
      type: Object as PropType<ExtensionActionRenderBtnOptionsInterface>,
      required: true,
    },
    activator: {
      type: [String, Object],
      default: undefined,
    },
  },
  computed: {
    tooltipText() {
      const source = this.options.tooltip;

      if (typeof source === "function") {
        return source(this.editor, this.options);
      }

      return source;
    },
  },
});
</script>
