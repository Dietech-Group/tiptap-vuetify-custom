<template>
  <v-menu offset-y>
    <template #activator="{ on: onMenu, attrs }">
      <action-btn
        :options="{
          tooltip: options.tooltip,
          icons: options.icons,
          isActive: () => isActive,
          onClick: () => {},
        }"
        :editor="editor"
        :dark="dark"
        :disabled="disabled"
        v-bind="attrs"
        :on="onMenu"
      />
    </template>
    <v-list>
      <slot :actions="options.actions">
        <template v-for="(action, ii) in options.actions">
          <action-list-item
            v-if="isBtn(action)"
            :key="`action-menu-entry-${ii}`"
            :options="action.render.options"
            :editor="editor"
            :dark="dark"
            :disabled="disabled"
          />
        </template>
      </slot>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Editor } from "@tiptap/vue-2";

import { VMenu, VList } from "vuetify/lib";

import type { ExtensionActionRenderMenuOptionsInterface } from "./ExtensionActionRenderMenuOptionsInterface";
import { isBtn } from "../btn/ExtensionActionRenderBtn";
import ExtensionActionRenderBtnComponent from "../btn/ExtensionActionRenderBtn.vue";
import ExtensionActionRenderMenuListItemComponent from "./ExtensionActionRenderMenuListItem.vue";

export default defineComponent({
  components: {
    "action-btn": ExtensionActionRenderBtnComponent,
    "action-list-item": ExtensionActionRenderMenuListItemComponent,
    VMenu,
    VList,
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
      type: Object as PropType<ExtensionActionRenderMenuOptionsInterface>,
      required: true,
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isActive() {
      return this.options.actions.some((action) =>
        action.render.options.isActive(this.editor),
      );
    },
  },
  methods: {
    isBtn,
  },
});
</script>
