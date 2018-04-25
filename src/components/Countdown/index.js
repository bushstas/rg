import {autobind} from "core-decorators"
import React from 'react'
import Dialog from 'app/ui/Dialog'
import Item from 'app/components/Item'
import GlobalState from 'app/services/GlobalState'
import Processor from 'app/storages/Processor'
import Dictionary from 'app/storages/Dictionary'

import "./style.scss";


export default class Countdown extends Dialog {
    constructor(props) {
        super(props);
        this.className = 'countdown';
        this.addToState({
        	sec: props.duration,
        	width: 0,
            dict: Dictionary.getItem('location', 'common')
        });
        this.step = 100 / props.duration;
        this.interval = window.setInterval(this.change, 1000);
    }

    renderContent() {
    	let {sec, width, dict} = this.state;
    	let {caption} = this.props;
    	let style = {
    		width: width + '%'
    	};
    	
    	return <div>
	    	<div className="caption">
	    		{caption}
	    	</div>
	    	<div className="time">
	    		<div className="scale">
	    			<div className="inner" style={style}/>
	    		</div>
	    		<div className="text">
	    			{dict.time_left}: {sec}
	    		</div>
	    	</div>
	    </div>
    }

    @autobind
    change() {
    	let {duration, onComplete} = this.props;
    	let {sec} = this.state;
    	sec--;
    	if (sec < 0) {
    		window.clearInterval(this.interval);
    		super.hide();
	    	if (onComplete instanceof Function) {
	    		onComplete();
	    	}
    	} else {
    		let width = (duration - sec) * this.step;
    		this.setState({sec, width});
    	}
    }

    hide() {}

}