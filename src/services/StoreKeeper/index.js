function StoreKeeper() {
	var x = 'ofd_manager_stored_';
	var s = {
		'month': 2592000,
		'day'  : 86400,
		'hour' : 3600,
		'min'  : 60
	};
	this.set = function(k, v) {
		var lk = g(k);
		var i = JSON.stringify({
			'data': v,
			'timestamp': Date.now().toString()
		});
		localStorage.setItem(lk, i);
	};
	this.get = function(k, d) {
		var i = gi(k);
		return i && i['data'] ? i['data'] : d || null;
	};
	this.getActual = function(k, p) {
		var i = gi(k);
		return i && i['data'] && ia(i['timestamp'], p) ? i['data'] : null;
	};
	this.remove = function(k) {
		var lk = g(k);
		localStorage.removeItem(lk);
	};
	var ia = function(sm, p) {
		var nm = Date.now(), pm = gm(p);
		if (typeof sm == 'string') sm = Number(sm);
		return pm && sm && nm - sm < pm;
	};
	var gi = function(k) {
		var lk = g(k);
		var i = localStorage.getItem(lk);
		if (!i) return null;
		try {
			i = JSON.parse(i);
		} catch (e) {
			return null;
		}
		return i;
	};
	var gm = function(p) {
		var n  = ~~p.replace(/[^\d]/g, '');
		var m = p.replace(/\d/g, '');
		if (!n) return 0;		
		if (!s[m]) return 0;
		return s[m] * n * 1000;
	};
	var g = function(k) {
		return x + k;
	};
}
export default new StoreKeeper;