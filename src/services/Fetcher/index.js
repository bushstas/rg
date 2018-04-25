import User from 'app/services/User'
import axios from 'axios';

class Fetcher {

	send(url, method, params, successCallback, failureCallback) {
		if (typeof url == 'string') {
			url = this.getProperUrl(url, params);
			let onSuccess = (response) => {
				let {data} = response;
				if (data instanceof Object) {
					if (data.access === false) {
						return User.handleAccessFail(data);
					} else if (data.success) {
						if (successCallback instanceof Function) {
							return successCallback(data.data);
						}
					}
				}
				if (failureCallback instanceof Function) {
					return failureCallback(data);
				}
			};

			let onFailure = (error) => {
				if (failureCallback instanceof Function) {
					return failureCallback(error);
				}
			};

			switch (method.toLowerCase()) {
				case 'put':
					return this.put(url, params, onSuccess, onFailure);

				case 'post':
					return this.post(url, params, onSuccess, onFailure);

				case 'delete':
					return this.delete(url, onSuccess, onFailure);

				default: 
					this.get(url, params, onSuccess, onFailure);
			}
		}
	}

	get(url, params, successCallback, failureCallback) {
		for (let k in params) {
			url = this.addGetParam(url, k, params[k]);
		}
		axios.get(url)
		.then(successCallback)
		.catch(failureCallback);
	}

	post(url, params, successCallback, failureCallback) {
		let body = new FormData();
		let param;
		for (let k in params) {
			param = params[k];
			if (typeof param == 'object' && !(param instanceof File)) {
				param = JSON.stringify(params[k]);
			}
			body.append(k, param);
		}
		let config = {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		};
		axios.post(url, body, config)
		.then(successCallback)
		.catch(failureCallback);
	}

	put(url, params, successCallback, failureCallback) {
		let body = `data=${encodeURIComponent(JSON.stringify(params))}`;
		let config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
			}
		};
		axios.put(url, body, config)
		.then(successCallback)
		.catch(failureCallback);
	}

	delete(url, successCallback, failureCallback) {
		axios.delete(url)
		.then(successCallback)
		.catch(failureCallback);
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

	addGetParam(url, name, value) {
		let parts = url.split('?');
		let params = parts[1] || '';
		params += (!!params ? '&' : '') + name + '=' + value;
		return parts[0] + '?' + params;
	}
}

export default new Fetcher;