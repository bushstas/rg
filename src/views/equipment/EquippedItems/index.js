import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'
import Item from 'app/components/Item'
import GlobalState from 'app/services/GlobalState'

import "./style.scss";

const ITEMS_MAP = [
	'rhand', 'lhand', 'torso', 'head', 'neck', 'arms', 'feet', 'belt', 'ring first', 'ring second',
	'ring third', 'ring fourth', 'talisman first', 'talisman second', 'talisman third', 'talisman fourth'
];

export default class EquippedItems extends Component {
    constructor() {
        super();

        this.addClickListeners({
            'weapon-set-button':  this.handleWeaponSetChange
        });
    }

    render() {
        let {data, heroClass} = this.props;
        let {set} = data;
        return <div ref="scope" className={'equipment-area ' + heroClass}>
            <div className="weapon-set-buttons">
                <div className={this.mergeClasses('weapon-set-button', set == 1 ? 'active' : '')} data-set="1">1</div>
                <div className={this.mergeClasses('weapon-set-button', set == 2 ? 'active' : '')} data-set="2">2</div>
                <div className={this.mergeClasses('weapon-set-button', set == 3 ? 'active' : '')} data-set="3">3</div>
            </div>
            {ITEMS_MAP.map(this.renderItem)}
        </div>
    }

    @autobind
    renderItem(name, i) {
    	let {data} = this.props;

    	let item = data[name];
    	return <div className={this.mergeClasses('item-slot', name, item ? 'busy' : '')} key={i}>
    		{item && <Item ref={name} name={name} data={item} types={['equipped', name]}/>}
    	</div>
    }

    handleWeaponSetChange({set}) {
        this.fireEvent('changeWeaponSet', set);
    }

}