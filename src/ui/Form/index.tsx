import * as React from 'react';
import {IComponent, IChildren, IFormData} from '../../models';
import FormField, {IFormFieldProps} from '../FormField';
import FormSubmit, {IFormSubmitProps} from '../FormSubmit';

interface IProps extends IComponent {
	onControlChange?: (name: string, value: any) => void;
	onChange?: (formData: IFormData) => void;
	onValidate?: () => void;
	onDispose?: () => void;
	onSubmit?: (formData: IFormData) => void;
}

interface IState {
	formData: IFormData;
}

export default class Form extends React.Component<IProps, IState> {
	static defaultProps = {
		onControlChange: () => {},
		onChange: () => {},
		onValidate: () => {},
		onDispose: () => {},
		onSubmit: () => {}
	}

	constructor(props) {
		super(props);
		this.state = {
			formData: props.data || {}
		};
	}

	render() {
		let {classes} = this.props;
		return (
			<div className="self $classes">
				{this.content}
			</div>
		)
	}

	get content() {
		let {children} = this.props;
		if (!(children instanceof Array)) {
			children = [children] as IChildren;
		}
		return this.renderChildren(children);
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
		return this.renderChild(children);
	}

	renderChild(child, i = 0) {
		if (React.isValidElement(child)) {
			if (child.type == FormField) {
				return this.renderFormField(child, i);
			} else  if (child.type == FormSubmit) {
				return this.renderFormSubmit(child, i);
			}
			return this.renderFormElement(child, i);
		}
		return child;
	}

	renderFormField(child, i) {
		const childProps = child.props as IFormFieldProps;
		if (childProps.isPresent === false) {
			return null;
		}
		const props: IFormFieldProps = {
			key: i,
			onChange: this.handleControlChange,
			onValidate: this.props.onValidate
		};
		return React.cloneElement(child, props, this.renderChildren(childProps.children));
	}

	renderFormSubmit(child, i) {
		const childProps = child.props as IFormSubmitProps;
		const props: IFormSubmitProps = {
			key: i,
			onClick: this.handleSubmit
		};
		return React.cloneElement(child, props, this.renderChildren(childProps.children));
	}

	renderFormElement(child, i) {
		const childProps = child.props as IComponent;
		const props = {key: i} as IComponent;
		return React.cloneElement(child, props, this.renderChildren(childProps.children));
	}

	handleControlChange = (name: string, value: string, checked?: boolean) => {
		let val: any = value;
		if (typeof checked == 'boolean') {
			val = checked;
		}
		let {onControlChange, onChange} = this.props;
		onControlChange(name, val);
		let {formData} = this.state;
		formData[name] = val;
		onChange(formData);
	}

	handleSubmit = () => {
		this.props.onSubmit(this.state.formData);
	}
}