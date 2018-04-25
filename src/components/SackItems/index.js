import {autobind} from "core-decorators"
import ScrollArea from 'react-scrollbar'
import React from 'react'
import Component from 'app/ui/Component'
import Item from 'app/components/Item'

import "./style.scss";

export default class SackItems extends Component {
    constructor() {
        super();
        
    }

    render() {
        let {data} = this.props;
        let keys = Object.keys(data);
        return (
            <ScrollArea className={this.getClasses('sack')} contentClassName="inner" horizontal={false} speed={0.5}>
                {keys.map(this.renderItem)}
            </ScrollArea>
        )
    }

    @autobind
    renderItem(key) {
        let {data, filter, itemClasses, itemTypes} = this.props;
        let item = data[key];
        if (item instanceof Object) {
            if (!filter || item.class == filter) {
                return <Item ref={key} classes={this.mergeClasses('sack-item', itemClasses)} name={key} data={item} types={itemTypes} key={key}/>
            }
        }
    }

}