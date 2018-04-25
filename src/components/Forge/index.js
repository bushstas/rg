import {autobind} from "core-decorators"
import React from 'react'
import Place from 'app/components/Place'
import Dictionary from 'app/storages/Dictionary'
import GlobalState from 'app/services/GlobalState'
import SackItems from 'app/components/SackItems'
import Item from 'app/components/Item'
import Processor from 'app/storages/Processor'

import "./style.scss";


export default class Forge extends Place {
    constructor(props) {
        super(props);
        this.addToState({
            dict: Dictionary.getItem('main', 'item_action')
        });
        this.className = 'forge';
        Processor.subscribeToStorages(this, 'depot', 'forge', 'sack');
        this.addClickListeners({
            action: this.handleItemAction,
            pick: this.handlePickItem,
            create: this.handleCreateItem
        });
    }

    renderContent() {        
        let {depot, forge, itemsShown} = this.state;
        let dict = this.props.dict.forge;
        let items = this.state[!itemsShown ? 'depot' : 'sack'];
        return <div className="place-inner">
            {this.renderInfo('forge')}
            
            {!itemsShown ? this.renderCreating(forge) : this.renderTransforming(forge)}
            
            <SackItems data={items} classes="forge-items" itemClasses={itemsShown? '' : 'material-item'} itemTypes={[itemsShown ? 'sack' : 'depot']}/>
            <div className="menu">
                <div className={this.mergeClasses('menu-item', itemsShown ? '' : 'active')} onClick={this.handleSectionChange.bind(this, false)}>
                    {dict.mat}
                </div>
                <div className={this.mergeClasses('menu-item', !itemsShown ? '' : 'active')} onClick={this.handleSectionChange.bind(this, true)}>
                    {dict.itm}
                </div>
            </div>
        </div>
    }

    renderCreating(forge) {
        let dict = this.props.dict.forge;
        let {lvl, materials, crafted} = forge;
        let slots = [];
        for (let i = 0; i < lvl; i++) {
            slots.push(this.renderSlot(materials[i], i));
        }
        let hasItem = !!crafted;
        return <div className="creating">
            <div className="material-slots">
                {slots}
            </div>
            <div className="forge-action">
                <span className="pick">
                    {dict.pick}
                </span>
            </div>
            {hasItem && <div>
                <div className="crafted-item">
                    <Item ref="crafted" classes="forge-item" data={crafted}/>
                </div>
                <div className="forge-action">
                    <span className="create">
                        {dict.create}
                    </span>
                </div>
            </div>}
        </div>
    }

    renderTransforming(forge) {
        let {item, actions} = forge;
        return <div className="transforming">
            {this.renderPlacedItem(item, actions)}
        </div>
    }

    @autobind
    renderSlot(item, i) {
        let hasItem = !!item;
        return <div className="material-slot" key={i}>
            <div className={this.mergeClasses('inner', hasItem ? 'busy' : '')}>
                {hasItem && <Item ref={item.key} classes="material-item" data={item} types={['forge', 'material']} name={item.key} key={item.key}/>}
            </div>
        </div>
    }

    renderPlacedItem(item, actions) {
        let hasItem = !!item;
        return <div className="placed-item-container">
            <div className="placed-item">
                {hasItem ? 
                    <Item ref={item.key} classes="forge-item" data={item} types={['forge', 'placed']} name={item.key} key={item.key}/> :
                    <div className="inner"/>
                }
            </div>
            {hasItem && this.renderItemActions(actions)}
        </div>
    }

    renderItemActions(actions) {
        return <div className="item-actions">
            {actions.map(this.renderItemAction)}
        </div>
    }

    @autobind
    renderItemAction(action) {
        let {dict} = this.state;
        return <div className="forge-action">
            <span className="action" key={action} data-action={action}>
                {dict[action]}
            </span>
        </div>
    }

    handleSectionChange(itemsShown) {
        this.setState({itemsShown});
    }

    @autobind
    handleItemAction({action}) {
        Processor.doAction('post_item', {action});
    }

    @autobind
    handlePickItem() {
        GlobalState.dispatchEvent('popupShown', 'drawings');
    }

    @autobind
    handleCreateItem() {
        let props = {
            duration: 5,
            caption: dict.creation,
            onComplete: () => {
                Processor.doAction('post_item', {action: 'create'});
            }
        }
        GlobalState.dispatchEvent('popupShown', 'countdown', props);
    }
}