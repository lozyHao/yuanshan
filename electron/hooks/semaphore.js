class Semaphore {
	permits;
	promiseResolverQueue;

	constructor(permits) {
		this.permits = permits;
	}

	async wait() {
		if (this.permits > 0) {
			this.permits -= 1;
			return Promise.resolve(true);
		}
		return new Promise(resolver => this.promiseResolverQueue.push(resolver));
	}

	async acquire() {
		return this.wait();
	}

	signal() {
		this.permits += 1;

		if (this.permits > 1 && this.promiseResolverQueue.length > 0) {
			console.warn('Semaphore.permits should never be > 0 when there is someone waiting.');
		} else if (this.permits === 1 && this.promiseResolverQueue.length > 0) {
			this.permits -= 1;

			const nextResolver = this.promiseResolverQueue.shift();
			if (nextResolver) {
				nextResolver(true);
			}
		}
	}

	release() {
		this.signal();
	}
}

export default Semaphore;