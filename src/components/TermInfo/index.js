import {autobind} from "core-decorators"
import React from 'react'
import Popup from 'app/ui/Popup'
import GlobalState from 'app/services/GlobalState'
import Terms from 'app/storages/Terms'
import Processor from 'app/storages/Processor'

import "./style.scss";


export default class TermInfo extends Popup {
    constructor(props) {
        super(props);

        this.addToState({
            data: {
                terms: Terms.subscribe(this)
            }
        });

        Processor.doAction('loadTerm', {term: props.term});
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        Terms.clear();
    }

    render() {
        let {coords, data} = this.state;
        let {terms} = data;
        if (!terms) {
            return null;
        }
        let {name, descr} = terms;
        return <div ref="scope" className={this.getClasses('term-info')} style={coords}>
            <div className="name">
                {name}
            </div>
            <div className="descr">
                {descr}
            </div>
        </div>
    }
}