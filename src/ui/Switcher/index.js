import React from 'react'
import Checkbox from 'app/ui/Checkbox'

import './style.scss';

export default class Switcher extends Checkbox {
	constructor() {
		super();
		this.className = 'switcher';
	}
} 