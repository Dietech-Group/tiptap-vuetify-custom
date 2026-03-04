<template>
  <v-btn
    v-bind="$attrs"
    :id="$id('action-btn')"
    :disabled="disabled"
    :loading="options.loading"
    :class="{
      'tiptap-vuetify-editor__action-render-btn': true,
      'v-btn--active': options.isActive(editor),
    }"
    class="rounded"
    :dark="dark"
    small
    :icon="isIconBtnOptions(options)"
    :text="isTextBtnOptions(options)"
    v-on="{ ...on }"
    @click="options.onClick({ editor: editor })"
  >
    <action-btn-content :options="options" />
    <action-tooltip
      :editor="editor"
      :options="options"
      :activator="$idRef('action-btn')"
    />
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Editor } from "@tiptap/vue-2";

import { VBtn } from "vuetify/lib";

import {
  type ExtensionActionRenderIconBtnOptionsInterface,
  type ExtensionActionRenderTextBtnOptionsInterface,
  isIconBtnOptions,
  isTextBtnOptions,
} from "./ExtensionActionRenderBtnOptionsInterface";

import ExtensionActionRenderTooltip from "../ExtensionActionRenderTooltip.vue";
import ExtensionActionRenderBtnContent from "./ExtensionActionRenderBtnContent.vue";

export default defineComponent({
  components: {
    "action-tooltip": ExtensionActionRenderTooltip,
    "action-btn-content": ExtensionActionRenderBtnContent,
    VBtn,
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
    on: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    isIconBtnOptions,
    isTextBtnOptions,
  },
});
</script>

<style lang="scss">
.tiptap-vuetify-editor__action-render-btn {
  margin: 2px 6px;
}
</style>
