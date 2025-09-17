import { TaskItem as TodoItemOriginal } from "@tiptap/extension-list";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import AbstractExtension from "@/extensions/AbstractExtension";

export default class TodoItem extends AbstractExtension {
  constructor(options: any) {
    super(options, TodoItemOriginal);
  }

  get availableActions(): ExtensionActionInterface[] {
    return [];
  }
}
