import {autobind} from 'core-decorators'
import React from 'react'
import Button from '../Button'
import Popuper from 'app/services/Popuper'
import Router from 'app/services/Router'
import Component from 'app/ui/Component'

import "./style.scss"

export default class ActionButton extends Component {
    constructor() {
        super();
        this.addToState({
            active: false
        });
    }

    render() {
        return (
           <div className={this.getClasses('action-button', this.state.active ? 'active' : '')} onClick={this.handleOuterClick}>
                <Button caption="Действия" onClick={this.handleClick} />
                <div className="action-button-menu" onClick={this.handleMenuClick}>
                    {this.mapProp('actions')}
                </div>
           </div>
        )
    }

    @autobind
    renderItem(action) {
        let apiUrls = this.getProp('apiUrls') || {};
        let urls = this.getProp('urls') || {};
        let url = urls[action];
        if (url) {
            let href = !apiUrls[action] ? Router.getLink(url, {id: this.getProp('id')}) : Router.getApiLink(url, {id: this.getProp('id')});
            return <a className="action-button-menu-item" href={href} target="_blank" key={action}>
                 {this.props.actions[action]}
            </a>
        }
        return (
            <div className="action-button-menu-item" data-action={action} key={action}>
                {this.props.actions[action]}
            </div>
        );
    }
    
    @autobind
    handleClick() {
        this.setState({
            active: true
        });
        Popuper.watch(this);
    }

    hide() {
        this.setState({
            active: false
        });
    }

    @autobind
    handleOuterClick(e) {
        e.stopPropagation();
        this.fireEvent('clicked');
    }

    @autobind
    handleMenuClick(e) {
        let action = this.getTargetData(e, 'action-button-menu-item', 'action');
        if (action) {
            this.fireEvent('action', action);
        }
    }
}