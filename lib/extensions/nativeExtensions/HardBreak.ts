import { HardBreak as HardBreakOriginal } from "@tiptap/extension-hard-break";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import AbstractExtension from "@/extensions/AbstractExtension";

export default class HardBreak extends AbstractExtension {
  constructor(options: any) {
    super(options, HardBreakOriginal);
  }

  get availableActions(): ExtensionActionInterface[] {
    return [];
  }
}
