<template>
  <v-list-item
    :id="$id('action-list-item')"
    dense
    :class="{ 'v-list-item--active': options.isActive(editor) }"
    :disabled="disabled"
    :dark="dark"
    @click="options.onClick({ editor: editor })"
  >
    <action-btn-content :options="options" />

    <action-tooltip
      :editor="editor"
      :options="options"
      :activator="$idRef('action-list-item')"
    />
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Editor } from "@tiptap/vue-2";

import ExtensionActionRenderTooltip from "../ExtensionActionRenderTooltip.vue";
import ExtensionActionRenderBtnContent from "../btn/ExtensionActionRenderBtnContent.vue";

import {
  type ExtensionActionRenderIconBtnOptionsInterface,
  type ExtensionActionRenderTextBtnOptionsInterface,
} from "../btn/ExtensionActionRenderBtnOptionsInterface";

export default defineComponent({
  components: {
    "action-tooltip": ExtensionActionRenderTooltip,
    "action-btn-content": ExtensionActionRenderBtnContent,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    options: {
      type: Object as PropType<
        | ExtensionActionRenderIconBtnOptionsInterface
        | ExtensionActionRenderTextBtnOptionsInterface
      >,
      required: true,
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
