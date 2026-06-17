<template>
  <div class="tiptap-color-picker">
    <v-btn
      :id="$id('color-btn')"
      small
      icon
      :disabled="disabled"
      :dark="dark"
      :class="{
        'tiptap-vuetify-editor__action-render-btn': true,
        'v-btn--active': options.isActive(editor),
      }"
      class="tiptap-color-picker__action-btn rounded"
      @click="applyColor"
    >
      <component
        :is="isTextIcon ? 'b' : 'v-icon'"
        class="tiptap-vuetify-editor__btn-icon"
        >{{ mainIcon }}</component
      >
      <div
        class="tiptap-color-picker__color-bar"
        :style="{ backgroundColor: options.colorState.selectedColor }"
      />
    </v-btn>

    <v-menu
      v-model="menuOpen"
      offset-y
      :content-class="editorInstanceUId"
      :close-on-content-click="false"
    >
      <template #activator="{ on: menuOn }">
        <v-btn
          icon
          plain
          :disabled="disabled"
          :dark="dark"
          class="tiptap-color-picker__dropdown-btn"
          v-on="menuOn"
        >
          <v-icon small>{{ dropdownArrowIcon }}</v-icon>
        </v-btn>
      </template>

      <v-card class="tiptap-color-picker__palette pa-2">
        <div
          class="tiptap-color-picker__grid"
          :style="{ width: gridWidth + 'px' }"
        >
          <v-btn
            v-for="color in options.colors"
            :key="color"
            depressed
            x-small
            class="tiptap-color-picker__swatch ma-1"
            :style="{ backgroundColor: color }"
            :aria-label="color"
            @click="selectColor(color)"
          >
            <v-icon
              v-if="isCurrentColor(color)"
              x-small
              :style="{ color: contrastColor(color) }"
              >{{ checkIcon }}</v-icon
            >
          </v-btn>
        </div>
        <div class="tiptap-color-picker__reset mt-2">
          <v-btn text small block @click="resetColor">
            {{ resetLabel }}
          </v-btn>
        </div>
      </v-card>
    </v-menu>

    <v-tooltip
      top
      :disabled="!tooltipText"
      :activator="$idRef('color-btn')"
      :content-class="editorInstanceUId"
    >
      <span>{{ tooltipText }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Editor } from "@tiptap/vue-2";

import { VBtn, VMenu, VCard, VIcon, VTooltip } from "vuetify/lib";

import { VuetifyIconsGroups } from "@/configs/theme";
import TextIcon from "@/extensions/nativeExtensions/icons/TextIcon";
import type { ExtensionActionRenderColorPickerOptionsInterface } from "./ExtensionActionRenderColorPickerOptionsInterface";

const DROPDOWN_ARROW_ICONS: Record<string, string> = {
  [VuetifyIconsGroups.md]: "arrow_drop_down",
  [VuetifyIconsGroups.fa]: "fas fa-caret-down",
  [VuetifyIconsGroups.mdi]: "mdi-menu-down",
  [VuetifyIconsGroups.mdiSvg]: "M7,10L12,15L17,10H7Z",
};

const CHECK_ICONS: Record<string, string> = {
  [VuetifyIconsGroups.md]: "check",
  [VuetifyIconsGroups.fa]: "fas fa-check",
  [VuetifyIconsGroups.mdi]: "mdi-check",
  [VuetifyIconsGroups.mdiSvg]:
    "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",
};

const SWATCH_SIZE = 24;
const SWATCH_MARGIN = 4;

export default defineComponent({
  components: { VBtn, VMenu, VCard, VIcon, VTooltip },
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
      type: Object as PropType<ExtensionActionRenderColorPickerOptionsInterface>,
      required: true,
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menuOpen: false,
    };
  },
  computed: {
    iconsGroup(): string {
      return (this as any).$tiptapVuetify.iconsGroup;
    },
    mainIcon(): string {
      const icon =
        this.options.icons[this.iconsGroup as keyof typeof VuetifyIconsGroups];
      return icon ? String(icon) : "";
    },
    isTextIcon(): boolean {
      const icon =
        this.options.icons[this.iconsGroup as keyof typeof VuetifyIconsGroups];
      return icon instanceof TextIcon;
    },
    dropdownArrowIcon(): string {
      return DROPDOWN_ARROW_ICONS[this.iconsGroup] ?? "mdi-menu-down";
    },
    checkIcon(): string {
      return CHECK_ICONS[this.iconsGroup] ?? "mdi-check";
    },
    gridColumns(): number {
      return this.options.gridColumns ?? 5;
    },
    gridWidth(): number {
      return this.gridColumns * (SWATCH_SIZE + SWATCH_MARGIN * 2);
    },
    tooltipText(): string | null {
      const { tooltip } = this.options;
      if (!tooltip) return null;
      if (typeof tooltip === "function") {
        return String(tooltip(this.editor, this.options));
      }
      return String(tooltip);
    },
    editorInstanceUId(): string | undefined {
      return (this.editor.options as any)?.editorInstanceUId;
    },
    resetLabel(): string {
      return String(this.options.resetButtonLabel);
    },
  },
  methods: {
    applyColor() {
      if (this.options.isActive(this.editor)) {
        this.options.onReset(this.editor);
      } else {
        this.options.onColorSelect(
          this.editor,
          this.options.colorState.selectedColor,
        );
      }
    },
    selectColor(color: string) {
      this.options.onColorSelect(this.editor, color);
      this.menuOpen = false;
    },
    resetColor() {
      this.options.onReset(this.editor);
      this.menuOpen = false;
    },
    isCurrentColor(color: string): boolean {
      return color === this.options.colorState.selectedColor;
    },
    contrastColor(hex: string): string {
      if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return "#000000";
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? "#000000" : "#ffffff";
    },
  },
});
</script>

<style lang="scss">
.tiptap-color-picker {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  margin: 2px 2px;

  &__action-btn {
    position: relative !important;
    overflow: visible !important;
    margin: 0 !important;
  }

  &__dropdown-btn {
    min-width: 14px !important;
    width: 14px !important;
    height: 24px !important;
    margin: 0 4px 0 0 !important;
  }

  &__color-bar {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 18px;
    height: 3px;
    border-radius: 1px;
    pointer-events: none;
  }

  &__palette {
    overflow: visible;
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
  }

  &__swatch {
    width: 24px !important;
    height: 24px !important;
    min-width: 24px !important;
    border-radius: 4px !important;
    border: none !important;
    padding: 0 !important;
    box-shadow: none !important;
  }

  &__reset {
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    padding-top: 4px;
  }
}
</style>
