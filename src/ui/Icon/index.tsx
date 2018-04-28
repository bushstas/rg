import * as React from 'react';
import {icons} from '../../utils/Dictionary';
import {IComponent} from '../../models';

interface IProps extends IComponent {
	size?: string;
	icon?: string;
}

export default function Icon({children, classes, size, icon, ...others}: IProps) {
	let style;
	if (size) {
		style = {
			fontSize: size + 'px'
		}
	}
	if (!children && icon) {
		children = icons[icon];
	}
	return (
		<i 
			className="self $classes"
			style={style}
			{...others}>
			{children}
		</i>
	)
}