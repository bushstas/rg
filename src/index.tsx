import * as React from 'react';
import * as ReactDOM from "react-dom";
import App from './containers/App';
import Store from 'xstore';

import battle from './store_handlers/battle';
import user from './store_handlers/user';

Store.setDefaultParams({
	flat: true
});
Store.addHandlers({
	user,
	battle
});

ReactDOM.render(
	<App/>,
	document.querySelector('#root')
);