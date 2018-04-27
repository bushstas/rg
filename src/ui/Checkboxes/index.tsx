import * as React from 'react';
import Checkbox from '../Checkbox';
import {IComponent, ICheckboxItem} from '../../models';

interface IProps extends IComponent {
	onChange?: (name: string, values: string[]) => void;
	onDispose?: (name: string) => void;
	items: ICheckboxItem[];
	name?: string;
	value?: string[];
}

export default class Checkboxes extends React.PureComponent<IProps, {}> {
	static defaultProps = {
		onChange: () => {},
		onDispose: () => {}
	}

	componentWillUnmount() {
		let {name, onDispose} = this.props;
		onDispose(name);
	}

	render() {
		let {classes, name, value} = this.props;
		return (
			<div className="self $classes">
				{this.controls}
			</div>
		)
	}

	get controls() {
		let {items} = this.props;
		let values = this.values;
		if (items instanceof Array) {
			return items.map((item, i) => {
				let checked = values.indexOf(item.value) > -1;
				return (
					<Checkbox 
						key={item.value}
						checked={checked}
						value={item.value}
						onChange={this.handleControlChange}>
						{item.label}
					</Checkbox>
				)
			});
		}
	}

	get values() {
		let {value} = this.props;
		if (!(value instanceof Array)) {
			value = [];
		}
		return value;
	}

	handleControlChange = (name: string, value: string, checked: boolean) => {
		let values = this.values;
		let idx = values.indexOf(value);
		if (checked && idx == -1) {
			values.push(value);
		} else if (!checked && idx > -1) {
			values.splice(idx, 1);
		}
		this.props.onChange(this.props.name, values);
	}
}