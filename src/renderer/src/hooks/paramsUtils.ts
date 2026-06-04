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

	// 等待 EXIF 解析完成，避免读到空数据（构造时为异步加载）
	await exif.ready

	const allList = text.filter((item) => item.position !== 'no')
	const list: { items: ImageTextItem[]; x: TextTemplatePositionEnum }[] = await getTemplate(
		allList,
		lens,
		exif
	)

	// 过滤掉没有内容的分组（getTemplate 已逐项过滤，这里兜底丢弃空分组）
	const newList = list.filter((item) => item.items.length > 0)

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

				const len = lens.find((len) => len.key === key)

				// 仅当 exif 中确有有效值时才拼接，避免把 undefined/null/NaN 绘制上去
				const exifValue = exif.get(key)
				const isInvalid =
					exifValue === null ||
					exifValue === undefined ||
					exifValue === '' ||
					(typeof exifValue === 'number' && Number.isNaN(exifValue))
				if (!isInvalid) {
					data.content = `${len?.prefix || ''}${exifValue}${len?.suffix || ''}`
				}

				if (len && !len.used) {
					// 关闭了使用
					continue
				}

				if (len && len.type === 1) {
					// 如果是自定义参数
					data.type = len.contentType as number

					data.content = `${len.prefix || ''}${len.contentText || ''}${len.suffix || ''}`
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

			// 过滤掉没有内容的项（如 exif 缺失、自定义内容为空），避免绘制空白/占位
			const items = arr.filter((it) => it.content !== '' && it.content !== null && it.content !== undefined)

			if (items.length > 0) {
				result.push({
					items,
					x: item.position
				})
			}
		}
	}

	if (result.length === 0) return []
	return result
}
