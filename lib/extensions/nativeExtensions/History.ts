import { UndoRedo as HistoryOriginal } from "@tiptap/extensions";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import AbstractExtension from "@/extensions/AbstractExtension";
import { ExtensionActionRenderIconBtn } from "@/extensions/actions/renders/btn/ExtensionActionRenderBtn";
import VuetifyIcon from "@/extensions/nativeExtensions/icons/VuetifyIcon";
import I18nText from "@/i18n/I18nText";

export default class History extends AbstractExtension {
  constructor(options: any) {
    super(options, HistoryOriginal);
  }

  get availableActions(): ExtensionActionInterface[] {
    // если не нужны кнокпи
    if (this.options?.noActions) return [];

    return [
      {
        render: new ExtensionActionRenderIconBtn({
          tooltip: new I18nText("extensions.History.buttons.undo.tooltip"),
          icons: {
            [VuetifyIconsGroups.md]: new VuetifyIcon("undo"),
            [VuetifyIconsGroups.fa]: new VuetifyIcon("fas fa-undo"),
            [VuetifyIconsGroups.mdi]: new VuetifyIcon("mdi-undo"),
            [VuetifyIconsGroups.mdiSvg]: new VuetifyIcon(
              "M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z",
            ),
          },
          nativeExtensionName: "undo",
          onClickCommand: "undo",
        }),
      },
      {
        render: new ExtensionActionRenderIconBtn({
          tooltip: new I18nText("extensions.History.buttons.redo.tooltip"),
          icons: {
            [VuetifyIconsGroups.md]: new VuetifyIcon("redo"),
            [VuetifyIconsGroups.fa]: new VuetifyIcon("fas fa-redo"),
            [VuetifyIconsGroups.mdi]: new VuetifyIcon("mdi-redo"),
            [VuetifyIconsGroups.mdiSvg]: new VuetifyIcon(
              "M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z",
            ),
          },
          nativeExtensionName: "redo",
          onClickCommand: "redo",
        }),
      },
    ];
  }
}
