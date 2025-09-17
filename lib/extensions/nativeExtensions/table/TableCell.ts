import { TableCell as TableCellOriginal } from "@tiptap/extension-table";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import AbstractExtension from "@/extensions/AbstractExtension";

export default class TableCell extends AbstractExtension {
  constructor(options: any) {
    super(options, TableCellOriginal);
  }

  get availableActions(): ExtensionActionInterface[] {
    return [];
  }
}
