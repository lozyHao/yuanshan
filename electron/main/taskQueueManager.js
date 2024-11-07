// taskQueueManager.js
import EventEmitter from 'events';
// import Semaphore from 'semaphore-async-await';
import Semaphore from "../hooks/semaphore.js";

class TaskQueueManager extends EventEmitter {
	constructor(maxConcurrentTasks) {
		super();
		this.tasks = []; // 存储任务的数组
		this.semaphore = new Semaphore(maxConcurrentTasks);
		this.isProcessing = false; // 标识是否正在处理任务
	}

	addTask(task) {
		this.tasks.push(task);
		if (this.tasks.length === 1) {
			// 如果之前没有任务，立即开始处理
			this.processNextTask();
		}
	}

	async processNextTask() {
		if (this.tasks.length === 0) return;

		const task = this.tasks.shift(); // 取出下一个任务
		await this.semaphore.acquire(); // 获取信号量
		this.isProcessing = true;

		try {
			await task(); // 执行任务
		} finally {
			this.semaphore.release(); // 释放信号量
			this.isProcessing = false;
			// 任务完成后，检查是否还有剩余任务
			if (this.tasks.length > 0) {
				// 继续处理下一个任务
				this.processNextTask();
			} else {
				// 如果没有剩余任务，触发所有任务完成事件
				this.allTasksCompleted();
			}
		}
	}

	allTasksCompleted() {
		this.emit('allTasksCompleted');
	}
}

// 创建单例实例
const taskQueueManager = new TaskQueueManager(5);

export default taskQueueManager;