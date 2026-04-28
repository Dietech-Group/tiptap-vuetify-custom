import type { VueConstructor } from "vue";

import {
  type FileTypesType,
  type MaxFileSizeType,
  type FilterErrorFuncType,
} from "@/extensions/helper/FileSelector";

export type Action = "upload" | "addExisting";
export type Actions = Action | Action[];

/**
 * Shared options for extensions that let the user upload a new file or pick an
 * existing one (file, image, …). Generic over the shape of the upload result
 * and the items returned by the picker so each extension can specialise them.
 */
export interface UploadSelectOptions<TUploadResult, TSelectItem> {
  /**
   * Any combination of 'upload' | 'addExisting' which disables these actions.
   */
  disableActions?: Actions;

  /**
   * Controls which file types are allowed to insert/drop.
   * @param fileTypes
   * @example ['application/pdf']
   */
  includedFileTypes: FileTypesType;

  /**
   * Controls which file types are not allowed to insert/drop.
   * @param fileTypes
   * @example ['application/pdf']
   */
  excludedFileTypes: FileTypesType;

  /**
   * Controls the allowed max file size of dropped files.
   * @param maxFileSize - Defaults to: null
   * @example 1073741824
   */
  maxFileSize: MaxFileSizeType;

  /**
   * Callback function which is called for every dropped file which is rejected because of file type or size.
   * @param filterErrorFunc - Defaults to: null
   * @example (type, file) => { console.log(type, file) }
   */
  filterErrorFunc: FilterErrorFuncType;

  /**
   * A function to upload a file to a server.
   * @param file - File object
   * @param onSuccess Callback for a successful upload — receives the new id and
   *   any extension-specific data the consumer needs to insert the node.
   * @param onError Error callback when the upload fails
   * @param onProgress Progress callback called with the upload progress as a
   *   fraction (0–1)
   */
  upload?: (
    file: File,
    onSuccess: (result: TUploadResult) => void,
    onError: (error: string) => void,
    onProgress: (progress: number) => void,
  ) => void;

  /**
   * A function to cancel all remaining uploads.
   */
  cancelRemainingUploads?: () => void;

  /**
   * Configures the "add existing" picker. `load` is invoked by the dialog to
   * fetch pages of existing items. The default dialog can be replaced via
   * `component`.
   */
  select?: {
    component?: VueConstructor;
    load: (params: {
      query: string;
      page: number;
      callback: (
        items: TSelectItem[],
        page: number,
        allPagesLoaded: boolean,
      ) => void;
    }) => void;
  };
}

/**
 * True when `action` is listed in `disableActions`.
 */
function isActionDisabled(
  action: Action,
  disableActions: Actions | undefined,
): boolean {
  if (!disableActions) return false;
  if (Array.isArray(disableActions)) return disableActions.includes(action);
  return disableActions === action;
}

/**
 * True when the upload action is enabled and the upload function is provided.
 */
export function isUploadEnabled(
  options: UploadSelectOptions<any, any>,
): boolean {
  return (
    !isActionDisabled("upload", options.disableActions) && !!options.upload
  );
}

/**
 * True when the addExisting action is enabled and the select function is provided.
 */
export function isAddExistingEnabled(
  options: UploadSelectOptions<any, any>,
): boolean {
  return (
    !isActionDisabled("addExisting", options.disableActions) && !!options.select
  );
}
