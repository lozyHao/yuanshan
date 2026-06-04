/**
 * 通用配置
 */
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { OptionLensValues, OptionLensEnum } from '@renderer/interfaces/options'
import { exifFields } from '@renderer/default/default-options'
import { getUUID } from '@renderer/utils/uuid'

export const useOptionLensStore = defineStore(
  'optionLens',
  () => {
    const _data = ref<OptionLensValues[]>([...exifFields])

    // 添加
    const add = (option: OptionLensValues): { status: boolean; msg: string } => {
      if (_data.value.length >= 26) {
        return { status: false, msg: '最多添加 10 项' }
      }
      option.key = getUUID()
      option.description = `{${option.name}}`
      _data.value.push(option)
      return { status: true, msg: '添加成功' }
    }

    // 获取
    const get = (key: string): OptionLensValues => {
      return _data.value.find(
        (item: OptionLensValues) => item[OptionLensEnum.KEY] === key
      ) as OptionLensValues
    }

    // 编辑
    const edit = (option: OptionLensValues) => {
      const item = _data.value.find(
        (item: OptionLensValues) => item[OptionLensEnum.KEY] === option[OptionLensEnum.KEY]
      )
      if (item) {
        Object.assign(item, option)
      }
    }

    // 开启/关闭
    const handleChange = (key: string, value: boolean) => {
      const item = _data.value.find((item: OptionLensValues) => item.key === key)
      if (!item) return
      item.used = value
    }

    // 删除
    const del = (key: string) => {
      _data.value = _data.value.filter((item: OptionLensValues) => item[OptionLensEnum.KEY] !== key)
    }

    // 获取所有
    const getValue = () => {
      return [..._data.value]
    }

    // 整体导入相机参数模板
    const setAll = (data: OptionLensValues[]) => {
      if (Array.isArray(data)) {
        _data.value = [...data]
      }
    }

    // 恢复默认
    const reset = () => {
      _data.value = [...exifFields]
    }

    return {
      _data,
      get,
      add,
      edit,
      handleChange,
      del,
      getValue,
      setAll,
      reset
    }
  },
  {
    persist: {
      key: 'optionLens',
      storage: window?.localStorage
    }
  }
)

// 支持 HMR：修改本 store 文件后热更新会替换实例，避免出现旧实例方法缺失
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOptionLensStore, import.meta.hot))
}
