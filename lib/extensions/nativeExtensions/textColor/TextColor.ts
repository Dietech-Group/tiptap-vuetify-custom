import Vue from "vue";

import { TextStyleKit } from "@tiptap/extension-text-style";
import { Editor } from "@tiptap/vue-2";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import AbstractExtension from "@/extensions/AbstractExtension";
import ExtensionActionRenderColorPicker from "@/extensions/actions/renders/colorPicker/ExtensionActionRenderColorPicker";
import type { ColorState } from "@/extensions/actions/renders/colorPicker/ExtensionActionRenderColorPickerOptionsInterface";
import VuetifyIcon from "@/extensions/nativeExtensions/icons/VuetifyIcon";
import I18nText from "@/i18n/I18nText";
import colors from "vuetify/lib/util/colors";

export const DEFAULT_TEXT_COLORS = [
  colors.red.darken2,
  colors.orange.darken2,
  colors.purple.darken1,
  colors.indigo.base,

  colors.green.darken2,
  colors.brown.base,
  colors.grey.darken2,
  colors.grey.base,
];

export default class TextColor extends AbstractExtension {
  private readonly colorState: ColorState;

  constructor(options: any = {}) {
    super(options, null);

    this.nativeExtensionInstance = TextStyleKit.configure({
      backgroundColor: false,
      fontFamily: false,
      fontSize: false,
      lineHeight: false,
    });

    this.colorState = Vue.observable({
      selectedColor: options?.defaultColor ?? colors.red.darken2,
    });
  }

  get availableActions(): ExtensionActionInterface[] {
    const { colorState } = this;
    const presetColors: string[] =
      this.options?.presetColors ?? DEFAULT_TEXT_COLORS;

    return [
      {
        render: new ExtensionActionRenderColorPicker({
          tooltip: new I18nText("extensions.TextColor.buttons.tooltip"),
          icons: {
            [VuetifyIconsGroups.md]: new VuetifyIcon("format_color_text"),
            [VuetifyIconsGroups.fa]: new VuetifyIcon("fas fa-font"),
            [VuetifyIconsGroups.mdi]: new VuetifyIcon("mdi-format-color-text"),
            [VuetifyIconsGroups.mdiSvg]: new VuetifyIcon(
              "M2,20H22V23H2M5.49,17H7.44L8.39,14.17H11.5L12.46,17H14.41L11.47,9H8.43L5.49,17M9.71,10.4H10.2L11.22,13H8.68L9.71,10.4M20,3H4V7H9V19H13V7H20V3Z",
            ),
          },
          colors: presetColors,
          colorState,
          gridColumns: 4,
          resetButtonLabel: new I18nText(
            "extensions.TextColor.buttons.resetColor",
          ),
          onColorSelect: (editor: Editor, color: string) => {
            colorState.selectedColor = color;
            editor.chain().focus().setColor(color).run();
          },
          onReset: (editor: Editor) => {
            editor.chain().focus().unsetColor().run();
          },
          isActive: (editor: Editor) =>
            !!editor.getAttributes("textStyle").color,
        }),
      },
    ];
  }
}
