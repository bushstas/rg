const REGEXES = {
	inn: /^(\d{10}|\d{12})$/,
	inn10: /^\d{10}$/,
	inn12: /^\d{12}$/,
	ogrn: /^(\d{13}|\d{15})$/,
	ogrn13: /^\d{13}$/,
	ogrn15: /^\d{15}$/,
	index: /^\d{6}$/,
	snils: /^\d{11}$/,
	kpp: /^\d{9}$/,
	passport_serial: /^\d{4}$/,
	passport_number: /^\d{6}$/,
	email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	date: /^\d{2}\.\d{2}\.\d{4}$/,
	rs: /^\d{20}$/,
	number: /^\d+$/,
	key: /^[\wа-яА-Я\-]{2,20}$/,
	bik: /^\d{9}$/,
	fn: /^\d{16}$/,
	kn: /^\d{5,20}$/
}

class Validator {
	isValid(validator, value) {
		return !this.validate(value, validator);
	}
	validate(value, validator) {
		let regex = this.getRegex(validator);
		if (!regex || !value || regex.test(value)) {
			return;
		}
		return true;
	}
	getRegex(validator) {
		if (validator) {
			let r = REGEXES[validator];
			if (r) return new RegExp(r);
		}
	}
	correct(value, validator) {
		switch (validator) {
			case 'inn10':
			case 'inn12':
			case 'ogrn':
			case 'snils':
			case 'kpp':
			case 'passport_serial':
			case 'passport_number':
			case 'rs':
			case 'number':
			case 'bik':
			case 'fn':
			case 'kn':
				return value.replace(/[^\d]/g, '');
			
		}
		return value;
	}
}

export default new Validator;