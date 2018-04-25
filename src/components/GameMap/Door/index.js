import {autobind} from "core-decorators"
import React, {Component} from 'react'
import Processor from 'app/storages/Processor'

import "./style.scss";


export default class Door extends Component {

    render() {
        let {side, style} = this.props;
        return <div className={'door ' + side} style={style} onClick={this.handleClick}/>
    }

    @autobind
    handleClick() {
        let {side} = this.props;
        Processor.doAction('post_map_openDoor', {side});
    }
}