import { TableRow as TableRowOriginal } from "@tiptap/extension-table";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import AbstractExtension from "@/extensions/AbstractExtension";

export default class TableRow extends AbstractExtension {
  constructor(options: any) {
    super(options, TableRowOriginal);
  }

  get availableActions(): ExtensionActionInterface[] {
    return [];
  }
}
