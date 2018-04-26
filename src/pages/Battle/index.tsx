import * as React from "react";
import Store from "xstore";

class Battle extends React.Component<{}, {}> {
	render() {
		return (
			<div class="self">
				Battle
			</div>
		)
	}
}

export default Store.connect(Battle, 'battle');