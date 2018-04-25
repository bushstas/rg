import {autobind} from "app/node_modules/core-decorators"
import React from 'react'
import Component from 'app/ui/Component'
import ScrollArea from 'react-scrollbar'

import "./style.scss";

export default class Dialog extends Component {
	render() {
		let {scrollable} = this.props;
		let content = this.renderContent();
		return <div ref="scope" className={this.getClasses('dialog')}>
            <div className="dialog-mask" onClick={this.hide}/>            
            {scrollable ? 
            	<ScrollArea className="dialog-container" contentClassName="inner" horizontal={false} speed={0.5}>
               		{content}
            	</ScrollArea> : 
            	<div className="dialog-container">
        			{content}
        		</div>
        	}
        </div>
	}

	@autobind
	hide() {
		let {popupName} = this.props;
		this.fireEvent('hide', popupName);
	}

	handleHiding() {}
}