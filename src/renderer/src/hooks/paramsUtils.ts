import {
  OptionBasicValues,
  OptionTextTemplateValues,
  OptionLensValues,
  ImageTextItem,
  TextTemplatePositionEnum
} from '@renderer/interfaces/options'
import ExifFactory from './exifFactory'
import { getImageBitmap } from '@renderer/utils/tool'

// 解析拼接参数
export const getParams = async (options: {
  exif: ExifFactory
  basic: OptionBasicValues
  text: OptionTextTemplateValues[]
  lens: OptionLensValues[]
}): Promise<{
  basic: OptionBasicValues
  textList: { [key: string]: { items: ImageTextItem[]; x: TextTemplatePositionEnum }[] }
}> => {
  const { exif, basic, text, lens } = options

  const allList = text.filter((item) => item.position !== 'no')
  const list: { items: ImageTextItem[]; x: TextTemplatePositionEnum }[] = await getTemplate(
    allList,
    lens,
    exif
  )

  // 过滤掉没有内容的项
  const newList = list.filter((item) => {
    if (item.items.length === 0) return false
    return item.items.filter((item) => {
      if (!item.content) return false
      return true
    })
  })

  return {
    basic: {
      ...basic,
      watermark: (await getImageBitmap(basic.watermark as string))?.image || null
    },
    textList: {
      left: newList.filter((item) => item.x === 'left'),
      center: newList.filter((item) => item.x === 'center'),
      right: newList.filter((item) => item.x === 'right')
    }
  }
}

// 解析模板参数
const getTemplate = async (
  list: OptionTextTemplateValues[],
  lens: OptionLensValues[],
  exif: ExifFactory
): Promise<{ items: ImageTextItem[]; x: TextTemplatePositionEnum }[] | []> => {
  if (!list || list.length === 0) return []

  const result: { items: ImageTextItem[]; x: TextTemplatePositionEnum }[] = []
  for (let i = 0; i < list.length; i++) {
    const item: OptionTextTemplateValues = list[i]
    if (item.content) {
      const arr: ImageTextItem[] = []
      for (let i = 0; i < item.content.length; i++) {
        const key = item.content[i]

        const data: ImageTextItem = {
          type: 0,
          content: '',
          size: item.size,
          color: item.color,
          bold: item.bold,
          italic: item.italic,
          font: item.font
        }

        // 校验 这个key 在 exif 上是否存在
        if (Object.prototype.hasOwnProperty.call(exif.exif, key)) {
          // 获取exif的值
          data.content = exif.get(key) as string
        }

        const len = lens.find((len) => len.key === key)
        if (len && !len.used) {
          // 关闭了使用
          continue
        }
        if (len && len.type === 1) {
          // 如果是自定义参数
          data.type = len.contentType as number

          data.content = len.contentText as string
          // 如果是图片
          if (data.type === 1) {
            data.content = (await getImageBitmap(len.contentImage as string))?.image || ''
          }
        }
        if (len && len.forcedUsed) {
          data.size = len.size as number
          data.color = len.color as string
          data.bold = len.bold as boolean
          data.italic = len.italic as boolean
          data.font = len.font as string
        }
        arr.push(data)
      }

      result.push({
        items: arr,
        x: item.position
      })
    }
  }

  if (result.length === 0) return []
  return result
}
