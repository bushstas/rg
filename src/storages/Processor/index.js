import {autobind} from "core-decorators"
import Fetcher from 'app/services/Fetcher'

import Chars from '../Chars'
import Stats from '../Stats'
import Exps  from '../Exps'
import Conds from '../Conds'
import Equip from '../Equip'
import Depot from '../Depot'
import Forge from '../Forge'
import Sack  from '../Sack'
import Hero  from '../Hero'
import Location  from '../Location'

let STORAGES_MAP = {
	chars: Chars,
	stats: Stats,
	exps:  Exps,
	conds: Conds,
	equip: Equip,
	depot: Depot,
	forge: Forge,
	sack:  Sack,
	hero:  Hero,
	loc:   Location
};

@autobind
class Processor {
	constructor() {
		this.storages = {};
	}

	subscribeToStorages(component, ...storages) {
		let storagesToLoad = [];
		for (let i = 0; i < storages.length; i++) {
			let key = storages[i];
			let s = this.storages[key] || STORAGES_MAP[key];
			if (s instanceof Function) {
				s = new s(key, this);
				this.storages[key] = s;
			}
			if (s instanceof Object) {				
				let data = s.get();
				if (!data) {
					storagesToLoad.addUnique(key);
				} else {
					let obj = {};
					obj[key] = data;
					component.addToState(obj);
				}
				s.subscribe(component);
				component.addStorage(key, s);
				component.shouldHave(key);
			}
		}
		if (!storagesToLoad.isEmpty()) {
			this.doAction('get_app_load', {storagesToLoad});
		}
	}

	getStorage(key) {
		return this.storages[key];
	}

	doAction(api, data, callback) {
		api = api.split('_');
		let method = api[0],
			subject = api[1],
			action = api[2];
		
		if (!(data instanceof Object)) {
			data = {};
		}
		data.api_subject = subject;
		data.api_action = action;
		if (!(callback instanceof Function)) {
			callback = this.handleSuccess;
		}
		Fetcher.send('execute.php', method, data, callback, this.handleFailure);
	}

    handleSuccess(data) {
    	for (let k in data) {
    		if (this.storages[k]) {
    			this.storages[k].set(data[k]);
    		}
    	}
    }

    handleFailure(data) {

    }
}

export default new Processor;