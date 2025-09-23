import CustomTaskItemNode from "./CustomTaskItemNode";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import AbstractExtension from "@/extensions/AbstractExtension";

export default class TaskItem extends AbstractExtension {
  constructor(options: any) {
    super(options, CustomTaskItemNode);
  }

  get availableActions(): ExtensionActionInterface[] {
    return [];
  }
}
