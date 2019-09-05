import React, { Component } from 'react';
import ScheduleTable from './ScheduleTable';

class SchedulePage extends Component {
  state = {
    schedules: [],
    endpoint: 'api/schedules/'
  };

  componentDidMount() {
    fetch(this.state.endpoint)
      .then(response => response.status === 200 ? response.json() : [])
      .then(schedules => this.setState({ schedules }));
  }

  render() {
    return <ScheduleTable schedules={this.state.schedules} />;
  }
}

export default SchedulePage;