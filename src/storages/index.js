
export default class Storage {
	constructor(key, processor) {
		this.subscribers = [];
		this.key = key;
		this.processor = processor;
	}
	
	init(data) {
		this.data = data;
	}

	getKey() {
		return this.key;
	}

	isLoaded() {
		return !!this.data;
	}

	set(data) {
		this.init(data);
		this.distribute(data);
	}

	get() {
		return this.data;
	}

	clear() {
		this.set(null);	
	}

	hasItem(name) {
		return !!this.data[name];
	}

	getItem(name) {
		return this.data[name];
	}

	subscribe(subscriber) {
		this.subscribers.push(subscriber);
	}

	unsubscribe(subscriber) {
		this.subscribers.removeItem(subscriber);
	}

	add(name, value) {
		this.data[name] += value;
		this.distribute(this.data);
	}

	distribute(value) {
		for (let i = 0; i < this.subscribers.length; i++) {
			let state = this.subscribers[i].state;
			state[this.key] = value;
			this.subscribers[i].setState(state);
		}
	}

}