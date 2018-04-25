import {autobind} from "core-decorators"
import React from 'react'
import GameMap from 'app/components/GameMap'
import Hero from 'app/components/Hero'

import "./style.scss";

export default class OuterMap extends GameMap {

    constructor() {
        super();
        this.addClickListeners({
            object: this.handleObjectClick
        });
    }

    renderContent() {
        let size = this.getAreaSize();
        let style = {
            width: size.width + 'px',
            height: size.height + 'px'
        };
        return <div ref="area" className="inner" style={style}>
            {this.renderMapFields()}
            {this.renderHero()}
        </div>
    }

    getAreaSize() {
        let {data} = this.props;
        let {width, height} = data;
        return {
            width: width * this.getCellSize(),
            height: height * this.getCellSize()
        };
    }

    renderHero() {
        let coords = this.getHeroCoords();
        return <Hero ref="hero" x={coords.x} y={coords.y}/>
    }

    getHeroCoords() {
        let {x, y} = this.props.data;
        return {
            x: x * this.getCellSize(),
            y: y * this.getCellSize()
        };
    }

    renderMapFields() {
        let {data} = this.props;
        let {width, height, cells} = data;
        let fields = [];
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                fields.push(this.renderField(cells, i, j));
            }
        }     
        return fields;
    }

    renderField(cells, i, j) {
        let cellStyle, value;
        let key = i + 'x' + j;
        let explored = typeof cells[key] != 'undefined';
        let hasObject = typeof cells[key] == 'object';
        let cellClasses = 'cell' + (!explored ? ' fogged' : '');

        if (hasObject) {
            var o = cells[key];
            cellStyle = {
                backgroundImage: 'url(' + GLOBALS.pathToImages + '/objects/' + o.t + '/' + (!!o.c ? o.c + '/' : '') + o.i + '.png)'
            }
            value = o.t + '.' + o.c + '.' + o.i;
        }
        return <div className={cellClasses} key={key}>
            <div className="field"/>
            {hasObject && <div className={this.mergeClasses('object', o.t)} data-value={value} style={cellStyle}/>}
        </div>
    }

    handleObjectClick({value}) {
        
    }

}