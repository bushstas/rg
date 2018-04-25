import {autobind} from 'core-decorators'
import React from 'react'
import Input from '../Input'
import Popuper from 'app/services/Popuper'
import Dates from 'app/services/Dates'
import Component from 'app/ui/Component'
import Select from 'app/ui/Select'
import {MONTHS} from 'app/consts/dates.js'

import "./style.scss"

export default class DateSelect extends Component {
	constructor(props) {
		super();
		this.months = [];
		for (let i = 0; i < MONTHS.length; i++) {
			this.months.push({value: i + 1, title: MONTHS[i]});
		}
		let month = Dates.getMonth() + 1;
		this.initYears(props);		
		this.addToState({
			active: false,
			month: month
		});
	}

	initYears(props) {
		let mode = props.mode;
		let yearShift = props.yearShift ? props.yearShift : 0;
		let currentYear = Dates.getYear();
		let startYear = currentYear - yearShift;
		this.years = [];
		switch (mode) {
			case 'future':
			case 'futureonly':
				for (let i = startYear; i <= startYear + 30; i++) {
					this.years.push({value: i, title: i});
				}
			break;			
			default:
				for (let i = startYear; i >= 1920; i--) {
					this.years.push({value: i, title: i});
				}
		}
		this.addToState({
			year: startYear
		});
	}

	componentWillReceiveProps(props) {
		let {value} = this.props;
		if (!value && props.value) {
			this.fireEvent('validate', true, this.getProp('name'));
		}
	}

	componentDidMount() {
		if (this.getProp('required') && !this.getProp('value')) {
			this.fireEvent('validate', false, this.getProp('name'));
		}
	}

	componentWillUnmount() {
        this.fireEvent('validate', true, this.getProp('name'));
    }

	render() {
		let {value, placeholder, name, required, error, requiredError, showError, inactive} = this.props;
		let	{active, month, year} = this.state;
		return (
			<div ref="scope" className={this.getClasses('date-select', active ? 'active' : '', !value ? 'empty' : '', this.hasProp('readOnly') ? 'read-only' : '')}>
				<div className="date-select-input" onClick={this.onClick}>
					<Input ref="input" name={name} value={value} readOnly={true} noClear={this.hasProp('readOnly')} placeholder={placeholder} required={required} requiredError={requiredError} showError={showError} error={error} onClear={this.handleClear} inactive={inactive}/>
				</div>
				<div className="date-select-area">
					<div className="calendar-header">
						<Select classes="linklike month" value={month} name="month" options={this.months} onChange={this.handleSelectChange}/>
						<Select classes="linklike year" value={year} name="year" options={this.years} onChange={this.handleSelectChange}/>
					</div>
					<div className="calendar-days" onClick={this.handleDayClick}>
						{this.renderDays()}
					</div>
				</div>	
			</div>
		)
	}

	renderDays() {
		let mode = this.getProp('mode');
		let {month, year} = this.state;
		let daysCount = Dates.getDays(month, year);
		let minDay = 1, maxDay = daysCount;
		let currentYear = Dates.getYear();
		let currentMonth = Dates.getMonth() + 1;
		let currentDay = Dates.getDay();
		switch (mode) {
			case 'pastonly':
				if (year > currentYear || (currentYear == year && month > currentMonth)) {
					minDay = 99;
				} else if (currentYear == year && currentMonth == month) {
					maxDay = currentDay;
				}
			break;

			case 'futureonly':
				if (year < currentYear || (currentYear == year && month < currentMonth)) {
					minDay = 99;
				} else if (currentYear == year && currentMonth == month) {
					minDay = currentDay;
				}
			break;
		}
		let days = [];
		for (let i = 1; i <= daysCount; i++) {
			days.push(i);
		}
		return days.map(this.renderDay.bind(this, minDay, maxDay));
	}

	@autobind
	renderDay(minDay, maxDay, i) {
		return <span className={this.mergeClasses('calendar-day', i < minDay || i > maxDay ? 'disabled' : '')} data-day={i} key={i}>{i}</span>
	}

	@autobind
	onClick() {
		if (!this.hasProp('readOnly')) {
			Popuper.watch(this);
			this.setState({
				active: true
			});
		}
	}

	hide() {
		this.setState({
			active: false
		});
	}

	@autobind
	handleSelectChange(name, value) {
		let {month, year} = this.state;
		let state = {};
		let {day} = this.state;
		state[name] = value;
		this.setState(state);
		if (day) {
			this.fireChange(day, name == 'month' ? value : month, name == 'year' ? value : year);
		}
	}

	@autobind
	handleDayClick(e) {
		let	day = this.getTargetData(e, 'calendar-day', 'day');
		if (day && !e.target.hasClass('disabled')) {
			this.setState({
				day: day
			});
			this.fireChange(day, this.state.month, this.state.year);
			this.hide();
		}
	}

	@autobind
	fireChange(day, month, year) {
		let value = '';
		if (day) {
			value = (day < 10 ? '0' + day : day) + '.' + (month < 10 ? '0' + month : month) + '.' + year;
		}
		let name = this.getProp('name');
		this.fireEvent('change', name, value);
		this.validate(value);
	}

	validate(value) {
		let isValid = this.isValid(value);
		let name = this.getProp('name');
		if (isValid && this.getProp('required')) {
			isValid = !!value;
		}
		this.fireEvent('validate', isValid, name, value);
	}

	isValid(value) {
		let validationMode = this.getProp('validationMode');
		if (!validationMode || !value) return true;
		let currentDate = Dates.getCurrentDate();
        let daysDiff = Dates.getDifferenceInDays(currentDate, value);     
		switch (validationMode) {
			case 'pastonly':
				return daysDiff > 0;

			case 'futureonly':
				return daysDiff < 0;
		}
	}

	@autobind
	handleClear() {
		this.fireChange();
	}
}