import React from 'react'
import Component from 'app/ui/Component'
import Collapse from 'app/ui/Collapse'

import "./style.scss"

export default class List extends Component {
	
	render() {
		return (
			<ul className={this.getClasses('list')}>
				{this.mapProp('items')}
			</ul>
		)
	}

	renderItem(item, i) {
		let name = item, descr, file, spoiler;
		if (item instanceof Object) {
			name = item.name || item.text;
			descr = item.description;
			file = item.file;
			spoiler = item.spoiler;
		}
		let items = item.rows || item.items;
		let isDescr = this.hasProp('descriptions');
		if (name !== '') {
			return (
				<li key={i}>
					{!file ? name : <a target="_blank" href={file}>{name}</a>}
					{typeof descr == 'string' && isDescr && <Collapse caption="подробнее">
						{descr}
					</Collapse>}
					{descr instanceof Array && descr[0] && isDescr && <List items={descr}/>}
					{spoiler && <Collapse caption="подробнее">
						<List items={spoiler}/>
					</Collapse>}
					{items instanceof Array && <List items={items}/>}
				</li>
			)
		}
	}
}