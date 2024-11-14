class TaskQueue {
  maxConcurrentTasks: number
  currentTaskCount: number
  queue: any[]
  semaphore: any
  //   事件监听进度（总量，已完成数，未完成数，所有都完成）
  onProgress: (total: number, completed: number, uncompleted: number, allCompleted: boolean) => void

  constructor(
    maxConcurrentTasks: number,
    onProgress?: (
      total: number,
      completed: number,
      uncompleted: number,
      allCompleted: boolean
    ) => void
  ) {
    this.maxConcurrentTasks = maxConcurrentTasks // 最大并发任务数
    this.currentTaskCount = 0 // 当前正在执行的任务数
    this.queue = [] // 任务队列
    this.semaphore = [] // 信号量数组，用于跟踪正在执行的任务

    this.onProgress = onProgress || function () {}
  }

  // 添加任务到队列
  addTask(task) {
    console.log(task)
    this.queue.push(task)
  }

  // 执行任务
  async executeTask(task) {
    try {
      await task()
    } catch (err) {
      console.error('Task failed:', err)
    } finally {
      this.currentTaskCount--
      // 释放信号量
      const released = this.semaphore.shift()
      console.log('结束一个', released)
      if (released) {
        this.onProgress(
          this.queue.length,
          this.queue.length - this.currentTaskCount,
          this.currentTaskCount,
          this.queue.length === this.currentTaskCount
        )
        released()
      }
      // 检查队列以启动下一个任务
      this.startNextTask()
    }
  }

  // 启动下一个任务
  async startNextTask() {
    if (this.queue.length > 0 && this.currentTaskCount < this.maxConcurrentTasks) {
      const task = this.queue.shift()
      this.currentTaskCount++
      // 添加新的信号量
      new Promise((resolve) => this.semaphore.push(resolve))
      this.executeTask(task)
    }
  }

  // 启动队列处理
  async start() {
    while (this.queue.length > 0 || this.currentTaskCount > 0) {
      this.startNextTask()
      await new Promise((resolve) => setTimeout(resolve, 100)) // 防止一直占用事件循环
    }
  }
}

export default TaskQueue
