import {autobind} from "core-decorators"
import React from 'react'
import Dialog from 'app/ui/Dialog'
import Item from 'app/components/Item'
import GlobalState from 'app/services/GlobalState'
import Processor from 'app/storages/Processor'

import "./style.scss";

@autobind
export default class Drawings extends Dialog {
    constructor(props) {
        super(props);
        this.className = 'drawings';
        Processor.doAction('drawings', {}, this.onLoad);
        this.addToState({
            tab: 0
        });
    }

    renderContent() {        
        let {tab} = this.state;
        switch (tab) {
            default: 
            let {all} = this.state;
                if (all) {
                    return <div>
                        {all.map(this.renderItem)}
                    </div>
                }
        }
    }

    renderItem(item) {
        let key = item.class + item.id;
        return <div className="item-container" key={key}>
            <Item classes="drawing-item" name={key} data={item} onClick={this.handleItemClick}/>
            <div className="item-name">
                {item.name}
            </div>
        </div>
    }

    onLoad(data) {
        this.setState(data);
    }

    handleItemClick(item) {
        Processor.doAction('post_item', {action: 'set', class: item.class, id: item.id});
        this.hide();
    }
}