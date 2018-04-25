import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'
import Router from 'app/services/Router'

import "./style.scss";

export default class BreadCrumbs extends Component {
    constructor(props) {
    	super();
    	this.addToState({
    		items: props.items,
    		data: {}
    	});
    }

    render() {
    	let items = this.getProperItems();
        return (
			<div className='breadcrumbs'>
				<a href={Router.getLink('main')}>
					Личный кабинет
				</a>
				{items.map(this.renderItem)}
			</div>
        )
    }

    @autobind
    renderItem(item, i) {
    	if (item.link) {
	    	return (
	    		<a href={Router.getLink(item.link)} key={i}>
					{item.title}
				</a>
	    	)
	    } else {
	    	return (
				<span key={i}>
					{item.title}
				</span>
	    	)
	    }
    }

    getProperItems() {
    	let {items, data} = this.state;
    	let regex, properItems = [], item;
    	for (let i = 0; i < items.length; i++) {
    		item = {
    			title: items[i].title,
    			link: items[i].link
    		};
    		if (typeof item.title == 'string') {
    			for (let k in data) {
    				regex = new RegExp('::' + k, 'g');
    				item.title = item.title.replace(regex, data[k]);
    			}
    			item.title = item.title.replace(/::\w+/g, '');
    		}
    		properItems.push(item);
    	}
    	return properItems;
    }

    update(data) {
    	let currentData = this.state.data;
    	for (let k in data) {
    		currentData[k] = data[k];
    	}
    	this.setState({
    		data: currentData
    	});
    }
}