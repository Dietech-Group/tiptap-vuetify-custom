import { Editor } from "@tiptap/vue-2";

import type IconInterface from "@/extensions/nativeExtensions/icons/IconInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import I18nText from "@/i18n/I18nText";

export interface ExtensionActionRenderBtnOptionsInterface {
  tooltip:
    | string
    | I18nText
    | ((editor: Editor, options: any) => string | I18nText);
  icons: Partial<{
    [key in keyof typeof VuetifyIconsGroups]: IconInterface;
  }>;
  onClick: ({ editor }: { editor: Editor }) => any;
  onClickCommand?: string;
  onClickOptions?: Record<string, any>;
  isActive: (editor: Editor) => boolean;
  isActiveOptions?: Record<string, any>;
  nativeExtensionName?: string;
}
