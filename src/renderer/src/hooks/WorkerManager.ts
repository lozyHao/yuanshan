// WorkerManager
class WorkerManager {
  workers: { [workerName: string]: Worker }
  callbacks: { [key: string]: (result: any) => void } = {}

  constructor() {
    this.workers = {}
  }

  createWorker(workerName: string, DefinedWorker: any) {
    const worker = new DefinedWorker()
    worker.onmessage = (event) => {
      if (event.data.callbackId && this.callbacks[event.data.callbackId]) {
        this.callbacks[event.data.callbackId](event.data.result)
      }
    }

    worker.onerror = (error) => {
      console.error(`Error in ${workerName}:`, error)
    }

    this.workers[workerName] = worker
    return worker
  }

  postMessage(workerName: string, message: any, callback: (result: any) => void) {
    const worker = this.workers[workerName]
    const callbackId = Math.random().toString(36).slice(2)

    if (worker && callback) {
      this.callbacks[callbackId] = callback
      worker.postMessage({ ...message, callbackId })
    }
  }

  terminateWorker(workerName: string) {
    const worker = this.workers[workerName]
    if (worker) {
      worker.terminate()
      delete this.workers[workerName]
    }
  }

  delete(workerName: string) {
    // delete this.callbacks[event.data.callbackId]; // 执行完毕后删除回调函数
    // 结束后，删除该 worker
    this.terminateWorker(workerName)
  }
}

export default WorkerManager
