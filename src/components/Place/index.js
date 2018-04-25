import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'
import Loader from 'app/ui/Loader'
import PlaceInfo from 'app/components/PlaceInfo'

export default class Place extends Component {

    render() {
        if (!this.isReady()) {
            return <Loader/>
        }
        return <div ref="scope" className={this.getClasses('place')}>
            {this.renderContent()}
        </div>
    }

    renderInfo(key) {
        let {dict, own} = this.props;
        let name = dict.places[key];
        return <PlaceInfo name={name} upgradable={own} dict={dict} onUpgrade={this.handleUpgrade} onQuit={this.handleQuit}/>
    }

    @autobind
    handleUpgrade() {
        this.fireEvent('upgrade');
    }

    @autobind
    handleQuit() {
        this.fireEvent('quit');
    }
}