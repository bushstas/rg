import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'

import './style.scss'

export default class Tabs extends Component {
	constructor(props) {
		super();
		let active = ~~props.active;
		if (props.all) {
			active = 'all';
		}
		this.addToState({
			'active': active
		});
	}

	componentWillReceiveProps(props) {
		if (typeof props.active == 'number') {
			this.state.active = props.active;
		}
	}

	render() {
		return (
			<div className={this.getClasses('tabs')}>
				{this.renderMenu()}
				{this.renderContent()}
			</div>
		);
	}

	renderMenu() {
		let {buttons} = this.props;
		if (buttons instanceof Array) {
			return (
				<menu className="tabs-menu" onClick={this.handleClick}>
					{this.renderAllButton()}
					{buttons.map(this.renderButton)}
				</menu>		
			)
		}
	}

	renderAllButton() {
		let {all, undetermined} = this.props;
		if (all) {
			let {active} = this.state;
			return (
				<span className={this.mergeClasses('tab-button', !undetermined && active == 'all' ? 'active' : '')} data-index="all">
					{all}
				</span>
			)
		}
	}
	
	@autobind
	renderButton(caption, i) {
		let {active} = this.state;
		let {undetermined} = this.props;
		return (
			<span className={this.mergeClasses('tab-button', !undetermined && active == i ? 'active' : '')} key={i} data-index={i}>
				{caption}
			</span>
		)
	}

	renderContent() {
		let {contents} = this.props;
		if (contents instanceof Array) {
			return (
				<div className="tab-contents">
					{contents.map(this.renderTabContent)}
				</div>
			)
		}
	}

	@autobind
	renderTabContent(content, i) {
		let {active} = this.state;
		let {undetermined} = this.props;
		let style = {display: !undetermined && (active == i || active == 'all') ? 'block' : 'none'}
		return (
			<div className="tab-content" style={style} key={i}>
				{content}
			</div>
		)
	}

	@autobind
	handleClick(e) {
		let idx = this.getTargetData(e, 'tab-button', 'index');
		if (idx) {
			this.switch(idx);
		}
	}

	switch(idx) {
		this.setState({
			active: idx
		});
		this.fireEvent('select', idx);
	}
}