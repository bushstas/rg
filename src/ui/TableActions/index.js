import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'

import "./style.scss";


export default class TableActions extends Component {
	render() {
		return (
			<div className={this.getClasses('table-actions')}>
				{this.renderButtons()}
			</div>
		)
	}

	renderButtons() {
		let buttons = this.getActions();
		if (buttons instanceof Array) {
			return buttons.map(this.renderButton);
		}
	}
	
	@autobind
	renderButton(item, i) {
		let classes = 'table-action ' + item.name;
		return (
			<span className={classes} key={i} data-name={item.name} onClick={this.onClick}>
				{item.title}
			</span>
		)
	}

	@autobind
	onClick(e) {
		let action = this.getTargetData(e, 'table-action', 'name');
		if (action) {
			this.fireEvent('pick', action);
		}
	}
	
	getActions(){}
}