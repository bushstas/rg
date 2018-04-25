import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'
import {TOOLTIPS, TOOLTIP_CLASSES} from 'app/consts/tooltips.js'

import './style.css';

export default class Tooltip extends Component {
    render() {
        let name = this.getProp('name');
    	return (
    		<div className={this.getClasses('tooltip-sign bold', !!name ? TOOLTIP_CLASSES[name] : '')} data-name={name}>
    			{this.getProp('sign') || '?'}
    			<div className="tooltip-popup">{this.renderContent()}</div>
    		</div>
    	);
    }

    renderContent() {
    	let cnt = this.getProp('children');
        let name = this.getProp('name');
        if (!cnt && name && TOOLTIPS[name]) {
            cnt = TOOLTIPS[name];
        }
    	if (cnt instanceof Array) {
    		return cnt.map(this.renderContentPart);
    	}
        return cnt;
    }

    @autobind
    renderContentPart(part, i) {
        if (part) {
            if (typeof part == 'string') {
                return part;
            }
            if (part instanceof Object && part.value && part.type) {
                if (part.type == 'text') {
                    return part.value + ' ';
                } else if (part.type == 'link') {
                    return <a href={part.value} key={i}>{part.title}</a>
                }
            }
        }
    }

}