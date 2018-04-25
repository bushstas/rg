import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'
import Button from 'app/ui/Button'

import "./style.scss";


export default class PlaceInfo extends Component {

    render() {
        let {name, upgradable, dict} = this.props;
        return <div ref="scope" className={this.getClasses('place-info')}>
            <div className="place-info-inner">
                <div className="name">
                    {name}
                </div>
                {upgradable && <Button classes="upgrade" caption={dict.actions.upgrade} onClick={this.handleUpgradeClick}/>}
                <Button classes="quit red" caption={dict.actions.quit} onClick={this.handleQuit}/>
            </div>
        </div>
    }

    @autobind
    handleUpgradeClick() {
        this.fireEvent('upgrade');
    }

    @autobind
    handleQuit() {
        this.fireEvent('quit');
    }
}