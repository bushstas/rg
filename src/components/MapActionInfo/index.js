import {autobind} from "core-decorators"
import React from 'react'
import Dialog from 'app/ui/Dialog'
import Button from 'app/ui/Button'
import Loader from 'app/ui/Loader'
import Processor from 'app/storages/Processor'
import GlobalState from 'app/services/GlobalState'

import "./style.scss";

@autobind
export default class MapActionInfo extends Dialog {
    constructor(props) {
        super(props);
        this.className = 'map-action-info';
        Processor.doAction('post_map_info', {action: props.action}, this.onLoad);
    }

    renderContent() {
        let {time, name, action, lines} = this.state;
        if (name) {
            return <div>
                <div className="name">{name}</div>
                <div className="time">{time}</div>
                {this.renderLines(lines)}
                <Button caption={action} onClick={this.handleActionConfirm}/>
            </div>
        }
        return <Loader/>
    }

    renderLines(lines) {
        if (lines instanceof Array) {
            return <div className="lines">
                {lines.map(this.renderLine)}
            </div>
        }
    }

    renderLine(item, i) {
        return <div className="line" key={i}>
            {item}
        </div>
    }

    onLoad(data) {
        this.setState(data);
    }

    handleActionConfirm() {
        let {name} = this.state;
        let props = {
            duration: 10,
            caption: name,
            onComplete: () => {
                let {action} = this.props;
                Processor.doAction('post_map_' + action);
            }
        }
        GlobalState.dispatchEvent('popupShown', 'countdown', props);
        this.hide();
    }
}