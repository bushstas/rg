import {autobind} from "app/node_modules/core-decorators"
import React from "app/node_modules/react"
import Component from "app/ui/Component"
import Prototypes from "app/services/prototypes.js"
import Loader from "app/ui/Loader"
import GlobalState from "app/services/GlobalState"
import HashRouter from "app/services/HashRouter"
import KeybordController from "app/services/KeybordController"
import Dictionary from "app/storages/Dictionary"

import Location from "views/location"
import Character from "views/character"
import Skills from "views/skills"
import Equipment from "views/equipment"

import MainMenu from "app/components/MainMenu"
import Popups from "app/components/Popups"

import "app/style.scss"

const VIEWS = [
	'location', 'character', 'skills', 'equipment'
];

const DEFAULT_VIEW = VIEWS[0];

export default class App extends Component {
	constructor() {
		super();
		KeybordController.init();
		Prototypes.init();		
		GlobalState.listen('changeView', this.handleChangeView, this);		
		Dictionary.load('main', this);
		this.titleElement = document.getElementsByTagName('title')[0];
	}

    setTitle(props) {
        let {dict, view} = this.state;
        if (dict) {
        	this.titleElement.innerHTML = dict.main_menu[view];
        }
    }

	componentDidMount() {
		super.componentDidMount();
		HashRouter.init();
	}

	componentDidUpdate() {
        this.setTitle();
    }

	render() {
		let {view, dict} = this.state;

		if (!dict) {
			return <Loader/>
		}
		return (
			<div className="app">
				<MainMenu view={view} dict={dict} onChange={this.handleChangeView}/>
				{this.renderView(view)}
				<Popups/>
			</div>
		)
	}

	renderView(view) {
		switch (view) {
			case 'location':  return <Location  name="location"/>
			case 'skills':    return <Skills    name="skills"/>
			case 'equipment': return <Equipment name="equipment"/>
			case 'character': return <Character name="character"/>
		}
		return <Location name="location"/>
	}

	@autobind
	handleChangeView(view) {
		if (!VIEWS.has(view)) {
			view = DEFAULT_VIEW;
			HashRouter.replaceState(view);
		}
		this.setState({view});
	}

    @autobind
    handleDictionaryLoad(dict) {
        this.setState({dict});
        this.setTitle();
    }
}