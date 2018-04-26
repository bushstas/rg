import {autobind} from "core-decorators"
import React from 'react'
import View from 'app/views'
import Button from 'app/ui/Button'
import Item from 'app/components/Item'
import GlobalState from 'app/services/GlobalState'
import Processor from 'app/storages/Processor'
import Loader from 'app/ui/Loader'

import EquippedItems from './EquippedItems'
import ScrollWizard from './ScrollWizard'
import SpellWizard from './SpellWizard'
import SackItems from 'app/components/SackItems'

import "./style.scss";

export default class Equipment extends View {
	constructor() {
		super();
        Processor.subscribeToStorages(this, 'hero', 'sack', 'equip');      

		GlobalState.listen('changeInventoryPlace', this.handleChangePlace, this);
	}

    renderContent() {
        if (!this.isReady()) {
            return <Loader/>
        }
    	let {place, equip, sack} = this.state;
        let {set} = equip;
        let heroClass = this.storages.hero.getClass();

        switch (place) {
            case 'scroll':
                place = <ScrollWizard/>
            break;

            case 'spell':
                place = <SpellWizard/>
            break;

            default:
                place = <div>
                    <EquippedItems data={equip} heroClass={heroClass} onChangeWeaponSet={this.handleWeaponSetChange}/>
                    <SackItems data={sack} itemTypes={['sack']}/>
                </div>
        }
        return <div className="view-inner-content">
            {place}
    	</div>
    }

    @autobind
    handleChangePlace(place, item) {
    	this.setState({place});
    }

    @autobind
    handleWeaponSetChange(set) {
        Processor.doAction('post_equip_changeset', {set});
    }

}