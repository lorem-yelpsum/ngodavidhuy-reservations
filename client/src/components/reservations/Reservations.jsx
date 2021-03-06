import React, { Component } from 'react';
import Icon from '../icons/Icon.jsx';
import CSSModules from 'react-css-modules';
import style from './reservations.css';
import utils from '../../utils/calendar-helpers.js';
import Calendar from './calendar/Calendar.jsx';
import PeoplePicker from './select/PeoplePicker.jsx';
import TimePicker from './select/TimePicker.jsx';


class Reservations extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currMonth: null,
      currYear: null,
      calendar: [],
      calendarDisplay: false,
      dateSelected: null,
      timeSelected: null,
      partySelected: 2,
    }

    this.calendarToggle = this.calendarToggle.bind(this);
    this.handlePrevMonth = this.handlePrevMonth.bind(this);
    this.handleNextMonth = this.handleNextMonth.bind(this);
    this.handleDatePicker = this.handleDatePicker.bind(this);
    this.handleTimePicker = this.handleTimePicker.bind(this);
    this.handlePeoplePicker = this.handlePeoplePicker.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const today = new Date();
    const calendarMonth = utils.generateCalendarMonth(today.getMonth(), today.getFullYear());
    this.setState({
      currMonth: today.getMonth(),
      currYear: today.getFullYear(),
      calendar: calendarMonth,
      dateSelected: utils.formatDate(today),
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.open_time !== this.state.timeSelected && !this.state.timeSelected) {
      this.setState({
        timeSelected: this.props.open_time,
      }) 
    }
  } 

  calendarToggle() {
    this.setState(prevState => {
      return {
        calendarDisplay: !prevState.calendarDisplay
      }
    });
  }

  handlePrevMonth(e) {
    e.stopPropagation();
    let month = this.state.currMonth === 0 ? 11 : this.state.currMonth - 1;
    let year = month === 11 ? this.state.currYear - 1 : this.state.currYear;
    let calendarMonth = utils.generateCalendarMonth(month, year);

    this.setState({
      currMonth: month,
      currYear: year,
      calendar: calendarMonth
    });
  }

  handleNextMonth(e) {
    e.stopPropagation();
    let month = this.state.currMonth === 11 ? 0 : this.state.currMonth + 1;
    let year = month === 0 ? this.state.currYear + 1 : this.state.currYear;
    let calendarMonth = utils.generateCalendarMonth(month, year);

    this.setState({
      currMonth: month,
      currYear: year,
      calendar: calendarMonth
    });
  }

  handleDatePicker(e) {
    e.stopPropagation();
    let newDateSelected = utils.formatDate(new Date(e.target.dataset.date));
    this.setState({
      dateSelected: newDateSelected,
      calendarDisplay: false
    });
  }

  handleTimePicker(e) {
    this.setState({
      timeSelected: e.target.value
    })
  }

  handlePeoplePicker(e) {
    this.setState({
      partySelected: parseInt(e.target.value)
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    let {dateSelected, timeSelected, partySelected} = this.state;
    let {rest_id} = this.props;

    if (dateSelected && timeSelected && partySelected) {
      let data = {
        rest_id,
        user_id: 1,
        date: dateSelected,
        reservation_time: timeSelected,
        party_size: partySelected
      }

      fetch(`http://127.0.0.1:3005/reservations/${rest_id}/`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .then(response => {
        console.log('Success:', response);
        alert('Reservation Booked!');
      })
      .catch(error => console.error('Error:', error))
    }
  }

  render() {
    let {days_open, max_party, open_time, close_time} = this.props;

    return (
      <div styleName="reservations-container">
        <h3>
          <Icon name={'24x24_reservation'} width={25} height={25} fill={'#333'}/>
          <a href="#" styleName="reservation-header-link">Make a Reservation</a>
        </h3>
        <div>
          <form method="POST" name="reservation-availability-form">
            <ul styleName="reservation-fields">
              <li styleName="date-picker">
                <div styleName="yselect">
                  <Icon name={'18x18_reservation'} width={15} height={15} fill={'#666'} />
                  <input
                    name="reservation_datetime_date" 
                    type="text" 
                    value={utils.formatDateInputValue(this.state.dateSelected)} 
                    onClick={this.calendarToggle} 
                    readOnly
                    />
                  <Icon name={'14x14_triangle_down'} width={12} height={12} />
                </div>
                <div>
                  <Calendar 
                    calendar={this.state.calendar} 
                    calendarDisplay={this.state.calendarDisplay}
                    currMonth={this.state.currMonth}
                    currYear={this.state.currYear}
                    dateSelected={this.state.dateSelected}
                    handlePrevMonth={this.handlePrevMonth} 
                    handleNextMonth={this.handleNextMonth} 
                    handleDatePicker={this.handleDatePicker}
                    days_open={days_open}
                    />
                </div>
              </li>
              <li styleName="time-picker">
                <div styleName="yselect">
                  <Icon name={'18x18_clock'} width={15} height={15} fill={'#666'} />
                  <TimePicker open_time={open_time} close_time={close_time} handleTimePicker={this.handleTimePicker} />
                  <Icon name={'14x14_triangle_down'} width={12} height={12} />
                </div>
              </li>
              <li styleName="people-picker">
                <div styleName="yselect">
                  <Icon name={'18x18_friends'} width={15} height={15} />
                  <PeoplePicker max_party={max_party} handlePeoplePicker={this.handlePeoplePicker}/>
                  <Icon name={'14x14_triangle_down'} width={12} height={12} />
                </div>
              </li>
            </ul>
            <button styleName="find-table-button" onClick={this.handleSubmit}>Find a Table</button>
          </form>
        </div>
      </div>
    );
  }
}

export default CSSModules(Reservations, style, {allowMultiple: true});
