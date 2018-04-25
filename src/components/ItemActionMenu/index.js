import {autobind} from "core-decorators"
import React from 'react'
import Popup from 'app/ui/Popup'
import Items from 'app/informers/Items'
import GlobalState from 'app/services/GlobalState'
import HashRouter from 'app/services/HashRouter'
import Dictionary from 'app/storages/Dictionary'
import Processor from 'app/storages/Processor'

import "./style.scss";


export default class ItemActionMenu extends Popup {
    constructor() {
        super();
        this.addToState({
            dict: Dictionary.getItem('main', 'item_action'),
            view: HashRouter.getView()
        });
        this.className = 'item-action-menu';

        Processor.subscribeToStorages(this, 'loc', 'equip');
    }

    renderContent() {        
        return this.renderActions();
    }

    renderActions() {
        let {types} = this.props;
        let {view} = this.state;
        switch (view) {
            case 'location': return this.renderLocationActions(types);
        }
        return this.renderEquipmentActions(types);
    }

    renderLocationActions(types) {
        return <div className="actions">
            {this.renderAddButton(types)}
            {this.renderRemoveButton(types)}
            {this.renderTakeButton(types)}
            {this.renderPlaceButton(types)}
            {this.renderTakeOffButton(types)}
            {this.renderThrowAwayButton(types)}
        </div>
    }

    renderEquipmentActions(types) {
        return <div className="actions">
            {this.renderSwapWeaponsButton(types)}
            {this.renderTakeOnButton(types)}
            {this.renderTakeInRightHandButton(types)}
            {this.renderTakeInLeftHandButton(types)}
            {this.renderTakeInHandButton(types)}
            {this.renderApplyScrollButton(types)}
            {this.renderApplySpellButton(types)}
            {this.renderApplyPotionButton(types)}
            {this.renderTakeOffButton(types)}
            {this.renderThrowAwayButton(types)}
        </div>
    }

    renderTakeButton(types) {
        let {loc} = this.state;
        if (loc.place == 'chest') {
            return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'take'})}>
                {this.state.dict.take}
            </div>
        }
    }

    renderAddButton(types) {
        let {loc} = this.state;
        if (['forge', 'laboratory'].has(loc.place) && types.has('depot')) {
            return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'add'})}>
                {this.state.dict.add}
            </div>
        }
    }

    renderRemoveButton(types) {
        if (types.hasAny('material', 'ingredient')) {
            return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'remove'})}>
                {this.state.dict.remove}
            </div>
        }
    }

    renderSwapWeaponsButton(types) {
        let h = types.hasAny('rhand', 'lhand');
        let E = this.storages.equip;
        if (h && E.isEquipped('rhand') && E.isEquipped('lhand') && !Items.isShield('lhand')) {
            let r = h == 'rhand';
            return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'swap'})}>
                {r ? this.state.dict.swap_left : this.state.dict.swap_right}
            </div>
        }
    }
    
    renderTakeOnButton(types) {
        let {name} = this.props;
        if (types.has('sack') && !Items.isWeapon(name)) {
            return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'takeOn'})}>
                {this.state.dict.take_on}
            </div>
        }
    }

    renderTakeInRightHandButton(types) {
        let {name} = this.props;
        if (types.has('sack') && Items.isWeapon(name)) {
            return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'takeInRightHand'})}>
                {this.state.dict.take_right}
            </div>
        }
    }

    renderTakeInLeftHandButton(types) {
        let {name} = this.props;
        if (types.has('sack') && (Items.isWeapon(name) || Items.isShield(name))) {
            return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'takeInLeftHand'})}>
                {this.state.dict.take_left}
            </div>
        }
    }

    renderTakeInHandButton(types) {
        let h = types.hasAny('rhand', 'lhand');
        let r = h == 'rhand';
        if (r) {
            if (!Items.isOneHanded('rhand')) {
                return;
            }
        } else if (Items.isShield('lhand')) {
            return;
        }
        if (h) {
            return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'takeInHand'})}>
                {r ? this.state.dict.take_left : this.state.dict.take_right}
            </div>
        }
    }

    renderTakeOffButton(types) {
        if (types.hasAny('equipped', 'placed')) {
            return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'takeOff'})}>
                {this.state.dict.take_off}
            </div>
        }
    }

    renderApplyScrollButton(types) {
        return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'applyScroll'})}>
            {this.state.dict.apply_scroll}
        </div>
    }

    renderApplySpellButton(types) {
        return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'applySpell'})}>
            {this.state.dict.apply_spell}
        </div>
    }

    renderApplyPotionButton(types) {
        return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'applyPotion'})}>
            {this.state.dict.apply_potion}
        </div>
    }

    renderPlaceButton(types) {
        let {loc} = this.state;
        if (loc.place == 'forge' && types.has('sack')) {
            return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'place'})}>
                {this.state.dict.place}
            </div>
        }
    }

    renderThrowAwayButton(types) {
        if (!types.hasAny('material', 'depot', 'placed')) {
            return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'throwAway'})}>
                {this.state.dict.throw_away}
            </div>
        }
    }

    renderDestroyButton(types) {
        return <div className="menu-item" onClick={this.handleAction.bind(this, {action: 'destroy'})}>
            {this.state.dict.destroy}
        </div>
    }

    

    @autobind
    handleAction({action, ...options}, e) {
        e.stopPropagation();
        let {name, data} = this.props;

        switch (action) {

            case 'takeInRightHand':
                Processor.doAction('post_equip_takeon', {toSlot: 'rhand', item: name});
            break;

            case 'takeInLeftHand':
                Processor.doAction('post_equip_takeon', {toSlot: 'lhand', item: name});
            break;

            case 'takeInHand':
                Processor.doAction('post_equip_takein', {fromSlot: name, toSlot: name == 'rhand' ? 'lhand' : 'rhand'});
            break;

            case 'takeOff':
                let {view} = this.state;
                if (view == 'location') {
                    Processor.doAction('post_item_takeoff');
                } else {
                    Processor.doAction('post_equip_takeoff', {fromSlot: name});
                }
            break;

            case 'applyScroll':
                GlobalState.dispatchEvent('changeInventoryPlace', 'scroll', name);
            break;

            case 'applySpell':
                GlobalState.dispatchEvent('changeInventoryPlace', 'spell', name);
            break;

            case 'swap':
                Processor.doAction('post_equip_' + action);
            break;

            case 'remove':
            case 'place':
            case 'add':
                Processor.doAction('post_item_' + action, {name});
            break;
        }
        this.hide();
    }

    @autobind
    handleHiding() {
        this.props.item.setState({selected: false});
    }
}