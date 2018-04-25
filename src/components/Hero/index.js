import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'

import "./style.scss";


export default class Hero extends Component {

    render() {
        let {x, y} = this.props;
        let style = {
            left: x + 'px',
            top: y + 'px'
        };
        return <div className="hero" style={style}/>
    }
}