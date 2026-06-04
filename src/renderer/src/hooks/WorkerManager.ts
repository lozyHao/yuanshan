// WorkerManager
type WorkerCallback<R = unknown> = (result: R) => void

interface WorkerMessage {
  callbackId?: string
  result?: unknown
  [key: string]: unknown
}

class WorkerManager {
  workers: { [workerName: string]: Worker } = {}
  callbacks: { [key: string]: WorkerCallback } = {}
  private seq = 0

  createWorker(workerName: string, DefinedWorker: new () => Worker): Worker {
    const worker = new DefinedWorker()
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const { callbackId, result } = event.data
      if (callbackId && this.callbacks[callbackId]) {
        this.callbacks[callbackId](result)
        // 进度类消息会多次回调，仅在收到最终结果（对象）后释放，避免回调堆积
        if (typeof result !== 'number') {
          delete this.callbacks[callbackId]
        }
      }
    }

    worker.onerror = (error) => {
      console.error(`Error in ${workerName}:`, error)
    }

    this.workers[workerName] = worker
    return worker
  }

  postMessage<R = unknown>(workerName: string, message: object, callback: WorkerCallback<R>): void {
    const worker = this.workers[workerName]
    // 单调递增 id，避免 Math.random 的碰撞风险
    const callbackId = `cb_${++this.seq}_${Date.now()}`

    if (worker && callback) {
      this.callbacks[callbackId] = callback as WorkerCallback
      worker.postMessage({ ...message, callbackId })
    }
  }

  terminateWorker(workerName: string): void {
    const worker = this.workers[workerName]
    if (worker) {
      worker.terminate()
      delete this.workers[workerName]
    }
  }

  delete(workerName: string): void {
    // 结束后，删除该 worker
    this.terminateWorker(workerName)
  }
}

export default WorkerManager
