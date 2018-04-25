import {autobind} from "core-decorators"
import React from 'react'
import View from 'app/views'
import Button from 'app/ui/Button'
import Loader from 'app/ui/Loader'
import Processor from 'app/storages/Processor'
import GlobalState from 'app/services/GlobalState'

import "./style.scss";

export default class Character extends View {
	constructor(props) {
		super(props);
		this.added = {};

		this.addToState({
            totalAdded: 0
		});

        Processor.subscribeToStorages(this, 'chars', 'stats', 'exps', 'conds', 'equip');

        this.addClickListeners({
            term: this.handleTermClick,
            weapon: this.handleWeaponChange
        });
	}

	componentWillUnmount() {
        let set = this.getWeaponSet();
		if (this.hasState('totalAdded')) {
			this.reset();
		}
        super.componentWillUnmount();
	}

    renderContent() {
        if (!this.isReady()) {
            return <Loader/>
        }
        let {totalAdded, dict, exps, conds, equip, stats, chars} = this.state;
        let {set} = equip;
                
        let sdict = dict.stats;
        let charsList = this.storages.chars.getList();

        return <div className="view-inner-content" onClick={this.handleClick}>
            <div className="main-stats">
                <div className="chars-block">
                    <span className="term" data-term="set">
                        {dict.set}
                    </span>
                    <span className={this.mergeClasses('weapon', set == 1 ? 'active': '')} data-set="1">
                        1
                    </span>
                    <span className={this.mergeClasses('weapon', set == 2 ? 'active': '')} data-set="2">
                        2
                    </span>
                    <span className={this.mergeClasses('weapon', set == 3 ? 'active': '')} data-set="3">
                        3
                    </span>
                </div>
                <div className="chars-block">
                    {charsList.map(this.renderChar.bind(this, dict.chars, chars))}
                </div>
                
                
                <div className="chars-block">
                    <div className="char">
                        <span className="term" data-term="hp">
                            {sdict.hp}
                        </span>
                        <span className="value fr stat">
                            {conds.hp} / {stats.hp}
                        </span>
                    </div>
                    <div className="char">
                        <span className="term" data-term="mn">
                            {sdict.mn}
                        </span>
                        <span className="value fr stat">
                            {conds.mn} / {stats.mn}
                        </span>
                    </div>
                    <div className="char">
                        <span className="term" data-term="en">
                            {sdict.en}
                        </span>
                        <span className="value fr stat">
                            {conds.en} / {stats.en}
                        </span>
                    </div>
                </div>
                <div className="chars-block">
        			<div className="char">
        				<span className="term" data-term="points">
                            {dict.points}
                        </span>
                        <span className="fr">
                            {exps.points}
                        </span>
        			</div>
        		</div>
                {totalAdded > 0 && <Button classes="reset red" caption={dict.actions.reset} onClick={this.reset}/>}
                {totalAdded > 0 && <Button caption={dict.actions.save} onClick={this.save}/>}
            </div>
            <div className="secondary-stats">
                 <div className="chars-block">
                    {equip.attype == 2 && <div className="char">
                        <span className="term" data-term="rng">
                            {sdict.rng}
                        </span>
                        <span className="value fr stat">
                            {stats.rng}
                        </span>
                    </div>}
                    {equip.attype == 1 ? <div className="char">
                        <span className="term" data-term="att">
                            {sdict.att}
                        </span>
                        <span className="value fr stat">
                            {stats.att}
                        </span>
                    </div> : <div className="char">
                        <span className="term" data-term="hit">
                            {sdict.hit}
                        </span>
                        <span className="value fr stat">
                            {stats.hit}
                        </span>
                    </div>}
                    <div className="char">
                        <span className="term" data-term="dmg">
                            {equip.attype == 1 ? sdict.dmg : sdict.hdmg}
                        </span>
                        <span className="value fr stat">
                            {stats.dmg1} - {stats.dmg2}
                        </span>
                    </div>
                </div>
            </div>
    	</div>
    }

    @autobind
    renderChar(cdict, chars, char) {
        let name = cdict[char];
        let value = chars[char]
        let added = !!this.added[char];
        let canAdd = this.storages.chars.canAdd(char);
    	return <div className="char" key={char}>
            <span className="term" data-term={char}>
                {name}
            </span>
            <span className={this.mergeClasses('value fr', added ? 'green' : '')}>
                {value}
            </span>
            {(canAdd || added) && <span className={this.mergeClasses('fr plus', !canAdd ? 'disabled' : '')} onClick={canAdd ? this.handleAdd.bind(this, char, 1) : null}>+</span>}
            {(canAdd || added) && <span className={this.mergeClasses('fr plus', !added ? 'disabled' : '')} onClick={added ? this.handleAdd.bind(this, char, -1) : null}>-</span>}
        </div>
    }

    handleAdd(name, value) {
        let {totalAdded} = this.state;
        totalAdded += value;
    	this.added[name] = this.added[name] || 0;
    	this.added[name] += value;
        this.setState({totalAdded});
        this.calculate();
    }

    @autobind
    save() {
        Processor.doAction('post_chars', {data: this.added, action: 'save'});
        this.clearAdded();
    }

    @autobind
    reset() {
        this.clearAdded();
        this.calculate();
    }

    handleWeaponChange({set}) {
        this.calculate(~~set);       
    }

    handleTermClick({term}, e) {
        e.stopPropagation();
        GlobalState.dispatchEvent('popupShown', 'termInfo', {term}, e);
    }

    calculate(set) {
        Processor.doAction('post_chars', {data: {equip: {set: this.getWeaponSet(set)}, chars: this.added}, action: 'calc'});
    }

    getWeaponSet(set) {
        if (set) return set;
        let {equip} = this.state;
        if (equip) return equip.set;
    }

    clearAdded() {
        this.added = {};
        this.setState({totalAdded: 0});
    }

}