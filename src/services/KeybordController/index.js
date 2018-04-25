import GlobalState from 'app/services/GlobalState'

class KeybordController {
	init() {
		window.addEventListener('keyup', this.handleKeyUp.bind(this), false);
	}

	handleKeyUp(e) {
		GlobalState.dispatchEvent('keyup', e.keyCode, e);
	}
}

export default new KeybordController;