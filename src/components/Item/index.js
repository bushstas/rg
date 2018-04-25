import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'
import Equip from 'app/storages/Equip'
import GlobalState from 'app/services/GlobalState'

import "./style.scss";


export default class Item extends Component {

    render() {
        let {selected} = this.state;
        let {name, data, types} = this.props;
        let style = {
            backgroundImage: 'url(' + GLOBALS.pathToImages + '/items/' + data.class + '/' + data.img + '.png)'
        };
        let {q} = data;
        return <div ref="scope" className={this.getClasses('item ' + name, selected ? 'selected' : '')} style={style} onClick={this.handleClick}>
            {q && <div className="quantity">{q}</div>}
        </div>
    }

    @autobind
    handleClick(e) {
        e.stopPropagation();
        let {onClick, types} = this.props;
        if (onClick) {
            this.fireEvent('click', this.props.data);
        }
        if (types instanceof Array) {
            GlobalState.dispatchEvent('popupShown', 'itemActionMenu', {item: this, ...this.props}, e.nativeEvent);
            this.setState({selected: true});
        }
    }
}