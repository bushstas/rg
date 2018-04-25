import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'
import Input from 'app/ui/Input'

import './style.scss';

export default class Counter extends Component {
	
	render() {
		let value = this.getProp('value');
		let name = this.getProp('name');
		return (
			<div className={this.getClasses('counter')}>
				<span className="minus" onClick={this.handleMinus}>-</span>
				<Input name={name} value={value} maxLength="2" onChange={this.handleInputChange}/>
				<span className="plus" onClick={this.handlePlus}>+</span>
			</div>
		)
	}

	@autobind
	handleInputChange(name, value) {
		this.fireEvent('change', name, value);
	}

	@autobind
	handleMinus() {
		let value = ~~this.getProp('value');
		let prevValue = value;
		value--;
		value = Math.max(0, value);
		if (prevValue != value) {
			this.handleInputChange(this.getProp('name'), value);
		}
	}

	@autobind
	handlePlus() {
		let value = ~~this.getProp('value');
		let prevValue = value;
		value++;
		value = Math.min(99, value);
		if (prevValue != value) {
			this.handleInputChange(this.getProp('name'), value);
		}
	}
} 