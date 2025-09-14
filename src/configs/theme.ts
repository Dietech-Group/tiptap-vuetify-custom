export const enum VuetifyIconsGroups {
  // default icons in vuetify (official material design icons)
  md = "md",
  mdi = "mdi",
  fa = "fa",
  /*
    Для получения mdiSvg иконки, можно в RunKit запустить код:
    const js = require("@mdi/js")
    console.log(js.mdiClose)
   */
  mdiSvg = "mdiSvg",
}

export default {
  defaultIconsGroup: VuetifyIconsGroups.md,
};
