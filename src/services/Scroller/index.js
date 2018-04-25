var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

class Scroller {
	scrollTo(y, ms, delay) {
		var cb = function() {
			if (!isFirefox) {
				document.body.scrollTo(y, ms, delay);
			} else {
				document.documentElement.scrollTo(y, ms);
			}
		};
		if (delay) setTimeout(cb, delay);
		else cb();
	};
	findAndScrollTo(selector, scope, ms, delay) {
		if (scope instanceof Element) {
			var cb = (function() {
				this.scrollTo(scope.querySelector(selector), ms);
			}).bind(this);
			if (delay) setTimeout(cb, delay);
			else cb();
		}
	}
	getBody() {
		return isFirefox ? document.documentElement : document.body;
	}
}

export default new Scroller;