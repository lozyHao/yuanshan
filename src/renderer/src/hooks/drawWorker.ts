// worker.ts
self.onmessage = async (event) => {
  const { params, image, width, height, callbackId } = event.data
  const result = await draw(params, image, width, height, callbackId)
  postMessage({ result, callbackId })
}

const draw = async (
  params: any,
  image: ImageBitmap,
  width: number,
  height: number,
  callbackId: string
) => {
  const { basic, textList } = params

  // 判断是否有内容绘制
  const haveText =
    textList &&
    (textList.left.length > 0 || textList.right.length > 0 || textList.center.length > 0)

  const CanvasDraw = await import('./canvasDraw')
  const canvasDraw = new CanvasDraw.default(
    width,
    height,
    basic.pattern,
    basic.textBgColorUsed,
    basic.mainImgSize,
    haveText
  )

  // 绘制背景图 / 纯色背景
  if (basic.bgColorUsed) {
    canvasDraw.drawColorBackground({ color: basic.bgColor })
  } else {
    canvasDraw.drawBlurImage({ image, width, height, blur: basic.bgBlur })
  }
  postMessage({ result: 40, callbackId })

  // 绘制主图
  canvasDraw.drawMainImage({
    image,
    width,
    height,
    shadow: basic.shadowSize,
    ratio: basic.mainImgSize,
    radius: basic.roundedSize
  })
  postMessage({ result: 50, callbackId })

  // 绘制边框
  if (basic.textBgColorUsed) {
    canvasDraw.drawTextBackground({ color: basic.textBgColor })
  }
  postMessage({ result: 60, callbackId })

  // TODO: 绘制水印
  if (basic.watermarkUsed && basic.watermark) {
    canvasDraw.drawWatermark({
      image: basic.watermark,
      size: basic.watermarkSize,
      position: basic.watermarkPosition
    })
  }
  postMessage({ result: 70, callbackId })

  // 绘制文字
  // 绘制左侧
  if (textList.left.length) {
    for (let i = 0; i < textList.left.length; i++) {
      const item = textList.left[i]
      canvasDraw.drawItems({
        items: item.items,
        x: 'left',
        y: textList.left.length === 1 ? 0 : i + 1
      })
    }
  }
  postMessage({ result: 80, callbackId })
  // 绘制中间
  if (textList.center.length) {
    for (let i = 0; i < textList.center.length; i++) {
      const item = textList.center[i]
      canvasDraw.drawItems({
        items: item.items,
        x: 'center',
        y: textList.center.length === 1 ? 0 : i + 1
      })
    }
  }
  postMessage({ result: 90, callbackId })
  // 绘制右侧
  if (textList.right.length) {
    for (let i = 0; i < textList.right.length; i++) {
      const item = textList.right[i]
      canvasDraw.drawItems({
        items: item.items,
        x: 'right',
        y: textList.right.length === 1 ? 0 : i + 1
      })
    }
  }
  postMessage({ result: 95, callbackId })

  const imageDataURL = await canvasDraw.getBlob()
  postMessage({ result: 100, callbackId })

  return imageDataURL
}
