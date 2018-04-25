import React from 'react'
import Checkbox from 'app/ui/Checkbox'

import './style.scss';

export default class Radio extends Checkbox {
	constructor() {
		super();
		this.className = 'radio';
	}
} 