class GlobalState {	
	constructor() {
		this.data = {};
		this.subscribers = {};
	}
	set(key, value) {
		this.data[key] = value;
	}
	get(key) {
		return this.data[key];
	}
	dispatchEvent(eventName, ...args) {
		let s = this.subscribers[eventName];
		if (s) {
			for (let i = 0; i < s.length; i++) {
				s[i][0].apply(s[i][1], args);
			}
		}
	}
	listen(eventName, callback, subscriber) {
		this.subscribers[eventName] = this.subscribers[eventName] || [];
		this.subscribers[eventName].push([callback, subscriber]);
		subscriber.addSubscriptionToGlobalState(eventName);
	}

	unlisten(eventName, subscriber) {
		let s = this.subscribers[eventName];
		if (s instanceof Array) {
			let subs = [];
			for (let i = 0; i < s.length; i++) {
				if (subscriber != s[i][1]) {
					subs.push(s[i]);
				}
			}
			this.subscribers[eventName] = subs;
		}
	}
}

export default new GlobalState;