import { Italic as ItalicOriginal } from "@tiptap/extension-italic";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import AbstractExtension from "@/extensions/AbstractExtension";
import { ExtensionActionRenderIconBtn } from "@/extensions/actions/renders/btn/ExtensionActionRenderBtn";
import VuetifyIcon from "@/extensions/nativeExtensions/icons/VuetifyIcon";
import I18nText from "@/i18n/I18nText";

export default class Italic extends AbstractExtension {
  constructor(options: any) {
    super(options, ItalicOriginal);
  }

  get availableActions(): ExtensionActionInterface[] {
    return [
      {
        render: new ExtensionActionRenderIconBtn({
          tooltip: new I18nText("extensions.Italic.buttons.italic.tooltip"),
          icons: {
            [VuetifyIconsGroups.md]: new VuetifyIcon("format_italic"),
            [VuetifyIconsGroups.fa]: new VuetifyIcon("fas fa-italic"),
            [VuetifyIconsGroups.mdi]: new VuetifyIcon("mdi-format-italic"),
            [VuetifyIconsGroups.mdiSvg]: new VuetifyIcon(
              "M10,4V7H12.21L8.79,15H6V18H14V15H11.79L15.21,7H18V4H10Z",
            ),
          },
          nativeExtensionName: "italic",
          onClickCommand: "toggleItalic",
        }),
      },
    ];
  }
}
