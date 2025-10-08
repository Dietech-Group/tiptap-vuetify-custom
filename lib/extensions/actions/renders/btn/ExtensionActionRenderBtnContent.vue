<template>
  <component
    :is="isTextIcon ? 'b' : isVuetifyIcon ? 'v-icon' : null"
    v-if="isIconBtnOptions(options)"
    class="tiptap-vuetify-editor__btn-icon"
  >
    {{ buttonIcon }}
  </component>
  <div v-else-if="isTextBtnOptions(options)">
    {{ buttonText }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { VIcon } from "vuetify/lib";

import {
  type ExtensionActionRenderIconBtnOptionsInterface,
  type ExtensionActionRenderTextBtnOptionsInterface,
  isIconBtnOptions,
  isTextBtnOptions,
} from "./ExtensionActionRenderBtnOptionsInterface";
import type IconInterface from "@/extensions/nativeExtensions/icons/IconInterface";

import TextIcon from "@/extensions/nativeExtensions/icons/TextIcon";
import VuetifyIcon from "@/extensions/nativeExtensions/icons/VuetifyIcon";
import ConsoleLogger from "@/logging/ConsoleLogger";

export default defineComponent({
  components: { VIcon },
  props: {
    options: {
      type: Object as PropType<
        | ExtensionActionRenderIconBtnOptionsInterface
        | ExtensionActionRenderTextBtnOptionsInterface
      >,
      required: true,
    },
  },
  computed: {
    buttonIcon(): IconInterface {
      const iconBtnOptions = this
        .options as ExtensionActionRenderIconBtnOptionsInterface;
      const icon = iconBtnOptions.icons[this.$tiptapVuetify.iconsGroup];

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
    buttonText() {
      const textBtnOptions = this
        .options as ExtensionActionRenderTextBtnOptionsInterface;
      return textBtnOptions.text;
    },
  },
  methods: {
    isIconBtnOptions,
    isTextBtnOptions,
  },
});
</script>

<style lang="scss">
.tiptap-vuetify-editor__btn-icon.v-icon.fas {
  font-size: 16px;
}
</style>
