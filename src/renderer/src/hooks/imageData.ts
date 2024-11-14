import { getUUID } from '@renderer/utils/uuid'

import ExifFactory from './exifFactory'
import WorkerManager from '@renderer/hooks/WorkerManager'
import {
  ImageTextItem,
  OptionBasicValues,
  OutputStatusEnum,
  TextTemplatePositionEnum
} from '@renderer/interfaces/options'

import OutputWorker from '@renderer/hooks/outputWorker.ts?worker'

class ImageData {
  key: string
  file: File | null
  filename: string
  perUrl: string // 原图预览地址
  outerUrl: string | null // 输出预览地址
  exif: ExifFactory // 元数据对象

  preLoading: boolean = false // 预览图更新中
  progress: number = 0 // 预览、输出进度
  outputStatus: OutputStatusEnum = OutputStatusEnum.NO // 输出状态

  constructor(file: File) {
    this.file = file
    this.filename = file.name
    this.key = getUUID()
    this.perUrl = this.getPerUrl()
    this.outerUrl = null
    this.exif = new ExifFactory(file)

    this.preLoading = false
  }

  getPerUrl(): string {
    return this.file ? URL.createObjectURL(this.file) : ''
  }

  /** 输出 */
  async onPrint(
    params: {
      basic: OptionBasicValues
      textList: { [key: string]: { items: ImageTextItem[]; x: TextTemplatePositionEnum }[] }
    },
    type: string = 'preview'
  ) {
    if (type === 'preview') {
      await this.startPreview(params)
    } else {
      await this.startOutput(params)
    }
  }

  // 开始绘制预览
  async startPreview(params: {
    basic: OptionBasicValues
    textList: { [key: string]: { items: ImageTextItem[]; x: TextTemplatePositionEnum }[] }
  }) {
    this.preLoading = true

    const img = new Image()
    const src = URL.createObjectURL(this.file as File)
    img.src = src

    img.onload = async () => {
      // blob 转 imageBitmap
      const imageBitmap = await createImageBitmap(img)
      const { width, height } = imageBitmap
      this.progress = 20

      // 解析参数，避免存在对象
      const currentParams = {
        basic: { ...params.basic },
        textList: { ...params.textList }
      }

      const worker = new WorkerManager()
      worker.createWorker('draw', OutputWorker)
      worker.postMessage(
        'draw',
        {
          params: currentParams,
          image: imageBitmap,
          width: width ?? img.width,
          height: height ?? img.height,
          type: 'preview'
        },
        (message: any) => {
          console.log(`${this.filename} 进度：`, message)
          if (typeof message === 'number') {
            this.progress = message
          } else {
            this.outerUrl = URL.createObjectURL(message)
            this.preLoading = false
            worker.delete('draw')
          }
        }
      )
    }
  }

  // 开始输出
  async startOutput(params: {
    basic: OptionBasicValues
    textList: { [key: string]: { items: ImageTextItem[]; x: TextTemplatePositionEnum }[] }
  }) {
    const img = new Image()
    const src = URL.createObjectURL(this.file as File)
    img.src = src

    return await new Promise((resolve) => {
      img.onload = async () => {
        // blob 转 imageBitmap
        const imageBitmap = await createImageBitmap(img)
        const { width, height } = imageBitmap
        this.progress = 20

        // 解析参数，避免存在对象
        const currentParams = {
          basic: { ...params.basic },
          textList: { ...params.textList }
        }

        const worker = new WorkerManager()
        worker.createWorker('draw', OutputWorker)
        worker.postMessage(
          'draw',
          {
            params: currentParams,
            image: imageBitmap,
            width: width ?? img.width,
            height: height ?? img.height,
            type: 'output'
          },
          async (message: any) => {
            console.log(`${this.filename} 进度：`, message)
            if (typeof message === 'number') {
              this.progress = message
            } else {
              worker.delete('draw')
              //   TODO: 发送消息到Electron主线程来保存文件，并接受保存结果
              //   const img = URL.createObjectURL(message)

              const arrayBuffer = await blobToArrayBuffer(message)

              if (!arrayBuffer) resolve(null)

              const result = await (window.api as any).sendSaveFile({
                width: width ?? img.width,
                height: height ?? img.height,
                imageArrayBuffer: arrayBuffer,
                dir: params.basic.outputPath,
                quality: params.basic.outputQuality
              })
              console.log('保存结果：', result)
              if (result) {
                this.outputStatus = OutputStatusEnum.SUCCESS
              } else {
                this.outputStatus = OutputStatusEnum.FAIL
              }

              this.progress = 100
              resolve(result)
            }
          }
        )
      }
    })
  }
}

// 转换成 ArrayBuffer
function blobToArrayBuffer(blob: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = () => {
      resolve(null)
    }
  })
}

export default ImageData
