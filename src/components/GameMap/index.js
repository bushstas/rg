import {autobind} from "core-decorators"
import React from 'react'
import DraggableComponent from 'app/ui/DraggableComponent'
import GlobalState from 'app/services/GlobalState'
import Processor from 'app/storages/Processor'

import "./style.scss";

const SIZE = 130;

@autobind
export default class GameMap extends DraggableComponent {
    constructor() {
        super();
        GlobalState.listen('keyup', this.handleKeyUp, this);
        this.addClickListeners({
            action: this.handleMapAction        
        });
    }	

	render() {
        let size = this.getAreaSize();
        let style = {
            maxWidth: size.width + 'px',
            maxHeight: size.height + 'px'
        };
        return <div ref="scope" className={this.getClasses('gamemap')} style={style}>
            <div className="aside">
                {this.renderActions()}
            </div>
            <div ref="draggable" className="outer">
               {this.renderContent()}
            </div>
        </div>
    }

    renderActions() {
        let {data} = this.props;
        let {actions} = data;
        if (actions instanceof Array) {
            return <div className="map-actions">
                {actions.map(this.renderAction)}
            </div>
        }
    }

    renderAction(item) {
        let {dict} = this.props;
        return <div className="action" data-action={item} key={item}>
            {dict.map_actions[item]}
        </div>
    }

    getLimits() {
        let {draggable, area} = this.refs;
        let outerRect = draggable.getRect();
        let innerRect = area.getRect();

        if (area) {
            return {
                left: 0,
                top: 0,
                right: innerRect.width - outerRect.width,
                bottom: innerRect.height - outerRect.height
            };
        }
    }

    getInitialCoords() {
        let {x, y} = this.getHeroCoords();
        let {draggable} = this.refs;
        if (draggable) {
            let outerRect = draggable.getRect();
            let left = -x + outerRect.width / 2 - this.getCellSize() / 2;
            let top = -y + outerRect.height / 2 - this.getCellSize() / 2;
            return {
                left, top
            };
        }
    }

    handleKeyUp(key) {
        switch (key) {
            case 37: this.makeMove('w');  break;
            case 38: this.makeMove('n');    break;
            case 39: this.makeMove('e'); break;
            case 40: this.makeMove('s');  break;
        }
    }

    makeMove(direction) {
        let {data} = this.props;
        let {moves} = data;
        if (!(moves instanceof Array) || moves.has(direction)) {
            Processor.doAction('post_map_move', {direction});
        }
    }

    handleMapAction({action}) {
        switch (action) {
            case 'explore':
            case 'search':
                GlobalState.dispatchEvent('popupShown', 'mapActionInfo', action);
            break;

            default:
                Processor.doAction('post_map_' + action);
        }
    }
 
    getCellSize() {
        return SIZE;
    }

    renderContent(){}
}