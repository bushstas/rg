import {autobind} from 'core-decorators'
import React from 'react'
import Component from 'app/ui/Component'

export default class DraggableComponent extends Component {
	constructor() {
		super();
		this.left = 0;
		this.top = 0;
	}

	componentDidMount() {
		super.componentDidMount();

		window.setTimeout(() => {
			let {draggable} = this.refs;
			if (draggable) {
				draggable.addEventListener('mousedown', this.handleMouseDown, false);
                draggable.addEventListener('dragstart', this.preventDefault, false);
			}
            this.limits = this.getLimits();
            let initialCoords = this.getInitialCoords();
            if (initialCoords instanceof Object) {
                this.left = initialCoords.left;
                this.top = initialCoords.top;
                this.setCoords();
            }
		}, 200);
	}

    componentWillUnmount() {
        let {draggable} = this.refs;
        if (draggable) {
            draggable.removeEventListener('mousedown', this.handleMouseDown, false);
            draggable.removeEventListener('dragstart', this.preventDefault, false);
        }
        super.componentWillUnmount();
    }

	@autobind
    handleMouseDown(e) {
    	document.body.addEventListener('mousemove', this.handleMouseMove, false);
    	document.body.addEventListener('mouseup', this.handleMouseUp, false);

    	this.x = e.pageX;
		this.y = e.pageY;
    }

    preventDefault(e) {
        e.preventDefault();
    }

    @autobind
    handleMouseMove(e) {
    	let mx = this.x - e.pageX;
    	let my = this.y - e.pageY;
        this.x = e.pageX;
        this.y = e.pageY;

    	this.left -= mx;
    	this.top -= my;
        this.setCoords();        
    }

    setCoords() {
        if (this.limits instanceof Object) {
            if (this.left > this.limits.left) {
                this.left = this.limits.left;
            } else if (-this.left > this.limits.right) {
                this.left = -this.limits.right;
            }
            if (this.top > this.limits.top) {
                this.top = this.limits.top;
            } else if (-this.top > this.limits.bottom) {
                this.top = -this.limits.bottom;
            }
        }

        let {area} = this.refs;
        if (area) {
            area.style.marginLeft = this.left + 'px';
            area.style.marginTop = this.top + 'px';
        }
    }

    @autobind
    handleMouseUp(e) {
    	document.body.removeEventListener('mousemove', this.handleMouseMove, false);
    	document.body.removeEventListener('mouseup', this.handleMouseUp, false);
    }

    getLimits() {}
    getInitialCoords() {}
}