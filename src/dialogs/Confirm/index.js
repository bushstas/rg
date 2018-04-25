import React from 'react'
import {autobind} from "app/node_modules/core-decorators"
import DialogWrapper from 'app/ui/DialogWrapper'
import Button from 'app/ui/Button'

import "./style.scss";

export default class Confirm extends DialogWrapper {
	render() {
		return this.renderDialog({
			classes: 'confirm',
			buttons: (
				<span>
					<Button classes="upper-case yes" caption="Да" value="yes" onClick={this.handleButtonClick} />
					<Button classes="upper-case no" caption="Нет" value="no" onClick={this.handleButtonClick} />
				</span>
			)
		});
	}

	@autobind
	handleButtonClick(value) {
		this.hide();
		if (value == 'yes') {
			if (this.options.onConfirm instanceof Function) {
				this.options.onConfirm();
			} else {
				this.fireEvent('confirm');
			}
		}
	}
}