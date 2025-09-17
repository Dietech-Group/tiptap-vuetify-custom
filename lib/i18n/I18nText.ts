import { getMsg } from "@/i18n/index";

export default class I18nText {
  text: string;

  constructor(path: string, args?: any) {
    this.text = getMsg(path, args);
  }

  toString() {
    return this.text;
  }
}
