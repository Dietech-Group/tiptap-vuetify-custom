<template>
  <div>
    <template v-for="(action, i) in $props[PROPS.ACTIONS]">
      <action-btn
        v-if="isBtn(action)"
        :key="'action-button-' + i"
        :options="action.render.options"
        :editor="$props[PROPS.EDITOR]"
        :dark="$props[PROPS.DARK]"
        :disabled="$props[PROPS.DISABLED]"
      />
      <action-menu
        v-else-if="isMenu(action)"
        :key="'action-menu-' + i"
        :options="action.render.options"
        :editor="$props[PROPS.EDITOR]"
        :dark="$props[PROPS.DARK]"
        :disabled="$props[PROPS.DISABLED]"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { type Editor } from "@tiptap/vue-2";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import { isBtn } from "@/extensions/actions/renders/btn/ExtensionActionRenderBtn";
import ExtensionActionRenderBtnComponent from "@/extensions/actions/renders/btn/ExtensionActionRenderBtn.vue";

import { isMenu } from "@/extensions/actions/renders/menu/ExtensionActionRenderMenu";
import ExtensionActionRenderMenuComponent from "@/extensions/actions/renders/menu/ExtensionActionRenderMenu.vue";

export const PROPS = {
  EDITOR: "editor" as const,
  ACTIONS: "actions" as const,
  DARK: "dark" as const,
  DISABLED: "disabled" as const,
};

export default defineComponent({
  components: {
    "action-btn": ExtensionActionRenderBtnComponent,
    "action-menu": ExtensionActionRenderMenuComponent,
  },
  props: {
    [PROPS.EDITOR]: {
      type: Object as PropType<Editor>,
      required: true,
    },
    [PROPS.DISABLED]: {
      type: Boolean,
      default: false,
    },
    [PROPS.ACTIONS]: {
      type: Array as PropType<ExtensionActionInterface[]>,
      default: (): ExtensionActionInterface[] => [],
    },
    [PROPS.DARK]: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    PROPS() {
      return PROPS;
    },
  },
  methods: {
    isBtn,
    isMenu,
  },
});
</script>

<style lang="scss">
.tiptap-vuetify-editor__toolbar {
  .v-toolbar {
    .v-toolbar__content {
      height: auto !important;
      flex-wrap: wrap;
    }
  }
}
</style>
