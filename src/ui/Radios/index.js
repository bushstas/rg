import {autobind} from "core-decorators"
import React from 'react'
import Radio from '../Radio'
import Component from 'app/ui/Component'

import './style.scss'

export default class Radios extends Component {
	render() {
		return (
			<div className={this.getClasses('radios')}>
				{this.mapProp('items')}
			</div>
		);
	}

	renderItem(item, i) {
		let {value, label, disabled, note, disabledMessage, description} = item;
		let	checked = value == this.props.value;
		return (
			<div className="radio-item" key={i} style={this.getItemStyle(item)}>
				<Radio ref={i} value={value} checked={checked} onChange={this.handleRadioChange} label={label} disabled={disabled} disabledMessage={disabledMessage} note={note} description={description}/>
			</div>
		)
	}

	getItemStyle(item) {
		let style;
		if (item.hidden) {
			style = {visibility: 'hidden'};
		}
		return style;
	}

	@autobind
	handleRadioChange(name, value, checked) {
		if (!this.hasProp('readOnly')) {
			this.fireEvent('change', this.props.name, value);
		}
	}
}