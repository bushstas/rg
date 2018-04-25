import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'

@autobind
export default class Popup extends Component {

	componentDidMount() {
		super.componentDidMount();
		window.addEventListener('resize', this.initCoords, false);
		this.initCoords();
		document.body.addEventListener('click', this.onBodyClick, false);
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		window.removeEventListener('resize', this.initCoords, false);
		document.body.removeEventListener('click', this.onBodyClick, false);
	}

	render() {
        let {coords} = this.state;
        return <div ref="scope" className={this.getClasses('popup')} style={coords}>
           	{this.renderContent()}
        </div>
    }
 
	setCoords(coords) {
		let state = this.state || {};
		let bodyRect = document.body.getRect();
		let {scope} = this.refs;
		let scopeRect;
		if (scope) {
			scopeRect = scope.getRect();
		} else {
			scopeRect = {width: 0, height: 0};
		}

		let style = {};
		if (coords.left) {
			if (coords.left + scopeRect.width > bodyRect.width) {
				this.handleOverflowLeft(coords);
			}
			style.left = coords.left + 'px';
		}
		if (coords.top) {
			if (coords.top + scopeRect.height > bodyRect.height) {
				this.handleOverflowTop(coords);
			}
			style.top = coords.top + 'px';
		}
		state.coords = style;
		this.setState(state);
	}

	placeAtRight(coords) {
		coords.left += coords.width;
	}

	placeAtBottom(coords) {
		coords.top += coords.height;
	}

	placeAtLeft(coords, twoTimes) {
		let times = twoTimes ? 2 : 1;
		let {scope} = this.refs;
		if (scope instanceof Element) {
			let rect = scope.getRect();
			coords.left -= rect.width * times;
		}
	}

	placeAtTop(coords, twoTimes) {
		let times = twoTimes ? 2 : 1;
		let {scope} = this.refs;
		if (scope instanceof Element) {
			let rect = scope.getRect();
			coords.top -= rect.height * times;
		}
	}

	getRect(element) {
		if (!(element instanceof Element)) {
			return {left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0};
		}
		const rect = element.getRect();
		return {
			top: rect.top,
			right: rect.right,
			bottom: rect.bottom,
			left: rect.left,
			width: rect.width,
			height: rect.height,
			x: rect.x,
			y: rect.y
		};
	}

	handleOverflowLeft(coords) {
		this.placeAtLeft(coords, true);	
	}

	handleOverflowTop(coords) {
		let bodyRect = document.body.getRect();
		let scopeRect = this.refs.scope.getRect();
		coords.top -= coords.top + scopeRect.height - bodyRect.height + 10;
	}

	initCoords() {
		let {event} = this.props;
		if (event) {
			this.setCoords({left: event.pageX, top: event.pageY});
		}
	}

	hide() {
		let {popupName} = this.props;
		this.fireEvent('hide', popupName);
	}

    onBodyClick(e) {
        if (!this.isClickedOnPopup(e)) {
            this.hide();
        }        
    }

    isClickedOnPopup(e) {
        let {scope} = this.refs;
        let {target} = e;       
        while (target) {
            if (target == scope) {
                return true;
            }
            target = target.parentNode;
        }
        return false;
    }

	handleHiding() {}
}