import * as React from 'react';
import {IComponent, IEnemy} from '../../models';
import CreatureImage from '../CreatureImage';

interface IProps extends IComponent {
	data: IEnemy;
}

export default class Enemy extends React.Component<IProps, {}> {
	render() {
		const {data: {name, type, img, active}} = this.props;
		return (
			<div className="self $?..active">
				<div className="ground dirt"/>
				<CreatureImage
					type={type}
					id={img}
				/>
			</div>
		)
	}
}