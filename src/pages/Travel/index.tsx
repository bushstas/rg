import * as React from "react";
import Store from "xstore";
import Loader from "../../ui/Loader";
import TravelCard from "../../components/TravelCard";
import {IConnectedComponent, ITravelData} from '../../models';

interface IProps extends IConnectedComponent, ITravelData {}

class Travel extends React.Component<IProps, {}> {
	componentDidMount() {
		this.props.doAction('TRAVEL_LOAD');
	}

	render() {
		const {fetching} = this.props;
		return (
			<Loader 
				classes="self"
				fetching={fetching}
			>
				{this.cards}
			</Loader>
		)
	}

	get cards() {
		const {cards} = this.props;
		let result = null;		
		if (cards instanceof Array)  {
			result = cards.map((card) => {
				return (
					<TravelCard 
						data={card}
						key={card.key}
					/>
				)
			});
		}
		return result;
	}
}

export default Store.connect(Travel, 'travel');