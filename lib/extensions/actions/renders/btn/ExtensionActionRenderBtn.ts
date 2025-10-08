import type {
  ExtensionActionRenderBtnOptionsInterface,
  ExtensionActionRenderIconBtnOptionsInterface,
  ExtensionActionRenderTextBtnOptionsInterface,
} from "@/extensions/actions/renders/btn/ExtensionActionRenderBtnOptionsInterface";
import ExtensionActionInterface from "../../ExtensionActionInterface";

import { UnionCommands } from "@tiptap/core";

type OptionalOptionsType = "onClick" | "isActive";

class ExtensionActionRenderBtn<
  T extends ExtensionActionRenderBtnOptionsInterface,
> {
  options: T;

  constructor(
    options: Omit<T, OptionalOptionsType> &
      Partial<Pick<T, OptionalOptionsType>>,
  ) {
    const nativeExtensionName = options.nativeExtensionName!;

    this.options = {
      onClick({ editor }) {
        if (options.onClickCommand) {
          (
            editor.chain().focus()[
              options.onClickCommand as keyof UnionCommands
            ] as any
          )(options.onClickOptions)?.run();
        }
      },
      isActive(editor) {
        return editor.isActive(nativeExtensionName, options.isActiveOptions);
      },
      ...options,
    } as T;
  }
}

export class ExtensionActionRenderIconBtn extends ExtensionActionRenderBtn<ExtensionActionRenderIconBtnOptionsInterface> {
  constructor(
    options: Omit<
      ExtensionActionRenderIconBtnOptionsInterface,
      OptionalOptionsType
    > &
      Partial<
        Pick<ExtensionActionRenderIconBtnOptionsInterface, OptionalOptionsType>
      >,
  ) {
    super(options);
  }
}

export class ExtensionActionRenderTextBtn extends ExtensionActionRenderBtn<ExtensionActionRenderTextBtnOptionsInterface> {
  constructor(
    options: Omit<
      ExtensionActionRenderTextBtnOptionsInterface,
      OptionalOptionsType
    > &
      Partial<
        Pick<ExtensionActionRenderTextBtnOptionsInterface, OptionalOptionsType>
      >,
  ) {
    super(options);
  }
}

export function isBtn(action: ExtensionActionInterface): boolean {
  return (
    action.render instanceof ExtensionActionRenderIconBtn ||
    action.render instanceof ExtensionActionRenderTextBtn
  );
}
