import {Router, Route, IndexRoute, browserHistory} from "node_modules/react-router"
import React from "node_modules/react"
import ReactDOM from "node_modules/react-dom"
import App from 'app'

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path={GLOBALS.base} component={App}>		
			<IndexRoute component={App}/>
			<Route path='*' component={App} />
		</Route>
	</Router>,
	document.querySelector('#root')
);