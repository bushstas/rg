import * as React from "react";
import Store from "xstore";
import {IConnectedComponent} from '../../models';
import Battle from "../../pages/Battle";
import User from "../User";

interface IProps extends IConnectedComponent {
	location: string;
}

class App extends React.Component<IProps, {}> {

	render() {
		return (
			<User>
				{this.view}
			</User>
		)
	}

	get view() {
		const {location} = this.props;
		switch (location) {
			case 'battle':
				return <Battle/>

		}
		return null;
	}
}

export default Store.connect(App, 'user');