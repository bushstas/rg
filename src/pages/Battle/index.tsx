import * as React from "react";
import Store from "xstore";
import Enemy from "../../components/Enemy";
import Loader from "../../ui/Loader";
import {IConnectedComponent, IEnemy} from '../../models';

interface IProps extends IConnectedComponent {
	enemies: IEnemy[];
}

class Battle extends React.Component<IProps, {}> {
	componentDidMount() {
		this.props.doAction('BATTLE_LOAD');
	}

	render() {
		const {fetching} = this.props;
		return (
			<Loader 
				classes="self"
				fetching={fetching}
			>
				<div className="enemies">
					{this.enemies}
				</div>
			</Loader>
		)
	}

	get enemies() {
		const {enemies} = this.props;
		let result = null;		
		if (enemies instanceof Array)  {
			result = enemies.map((enemy) => {
				return (
					<Enemy 
						data={enemy}
						key={enemy.key}
					/>
				)
			});
		}
		return result;
	}
}

export default Store.connect(Battle, 'battle');