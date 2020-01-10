import React from 'react';
import Button from '../components/button';
import EventsChart from '../components/chart';
import HourlyEventsChart from '../components/hourly';
import '../App.css';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      dailyEvents: [],
      hourlyEvents: [],
      type:"daily",
      render: false
    };
  }

  async componentDidMount() {
    await Promise.all([
      fetch('http://localhost:5555/events/daily'),
      fetch('http://localhost:5555/stats/daily')
    ])
    .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
    .then(([data1, data2]) => this.setState({
        dailyEvents: [...data1.data], 
        hourlyEvents: [...data2.data]
    }));
  }

  render () {
    const {dailyEvents, hourlyEvents} = this.state;
    if (this.state.dailyEvents.length > 0 || this.state.hourlyEvents.length > 0) {
      return (
        <div>
            {/* <Button value='hourly' onClick={this.handleClick}> Hourly </Button>
            <Button value='daily' onClick={this.handleClick}> Daily </Button> */}
            <EventsChart data={dailyEvents} type={this.state.type}/>
            {/* <HourlyEventsChart data={hourlyEvents} type={this.state.type}/> */}
        </div>
      )
    } else {
      return (
        <div>....Loading</div>
      )
    }
  }
}