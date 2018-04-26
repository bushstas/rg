import {autobind} from "core-decorators"
import React from 'react'
import View from 'app/views'
import Button from 'app/ui/Button'
import Chars from 'app/storages/Chars'
import Stats from 'app/storages/Stats'
import Exps from 'app/storages/Exps'
import Conds from 'app/storages/Conds'
import Equip from 'app/storages/Equip'

import "./style.scss";

export default class Skills extends View {
	constructor(props) {
		super(props);
		this.added = {};

		this.addToState({
            totalAdded: 0
		});
	}

    renderContent() {

        return <div className="view-inner-content">
            1111
    	</div>
    }


}