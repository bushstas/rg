import GlobalState from 'app/services/GlobalState'

class HashRouter {
	init() {
		window.addEventListener('hashchange', this.handleHashChanged.bind(this), false);
		this.handleHashChanged();
	}
	
	handleHashChanged() {
		GlobalState.dispatchEvent('changeView', this.getView());
	}

	getView() {
		return window.location.hash.replace(/\#/, '');
	}

	replaceState(view) {
		window.history.replaceState(null, '', '#' + view);
	}

	pushState(view) {
		window.history.pushState(null, '', '#' + view);
	}
}
export default new HashRouter;