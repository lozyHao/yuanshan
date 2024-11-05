import CanvasDraw from "./canvasDraw";

interface ImageTextItem {
  type: "image" | "text";
  content: File | string;
  width?: number;
  height?: number;
}

type Position = "center" | "left" | "right";

class GroupFactory {
  private canvasDraw: CanvasDraw;
  private fontRatio = 1 / 30; // width/height:600px font:20px

  constructor(canvasDraw: CanvasDraw) {
    this.canvasDraw = canvasDraw;
  }

  /**
   * 绘制图片
   */
  async drawImage(
    image: File,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    await this.canvasDraw.drawImage(image, x, y, width, height);
  }

  /**
   * 动态计算文本宽度
   * @param text 文本内容
   * @param fontSize 字体大小
   * @param font 字体
   */
  private measureTextWidth(
    text: string,
    fontSize: number,
    font: string
  ): number {
    this.canvasDraw.ctx.font = `${fontSize}px ${font}`;
    const metrics = this.canvasDraw.ctx.measureText(text);
    return metrics.width;
  }

  /**
   * 绘制图片和文本列表，并确保它们整体水平居中
   * @param items 图片和文本配置数组
   */
  async drawItems(
    items: ImageTextItem[],
    x: Position = "center",
    y: number
  ): Promise<string> {
    let totalWidth = 0;
    let maxHeight = 0;

    // 首先计算所有元素的总宽度和最大高度
    for (const item of items) {
      if (item.type === "image") {
        const { width, height } = await this.canvasDraw.getImageURL(
          item.content as File
        );
        totalWidth += width + 10; // 假设每个图片右侧有10px的间距
        maxHeight = Math.max(maxHeight, height);
      } else {
        const width = this.measureTextWidth(
          item.content as string,
          14,
          "Arial"
        );
        totalWidth += width + 10; // 假设每个文本右侧有10px的间距
        maxHeight = Math.max(maxHeight, 20); // 假设文本高度为20px
      }
    }

    let currentX: number;
    switch (x) {
      case "center":
        currentX = (this.canvasDraw.width - totalWidth) / 2;
        break;
      case "left":
        currentX = 0;
        break;
      case "right":
        currentX = this.canvasDraw.width - totalWidth;
        break;
      default:
        currentX = (this.canvasDraw.width - totalWidth) / 2;
    }

    // 然后根据计算出的总宽度和最大高度绘制每个元素
    for (const item of items) {
      if (item.type === "image") {
        const { width, height } = await this.canvasDraw.getImageURL(
          item.content as File
        );
        this.canvasDraw.drawImage(
          item.content as File,
          currentX,
          this.canvasDraw.height - maxHeight - 20,
          width,
          height
        );
        currentX += width + 10;
      } else {
        const textWidth = this.measureTextWidth(
          item.content as string,
          14,
          "Arial"
        );
        this.canvasDraw.drawText(
          item.content as string,
          "Arial",
          currentX,
          this.canvasDraw.height - maxHeight - 20,
          "black",
          14,
          "normal",
          "left"
        );
        currentX += textWidth + 10;
      }
    }

    // 返回Canvas的DataURL
    return this.canvasDraw.getDataURL();
  }
}

export default GroupFactory;
