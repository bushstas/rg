import * as React from 'react';
import {IComponent} from '../../models';

interface IProps extends IComponent {
	onChange?: (name: string, value: string) => void;
	onDispose?: (name: string) => void;
	onValidate?: (isValid: boolean) => void;
	type?: string;
	name?: string;
	value: string;
	textarea?: boolean;
	spellCheck?: boolean;
}

export default class Input extends React.PureComponent<IProps, {}> {
	static defaultProps = {
		onChange: () => {},
		onDispose: () => {},
	}

	componentWillUnmount() {
		let {name, onDispose} = this.props;
		onDispose(name);
	}

	render() {
		let {
			textarea,
			classes,
			value = '',
			onValidate,
			onChange,
			onDispose,
			...others
		} = this.props;

		const props = {
			...others,
			value,
			onChange: this.handleChange						
		}
		if (!textarea) {
			props.type = this.type;
			props.value = value;
		} else {
			props.spellCheck = false;
		}
		return (
			<div className="self $classes">
				{textarea ? (
					<textarea {...props}>
						{value}
					</textarea>
				) : (
					<input {...props}/>
				)}
			</div>
		)
	}

	get type() {
		let {type} = this.props;
		return type || 'text';
	}

	handleChange = (e) => {
		let {onChange, name} = this.props;
		onChange(name, e.target.value);
	}
}