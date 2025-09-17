<template>
  <v-tooltip top>
    <!--:disabled="isButtonDisabled(commands, button)"-->
    <template #activator="{ on }">
      <v-btn
        :disabled="disabled"
        :class="{
          'tiptap-vuetify-editor__action-render-btn': true,
          'v-btn--active': options.isActive(editor),
        }"
        :dark="dark"
        small
        icon
        v-on="on"
        @click="options.onClick({ editor: editor })"
      >
        <component
          :is="isTextIcon ? 'b' : isVuetifyIcon ? 'v-icon' : null"
          class="tiptap-vuetify-editor__btn-icon"
        >
          {{ buttonIcon }}
        </component>
      </v-btn>
    </template>
    <span>{{ tooltipText }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Editor } from "@tiptap/vue-2";

import { VTooltip, VBtn, VIcon } from "vuetify/lib";

import type { ExtensionActionRenderBtnOptionsInterface } from "./ExtensionActionRenderBtnOptionsInterface";
import type IconInterface from "@/extensions/nativeExtensions/icons/IconInterface";

import TextIcon from "@/extensions/nativeExtensions/icons/TextIcon";
import VuetifyIcon from "@/extensions/nativeExtensions/icons/VuetifyIcon";
import ConsoleLogger from "@/logging/ConsoleLogger";

export const PROPS = {
  EDITOR: "editor" as const,
  OPTIONS: "options" as const,
  DARK: "dark" as const,
  DISABLED: "disabled" as const,
};

export default defineComponent({
  components: { VTooltip, VBtn, VIcon },
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
      type: Object as PropType<ExtensionActionRenderBtnOptionsInterface>,
      required: true,
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonIcon(): IconInterface {
      const icon = this.options.icons[this.$tiptapVuetify.iconsGroup];

      if (!icon) {
        ConsoleLogger.warn("No icon was provided in extension options.");

        return "No icon";
      }

      return icon;
    },
    isTextIcon() {
      return this.buttonIcon instanceof TextIcon;
    },
    isVuetifyIcon() {
      return this.buttonIcon instanceof VuetifyIcon;
    },
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

<style lang="scss">
.tiptap-vuetify-editor__action-render-btn {
  margin: 2px 6px;
}

.tiptap-vuetify-editor__btn-icon.v-icon.fas {
  font-size: 16px;
}
</style>
