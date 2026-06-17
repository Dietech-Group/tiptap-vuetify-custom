import Vue from "vue";

import { Highlight as HighlightOriginal } from "@tiptap/extension-highlight";
import { Editor } from "@tiptap/vue-2";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import AbstractExtension from "@/extensions/AbstractExtension";
import ExtensionActionRenderColorPicker from "@/extensions/actions/renders/colorPicker/ExtensionActionRenderColorPicker";
import type { ColorState } from "@/extensions/actions/renders/colorPicker/ExtensionActionRenderColorPickerOptionsInterface";
import VuetifyIcon from "@/extensions/nativeExtensions/icons/VuetifyIcon";
import I18nText from "@/i18n/I18nText";

import colors from "vuetify/lib/util/colors";

export const DEFAULT_HIGHLIGHT_COLORS = [
  colors.yellow.lighten3,
  colors.orange.lighten3,
  colors.deepOrange.lighten3,
  colors.pink.lighten3,
  colors.deepPurple.lighten4,
  colors.blue.lighten4,
  colors.teal.lighten4,
  colors.green.lighten4,
  colors.brown.lighten4,
  colors.grey.lighten2,
];

export default class HighlightColor extends AbstractExtension {
  private readonly colorState: ColorState;

  constructor(options: any = {}) {
    super({ multicolor: true, ...options }, HighlightOriginal);

    this.colorState = Vue.observable({
      selectedColor: options?.defaultColor ?? colors.yellow.lighten3,
    });
  }

  get availableActions(): ExtensionActionInterface[] {
    const { colorState } = this;
    const presetColors: string[] =
      this.options?.presetColors ?? DEFAULT_HIGHLIGHT_COLORS;

    return [
      {
        render: new ExtensionActionRenderColorPicker({
          tooltip: new I18nText("extensions.Highlight.buttons.tooltip"),
          icons: {
            [VuetifyIconsGroups.md]: new VuetifyIcon("border_color"),
            [VuetifyIconsGroups.fa]: new VuetifyIcon("fas fa-highlighter"),
            [VuetifyIconsGroups.mdi]: new VuetifyIcon(
              "mdi-format-color-highlight",
            ),
            [VuetifyIconsGroups.mdiSvg]: new VuetifyIcon(
              "M6,20A2,2 0 0,1 4,18C4,17.5 4.2,17 4.6,16.6L10.3,11H14.5C14.5,11 16,12.5 16,13V17.2L10.4,16.6C10,17 9.5,17.2 9,17.2A2,2 0 0,1 7,15.2C7,14.3 7.7,13.6 8.6,13.4L13,9.5V8.5L7.6,7A2,2 0 0,1 9,4C9.5,4 10,4.2 10.4,4.6L16.6,10.8L17.6,10L20,12.4L16,16.4L13.5,13.9L13,14.5V17.9L9.5,17.4C9.2,17.8 8.7,18 8.2,18C7.6,18 7.1,17.7 6.8,17.3L6,20Z",
            ),
          },
          colors: presetColors,
          colorState,
          gridColumns: 5,
          resetButtonLabel: new I18nText(
            "extensions.Highlight.buttons.removeHighlight",
          ),
          onColorSelect: (editor: Editor, color: string) => {
            colorState.selectedColor = color;
            editor.chain().focus().setHighlight({ color }).run();
          },
          onReset: (editor: Editor) => {
            editor.chain().focus().unsetHighlight().run();
          },
          isActive: (editor: Editor) => editor.isActive("highlight"),
        }),
      },
    ];
  }
}
