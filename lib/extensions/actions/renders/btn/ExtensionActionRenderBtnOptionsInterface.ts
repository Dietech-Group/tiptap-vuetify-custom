import { Editor } from "@tiptap/vue-2";

import type IconInterface from "@/extensions/nativeExtensions/icons/IconInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import I18nText from "@/i18n/I18nText";

export interface ExtensionActionRenderBtnOptionsInterface {
  tooltip?:
    | string
    | I18nText
    | ((editor: Editor, options: any) => string | I18nText)
    | null;
  onClick: ({ editor }: { editor: Editor }) => any;
  onClickCommand?: string;
  onClickOptions?: Record<string, any>;
  isActive: (editor: Editor) => boolean;
  isActiveOptions?: Record<string, any>;
  nativeExtensionName?: string;
}

export interface ExtensionActionRenderIconBtnOptionsInterface
  extends ExtensionActionRenderBtnOptionsInterface {
  icons: Partial<{
    [key in keyof typeof VuetifyIconsGroups]: IconInterface;
  }>;
}

export interface ExtensionActionRenderTextBtnOptionsInterface
  extends ExtensionActionRenderBtnOptionsInterface {
  text: string;
}

export function isIconBtnOptions(
  options: any,
): options is ExtensionActionRenderIconBtnOptionsInterface {
  return (
    typeof options === "object" && options !== null && "icons" in options // Check if 'icons' property exists
  );
}

export function isTextBtnOptions(
  options: any,
): options is ExtensionActionRenderTextBtnOptionsInterface {
  return (
    typeof options === "object" && options !== null && "text" in options // Check if 'text' property exists
  );
}
