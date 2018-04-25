import React from 'react'
import Component from 'app/ui/Component'

import './style.scss';

export default class Warning extends Component {
	render() {
		return (
			<div className={this.getClasses('warning-message')}>
				<div className="caption">{this.getProp('caption') || 'Внимание'}</div>
				<div className="text">
					{this.getProp('children')}
				</div>
			</div>
		)
	}
}