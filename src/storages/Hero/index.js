import {autobind} from "core-decorators"
import Storage from 'app/storages'


export default class Hero extends Storage {
	getClass() {
		return this.data.class;
	}
}