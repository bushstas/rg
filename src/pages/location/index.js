import {autobind} from "core-decorators"
import React from 'react'
import View from 'app/views'
import Processor from 'app/storages/Processor'
import Forge from 'app/components/Forge'
import OuterMap from 'app/components/OuterMap'
import InnerMap from 'app/components/InnerMap'

import "./style.scss";

export default class Location extends View {
	constructor(props) {
		super(props);
		Processor.subscribeToStorages(this, 'loc');
	}

    renderContent() {
        return <div className="view-inner-content">
            {this.renderPlace()}
    	</div>
    }

    renderPlace() {
    	let {loc, dict} = this.state;
    	let {place} = loc;
    	
    	switch (place) {
    		case 'forge': 
    			return <Forge {...this.getPlaceProps()}/>
    		
    		case 'outermap':
    		case 'homemap':
    			return <OuterMap classes="outermap" {...this.getMapProps()}/>

            case 'innermap':
                return <InnerMap classes="innermap" {...this.getMapProps()}/>
    	}
    }

    getPlaceProps() {
    	let {loc, dict} = this.state;
    	let {own} = loc;
    	return {
    		dict,
    		own,
    		onQuit: this.handleQuit,
    		onUpgrade: this.handleUpgrade
    	};
    }

    getMapProps() {
    	let {loc, dict} = this.state;
    	let {data} = loc;
    	return {
    		dict,
    		data
    	};
    }

    @autobind
    handleQuit() {
    	Processor.doAction('post_location_quit');
    }

    @autobind
    handleUpgrade() {
    	Processor.doAction('post_location_upgrade');
    }
}