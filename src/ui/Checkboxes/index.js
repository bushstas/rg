import {autobind} from "core-decorators"
import React from 'react'
import Checkbox from '../Checkbox'
import Switcher from '../Switcher'
import Component from 'app/ui/Component'
import Collapse from 'app/ui/Collapse'

import './style.scss'
const COLLAPSE_BUTTON = 'Показать все';

export default class Checkboxes extends Component {
	render() {
		return (
			<div className="checkboxes">
				{this.hasProp('caption') && <div className="field-caption">{this.getProp('caption')}</div>}
				<div>
					{this.mapProp('items')}
				</div>
				{this.renderCollapse()}
			</div>
		);
	}

	renderItem(item, i) {
		let {collapse} = this.props;
		if (!collapse || i < collapse) {
			return this.getItem(item, i);
		}
	}

	getItem(item, i) {
		let {switchers} = this.props;
		let checked = item.checked;
		if (typeof checked == 'undefined' && this.hasProp('value')) {
			let {value} = this.props;
			if (!(value instanceof Array)) {
				value = [value];
			}
			checked = value.has(i);
		}
		return (
			<div className="checkboxes-item" key={i}>
				{!switchers ?
					<Checkbox ref={i} value={i} checked={checked} onChange={this.handleCheckboxChange} label={item.label} disabled={item.disabled} onDisabledMessage={this.handleWarning}/> :
					<Switcher ref={i} value={i} checked={checked} onChange={this.handleCheckboxChange} label={item.label} disabled={item.disabled} onDisabledMessage={this.handleWarning}/>
				}
			</div>
		)
	}

	renderCollapse() {
		let {collapse, collapseButton, items} = this.props;
		if (collapse && items.length > collapse) {
			return (
				<Collapse caption={collapseButton || COLLAPSE_BUTTON} buttonAfter={true}>
					{this.mapProp('items', this.renderCollapseItem)}
				</Collapse>
			)
		}
	}

	renderCollapseItem(item, i) {
		let {collapse} = this.props;
		if (collapse && i >= collapse) {
			return this.getItem(item, i);
		}
	}

	@autobind
	handleCheckboxChange(name, value, checked) {
		this.fireEvent('change', checked, this.props.name, value);
	}

	@autobind
	handleWarning() {
		let message = this.getProp('disabledMessage');
		if (message) {
			this.alert(message);
		}
	}
}