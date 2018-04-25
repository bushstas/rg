import {autobind} from 'core-decorators'
import React from 'react'
import Component from 'app/ui/Component'

import "./style.scss"

export default class Button extends Component {
    render() {
        let {href, target, disabled, caption, download} = this.props;
        let attrs = {
            ref: 'button',
            className: this.getClasses('button', disabled ? 'disabled' : ''),
            style: this.getStyle(),
            download: download
        };
        if (href && !disabled) {
            return (
                <a ref="button" href={href} target={target} {...attrs}>
                    {caption}
                </a>
            )
        } else {
            return (
                <div ref="button" onClick={this.handleClick} {...attrs}>
                    {caption}
                </div>
            )
        }
    }
    
    @autobind
    handleClick(e) {
        e.stopPropagation();
        this.fireEvent(!this.props.disabled ? 'click' : 'disabledClick', this.props.value);
    }

    getStyle() {
        let style;
        let {width} = this.props;
        if (width) {
            style = {width: width + 'px'};
        }
        return style;
    }

    click() {
        this.refs.button.click();
    }
}