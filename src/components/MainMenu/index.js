import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'
import HashRouter from 'app/services/HashRouter'
import Dictionary from 'app/storages/Dictionary'

import "./style.scss";


export default class MainMenu extends Component {

    render() {
        let {view, dict} = this.props;
        dict = dict.main_menu;
        
        return (
            <div className="main-menu">
                <div className={this.mergeClasses('link', view == 'location' ? 'active' : '')} onClick={this.handleClick.bind(this, 'location')}>
                    {dict.location}
                </div>
                <div className={this.mergeClasses('link', view == 'character' ? 'active' : '')} onClick={this.handleClick.bind(this, 'character')}>
                    {dict.character}
                </div>
                <div className={this.mergeClasses('link', view == 'skills' ? 'active' : '')} onClick={this.handleClick.bind(this, 'skills')}>
                    {dict.skills}
                </div>
                <div className={this.mergeClasses('link', view == 'equipment' ? 'active' : '')} onClick={this.handleClick.bind(this, 'equipment')}>
                    {dict.equipment}
                </div>
            </div>
        )
    }

    handleClick(view) {
        HashRouter.pushState(view);
        this.fireEvent('change', view);
    }
}