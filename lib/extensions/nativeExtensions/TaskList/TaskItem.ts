import { TaskItem as TaskItemOriginal } from "@tiptap/extension-list";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import AbstractExtension from "@/extensions/AbstractExtension";

export default class TaskItem extends AbstractExtension {
  constructor(options: any) {
    super(options, TaskItemOriginal);
  }

  get availableActions(): ExtensionActionInterface[] {
    return [];
  }
}
