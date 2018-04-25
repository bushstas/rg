import {autobind} from "core-decorators"
import User from 'app/services/User'
import GlobalState from 'app/services/GlobalState'

class AjaxRequest {
	send(url, method, options, onSuccess, onFailure, opts) {
		let {stream} = (opts || {});
		url = this.getProperUrl(url, options);
		method = method || 'GET';
		let body, myHeaders;
		if (options instanceof Object) {
			let m = method.toUpperCase();
			if (m == 'PUT') {
				myHeaders = new Headers();
				myHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
				body = `data=${encodeURIComponent(JSON.stringify(options))}`;
			} else if (m == 'POST') {
				body = this.getPostData(options);
			} else {
				for (var k in options) {
					url = this.addGetParam(url, k, options[k]);
				}
			}
		}
		url = url.replace(/\?\&/, '?');
		if (window.fetch instanceof Function) {
			let handleAccessFail = this.handleAccessFail;
			this.fetch(url, {body, method: method, headers: myHeaders})
				.then( function(r) {
					if (stream) return r.text();
					return r.json();
				})
				.then( function(data) {
					let isObj = data instanceof Object;
					if (data.success === false && onFailure instanceof Function) {
						onFailure(data.error, data.data);
					} else {
						if (isObj) {
							if (data.access !== undefined) {
								handleAccessFail();
								return;
							}
							if (typeof data.data != 'undefined') {
								data = data.data;
							}
						}
						if (onSuccess instanceof Function) {
							onSuccess(data);
						}
					}
				}).catch(error => {
					if (onFailure instanceof Function) {
						onFailure(error);
					} else {
						if (onSuccess instanceof Function) {
							onSuccess({error: error});
						}
						this.onFailure(error);
					}
				})
		} else {
			let r = new XMLHttpRequest();
			r.onreadystatechange = this.onReadyStateChange.bind(this, onSuccess, stream);
			r.open(method, url, true);
			r.send(body);
		}
	}

	getPostData(options) {
		let body = new FormData();
		let param;
		for (let k in options) {
			param = options[k];
			if (typeof param == 'object' && !(param instanceof File)) {
				param = JSON.stringify(options[k]);
			}
			body.append(k, param);
		}
		return body;
	}

	@autobind
	handleAccessFail() {
		
	}

	addGetParam(url, name, value) {
		let parts = url.split('?');
		let params = parts[1] || '';
		params += '&' + name + '=' + value;
		return parts[0] + '?' + params;
	}
	
	getProperUrl(url, options) {
		if (options instanceof Object) {
			let regexp, prevUrl = url;
			for (var k in options) {
				regexp = new RegExp(':' + k, 'gi');
				url = url.replace(regexp, options[k]);
				if (prevUrl != url) {
					prevUrl = url;
					delete options[k];
				}
			}
		}
		url = url.replace(/:\w+/, '');
		if (!(/^http/).test(url)) {
			url = GLOBALS.api + url;
		}
		let apikey = User.getApiKey();
		if (apikey) {
			return this.addGetParam(url, 'api_key', apikey);	
		}
		return url;
	}

	@autobind
	onFailure(error) {
		console.log(error);
	}

	fetch(url, options) {
		return fetch(url, options)
			.then(r => {
				switch(r.status) {
					case 400: {
						return r;
					}
					case 401: {
						const error = new Error(r.statusText);
						error.response = r;
						throw error;
						break;
					}
					case 404:
					case 400:
					case 500: {
						const error = new Error(r.statusText);
						error.response = r;
						throw error;
						break;
					}
					default:
						break;
				}
				return r;
			});
	}

	onReadyStateChange(callback, stream, e) {
		let r = e.target;
		if (r.readyState == 4) {
			let response = r.response;
			let data;
			if (!stream) {
				try {
					data = JSON.parse(response);
				} catch (e) {
					data = response;
				}
				if (data instanceof Object && typeof data.data != 'undefined') {
					data = data.data;
				}
			}
			if (callback instanceof Function) {
				callback(data);
			}
		}
	}
}

export default new AjaxRequest;