import { CodeBlock as CodeBlockOriginal } from "@tiptap/extension-code-block";
import { CodeBlockLowlight as CodeBlockLowlightOriginal } from "@tiptap/extension-code-block-lowlight";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import AbstractExtension from "@/extensions/AbstractExtension";
import ExtensionActionRenderBtn from "@/extensions/actions/renders/btn/ExtensionActionRenderBtn";
import VuetifyIcon from "@/extensions/nativeExtensions/icons/VuetifyIcon";
import I18nText from "@/i18n/I18nText";

// TODO text before/after the icon. Do this via an array: [new VuetifyIcon('code'), new TextForIcon('text')]
export default class CodeBlock extends AbstractExtension {
  constructor(options: any) {
    options = options || {};
    super(
      options,
      Object.prototype.hasOwnProperty.call(options, "lowlight")
        ? CodeBlockLowlightOriginal
        : CodeBlockOriginal,
    );
  }

  get availableActions(): ExtensionActionInterface[] {
    return [
      {
        render: new ExtensionActionRenderBtn({
          tooltip: new I18nText(
            "extensions.CodeBlock.buttons.codeBlock.tooltip",
          ),
          icons: {
            [VuetifyIconsGroups.md]: new VuetifyIcon("code"),
            [VuetifyIconsGroups.fa]: new VuetifyIcon("fas fa-code"),
            [VuetifyIconsGroups.mdi]: new VuetifyIcon("mdi-code-tags"),
            [VuetifyIconsGroups.mdiSvg]: new VuetifyIcon(
              "M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z",
            ),
          },
          nativeExtensionName: "codeBlock",
          onClickCommand: "toggleCodeBlock",
        }),
      },
    ];
  }
}
