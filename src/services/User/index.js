import {autobind} from 'app/node_modules/core-decorators'
import StoreKeeper from '../StoreKeeper'
import AjaxRequest from 'app/services/AjaxRequest'
import GlobalState from 'app/services/GlobalState'

const API_KEY = 'apikey';
const AUTH_URL = '/access/auth';
const REGISTER_URL = '/access/create';
const RESTORE_URL = '/access/restore';
const LOAD_URL = '/personal';
const CONFIRM_URL = '/access/reg';
const CHECK_STATUS_URL = '/access/active';
const CHECK_STATUS_INTERVAL = 30000;
const CHECK_STATUS_TIMEOUT = 500;

class User {
	constructor() {
		this.attrs = {};
		if (this.isAuthorized()) {
			//window.setInterval(this.checkUserStatus, CHECK_STATUS_INTERVAL);
			//window.setTimeout(this.checkUserStatus, CHECK_STATUS_TIMEOUT);
		}
	} 

	@autobind
	checkUserStatus() {
		AjaxRequest.send(CHECK_STATUS_URL, 'GET', null, this.onGotStatus);
	}

	@autobind
	onGotStatus(data) {
		if (!data) {
			StoreKeeper.set('need_to_logout', 1);
			GlobalState.dispatchEvent('alert', {children: 'Срок действия авторизации истек', title: 'Статус авторизации', onClose: this.logout});
		}
	}

	init(app) {
		this.app = app;
	}

	getApiKey() {
		let needToLogout = StoreKeeper.get('need_to_logout');
		if (!!needToLogout) {
			StoreKeeper.remove('need_to_logout');
			this.logout();
		} else {
			return StoreKeeper.getActual(API_KEY, '250day');
		}
	}

	auth(data) {
		let {email, password} = data;
		AjaxRequest.send(AUTH_URL, 'GET', {id: email || '', psw: password || ''}, this.onAuth.bind(this, email));
	}

	restorePassword(email) {
		AjaxRequest.send(RESTORE_URL, 'GET', {value: email});
	}

	isAuthorized() {
		return !!this.getApiKey();
	}

	getAttribute(name) {
		return this.attrs[name];
	}

	setAttribute(name, value) {
		this.attrs[name] = value;
	}

	onAuth(email, data) {
		if (data instanceof Object && data.success === false) {
			this.app.setState({
				loading: false,
				error: data.error,
				email: email
			});	
		} else if (data && typeof data == 'string') {
			StoreKeeper.set('apikey', data);
			this.app.setState({
				loading: false,
				email: email
			});
		}
	}
	removeApiKey() {
		StoreKeeper.remove(API_KEY);
	}

	@autobind
	logout() {
		StoreKeeper.remove('need_to_logout');
		this.removeApiKey();
		window.location.reload();
	}
	
	register({email, firstname, lastname, phone}) {
		phone = '8' + phone.replace(/[^\d]/g, '');
		AjaxRequest.send(REGISTER_URL, 'GET', {id: email, name: firstname, lname: lastname, phone}, this.onRegister.bind(this, email), this.onRegisterFailure.bind(this, email));
	}

	onRegister(email) {
		this.app.setState({
			regEmail: email
		});
	}

	onRegisterFailure(email, error) {
		this.app.setState({
			regEmail: email,
			regError:  error
		});
	}

	handleRegKey(key) {
		AjaxRequest.send(CONFIRM_URL, 'GET', {key}, this.onConfirmed);
	}

	@autobind
	onConfirmed(data) {
		this.app.setState({
			regdata: data
		});
	}
}

export default new User;