import * as React from 'react';
import Input from '../Input';
import Select from '../Select';
import Checkboxes from '../Checkboxes';
import Checkbox from '../Checkbox';
import Radios from '../Radios';
import Radio from '../Radio';
import Tooltip from '../Tooltip';
import {IComponent, IChildren} from '../../models';

export interface IFormFieldProps extends IComponent {
	onChange?: (name: string, value: string, checked?: boolean) => void;
	onValidate?: () => void;
	onDispose?: () => void;
	caption?: string | JSX.Element;
	tooltip?: string | JSX.Element;
	isPresent?: boolean;
}

const INPUT_TYPES = [
	Input,
	Select,
	Checkboxes,
	Checkbox,
	Radios,
	Radio
];

export default class FormField extends React.PureComponent<IFormFieldProps, {}> {

	static defaultProps = {
		onChange: () => {},
		onValidate: () => {},
		onDispose: () => {}
	}

	render() {
		let {classes} = this.props;
		return (
			<div className="self $classes">
				{this.caption}
				<div className="content">
					{this.control}
					{this.tooltip}
				</div>		
			</div>
		)
	}

	get caption() {
		let {caption} = this.props;
		if (caption) {
			return (
				<div className="caption">
					{caption}
				</div>
			)
		}
	}

	get control() {
		let {children} = this.props;
		if (!(children instanceof Array)) {
			children = [children] as IChildren;
		}
		return this.renderChildren(children);
	}

	get tooltip() {
		let {tooltip} = this.props;
		if (tooltip) {
			return (
				<Tooltip>
					{tooltip}
				</Tooltip>
			)
		}
	}

	renderChildren(children) {
		if (children instanceof Array) {
			return children.map((child, i) => {
				if (child instanceof Array) {
					return this.renderChildren(child);
				}
				return this.renderChild(child, i);
			});
		}
		return this.renderChild(children, 0);
	}

	renderChild(child, i) {
		if (React.isValidElement(child)) {
			const childProps: IFormFieldProps = child.props;
			let props = {
				key: i
			} as IFormFieldProps;
			if (INPUT_TYPES.indexOf(child.type) > -1) {
				props.onChange = this.props.onChange;
				props.onValidate = this.props.onValidate;
				props.onDispose = this.props.onDispose;
			}
			return React.cloneElement(
				child,
				props,
				this.renderChildren(childProps.children)
			);
		}
		return child;
	}
}