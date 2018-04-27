import * as React from 'react';
import {IComponent} from '../../models';

interface IProps extends IComponent {
	onClick?: (value: string) => void;
	href?: string;
	width?: number;
	value?: string;
}

export default class Button extends React.Component<IProps, {}> {
	static defaultProps = {
		onClick: () => {}
	}

	render() {
		let {classes, children, href, onClick, disabled, width} = this.props;
		classes = $classy('self $classes $?disabled');
		let props = {
			className: classes,
			onClick: this.handleClick
		};
		let style;
		if (width) {
			style = {
				minWidth: width + 'px'
			}
		}
		if (href) {
			return (
				<a href={href} style={style} {...props}>
					{children}
				</a>
			)
		}
		return (
			<div style={style} {...props}>
				{children}
			</div>
		)
	}

	handleClick = (e) => {
		e.stopPropagation();
		let {value, disabled} = this.props;
		if (disabled) return;
		this.props.onClick(value);
	}
}