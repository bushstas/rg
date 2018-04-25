import {autobind} from "core-decorators"
import AjaxRequest from 'app/services/AjaxRequest'

const DICTIONARY_URL = 'https://dev.initpro.ru/bushstas-test-api/apis/dictionary.php';

class Dictionary {

	constructor() {
		this.dicts = {};
	}

	load(page, subscriber) {
		if (!this.dicts[page]) {
			this.loadForPage(page, subscriber);
		} else {
			if (subscriber.handleDictionaryLoad instanceof Function) {
				subscriber.handleDictionaryLoad(this.dicts[page]);
			}
			return this.dicts[page];
		}
	}

	getItem(page, name) {
		if (this.dicts[page] instanceof Object) {
			return this.dicts[page][name];
		}
	}

	loadForPage(page, subscriber) {
		AjaxRequest.send(DICTIONARY_URL, 'GET', {page}, this.handleLoad.bind(this, page, subscriber));
	}

	@autobind
	handleLoad(page, subscriber, data) {
		this.dicts[page] = data;
		subscriber.handleDictionaryLoad(data);
	}
}

export default new Dictionary;