import {autobind} from "core-decorators"
import Storage from 'app/storages'

export default class Equip extends Storage {
	
	init(data) {
		let {set} = data;
		if (data['rhand' + set]) {
			data.rhand = data['rhand' + set];
		}
		if (data['lhand' + set]) {
			data.lhand = data['lhand' + set];
		}
		super.init(data);
	}

	isEquipped(slot) {
		return this.hasItem(slot);
	}

	swapWeapons() {
		this.processor.doAction('equip', {action: 'swap'});
	}

}