import React, { Component } from 'react';
import ScheduleTable from './ScheduleTable';
import ScheduleForm from './ScheduleForm';

class SchedulePage extends Component {
  state = {
    schedules: [],
    endpoint: 'api/schedules/'
  };

  updateSchedule(schedule) {
    const schedules = [...this.state.schedules, schedule];

    this.setState({ schedules });
  }

  componentDidMount() {
    fetch(this.state.endpoint)
      .then(response => response.status === 200 ? response.json() : [])
      .then(schedules => this.setState({ schedules }));
  }

  render() {
    return (
      <React.Fragment>
        <ScheduleForm endpoint={this.state.endpoint} updateSchedule={this.updateSchedule.bind(this)} />
        <ScheduleTable schedules={this.state.schedules} />
      </React.Fragment>
    );
  }
}

export default SchedulePage;