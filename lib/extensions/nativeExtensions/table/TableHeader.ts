import { TableHeader as TableHeaderOriginal } from "@tiptap/extension-table";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import AbstractExtension from "@/extensions/AbstractExtension";

export default class TableHeader extends AbstractExtension {
  constructor(options: any) {
    super(options, TableHeaderOriginal);
  }

  get availableActions(): ExtensionActionInterface[] {
    return [];
  }
}
