import {
	OptionBasicEnum,
	OptionBasicValues,
	TextTemplatePositionEnum,
	WatermarkPositionEnum
} from '@renderer/interfaces/options'
import { createDefaultBasic } from '@renderer/store/optionBasic'
import { defTextTemps, exifFields } from './default-options'
import { YuanshanConfig } from '@renderer/utils/configIO'

type PresetText = NonNullable<YuanshanConfig['data']['text']>

// 文字中线默认位置
const defaultTextPositions = (): PresetText['textPositions'] => ({
	header: [0.3, 0.5, 0.7],
	middle: [0.3, 0.5, 0.7],
	footer: [0.3, 0.5, 0.7]
})

// 生成文字模板：统一颜色，可选「居中」或「两端分布」布局
const makeText = (color: string, layout: 'center' | 'spread' = 'center'): PresetText => ({
	templates: defTextTemps.map((t, i) => ({
		...t,
		content: t.content ? [...t.content] : t.content,
		color,
		position:
			layout === 'spread'
				? i === 0
					? TextTemplatePositionEnum.HEADER
					: TextTemplatePositionEnum.FOOTER
				: TextTemplatePositionEnum.MIDDLE
	})),
	textPositions: defaultTextPositions()
})

// 克隆默认相机参数
const cloneLens = () => exifFields.map((f) => ({ ...f }))

// 基础配置 = 默认值 + 覆盖项
const basic = (overrides: Partial<OptionBasicValues>): OptionBasicValues => ({
	...createDefaultBasic(),
	...overrides
})

export interface PresetTemplate {
	id: string
	name: string
	desc: string
	// 卡片预览用的主色调（背景示意）
	swatch: string
	data: YuanshanConfig['data']
}

export const presetTemplates: PresetTemplate[] = [
	{
		id: 'blur-classic',
		name: '经典模糊',
		desc: '毛玻璃背景 + 居中参数，白色文字',
		swatch: '#3a3a3a',
		data: {
			basic: basic({
				[OptionBasicEnum.BG_COLOR_USED]: false,
				[OptionBasicEnum.BG_BLUR]: 100,
				[OptionBasicEnum.BORDER_WIDTH]: [4, 4, 4, 4],
				[OptionBasicEnum.BORDER_SIZE]: 8,
				[OptionBasicEnum.ROUNDED_SIZE]: [6, 6, 6, 6],
				[OptionBasicEnum.SHADOW_SIZE]: 0.5
			}),
			text: makeText('#ffffff', 'center'),
			lens: cloneLens()
		}
	},
	{
		id: 'white-frame',
		name: '纯白边框',
		desc: '白底深字，经典留白相框',
		swatch: '#ffffff',
		data: {
			basic: basic({
				[OptionBasicEnum.BG_COLOR_USED]: true,
				[OptionBasicEnum.BG_COLOR]: '#ffffff',
				[OptionBasicEnum.TEXT_BG_COLOR_USED]: true,
				[OptionBasicEnum.TEXT_BG_COLOR]: '#ffffff',
				[OptionBasicEnum.BORDER_WIDTH]: [4, 4, 4, 4],
				[OptionBasicEnum.BORDER_SIZE]: 10,
				[OptionBasicEnum.ROUNDED_SIZE]: [0, 0, 0, 0],
				[OptionBasicEnum.SHADOW_SIZE]: 0.2
			}),
			text: makeText('#222222', 'center'),
			lens: cloneLens()
		}
	},
	{
		id: 'black-minimal',
		name: '极简黑框',
		desc: '纯黑底白字，沉稳简洁',
		swatch: '#111111',
		data: {
			basic: basic({
				[OptionBasicEnum.BG_COLOR_USED]: true,
				[OptionBasicEnum.BG_COLOR]: '#000000',
				[OptionBasicEnum.TEXT_BG_COLOR_USED]: true,
				[OptionBasicEnum.TEXT_BG_COLOR]: '#000000',
				[OptionBasicEnum.BORDER_WIDTH]: [3, 3, 3, 3],
				[OptionBasicEnum.BORDER_SIZE]: 9,
				[OptionBasicEnum.ROUNDED_SIZE]: [0, 0, 0, 0],
				[OptionBasicEnum.SHADOW_SIZE]: 0.3
			}),
			text: makeText('#ffffff', 'center'),
			lens: cloneLens()
		}
	},
	{
		id: 'wide-margin',
		name: '宽边留白',
		desc: '大留白白框，杂志风',
		swatch: '#f5f5f5',
		data: {
			basic: basic({
				[OptionBasicEnum.BG_COLOR_USED]: true,
				[OptionBasicEnum.BG_COLOR]: '#ffffff',
				[OptionBasicEnum.TEXT_BG_COLOR_USED]: true,
				[OptionBasicEnum.TEXT_BG_COLOR]: '#ffffff',
				[OptionBasicEnum.BORDER_WIDTH]: [8, 8, 2, 8],
				[OptionBasicEnum.BORDER_SIZE]: 14,
				[OptionBasicEnum.ROUNDED_SIZE]: [0, 0, 0, 0],
				[OptionBasicEnum.SHADOW_SIZE]: 0.2
			}),
			text: makeText('#333333', 'center'),
			lens: cloneLens()
		}
	},
	{
		id: 'rounded-shadow',
		name: '圆角阴影',
		desc: '毛玻璃 + 大圆角投影，现代质感',
		swatch: '#2b2b2b',
		data: {
			basic: basic({
				[OptionBasicEnum.BG_COLOR_USED]: false,
				[OptionBasicEnum.BG_BLUR]: 120,
				[OptionBasicEnum.BORDER_WIDTH]: [6, 6, 6, 6],
				[OptionBasicEnum.BORDER_SIZE]: 8,
				[OptionBasicEnum.ROUNDED_SIZE]: [30, 30, 30, 30],
				[OptionBasicEnum.SHADOW_SIZE]: 0.9
			}),
			text: makeText('#ffffff', 'center'),
			lens: cloneLens()
		}
	},
	{
		id: 'info-bar',
		name: '底部信息条',
		desc: '毛玻璃 + 深色信息条，两端分布',
		swatch: '#1a1a1a',
		data: {
			basic: basic({
				[OptionBasicEnum.BG_COLOR_USED]: false,
				[OptionBasicEnum.BG_BLUR]: 80,
				[OptionBasicEnum.TEXT_BG_COLOR_USED]: true,
				[OptionBasicEnum.TEXT_BG_COLOR]: '#111111',
				[OptionBasicEnum.BORDER_WIDTH]: [2, 2, 2, 2],
				[OptionBasicEnum.BORDER_SIZE]: 9,
				[OptionBasicEnum.ROUNDED_SIZE]: [10, 10, 10, 10],
				[OptionBasicEnum.SHADOW_SIZE]: 0.5,
				[OptionBasicEnum.WATERMARK_POSITION]: WatermarkPositionEnum.RIGHT_BOTTOM
			}),
			text: makeText('#ffffff', 'center'),
			lens: cloneLens()
		}
	}
]
