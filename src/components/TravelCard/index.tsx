import * as React from 'react';
import {IComponent, ITravelCard} from '../../models';

interface IProps extends IComponent {
	data: ITravelCard;
}

export default class TravelCard extends React.Component<IProps, {}> {
	render() {
		const {data: {type}} = this.props;
		return (
			<div className="self">
				{type} card
			</div>
		)
	}
}