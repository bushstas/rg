import {autobind} from 'core-decorators'
import React from 'react'
import DialogWrapper from 'app/ui/DialogWrapper'
import Button from 'app/ui/Button'

import "./style.scss";

export default class Alert extends DialogWrapper {
	render() {
		let {title = 'Внимание!'} = this.options || {};
		return this.renderDialog({
			title: title,
			classes: 'alert',
			closable: true,
			buttons: (
				<span>
					<Button classes="upper-case" caption="Ок" onClick={this.hide} />
				</span>
			)
		});
	}

	@autobind
	hide() {
		if (this.options) {
			let {onClose} = this.options;
			if (onClose instanceof Function) {
				onClose();
			}
		}
		super.hide();
	}
}