import {autobind} from 'core-decorators'
import React from 'react'
import Input from '../Input'
import Calendar from '../Calendar'
import Popuper from 'app/services/Popuper'
import Dates from 'app/services/Dates'
import Component from 'app/ui/Component'

import "./style.scss"

export default class DatePicker extends Component {
	constructor() {
		super();
		this.addToState({
			active: false,
			month: Dates.getMonth(), 
			year: Dates.getYear()
		});
	}

	componentWillReceiveProps(props) {
		let {value} = props;
		if (value) {
			let date = Dates.getDate(value);
			this.addToState({
				month: date.month, 
				year: date.year
			});
		}
	}

	render() {
		let {value, placeholder, name} = this.props;
		let	{active, year, month} = this.state;
		return (
			<div ref="scope" className={this.getClasses('date-picker', active ? 'active' : '')}>
				<div className={this.mergeClasses('date-picker-input', !value ? 'empty' : '')} onClick={this.onClick}>
					<Input ref="input" name={name} value={value} readOnly={true} placeholder={placeholder} novalidation={true} onClear={this.handleClear}/>
				</div>
				<div className="date-picker-calendar">
					<Calendar ref="calendar" month={month} year={year} onPick={this.handleDatePick} onChangeMonth={this.handleChangeMonth}/>
				</div>	
			</div>
		)
	}

	createDateValue(day) {
		let {month, year} = this.state;
		month++;
		day = day < 10 ? '0' + day : day;
		month = month < 10 ? '0' + month : month;
		return day + '.' + month + '.' + year;
	}

	@autobind
	handleClear() {
		this.fireEvent('change', this.props.name, '');
	}

	@autobind
	handleDatePick(day) {
		this.hide();
		let value = this.createDateValue(day);
		this.fireEvent('change', this.props.name, value);
	}

	@autobind
	handleChangeMonth(month, year) {
		this.setState({
			month: month,
			year: year
		});
	}

	@autobind
	onClick() {
		Popuper.watch(this);
		this.setState({
			active: true
		});
	}

	hide() {
		this.setState({
			active: false
		});
	}
}