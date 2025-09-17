import { HorizontalRule as HorizontalRuleOriginal } from "@tiptap/extension-horizontal-rule";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import AbstractExtension from "@/extensions/AbstractExtension";
import ExtensionActionRenderBtn from "@/extensions/actions/renders/btn/ExtensionActionRenderBtn";
import TextIcon from "@/extensions/nativeExtensions/icons/TextIcon";
import VuetifyIcon from "@/extensions/nativeExtensions/icons/VuetifyIcon";
import I18nText from "@/i18n/I18nText";

export default class HorizontalRule extends AbstractExtension {
  constructor(options: any) {
    super(options, HorizontalRuleOriginal);
  }

  get availableActions(): ExtensionActionInterface[] {
    return [
      {
        render: new ExtensionActionRenderBtn({
          tooltip: new I18nText(
            "extensions.HorizontalRule.buttons.horizontalRule.tooltip",
          ),
          icons: {
            [VuetifyIconsGroups.md]: new TextIcon("—"),
            [VuetifyIconsGroups.fa]: new VuetifyIcon("fas fa-minus"),
            [VuetifyIconsGroups.mdi]: new VuetifyIcon("mdi-minus"),
            [VuetifyIconsGroups.mdiSvg]: new VuetifyIcon("M19,13H5V11H19V13Z"),
          },
          nativeExtensionName: "horizontalRule",
          onClickCommand: "setHorizontalRule",
        }),
      },
    ];
  }
}
