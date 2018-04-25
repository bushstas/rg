const VARIANTS = {
	result: ['результат', 'результата', 'результатов'],
	found: ['найден', 'найдено', 'найдено']
}

class Decliner {
	decline(wordKey, number, upperCaseFirst) {
		number = Math.floor(number) + '';
		let m = number.charAt(number.length - 1); 
		let variant, n;
		if (number.length > 1) {
			n = number.charAt(number.length - 2); 
		} else {
			n = 0;
		}
		if (n == 1) {
			variant = 2;
		} else { 
			if (m == 1) {
				variant = 0;
			} else if (m > 1 && m < 5) {
				variant = 1;
			} else {
				variant = 2;
			}
		}
		let v = VARIANTS[wordKey];
		if (!v) return '';
		if (upperCaseFirst) {
			return this.ucfirst(v[variant]);
		}
		return v[variant];
	}
	
	ucfirst(str) {
		if (typeof str != 'string') return '';
   		let f = str.charAt(0).toUpperCase();
   		return f + str.substr(1, str.length - 1);
	}

}
export default new Decliner;