import * as React from "react";
import Store from "xstore";
import {IConnectedComponent} from '../../models';
import Battle from "../../pages/Battle";
import Travel from "../../pages/Travel";
import MainMenu from "../MainMenu";
import User from "../User";

interface IProps extends IConnectedComponent {
	location: string;
}

class App extends React.Component<IProps, {}> {

	render() {
		return (
			<div className="self">
				<MainMenu/>
				<User>
					{this.view}
				</User>
			</div>
		)
	}

	get view() {
		const {location} = this.props;
		switch (location) {
			case 'battle':
				return <Battle/>

			case 'travel':
				return <Travel/>

		}
		return null;
	}
}

export default Store.connect(App, 'user');