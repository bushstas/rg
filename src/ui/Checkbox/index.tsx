import * as React from 'react';
import Icon from '../Icon';
import {IComponent} from '../../models';

interface IProps extends IComponent {
	onChange?: (name: string, value: string, checked: boolean) => void;
	name?: string;
	value?: string;
	checked: boolean;
}

export default class Checkbox extends React.PureComponent<IProps, {}> {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {classes, checked, disabled, name, value = '', children} = this.props;
		if (typeof checked != 'boolean') {
			checked = !!checked;
		}
		let props = {
			type: 'checkbox',
			checked,
			name,
			value,
			onChange: this.handleChange
		}
		return (
			<div className="self $classes $?checked $?disabled">
				<label className="label-area" onClick={this.handleChange}>
					<span className="control">
						{checked && (
							<Icon icon="checked"/>
						)}
					</span>
					<span className="label">
						{children}
					</span>
				</label>
			</div>
		)
	}

	handleChange = (e) => {
		let {onChange, name, value, checked, disabled} = this.props;
		if (!disabled) {
			onChange(name, value, !checked);
		}
	}
}
