import {autobind} from "core-decorators"
import React from 'react'
import GameMap from 'app/components/GameMap'
import Door from 'app/components/GameMap/Door'
import Hero from 'app/components/Hero'

import "./style.scss";

export default class InnerMap extends GameMap {

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
        let {width, height, cells, open} = data;
        let fields = [];
        for (let k in cells) {
            fields.push(this.renderField(cells[k], k, open.has(k)));
        }     
        return fields;
    }

    renderField(cell, key, isOpen) {
        let coords = key.split('x');
        let y = ~~coords[0];
        let x = ~~coords[1];
        let cellStyle = {
            top: y * this.getCellSize() + 'px',
            left: x * this.getCellSize() + 'px'
        };
        
        return <div key={key}>
            <div className={'cell inner-cell' + (isOpen ? ' open' : '')} style={cellStyle}>
                {cell.l && <div className="wall left"/>}
                {cell.r && <div className="wall right"/>}
                {cell.t && <div className="wall top"/>}
                {cell.b && <div className="wall bottom"/>}
                <div className="field"/>
            </div>
            {cell.dl && <Door side="l" style={cellStyle}/>}
            {cell.dr && <Door side="r" style={cellStyle}/>}
            {cell.dt && <Door side="t" style={cellStyle}/>}
            {cell.db && <Door side="b" style={cellStyle}/>}
        </div>
    }

    handleObjectClick({value}) {
        
    }
}