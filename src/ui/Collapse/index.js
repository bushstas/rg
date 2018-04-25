import {autobind} from 'core-decorators'
import React from 'react'
import Component from 'app/ui/Component'
import ReactCollapse from 'node_modules/react-collapse'

import "./style.scss"

export default class Collapse extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			expanded: props.expanded || false
		};
	}

	render() {
		let {buttonAfter, before} = this.props;
		let {expanded} = this.state;
		let button = (
			<div className="collapse-button-placeholder">
				{!!before && <span className="collapse-button-before">{before}</span>}
				<div className={this.mergeClasses('collapse-button', expanded ? 'expanded' : '')} onClick={this.toggleState.bind(this, 'expanded')}>
					{this.props.caption}
				</div>
			</div>
		);
		return (
			<div className={this.getClasses('collapse')}>
				{buttonAfter || button}
				<ReactCollapse isOpened={expanded}>
					{this.props.children}
				</ReactCollapse>
				{!buttonAfter || button}
			</div>
		)
	}

	toggle() {
		this.toggleState('expanded');
	}
}