import {autobind} from 'core-decorators'
import React, {Component} from 'react'
import GlobalState from 'app/services/GlobalState'

const mergeClasses = function(...args) {
	let classes = [];
	for (var i = 0; i < args.length; i++) {
		if (args[i] && typeof args[i] == 'string') {
			classes.push(args[i]);
		}
	}
	return classes;
}

export default class CustomComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	addToState(params) {
		if (params instanceof Object) {
			this.state = {
				...(this.state || {}),
				...params
			};
		}
	}
	getProp(propName) {
		if (this.props instanceof Object) {
			return this.props[propName];
		}
	}
	getState(...args) {
		this.state = this.state || {};
		let item = this.state;
		for (let i = 0; i < args.length; i++) {
			item = item[args[i]];
			if (typeof args[i + 1] != 'undefined') {
				if (!(item instanceof Object)) {
					return;
				}
			} else {
				return item;
			}
		}
	}
	toggleState(stateName) {
		let state = this.state || {};
		state[stateName] = !state[stateName];
		this.setState(state);
	}
	hasState(stateName) {
		return this.state && this.state[stateName];
	}
	hasStates(...states) {
		if (this.state) {
			for (let i = 0; i < states.length; i++) {
				if (!this.hasState(states[i])) {
					return false;
				}
			}
			return true;
		}
	}
	hasProp(propName) {
		return this.props && this.props[propName];
	}
	mergeClasses(...args) {
		return mergeClasses.apply(this, args).join(' ');
	}
	getClasses() {
		return mergeClasses.apply(this, [this.className, this.getProp('classes'), ...arguments]).join(' ');
	}
	fireEvent(propName, ...args) {
		propName = 'on' + propName.charAt(0).toUpperCase() + propName.slice(1);
		if (this.props) {
			if (propName == 'onChange' && this.props['handleChange'] instanceof Function) {
				this.props['handleChange'].apply(null, args);
			}
			if (this.props[propName] instanceof Function) {
				this.props[propName].apply(null, args);
			}
		}
	}
	addSubscriptionToGlobalState(eventName) {
		this.globalEvents = this.globalEvents || [];
		this.globalEvents.push(eventName);
	}
	componentDidMount() {
		this.mounted = true;
		window.setTimeout(() => {
		if (this.clickListeners) {
			let {scope} = this.refs;
			if (scope instanceof Element) {
				scope.addEventListener('click', this.handleScopeClick, false);
			}
		}}, 200);
	}
	componentWillUnmount() {
		this.mounted = false;
		if (this.clickListeners) {
			this.clickListeners = null;
			let {scope} = this.refs;
			if (scope instanceof Element) {
				scope.removeEventListener('click', this.handleScopeClick, false);
			}
		}		
		if (this.globalEvents instanceof Array) {
			for (let i = 0; i < this.globalEvents.length; i++) {
				GlobalState.unlisten(this.globalEvents[i], this);
			}
		}
		if (this.storages instanceof Object) {
			for (let k in this.storages) {
				this.storages[k].unsubscribe(this);
			}
			this.storages = null;
		}
	}
	setState(state) {
		if (this.mounted !== false) {
			super.setState(state)
		}
	}
	@autobind
	handleScopeClick(e) {
		let classes = e.target.getClasses();
		let keys = Object.keys(this.clickListeners);
		let i = classes.getIntersections(keys)[0];
		if (i) {
			e.stopPropagation();
			let data = Object.assign({}, e.target.dataset);
			let keys = Object.keys(data);
			if (!keys.isEmpty()) {
				this.clickListeners[i].call(this, data, e);
			} else {
				this.clickListeners[i].call(this, e);
			}
		}
	}
	addStorage(name, storage) {
		this.storages = this.storages || {};
		this.storages[name] = storage;
	}
	shouldHave(stateName) {
		this.shouldHaveStates = this.shouldHaveStates || [];
		this.shouldHaveStates.push(stateName);
	}
	isReady() {
		return !(this.shouldHaveStates instanceof Array) || this.hasStates(...this.shouldHaveStates);
	}
	addClickListeners(data) {
		if (this.clickListeners instanceof Object) {
			this.clickListeners = {
				...this.clickListeners,
				...data
			}
		} else {
			this.clickListeners = data;
		}
	}
}