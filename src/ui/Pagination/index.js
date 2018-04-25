import {autobind} from 'core-decorators'
import React from 'react'
import Component from 'app/ui/Component'
import Router from 'app/services/Router'
import StoreKeeper from 'app/services/StoreKeeper'
import Decliner from 'app/services/Decliner'

import "./style.scss"

export default class Pagination extends Component {	
	render() {
		let {count = 0, onPage = 10, buttons = 15} = this.props;
		let page = ~~this.getPage();
		let pages = Math.ceil(count / onPage);		
		if (pages < 2) return this.getEmpty();
		if (page < 0) {
			this.moveToPage(1);
			return this.getEmpty();
		}
		if (page > pages) {
			this.moveToPage(pages);
			return this.getEmpty();
		}		
		let half1 = Math.floor((buttons - 1) / 2);
		let half2 = Math.ceil((buttons - 1) / 2);
		let numbers = [];
		let last = page + half2;
		let minus = half1;
		if (last > pages) {
			minus = half2 + last - pages;
		}
		let from = page - minus;
		if (from < 1) {
			from = 1;
		}

		for (let i = from; i < from + buttons; i++) {
			if (i <= pages) {
				numbers.push(i);
			}
		}
		return (
			<div className={this.getClasses('pagination')} onClick={this.onClick}>
				{page > 1 && <span className="pagination-link prev" data-page="prev"/>}
				{numbers.map(this.renderButton)}
				{pages && page < pages && <span className="pagination-link next" data-page="next"/>}
				<div className="total-count">
					{Decliner.decline('found', count, true)} {count} {Decliner.decline('result', count)}
				</div>
			</div>
		)
	}

	getEmpty() {
		return <div className="pagination empty"/>
	}

	getPage() {
		return this.getProp('page') || 1;
	}

	@autobind
	renderButton(i) {
		let page = this.getPage();
		return (
			<span data-page={i} key={i} className={this.mergeClasses('pagination-link', i == page ? 'active' : '')}>
				{i}
			</span>
		)
	}

	@autobind
	onClick(e) {
		var currentPage = ~~this.getProp('page');
		var page = this.getTargetData(e, 'pagination-link', 'page');
		if (page && page != this.page) {
			if (page == 'prev') {
				this.moveToPage(currentPage - 1);
			} else if (page == 'next') {
				this.moveToPage(currentPage + 1);
			}
			else {
				this.moveToPage(page);
			}
		}
	}

	moveToPage(page) {
		let name = this.getProp('name');
		StoreKeeper.set(name + '_page', page);
		this.fireEvent('change', page);
	}
}

