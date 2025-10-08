import { TaskList as TaskListOriginal } from "@tiptap/extension-list";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import AbstractExtension from "@/extensions/AbstractExtension";
import { ExtensionActionRenderIconBtn } from "@/extensions/actions/renders/btn/ExtensionActionRenderBtn";
import VuetifyIcon from "@/extensions/nativeExtensions/icons/VuetifyIcon";
import I18nText from "@/i18n/I18nText";

export default class TaskList extends AbstractExtension {
  constructor(options: any) {
    super(options, TaskListOriginal);
  }

  get availableActions(): ExtensionActionInterface[] {
    return [
      {
        render: new ExtensionActionRenderIconBtn({
          tooltip: new I18nText("extensions.TaskList.buttons.taskList.tooltip"),
          icons: {
            [VuetifyIconsGroups.md]: new VuetifyIcon("check_box"),
            [VuetifyIconsGroups.fa]: new VuetifyIcon("fas fa-tasks"),
            [VuetifyIconsGroups.mdi]: new VuetifyIcon("mdi-format-list-checks"),
            // mdiFormatListChecks
            [VuetifyIconsGroups.mdiSvg]: new VuetifyIcon(
              "M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z",
            ),
          },
          nativeExtensionName: "taskList",
          onClickCommand: "toggleTaskList",
        }),
      },
    ];
  }
}
