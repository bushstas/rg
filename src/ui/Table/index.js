import {autobind} from "core-decorators"
import React from 'react'

import Component from '../Component'
import DefaultCell from './cells/default.js'
import ActionsCell from './cells/action.js'
import StatusCell from './cells/status.js'
import RequisitesCell from './cells/requisites.js'
import ContractsCell from './cells/contracts.js'
import CashboxesCell from './cells/cashboxes.js'
import NameCell from './cells/name.js'
import ClientIDCell from './cells/clientId.js'



import "./style.scss";

const CELLS = {
    default: DefaultCell,
    requisites: RequisitesCell,
    status: StatusCell,
    contracts: ContractsCell,
    actions: ActionsCell,
    name: NameCell,
    cashboxes: CashboxesCell,
    clientId: ClientIDCell
}

export default class Table extends Component {
    constructor() {
        super();
        this.checkedRows = [];
    }

    render() {
    	this.preparerRows();
        return (
			<div className={this.getClasses('table-container', this.hasProp('selection') ? 'selectable' : '')}>
				<table cellPadding="0" cellSpacing="0">
					{this.renderHead()}
					{this.renderBody()}
				</table>
			</div>
        )
    }

     preparerRows() {
        let {rows} = this.props;
        let properRows = {}, id;
        this.rowsOrder = [];
        if (rows instanceof Array) {
            for (let i = 0; i < rows.length; i++) {
                id = rows[i].id;
                this.rowsOrder.push(id);
                properRows[id] = rows[i];
            }
        }
        this.rows = properRows;
    }

    @autobind
    renderHead() {
        let {headers} = this.props;
        if (headers instanceof Array) {
            return (
                <thead>
                    <tr>
                        {this.renderCheckboxCell()}
                        {headers.map(this.renderTh)}
                    </tr>
                </thead>
            )
        }
    }

    @autobind
    renderBody() {
        let rows = this.rows;
        if (rows instanceof Object) {
            if (typeof this.rowsOrder[0] != 'undefined') {
                return (
                    <tbody>
                        {this.rowsOrder.map(id => (
                            this.renderRow(rows[id], id)
                        ))}
                    </tbody>
                )
            } else {
                let {headers, checkboxes} = this.props;
                if (headers instanceof Array) {
                    return (
                        <tbody>
                            <tr>
                                <td colSpan={headers.length + (checkboxes ? 1 : 0)}>
                                    {this.getProp('emptyContent') || 'Не найдено ни одной записи'}
                                </td>
                            </tr>
                        </tbody>
                    )
                }
            }
        }
    }

    @autobind
    renderTh(item, i) {
    	if (item.column != 'id') {
	    	return (
				<th key={i}>
			    	{item.caption}
			    </th>
	    	)
	    }
    }

    @autobind
    renderRow(cells, id) {
    	let {headers} = this.props;
        let selectedRowId = this.getState('selectedRowId');
    	if (headers instanceof Array) {
	    	return (
				<tr className={this.mergeClasses('table-row', selectedRowId == id ? 'selected' : '')} key={id} data-id={id} onClick={this.handleRowClick}>
			    	{this.renderCheckboxCell(id)}
                    {headers.map((item, i) => (
			    		cells[item.name] && 
                        this.renderTd(cells[item.name], item.name, id, cells)
			    	))}
			    </tr>
	    	)
	   	}
    }

    @autobind
    renderTd(data, key, id, cells) {
    	let cellRenderer = CELLS[key];
        let defaultCellRenderer = CELLS.default;
        if (cellRenderer instanceof Function) {
            return cellRenderer(data, key, this, id, cells);
        }
        return defaultCellRenderer(data, key, this, id, cells);
    }

    renderCheckboxCell(id) {
        let {checkboxes} = this.props;
        if (checkboxes) {
            if (!id) {
                return <th/>
            } else {
                return this.renderTd(null, 'checkbox', id);
            }
        }
    }

    handleAction(id, action) {
        this.fireEvent('action', action, id);
    }

    handleActionButtonClick(action, id) {
        this.fireEvent('action', action, id);
    }

    handleCheck(id, value, checked) {
        this.checkedRows.addRemove(id, checked, true);
    }

    @autobind
    handleRowClick(e) {
        let selection = this.getProp('selection');
        if (selection) {
            let target = e.target;
            if (!target.hasClass('table-row')) {
                target = target.getAncestor('.table-row');
            }
            if (target) {
                let rowId = target.getData('id');
                let selectedRowId = this.getState('selectedRowId');
                if (rowId) {
                    rowId = rowId != selectedRowId ? rowId : '';
                    this.setState({
                        selectedRowId: rowId
                    });
                    this.fireEvent('select', rowId);
                }
            }
        }
    }
}