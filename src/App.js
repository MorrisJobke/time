import React, { Component } from 'react';

var underscore = require('underscore/underscore');
var moment = require('moment/moment');

function Slot(props) {
  const startDate = new Date(props.slot.start);
  const endDate = new Date(props.slot.end);
  if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
    return (
      <div className="slot error">Invalid row</div>
    );
  }
  const durationInMinutes = (endDate - startDate) / (60 * 1000);

  const minutes = durationInMinutes % 60;
  const hours = (durationInMinutes - minutes) / 60;
  const paddedMinutes = (minutes > 9) ? minutes : '0' + minutes; 

  const start = [startDate.getHours(), startDate.getMinutes()].map(
      (item) => item > 9 ? item : '0' + item
    ).join(':');
  const end = [endDate.getHours(), endDate.getMinutes()].map(
      (item) => item > 9 ? item : '0' + item
    ).join(':');

  return (
    <div className="slot">
      <div className="duration">{hours}:{paddedMinutes}h</div>
      <div className="details">
        {start}<br/>
        {end}
      </div>
    </div>
  );
}
function DaySlot(props) {

  const date = new Date(props.daySlot.date);
  const now = new Date();
  const days = Math.floor((now - date)/(24 * 60 * 60 * 1000));

  let daysString;
  if (days === 0) {
    daysString = 'Today';
  } else if (days === 1) {
    daysString = 'Yesterday';
  } else {
    daysString = props.daySlot.date;
  }

  const totalMinutes = props.daySlot.slots
    .map((slot) => {
      const startDate = new Date(slot.start);
      const endDate = new Date(slot.end);
      if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
        return 0;
      }

      return (endDate - startDate) / (60 * 1000);
    })
    .reduce((previous, current) => previous + current, 0);
  

  const passedMinutes = totalMinutes % 60;
  const passedHours = (totalMinutes- passedMinutes) / 60;
  const total = passedHours + ':' + ((passedMinutes < 10) ? '0' : '') + passedMinutes;

  const slots = props.daySlot.slots.map((slot) => {
    return (
      <li key={slot.id}>
        <Slot slot={slot} />
      </li>
    );
  })
  return (
    <div className="daySlot">
      <div className="day">
        {daysString}
        <span className="totalDuration">{total}</span>
      </div>
      <ul className="slotList">{slots}</ul>
    </div>
  );
}

class StartButtonContent extends Component {
  constructor() {
    super();
    this.state = {
      minutesPassed: 0
    }
  }
  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 5000);
    this.tick();
  }
  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.startedAt === null) {
      this.setState({
        minutesPassed: 0
      });
    }
  }
  tick() {
    if (this.props.startedAt !== null) {
      const d = new Date();
      const diff = Math.floor((d - new Date(this.props.startedAt)) / (60 * 1000));

      if (diff > this.state.minutesPassed) {
        this.setState({
            minutesPassed: diff
        })
      }
    }
  }
  render() {
    if (this.props.startedAt === null) {
      return (
        <div className="slot startTracking" onClick={() => this.props.onClick()}>
          <div className="text">
            Start tracking ...
          </div>
        </div>
      );
    }

    const passedMinutes = this.state.minutesPassed % 60;
    const passedHours = (this.state.minutesPassed - passedMinutes) / 60;
    const passedTime = passedHours + ':' + ((passedMinutes < 10) ? '0' : '') + passedMinutes;

    const d = new Date(this.props.startedAt);
    const formattedTime = [d.getHours(), d.getMinutes()].map(
        (item) => item > 9 ? item : '0' + item
      ).join(':');

    return (
      <div className="slot startTracking" onClick={() => this.props.onClick()}>
        <div className="duration">{passedTime}h</div>
        <div className="details">
          {formattedTime}h<br/>
        </div>
      </div>
    );

  }
}

class Stats extends Component {
  constructor() {
    super();
    this.state = {
      minutesPassedWeek: 0,
      minutesPassedDay: 0
    }
  }
  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 5000);
    this.tick();
  }
  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.startedAt === null) {
      this.setState({
          minutesPassedDay: 0,
          minutesPassedWeek: 0
      });
    }
  }
  reduceMinutes(slots) {
    return underscore.flatten(
      slots.map(
        (day) => day.slots
      ), true
    ).map(
      (slot) => Math.floor((new Date(slot.end) - new Date(slot.start)) / (60 * 1000))
    ).reduce(
      (previous, current) => current + previous, 0
    );
  }
  tick() {
    const d = new Date();
    if (d.getSeconds() > 10 && this.state.minutesPassedDay > 0) {
      // only refresh the view once per minute
      return;
    }
    if (d.getHours() === 0 && d.getMinutes() === 0 && this.props.startedAt === null) {
      // reset at 0:00 if there is currently no timer running
      this.setState({
          minutesPassedDay: 0,
          minutesPassedWeek: 0
      })
    }

    const startedAtDateOrNow = (this.props.startedAt !== null) ? new Date(this.props.startedAt) : new Date();
    const currentMonth = startedAtDateOrNow.getMonth() + 1;
    const currentDay = startedAtDateOrNow.getDate();
    const id = startedAtDateOrNow.getFullYear() + '-' + (currentMonth < 10 ? '0' : '') + currentMonth + '-' + (currentDay < 10 ? '0' : '') + currentDay;
    

    let minutesToday = 0;
    let minutesThisWeek = 0;
    let minutesSinceStarted = 0;

    if (this.props.startedAt !== null) {
      minutesSinceStarted = Math.floor((d - startedAtDateOrNow) / (60 * 1000));
    }

    // TODO cache the following
    const currentDaySlots = underscore.where(this.props.daySlots, {date: id});
    if (currentDaySlots.length > 0) {
      minutesToday += this.reduceMinutes(currentDaySlots);
    }

    if (minutesToday + minutesSinceStarted > this.state.minutesPassedDay) {
      this.setState({
          minutesPassedDay: minutesToday + minutesSinceStarted
      })
    }

    // TODO cache the following
    const mondayThisWeek = moment(startedAtDateOrNow).startOf('isoWeek');
    const currentWeekSlots = this.props.daySlots.filter(
      (day) => mondayThisWeek.isSameOrBefore(day.date, 'day')
    );
    if (currentDaySlots.length > 0) {
      minutesThisWeek += this.reduceMinutes(currentWeekSlots);
    }

    if (minutesThisWeek + minutesSinceStarted > this.state.minutesPassedWeek) {
      this.setState({
          minutesPassedWeek: minutesThisWeek + minutesSinceStarted
      })
    }
  }
  renderMinutes(minutes) {
    const passedMinutes = minutes % 60;
    const passedHours = (minutes - passedMinutes) / 60;
    return passedHours + ':' + ((passedMinutes < 10) ? '0' : '') + passedMinutes;
  }
  render() {
    return (
        <div className="stats">
          Today so far: {this.renderMinutes(this.state.minutesPassedDay)}<br />
          This week so far: {this.renderMinutes(this.state.minutesPassedWeek)}
        </div> 
    );

  }
}

class App extends Component {
  constructor() {
    super();

    const state = localStorage.getItem('timeTrackerState');
    if (state !== null) {
      console.log('loaded from localStorage');
      this.state = JSON.parse(state);
    } else {
      console.log('loaded dummy data');
      this.state = {
        daySlots: [],
        startedAt: null,
      };
    }
  }
  handleClick() {
    if(this.state.startedAt === null) {
      this.setState({
        startedAt: new Date()
      });
    } else {
      const d = new Date(this.state.startedAt);
      const currentMonth = d.getMonth() + 1;
      const currentDay = d.getDate();
      const id = d.getFullYear() + '-' + (currentMonth < 10 ? '0' : '') + currentMonth + '-' + (currentDay < 10 ? '0' : '') + currentDay;
      
      let index = -1;
      const daySlots = this.state.daySlots.slice();
      for(let i = 0; i < daySlots.length; i++) {
        if (daySlots[i].date === id) {
          index = i;
          break;
        }
      }
      const [start, end] = [new Date(this.state.startedAt), new Date()].map((date) => {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + ' ' + (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':00 UTC+1';
      });
      if (start !== end) {
        if (index !== -1) {
          daySlots[index].slots.push({
              id: daySlots[index].slots.length + 1,
              start: start,
              end: end,
          })
        } else {
          daySlots.push({
            date: id,
            slots: [{
              id: 1,
              start: start,
              end: end,
            }]
          });
        }
        this.setState({
          daySlots: daySlots,
        })
      }

      this.setState({
        startedAt: null,
      })
    }
  }
  componentDidUpdate() {
    console.log('stored to localStorage');
    localStorage.setItem('timeTrackerState', JSON.stringify(this.state));
  }
  render() {
    const daySlots = underscore
      .sortBy(this.state.daySlots, 'date')
      .reverse()
      .map((daySlot) => {
        return (
          <li key={daySlot.date}>
            <DaySlot daySlot={daySlot} />
          </li>
        );
      })
    return (
      <div>
        <Stats startedAt={this.state.startedAt} daySlots={this.state.daySlots} />
        <h1>Time</h1>       
        <StartButtonContent startedAt={this.state.startedAt} onClick={() => this.handleClick()} />
        <ul className="dayList">{daySlots}</ul>
        <button onClick={() => console.log(JSON.stringify(this.state))}>Export</button>
      </div>
    );
  }
}

export default App;
