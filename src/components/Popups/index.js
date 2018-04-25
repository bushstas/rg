import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'
import GlobalState from 'app/services/GlobalState'
import ItemActionMenu from 'app/components/ItemActionMenu'
import TermInfo from 'app/components/TermInfo'
import Drawings from 'app/components/Drawings'
import Countdown from 'app/components/Countdown'
import MapActionInfo from 'app/components/MapActionInfo'

import './style.scss'

export default class Popups extends Component {
    constructor() {
        super();
        this.addToState({
            popups: []
        });
        this.popupsProps = {};
        this.popupsEvents = {};
    }

    componentDidMount() {
        GlobalState.listen('popupShown', this.handlePopupShown, this);
    }

    render() {
        let {popups} = this.state;
        return (
            <div className="popups" ref="scope">
                {popups.map(this.renderPopup)}
            </div>
        )
    }

    @autobind
    renderPopup(popupName) {
        let props = this.popupsProps[popupName];
        let event = this.popupsEvents[popupName];
        let other = {
            ref: popupName,
            onHide: this.hide,
            popupName
        };
        switch (popupName) {
            case 'itemActionMenu':
                let {types, name, data, item} = props;
                return <ItemActionMenu 
                    key={name}
                    types={types}
                    name={name}
                    data={data}
                    item={item}
                    event={event}
                    {...other}
                />
            break;

            case 'drawings':
                return <Drawings 
                    key={popupName}
                    scrollable={true}
                    {...other}
                />
            break;

            case 'mapActionInfo':
                return <MapActionInfo 
                    key={popupName}
                    action={props}
                    {...other}
                />
            break;

            case 'termInfo':
                let {term} = props;
                return <TermInfo 
                    key={term}
                    term={term}
                    event={event} 
                    {...other}
                />
            break;

            case 'countdown':
                return <Countdown 
                    key={popupName}
                    {...props}
                    {...other}
                />
            break;
        }
    }

    @autobind
    handlePopupShown(name, props, event) {
        let {popups} = this.state;
        popups.addUnique(name);
        this.popupsProps[name] = props;
        this.popupsEvents[name] = event;
        this.setState({popups});
    }

    @autobind
    hide(popupName) {
        let {popups} = this.state;
        this.refs[popupName].handleHiding();
        popups.removeItem(popupName);
        this.setState({popups});
    }
}