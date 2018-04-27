import * as React from 'react';
import {IComponent} from '../../models';

interface IProps extends IComponent {
	fetching: boolean;
}

export default function Loader({fetching, classes, children}: IProps) {
	return (
		<div className="$classes">
			{fetching ? (
				<div className="self">
					<div className="container">
						<div className="whirlpool"/>
					</div>
				</div>
			) : children}
		</div>
	)
}