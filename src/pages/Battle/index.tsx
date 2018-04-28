import * as React from "react";
import Store from "xstore";
import Enemy from "../../components/Enemy";
import Loader from "../../ui/Loader";
import {IConnectedComponent, IEnemy, IBattleData} from '../../models';

interface IProps extends IConnectedComponent, IBattleData {
	
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
					<div className="enemies-row enemies-first-row">
						{this.enemies}
					</div>
					<div className="enemies-row enemies-second-row">
						{this.enemies}
					</div>
					<div className="enemies-row enemies-third-row">
						{this.enemies}
					</div>
				</div>
				<div className="hero-condition">
					{this.heroCondition}
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

	get heroCondition() {
		const {heroCondition} = this.props;
		return null;
	}
}

export default Store.connect(Battle, 'battle');