import * as React from "react";
import Store from "xstore";
import Battle from "../../pages/Battle";

interface IProps {
	page: string;
}

class App extends React.Component<IProps, {}> {
	render() {
		return (
			<div class="self">
				{this.renderView()}
			</div>
		)
	}

	renderView() {
		const {page} = this.props;
		switch (page) {
			case 'battle':
				return <Battle/>

		}
	}
}

export default Store.connect(App, 'app');