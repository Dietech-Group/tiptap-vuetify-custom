<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <bubble-menu :editor="editor" :options="{}">
    <v-sheet rounded elevation="2" color="grey lighten-4" class="bubble-menu">
      <actions-render :actions="actions" :editor="editor" />
    </v-sheet>
  </bubble-menu>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { type Editor } from "@tiptap/vue-2";
import { BubbleMenu } from "@tiptap/vue-2/menus";

import { VSheet } from "vuetify/lib";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import ActionsRender from "@/components/ActionsRender.vue";
import I18nMixin from "@/mixins/I18nMixin";

export default defineComponent({
  components: {
    ActionsRender,
    BubbleMenu,
    VSheet,
  },
  mixins: [I18nMixin],
  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    actions: {
      type: Array as PropType<ExtensionActionInterface[]>,
      default: (): ExtensionActionInterface[] => [],
    },
  },
});
</script>
