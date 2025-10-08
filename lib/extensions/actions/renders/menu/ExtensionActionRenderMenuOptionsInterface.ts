import { Editor } from "@tiptap/vue-2";

import type IconInterface from "@/extensions/nativeExtensions/icons/IconInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import I18nText from "@/i18n/I18nText";

import type ExtensionActionInterface from "../../ExtensionActionInterface";

export interface ExtensionActionRenderMenuOptionsInterface {
  tooltip:
    | string
    | I18nText
    | ((editor: Editor, options: any) => string | I18nText);
  icons: Partial<{
    [key in keyof typeof VuetifyIconsGroups]: IconInterface;
  }>;
  actions: ExtensionActionInterface[];
}
