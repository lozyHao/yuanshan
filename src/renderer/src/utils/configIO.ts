import {
	OptionBasicValues,
	OptionTextTemplateValues,
	OptionLensValues
} from '@renderer/interfaces/options'

// 配置文件格式版本，后续若结构变化可据此做兼容
export const CONFIG_FILE_VERSION = 1

type TextPositionTuple = [number, number, number]

export interface YuanshanConfig {
	app: 'yuanshan'
	type: 'config'
	version: number
	exportedAt: string
	data: {
		// 基础配置
		basic?: OptionBasicValues
		// 文字模板（含中线位置）
		text?: {
			templates: OptionTextTemplateValues[]
			textPositions: {
				header: TextPositionTuple
				middle: TextPositionTuple
				footer: TextPositionTuple
			}
		}
		// 相机参数模板
		lens?: OptionLensValues[]
	}
}

/** 组装导出配置对象 */
export function buildConfig(data: YuanshanConfig['data']): YuanshanConfig {
	return {
		app: 'yuanshan',
		type: 'config',
		version: CONFIG_FILE_VERSION,
		exportedAt: new Date().toISOString(),
		data
	}
}

/** 触发浏览器下载，把配置保存为 JSON 文件 */
export function downloadConfig(config: YuanshanConfig, filename?: string): void {
	const name = filename || `yuanshan-config-${formatDate()}.json`
	const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = name
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	URL.revokeObjectURL(url)
}

/** 读取并校验导入的配置文件 */
export async function parseConfigFile(file: File): Promise<YuanshanConfig> {
	const text = await file.text()

	let json: unknown
	try {
		json = JSON.parse(text)
	} catch {
		throw new Error('文件不是有效的 JSON')
	}

	if (!isYuanshanConfig(json)) {
		throw new Error('不是有效的远山配置文件')
	}

	return json
}

function isYuanshanConfig(value: unknown): value is YuanshanConfig {
	if (typeof value !== 'object' || value === null) return false
	const v = value as Record<string, unknown>
	return v.app === 'yuanshan' && v.type === 'config' && typeof v.data === 'object' && v.data !== null
}

function formatDate(): string {
	const d = new Date()
	const p = (n: number) => String(n).padStart(2, '0')
	return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}
