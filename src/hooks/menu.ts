import { Home16Filled } from "@vicons/fluent";
import { Pencil } from "@vicons/tabler";
import { MenuItem } from "@/interfaces/default";

class Menu {
  static navBar: MenuItem[] = [
    {
      label: "首页",
      value: "",
      desc: "首页",
      icon: Home16Filled,
    },
    {
      Label: "即刻创作",
      value: "workSpace",
      desc: "即刻创作: 调节参数、实时预览",
      icon: Pencil,
    },
    // TODO: 未完成
    // {
    //   Label: "自由拼图",
    //   value: "freePuzzle",
    //   desc: "自由拼图: 多图自由拼接修改样式",
    //   icon: PuzzlePiece20Regular,
    // },
    // {
    //   Label: "视频边框",
    //   value: "videoBorder",
    //   desc: "视频边框: 给视频添加边框/水印",
    //   icon: VideoClipMultiple24Regular,
    // },
  ];
}

export default Menu;
