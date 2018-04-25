import {autobind} from 'core-decorators'
import React from 'react'
import Component from 'app/ui/Component'
import Tooltip from 'app/ui/Tooltip'
import {ERRORS} from 'app/consts/errors.js'

import "./style.scss"

export default class Checkbox extends Component {
	constructor() {
		super();
		this.className = 'checkbox';
	}

	render() {
		let {checked, disabled, error} = this.props;
		return (
			<span className={this.getClasses(checked ? 'checked' : '', disabled ? 'disabled' : '')} onClick={this.toggle}>
				{error && this.renderError(error)}
				<span className="control"/>
				{this.renderLabel()}
				{this.renderNote()}
			</span>
		)
	}

	renderError(error) {
		return (
            <Tooltip sign="!" classes="error small shown">
                {ERRORS[error]}
            </Tooltip>
        )
	}

	renderLabel() {
		let {label, children, description} = this.props;
		children = children || description;
		if (label || children) {
			return (
				<span className="label">
					<div className="label-text">{label}</div>
					<div className="label-description">
						{children}
					</div>
				</span>
			)
		}
	}

	renderNote() {
		let {note} = this.props;
		if (note) {
			return (
				<div className="note">
					{note}
				</div>
			)
		}
	}

	@autobind
	toggle() {
		let {name, value, checked, disabled, disabledMessage, readOnly} = this.props;
		if (readOnly) return;
		if (disabled) {
			if (disabledMessage) {
				this.alert(disabledMessage);
			}
			this.fireEvent('disabledMessage');
			return;
		}
		if (typeof value == 'undefined') {
			value = !checked;
		}
		this.fireEvent('change', name, value, !checked);
	}
}