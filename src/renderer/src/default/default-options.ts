/** 默认的配置项 */
import modal01 from '@renderer/assets/images/modal01.png'
import modal02 from '@renderer/assets/images/modal02.png'

// 导入所有字体
import WenFont from '@renderer/assets/font/Wen.ttf'
import AliFY from '@renderer/assets/font/AliFY.ttf'
import AliDLi from '@renderer/assets/font/AliDLi.ttf'
import AliAgile from '@renderer/assets/font/AliAgile.ttf'

// 导入所有相机品牌
import xmage from '@renderer/assets/mark_logo/xmage.png'
import xmage_w from '@renderer/assets/mark_logo/xmage-w.png'
import xmage_b from '@renderer/assets/mark_logo/xmage-b.png'
import canon from '@renderer/assets/mark_logo/canon.png'
import canon_w from '@renderer/assets/mark_logo/canon-w.png'
import canon_b from '@renderer/assets/mark_logo/canon-b.png'
import nikon from '@renderer/assets/mark_logo/nikon.png'
import nikon_w from '@renderer/assets/mark_logo/nikon-w.png'
import nikon_b from '@renderer/assets/mark_logo/nikon-b.png'
import sony_w from '@renderer/assets/mark_logo/sony-w.png'
import sony_b from '@renderer/assets/mark_logo/sony-b.png'
import panasonic_w from '@renderer/assets/mark_logo/panasonic-w.png'
import panasonic_b from '@renderer/assets/mark_logo/panasonic-b.png'
import fujifilm_w from '@renderer/assets/mark_logo/fujifilm-w.png'
import fujifilm_b from '@renderer/assets/mark_logo/fujifilm-b.png'
import olympus from '@renderer/assets/mark_logo/olympus.png'
import olympus_w from '@renderer/assets/mark_logo/olympus-w.png'
import olympus_b from '@renderer/assets/mark_logo/olympus-b.png'
import leica from '@renderer/assets/mark_logo/leica.png'
import leica_w from '@renderer/assets/mark_logo/leica-w.png'
import leica_b from '@renderer/assets/mark_logo/leica-b.png'
import zeiss from '@renderer/assets/mark_logo/zeiss.png'
import zeiss_w from '@renderer/assets/mark_logo/zeiss-w.png'
import zeiss_b from '@renderer/assets/mark_logo/zeiss-b.png'
import hasselblad_w from '@renderer/assets/mark_logo/hasselblad-w.png'
import hasselblad_b from '@renderer/assets/mark_logo/hasselblad-b.png'
import dji_w from '@renderer/assets/mark_logo/dji-w.png'
import dji_b from '@renderer/assets/mark_logo/dji-b.png'
import songdian_w from '@renderer/assets/mark_logo/songdian-w.png'
import songdian_b from '@renderer/assets/mark_logo/songdian-b.png'
import pentax_w from '@renderer/assets/mark_logo/pentax-w.png'
import pentax_b from '@renderer/assets/mark_logo/pentax-b.png'
import ricoh_w from '@renderer/assets/mark_logo/ricoh-w.png'
import ricoh_b from '@renderer/assets/mark_logo/ricoh-b.png'
import sigma_w from '@renderer/assets/mark_logo/sigma-w.png'
import sigma_b from '@renderer/assets/mark_logo/sigma-b.png'

import {
  OptionLensValues,
  OptionTextTemplateValues,
  TextTemplatePositionEnum,
  OptionPatternEnum,
  WatermarkPositionEnum
} from '@renderer/interfaces/options'

// 字体文件列表
export const fontOptions = [
  { label: '默认字体', value: 'Wen', key: WenFont },
  { label: '方圆体', value: 'AliFY', key: AliFY },
  { label: '刀隶体', value: 'AliDLi', key: AliDLi },
  { label: '灵动体', value: 'AliAgile', key: AliAgile }
]

// 默认文字参数
export const defaultOptions = {
  fontColor: '#ffffff',
  fontSize: 0.35,
  fontBold: false,
  fontItalic: false,
  fontFamily: fontOptions[0].value,
  defaultDir: 'C:\\Program Files\\yuanshan'
}

// 默认相机参数
export const exifFields: OptionLensValues[] = [
  { key: 'Make', name: 'Logo', type: 0, used: true, description: '{Logo}', show: true },
  { key: 'Model', name: '型号', type: 0, used: true, description: '{型号}', show: true },
  { key: 'LensMake', name: '镜头Logo', type: 0, used: true, description: '{镜头Logo}', show: true },
  {
    key: 'LensModel',
    name: '镜头型号',
    type: 0,
    used: true,
    description: '{镜头型号}',
    show: true
  },
  { key: 'ExposureTime', name: '快门', type: 0, used: true, description: '{快门}s', show: true },
  { key: 'FNumber', name: '光圈', type: 0, used: true, description: 'f/{光圈}', show: true },
  { key: 'ISOSpeedRatings', name: 'ISO', type: 0, used: true, description: '{ISO}', show: true },
  { key: 'FocalLength', name: '焦距', type: 0, used: true, description: '{焦距}mm', show: true },
  {
    key: 'FocalLengthIn35mmFilm',
    name: '等效焦距',
    type: 0,
    used: true,
    description: '{等效焦距}mm',
    show: true
  },
  { key: 'ExposureProgram', name: '档位', type: 0, used: true, description: '{档位}', show: true },
  {
    key: 'ExposureMode',
    name: '曝光补偿',
    type: 0,
    used: true,
    description: '{曝光补偿}',
    show: true
  },
  {
    key: 'MeteringMode',
    name: '测光模式',
    type: 0,
    used: true,
    description: '{测光模式}',
    show: true
  },
  { key: 'WhiteBalance', name: '白平衡', type: 0, used: true, description: '{白平衡}', show: true },
  {
    key: 'DateTimeOriginal',
    name: '拍摄日期',
    type: 0,
    used: true,
    description: '{拍摄日期}',
    show: true
  },
  {
    key: 'Image Height',
    name: '图片高度',
    type: 0,
    used: true,
    description: '{高度}',
    show: false
  },
  { key: 'Image Width', name: '图片宽度', type: 0, used: true, description: '{宽度}', show: false }
]

// 默认文本模板
export const defTextTemps: OptionTextTemplateValues[] = [
  {
    key: 'Logo 型号',
    name: 'Logo 型号',
    type: 0,
    content: ['Make', 'Model'],
    font: defaultOptions.fontFamily,
    size: 0.4,
    color: defaultOptions.fontColor,
    italic: true,
    bold: true,
    position: TextTemplatePositionEnum.MIDDLE
  },
  {
    key: '镜头logo型号',
    name: '镜头logo型号',
    type: 0,
    content: ['FocalLength', 'FNumber', 'ExposureTime', 'ISOSpeedRatings'],
    font: defaultOptions.fontFamily,
    size: 0.3,
    color: defaultOptions.fontColor,
    italic: defaultOptions.fontItalic,
    bold: defaultOptions.fontBold,
    position: TextTemplatePositionEnum.MIDDLE
  }
]

// 模式
export const modalOptions = [
  {
    key: OptionPatternEnum.OUT,
    img: modal01
  },
  {
    key: OptionPatternEnum.IN,
    img: modal02
  }
]

// 水印位置
export const watermarkPositionOptions = [
  {
    label: '顶部',
    value: WatermarkPositionEnum.TOP
  },
  {
    label: '中间',
    value: WatermarkPositionEnum.CENTER
  },
  {
    label: '底部',
    value: WatermarkPositionEnum.BOTTOM
  },
  {
    label: '左上',
    value: WatermarkPositionEnum.LEFT_TOP
  },
  {
    label: '右上',
    value: WatermarkPositionEnum.RIGHT_TOP
  },
  {
    label: '左下',
    value: WatermarkPositionEnum.LEFT_BOTTOM
  },
  {
    label: '右下',
    value: WatermarkPositionEnum.RIGHT_BOTTOM
  }
]

// 相机品牌 logo 列表（name:名称、value: 图标路径）
export const cameraBrandOptions = [
  { label: 'xmage', value: xmage },
  { label: 'xmage-w', value: xmage_w },
  { label: 'xmage-b', value: xmage_b },
  { label: 'Canon', value: canon },
  { label: 'Canon-W', value: canon_w },
  { label: 'Canon-b', value: canon_b },
  { label: 'Nikon', value: nikon },
  { label: 'Nikon-w', value: nikon_w },
  { label: 'Nikon-b', value: nikon_b },
  { label: 'sony-w', value: sony_w },
  { label: 'sony-b', value: sony_b },
  { label: 'panasonic-w', value: panasonic_w },
  { label: 'panasonic-b', value: panasonic_b },
  { label: 'fujifilm-w', value: fujifilm_w },
  { label: 'fujifilm-b', value: fujifilm_b },
  { label: 'olympus', value: olympus },
  { label: 'olympus-w', value: olympus_w },
  { label: 'olympus-b', value: olympus_b },
  { label: 'panasonic-w', value: panasonic_w },
  { label: 'panasonic-b', value: panasonic_b },
  { label: 'leica', value: leica },
  { label: 'leica-w', value: leica_w },
  { label: 'leica-b', value: leica_b },
  { label: 'zeiss', value: zeiss },
  { label: 'zeiss-w', value: zeiss_w },
  { label: 'zeiss-b', value: zeiss_b },
  { label: 'hasselblad-w', value: hasselblad_w },
  { label: 'hasselblad-b', value: hasselblad_b },
  { label: 'dji-w', value: dji_w },
  { label: 'dji-b', value: dji_b },
  { label: 'songdian-w', value: songdian_w },
  { label: 'songdian-b', value: songdian_b },
  { label: 'pentax-w', value: pentax_w },
  { label: 'pentax-b', value: pentax_b },
  { label: 'ricoh-w', value: ricoh_w },
  { label: 'ricoh-b', value: ricoh_b },
  { label: 'sigma-w', value: sigma_w },
  { label: 'sigma-b', value: sigma_b }
]
