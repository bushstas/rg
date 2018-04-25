import {autobind} from "core-decorators"
import Storage from 'app/storages'

export default class Location extends Storage {
	isIn(...places) {
		return this.data instanceof Object && places.has(this.data.place);
	}
}