import {autobind} from "core-decorators"
import Storage from 'app/storages'
import Processor from 'app/storages/Processor'

export default class Chars extends Storage {

	getList() {
		return this.data['list'];
	}

	hasEnough(name, value) {
		return this.data[name] >= value;
	}

	canAdd(name) {
		let points = Processor.getStorage('exps').getItem('points');
		return points >= this.getPointsToAdd(name);
	}

	getPointsToAdd(name, add = 1) {
		if (add == -1) add = 0;
		let current = this.data[name];
		return (current + add) * 100;
	}

	add(name, value) {
		let points = this.getPointsToAdd(name, value);
		Processor.getStorage('exps').add('points', -points * value);
		super.add(name, value);
	}
}