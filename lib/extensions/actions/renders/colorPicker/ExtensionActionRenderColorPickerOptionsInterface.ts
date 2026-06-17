import { Editor } from "@tiptap/vue-2";

import type IconInterface from "@/extensions/nativeExtensions/icons/IconInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import I18nText from "@/i18n/I18nText";

export interface ColorState {
  selectedColor: string;
}

export interface ExtensionActionRenderColorPickerOptionsInterface {
  tooltip?:
    | string
    | I18nText
    | ((editor: Editor, options: any) => string | I18nText)
    | null;
  icons: Partial<{ [key in keyof typeof VuetifyIconsGroups]: IconInterface }>;
  colors: string[];
  colorState: ColorState;
  gridColumns?: number;
  resetButtonLabel: string | I18nText;
  onColorSelect: (editor: Editor, color: string) => void;
  onReset: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}
