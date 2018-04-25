import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'
import Dictionary from 'app/storages/Dictionary'
import Loader from 'app/ui/Loader'

import "./style.scss"

export default class View extends Component {
	constructor() {
		super();
		this.shouldHave('dict');
	}
	
	componentDidMount() {
		super.componentDidMount();
		Dictionary.load(this.props.name, this);
	}

	render() {
		if (!this.isReady()) {
            return <Loader/>
        }
		
		let viewClassName = this.getViewClassName() || this.props.name + '-view';
		return (
			<div ref="scope" className={'view ' + viewClassName}>
				{this.renderContent()}
			</div>
		)
		
		return null;
	}

   	@autobind
	handleDictionaryLoad(dict) {
    	this.setState({dict});
	}

	renderContent(){}
	getViewClassName() {}
} 