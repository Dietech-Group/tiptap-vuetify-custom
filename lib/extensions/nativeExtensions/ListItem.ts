import { ListItem as ListItemOriginal } from "@tiptap/extension-list";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import AbstractExtension from "@/extensions/AbstractExtension";

export default class ListItem extends AbstractExtension {
  constructor(options: any) {
    super(options, ListItemOriginal);
  }

  get availableActions(): ExtensionActionInterface[] {
    return [];
  }
}
