<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- Open/Closed principle https://css-tricks.com/creating-vue-js-component-instances-programmatically/ -->
  <div class="tiptap-vuetify-editor__toolbar">
    <v-toolbar
      v-bind="{
        ...toolbarConfig,
        ...toolbarAttributes,
      }"
    >
      <actions-render
        :actions="actions"
        :editor="editor"
        :disabled="disabled"
      />
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { type Editor } from "@tiptap/vue-2";

import { VToolbar } from "vuetify/lib";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import ActionsRender from "@/components/ActionsRender.vue";
import toolbarConfig from "@/configs/toolbar";

export default defineComponent({
  components: {
    ActionsRender,
    VToolbar,
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
    actions: {
      type: Array as PropType<ExtensionActionInterface[]>,
      default: (): ExtensionActionInterface[] => [],
    },
    toolbarAttributes: {
      type: [Array, Object],
      default: () => ({}),
    },
  },
  computed: {
    toolbarConfig() {
      return toolbarConfig;
    },
  },
});
</script>

<style lang="scss">
.tiptap-vuetify-editor__toolbar {
  .v-toolbar {
    display: flex;
    height: auto !important;
    padding: 5px;

    .v-toolbar__content {
      height: auto !important;
      flex-wrap: wrap;
      padding: 0;
    }
  }
}
</style>
