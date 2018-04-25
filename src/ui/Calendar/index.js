import {autobind} from 'core-decorators'
import React from 'react'
import Dates from 'app/services/Dates'
import Component from 'app/ui/Component'
import {DAY_NAMES} from 'app/consts/dates.js'
import "./style.scss"

export default class Calendar extends Component {
	render() {
		return (
			<div className="calendar">
				<div className="calendar-header">
					<div className="calendar-prev" onClick={this.handlePrevClick}></div>
					<div className="calendar-month">
						{this.getMonthName()}
						<span className="calendar-year">
							{this.getYear()}
						</span>
					</div>
					<div className="calendar-next" onClick={this.handleNextClick}></div>
				</div>
				<div className="calendar-content">
					<div className="calendar-day-names">
						<span>{DAY_NAMES[0]}</span>
						<span>{DAY_NAMES[1]}</span>
						<span>{DAY_NAMES[2]}</span>
						<span>{DAY_NAMES[3]}</span>
						<span>{DAY_NAMES[4]}</span>
						<span>{DAY_NAMES[5]}</span>
						<span>{DAY_NAMES[6]}</span>
					</div>
					<div className="calendar-days" onClick={this.handleDayClick}>
						{this.renderDays()}
					</div>
				</div>
			</div>
		)
	}

	renderDays() {
		let days = this.getDays();
		return days.map(this.renderDay);
	}

	@autobind
	renderDay(day, i) {
		let classes = [];
		if (!day.another) {
			classes.push('actual');
		}
		if (day.current) {
			classes.push('current');
		}
		if (day.marked) {
			classes.push('marked');
		}
		if (day.another) {
			return (
				<span className="another" key={i}>
					{day.num}
				</span>
			);
		} else {
			return (
				<span className={classes.join(' ')} key={i} data-day={day.num}>
					{day.num}
				</span>
			);
		}
	}

	getMonthName() {
		return Dates.getMonthName(this.props.month);
	}

	getYear() {
		return this.props.year;
	}

	reset() {
		this.props.onChangeMonth(Dates.getMonth(),  Dates.getYear());
	}
	
	getCurrentMonthAndYear() {
		let {month} = this.props;
		if (month) {
			return this.props;
		}
		return {
			month: Dates.getMonth(),
			year: Dates.getYear()
		};
	}

	getDays() {
		let {month, year} = this.getCurrentMonthAndYear();
		let day = this.isCurrentMonth() ? Dates.getDay() : 0,
			curDays = Dates.getDays(month + 1, year),
			prevMonth = month - 1 >= 0 ? month - 1 : 11,
			prevYear = prevMonth < 12 ? year : year - 1,
			prevDays = Dates.getDays(prevMonth + 1, prevYear),
			firstDay = Dates.getWeekDay(1, month, year),
			firstCell = firstDay > 0 ? firstDay - 1 : 6,
			count = 1,
			lastCell = 0, 
			days = [];
		for (var i = 0; i < firstCell; i++) {
			days.push({num: prevDays - i, another: true});
		}
		days = days.reverse();
		for (var i = firstCell; i < curDays + firstCell; i++) {
			days.push({num: count, current: count == day, marked: this.isMarked(count, month, year)});
			lastCell = i;
			count++;
		}
		var len = days.length;
		var more =  len <= 35 ? 35 - len : 42 - len;
		for (var i = 1; i <= more; i++) {
			days.push({num: i, another: true});
		}
		return days;
	}

	isCurrentMonth() {
		return this.month == Dates.getMonth() && this.year == Dates.getYear();
	}

	isMarked() {
		return false;
	}
	
	@autobind
	handleDayClick(e) {
		let day = this.getTargetData(e, 'actual', 'day');
		if (day) {
			this.fireEvent('pick', day);
		}
	}

	@autobind
	handlePrevClick() {
		this.changeMonth(-1);
	}

	@autobind
	handleNextClick() {
		this.changeMonth(1);	
	}

	changeMonth(value) {
		let {month, year} = this.props;
		month += value;
		if (month == 12) {
			month = 0;
			year++;
		} else if (month == -1) {
			month = 11;
			year--;
		}
		this.fireEvent('changeMonth', month, year);
	}
}