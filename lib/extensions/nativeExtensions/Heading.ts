import { Heading as HeadingOriginal } from "@tiptap/extension-heading";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import AbstractExtension from "@/extensions/AbstractExtension";
import { ExtensionActionRenderIconBtn } from "@/extensions/actions/renders/btn/ExtensionActionRenderBtn";
import TextIcon from "@/extensions/nativeExtensions/icons/TextIcon";
import I18nText from "@/i18n/I18nText";

export default class Heading extends AbstractExtension {
  constructor(options: any) {
    super(options, HeadingOriginal);
  }

  get availableActions(): ExtensionActionInterface[] {
    return this.options.levels.map((level: number) => ({
      render: new ExtensionActionRenderIconBtn({
        tooltip: new I18nText("extensions.Heading.buttons.heading.tooltip", {
          level,
        }),
        icons: {
          [VuetifyIconsGroups.md]: new TextIcon("H" + level),
          [VuetifyIconsGroups.fa]: new TextIcon("H" + level),
          [VuetifyIconsGroups.mdi]: new TextIcon("H" + level),
          [VuetifyIconsGroups.mdiSvg]: new TextIcon("H" + level),
        },
        nativeExtensionName: "heading",
        onClickOptions: { level },
        isActiveOptions: { level },
        onClickCommand: "toggleHeading",
      }),
    }));
  }
}
