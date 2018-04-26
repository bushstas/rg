import * as React from 'react';
import * as ReactDOM from "react-dom";
import App from 'components/App';
import Store from 'xstore';

import app from './store_handlers/app';

Store.setDefaultParams({
	flat: true
});
Store.addHandlers({
	app
});

ReactDOM.render(
	<App/>,
	document.querySelector('#root')
);